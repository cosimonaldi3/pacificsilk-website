"""
For each technical item description in a CSV, ask a free local LLM (via Ollama)
for 20 common, everyday words/names for similar items, so you can run
plain word-for-word searches.

Setup (once):
    1. Install Ollama: https://ollama.com/download
    2. ollama pull qwen2.5:7b        # good at JSON + technical text; ~4.7 GB
       (smaller/faster: qwen2.5:3b  |  alternative: llama3.1:8b)
    3. pip install ollama pandas

Run:
    python nomenclature.py                      # prices_2025.csv, column extended_description
    python nomenclature.py --level CN8          # only the most specific rows (8246 instead of 14941)
    python nomenclature.py --model qwen2.5:3b --out results.csv

The script saves after every row, so you can stop it and re-run to resume.
"""

import argparse
import json
import os

import ollama
import pandas as pd

N_TERMS = 20

PROMPT = """You convert technical product descriptions into everyday language.

Technical description (customs nomenclature path, from broad category to the specific item,
separated by " | " - focus on the last, most specific part):
\"\"\"{description}\"\"\"

List exactly {n} common, everyday item names or keywords that an ordinary person
would use for this item or very similar items. Rules:
- Short: 1-3 words each, lowercase, no brand names.
- Plain vocabulary, not jargon (e.g. "drill" not "rotary percussive apparatus").
- Include synonyms, the general category, and closely related items.
- No duplicates.

Answer ONLY with JSON in this form: {{"terms": ["term1", "term2", ...]}}"""


def get_terms(description: str, model: str, retries: int = 3) -> list[str]:
    for _ in range(retries):
        try:
            resp = ollama.chat(
                model=model,
                messages=[{"role": "user", "content": PROMPT.format(description=description, n=N_TERMS)}],
                format="json",
                options={"temperature": 0.3},
            )
            terms = json.loads(resp["message"]["content"]).get("terms", [])
            # clean + dedupe, keep order
            seen, clean = set(), []
            for t in terms:
                t = str(t).strip().lower()
                if t and t not in seen:
                    seen.add(t)
                    clean.append(t)
            if len(clean) >= N_TERMS // 2:  # accept if at least half came back usable
                return clean[:N_TERMS]
        except (json.JSONDecodeError, KeyError, ollama.ResponseError):
            pass
    return []


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("csv", nargs="?", default="prices_2025.csv", help="input CSV file")
    ap.add_argument("--column", default="extended_description", help="name of the column with the descriptions")
    ap.add_argument("--level", help="only process rows with this level (HS2, HS4, HS6, CN8)")
    ap.add_argument("--model", default="qwen2.5:7b")
    ap.add_argument("--out", default="prices_2025_terms.csv")
    ap.add_argument("--sep", default=",", help="CSV separator (use ';' for Italian Excel exports)")
    args = ap.parse_args()

    df = pd.read_csv(args.csv, sep=args.sep, dtype=str)
    if args.column not in df.columns:
        raise SystemExit(f"Column '{args.column}' not found. Available: {list(df.columns)}")

    if args.level:
        df = df[df["level"] == args.level].reset_index(drop=True)

    # resume from a previous run if the output already exists
    if os.path.exists(args.out):
        done = pd.read_csv(args.out, sep=args.sep, dtype=str)
        df["common_terms"] = done["common_terms"] if "common_terms" in done and len(done) == len(df) else ""
    else:
        df["common_terms"] = ""
    df["common_terms"] = df["common_terms"].fillna("").astype(str)

    total = len(df)
    for i, row in df.iterrows():
        if row["common_terms"].strip():
            continue  # already processed
        desc = str(row[args.column]).strip()
        if not desc or desc.lower() == "nan":
            continue
        terms = get_terms(desc, args.model)
        df.at[i, "common_terms"] = "; ".join(terms)
        df.to_csv(args.out, index=False, sep=args.sep)
        print(f"[{i + 1}/{total}] {desc[:60]!r} -> {', '.join(terms[:5])}...")

    # long format too: one row per (item, term) — handy for search/joins
    long = (
        df.assign(term=df["common_terms"].str.split("; "))
        .explode("term")
        .dropna(subset=["term"])
    )
    long = long[long["term"] != ""]
    long_out = args.out.replace(".csv", "_long.csv")
    long.drop(columns=["common_terms"]).to_csv(long_out, index=False, sep=args.sep)

    print(f"\nDone. Wide: {args.out}  |  One term per row: {long_out}")


if __name__ == "__main__":
    main()