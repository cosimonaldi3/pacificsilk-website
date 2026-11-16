import csv
import re
import sys
from collections import Counter
from pathlib import Path

HERE = Path(__file__).parent
SRC = HERE / "duties.csv"
DST = HERE / "duties_perc.csv"
ERRORS = HERE / "duties_errors.csv"

# Output columns, in the order they are inserted after rate_text.
RATE_COLS = ["rate_perc", "rate_dtn", "rate_nar", "rate_kgm", "rate_tne", "rate_mil", "rate_fix"]

# The rate after the condition code in a segment, e.g. "A (09):10 % " -> "10 % ".
CONDITION_RATE_RE = re.compile(r"\(\d+\):(.*)$")

# One component of a rate: "6.500 %" or "12.000 EUR DTN" (also NAR, KGM, TNE, MIL;
# a bare "3.000 EUR" is a fixed amount, rate_fix).
COMPONENT_RE = re.compile(r"^(\d[\d,]*(?:\.\d+)?)\s*(?:(%)|EUR(?:\s+(DTN|NAR|KGM|TNE|MIL))?)$")
UNIT_COL = {"%": "rate_perc", "DTN": "rate_dtn", "NAR": "rate_nar", "KGM": "rate_kgm",
            "TNE": "rate_tne", "MIL": "rate_mil", None: "rate_fix"}


def parse_rate(rate_text):
    """Split a rate_text into {column: value}.

    Composite rates ("5 % + 10 EUR DTN") fill several columns; repeated units
    are added together. NIHIL is a 0 %. Returns {} when the text holds no rate
    at all (empty, or a conditional entry that only lists certificates).
    Raises ValueError when part of the text can't be converted.
    """
    text = rate_text.strip()
    if text.startswith("Cond:"):
        # Conditional entries: "A cert: D-123 (09):5 % ; A (09):10 % ".
        # The segment without a certificate is the rate that applies by default.
        segments = [s for s in text[len("Cond:"):].split(";") if "cert:" not in s]
        if not segments:
            return {}
        m = CONDITION_RATE_RE.search(segments[-1])
        if not m:
            raise ValueError("unrecognised condition segment")
        text = m.group(1).strip()
    if not text:
        return {}
    if text.upper() == "NIHIL":
        return {"rate_perc": 0.0}

    values = {}
    for part in text.split("+"):
        m = COMPONENT_RE.match(part.strip())
        if not m:
            raise ValueError(f"cannot convert '{part.strip()}'")
        col = UNIT_COL["%" if m.group(2) else m.group(3)]
        values[col] = values.get(col, 0.0) + float(m.group(1).replace(",", ""))
    return values


def main(src=SRC, dst=DST, errors=ERRORS):
    stats = Counter()
    with open(src, newline="", encoding="utf-8-sig") as f_in:
        reader = csv.DictReader(f_in)
        in_fields = list(reader.fieldnames)
        out_fields = list(in_fields)
        idx = out_fields.index("rate_text") + 1
        out_fields[idx:idx] = RATE_COLS

        with open(dst, "w", newline="", encoding="utf-8-sig") as f_out, \
                open(errors, "w", newline="", encoding="utf-8-sig") as f_err:
            writer = csv.DictWriter(f_out, fieldnames=out_fields)
            err_writer = csv.DictWriter(f_err, fieldnames=in_fields + ["error"])
            writer.writeheader()
            err_writer.writeheader()

            for row in reader:
                stats["total"] += 1
                try:
                    values = parse_rate(row["rate_text"])
                except ValueError as e:
                    values = {}
                    err_writer.writerow({**row, "error": str(e)})
                    stats["errors"] += 1
                else:
                    stats["converted" if values else "no rate"] += 1
                for col in RATE_COLS:
                    row[col] = f"{values[col]:g}" if col in values else ""
                writer.writerow(row)

    print(f"{stats['total']} rows: {stats['converted']} converted, "
          f"{stats['no rate']} without a rate, {stats['errors']} errors")
    print(f"-> {dst}\n-> {errors}")


if __name__ == "__main__":
    main(*(Path(a) for a in sys.argv[1:4]))
