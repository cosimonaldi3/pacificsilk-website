"""
Fetch Eurostat Comext import data (default: EU imports from China) for every
product category and sub-category, and write one ready-to-use CSV.

Steps, all in one run:
  1. Downloads the full CN code list used by Comext (CXT_NC) once and caches it
     locally (cxt_nc.xml). It contains every HS2/HS4/HS6/CN8 code, current and past.
  2. Walks the tree one level at a time (HS2 -> HS4 -> HS6 -> CN8) and only goes
     deeper under codes that had trade. Queries dataset DS-045409 in batches.
  3. Fills eur_per_unit and eur_per_kg for the parents (HS2, HS4, HS6) as the
     average of the CN8 prices underneath, weighted by CN8 import value:
         parent price = sum(value_i * price_i) / sum(value_i)
     If any CN8 code under a parent has no price (no units reported, for
     eur_per_unit), the parent's price stays empty. --lenient averages over the
     CN8 codes that do have a price instead. The two prices are independent.
  4. Adds the columns chapter, hs4, hs6 at the start (empty where they do not
     apply) and extended_description after description: the descriptions from
     the chapter down to the row itself, joined with " | ".

Usage:
  python3 prices.py                          everything, 2025, EU imports from China
  python3 prices.py --years 2024 2025        several years
  python3 prices.py --prefix 8701            only one chapter/heading and below
  python3 prices.py --reporter IT --out italy_2025.csv
  python3 prices.py --lenient

Requires: pip install requests
"""

import argparse
import csv
import os
import sys
import time
import xml.etree.ElementTree as ET
from collections import defaultdict

import requests

DATA_URL = (
    "https://ec.europa.eu/eurostat/api/comext/dissemination/"
    "statistics/1.0/data/DS-045409"
)
CODELIST_URL = (
    "https://ec.europa.eu/eurostat/api/comext/dissemination/"
    "sdmx/2.1/codelist/ESTAT/CXT_NC"
)
CODELIST_CACHE = "cxt_nc.xml"
INDICATORS = ["VALUE_IN_EUROS", "QUANTITY_IN_100KG", "SUPPLEMENTARY_QUANTITY"]
CHUNK_SIZE = 40
PAUSE_SECONDS = 0.5
DEFAULT_YEARS = [2025]

NS = {
    "s": "http://www.sdmx.org/resources/sdmxml/schemas/v2_1/structure",
    "c": "http://www.sdmx.org/resources/sdmxml/schemas/v2_1/common",
}
XML_LANG = "{http://www.w3.org/XML/1998/namespace}lang"
LEVELS = {2: "HS2", 4: "HS4", 6: "HS6", 8: "CN8"}


# ---------------------------------------------------------------- HTTP

def http_get(url, params=None, retries=3, timeout=120):
    for attempt in range(1, retries + 1):
        try:
            r = requests.get(url, params=params, timeout=timeout)
            if r.status_code == 200:
                return r
            print(f"  HTTP {r.status_code}: {r.text[:200]}", file=sys.stderr)
        except requests.RequestException as e:
            print(f"  Request error: {e}", file=sys.stderr)
        time.sleep(2 * attempt)
    raise RuntimeError(f"Request failed after {retries} attempts: {url}")


# ---------------------------------------------------------------- code list

def load_codelist(refresh=False):
    """Return {code: english_label} for every numeric code in CXT_NC."""
    if refresh or not os.path.exists(CODELIST_CACHE):
        print("Downloading CN code list (large, one-time)...", file=sys.stderr)
        r = http_get(CODELIST_URL, timeout=300)
        with open(CODELIST_CACHE, "wb") as f:
            f.write(r.content)

    codes = {}
    # iterparse keeps memory low on the big XML file
    for _, el in ET.iterparse(CODELIST_CACHE, events=("end",)):
        if el.tag == f"{{{NS['s']}}}Code":
            code = el.get("id", "")
            if code.isdigit() and len(code) in LEVELS:
                label = ""
                for name in el.findall("c:Name", NS):
                    if name.get(XML_LANG) == "en":
                        label = (name.text or "").strip()
                        break
                codes[code] = label
            el.clear()
    return codes


def codes_under(prefix, codelist):
    """The prefix itself plus every longer code that starts with it."""
    return sorted(c for c in codelist if c.startswith(prefix))


# ---------------------------------------------------------------- data

def decode_jsonstat(data):
    """JSON-stat 2.0 -> list of observations {dim: code, ..., 'value': v}."""
    values = data.get("value") or {}
    if not values:
        return []
    dim_ids, sizes = data["id"], data["size"]
    pos_to_code = {
        d: {pos: code for code, pos in data["dimension"][d]["category"]["index"].items()}
        for d in dim_ids
    }
    strides = [1] * len(sizes)
    for i in range(len(sizes) - 2, -1, -1):
        strides[i] = strides[i + 1] * sizes[i + 1]

    items = values.items() if isinstance(values, dict) else enumerate(values)
    rows = []
    for flat, v in items:
        if v is None:
            continue
        flat = int(flat)
        obs = {d: pos_to_code[d][(flat // s) % n] for d, s, n in zip(dim_ids, strides, sizes)}
        obs["value"] = v
        rows.append(obs)
    return rows


def fetch_data(codes, years, reporter, partner, flow, results=None):
    """Return {(code, year): {value_eur, quantity_kg, supplementary_qty}}."""
    results = {} if results is None else results
    for i in range(0, len(codes), CHUNK_SIZE):
        chunk = codes[i : i + CHUNK_SIZE]
        print(f"Fetching {i + 1}-{i + len(chunk)} of {len(codes)} codes", file=sys.stderr)
        params = {
            "freq": "A",
            "reporter": reporter,
            "partner": partner,
            "flow": flow,
            "product": chunk,
            "indicators": INDICATORS,
            "time": [str(y) for y in years],
        }
        data = http_get(DATA_URL, params=params).json()
        for obs in decode_jsonstat(data):
            row = results.setdefault(
                (obs["product"], obs["time"]),
                {"value_eur": None, "quantity_kg": None, "supplementary_qty": None},
            )
            ind = obs["indicators"]
            if ind == "VALUE_IN_EUROS":
                row["value_eur"] = obs["value"]
            elif ind == "QUANTITY_IN_100KG":
                row["quantity_kg"] = obs["value"] * 100  # API unit is 100 kg
            elif ind == "SUPPLEMENTARY_QUANTITY":
                row["supplementary_qty"] = obs["value"]
        time.sleep(PAUSE_SECONDS)
    return results


def ratio(a, b, digits=4):
    return round(a / b, digits) if a and b else None


# ---------------------------------------------------------------- main

def build_rows(codes, years, codelist, data, reporter, partner):
    rows = []
    for code in codes:
        for year in years:
            d = data.get((code, str(year)))
            if not d:
                continue  # code not valid that year, or no trade
            v, kg, units = d["value_eur"], d["quantity_kg"], d["supplementary_qty"]
            rows.append({
                "code": code,
                "level": LEVELS[len(code)],
                "parent": code[:-2] if len(code) > 4 else (code[:2] if len(code) == 4 else ""),
                "description": codelist.get(code, ""),
                "year": year,
                "reporter": reporter,
                "partner": partner,
                "value_eur": v,
                "quantity_kg": kg,
                "supplementary_qty": units,
                "eur_per_kg": ratio(v, kg),
                "eur_per_unit": ratio(v, units, 2),
                "kg_per_unit": ratio(kg, units, 2),
            })
    return rows


# ---------------------------------------------------------------- post-processing

PARENT_LEVELS = (2, 4, 6)
PRICE_DIGITS = {"eur_per_unit": 2, "eur_per_kg": 4}


def fill_parent_prices(rows, lenient=False):
    """Replace the prices of HS2/HS4/HS6 rows with the value-weighted CN8 average."""
    # (year, parent code, price) -> [sum value*price, sum value, cn8 total, cn8 priced]
    acc = defaultdict(lambda: [0.0, 0.0, 0, 0])
    for r in rows:
        if r["level"] != "CN8":
            continue
        for price in PRICE_DIGITS:
            for n in PARENT_LEVELS:
                a = acc[(r["year"], r["code"][:n], price)]
                a[2] += 1
                if r[price] is not None and r["value_eur"]:
                    a[0] += r["value_eur"] * r[price]
                    a[1] += r["value_eur"]
                    a[3] += 1

    filled = {price: 0 for price in PRICE_DIGITS}
    parents = 0
    for r in rows:
        if len(r["code"]) not in PARENT_LEVELS:
            continue
        parents += 1
        for price, digits in PRICE_DIGITS.items():
            sum_vp, sum_v, total, priced = acc.get((r["year"], r["code"], price), (0, 0, 0, 0))
            if sum_v and (lenient or (total and priced == total)):
                r[price] = round(sum_vp / sum_v, digits)
                filled[price] += 1
            else:
                r[price] = None
    return filled, parents


def add_hierarchy(rows, codelist):
    """Add chapter/hs4/hs6 and extended_description ("chapter | hs4 | hs6 | cn8" descriptions)."""
    out = []
    for r in rows:
        code = r["code"]
        chain = [code[:n] for n in (2, 4, 6, 8) if n <= len(code)]
        ext = " | ".join(d for d in (" ".join(codelist.get(c, "").split()) for c in chain) if d)
        new = {
            "chapter": code[:2],
            "hs4": code[:4] if len(code) >= 4 else "",
            "hs6": code[:6] if len(code) >= 6 else "",
        }
        for k, v in r.items():
            new[k] = v
            if k == "description":
                new["extended_description"] = ext
        out.append(new)
    return out


def finish(rows, codelist, lenient):
    """Parent prices, then hierarchy columns. Returns new rows plus a summary."""
    filled, parents = fill_parent_prices(rows, lenient)
    return add_hierarchy(rows, codelist), filled, parents


def write_csv(rows, out):
    fields = list(rows[0].keys()) if rows else ["code"]
    with open(out, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        w.writerows(rows)


def main():
    p = argparse.ArgumentParser(description="Comext data for every code, or for one code and all codes under it")
    p.add_argument("--prefix", default="", help="optional HS2/HS4/HS6 code, e.g. 8701; default is all codes")
    p.add_argument("--years", nargs="+", type=int, default=DEFAULT_YEARS, help="default: 2025")
    p.add_argument("--reporter", default="EU", help="EU or a Member State, e.g. IT")
    p.add_argument("--partner", default="CN", help="Origin country, default CN")
    p.add_argument("--flow", default="1", choices=["1", "2"], help="1=import, 2=export")
    p.add_argument("--lenient", action="store_true",
                   help="parent prices average the CN8 codes that have a price, instead of staying empty")
    p.add_argument("--out", help="Output CSV (default comext_<prefix or all>_<years>.csv)")
    p.add_argument("--refresh-codelist", action="store_true", help="Re-download the code list")
    args = p.parse_args()

    if args.prefix and not (args.prefix.isdigit() and len(args.prefix) in (2, 4, 6, 8)):
        sys.exit("--prefix must be a 2, 4, 6 or 8 digit code")

    codelist = load_codelist(args.refresh_codelist)
    codes = codes_under(args.prefix, codelist)
    if not codes:
        sys.exit(f"No codes found under {args.prefix!r} in the code list")
    print(f"{len(codes)} codes in scope", file=sys.stderr)

    out = args.out or f"comext_{args.prefix or 'all'}_{'-'.join(map(str, args.years))}.csv"
    data, fetched, rows, filled, parents = {}, set(), [], {}, 0
    for length in sorted(LEVELS):
        # a code only needs a request if its parent had trade (parents sum their children)
        level = [c for c in codes if len(c) == length]
        if length > max(len(args.prefix), 2):
            traded = {k[0] for k in data}
            level = [c for c in level if c[:length - 2] in traded]
        if not level:
            continue
        print(f"{LEVELS[length]}: {len(level)} codes", file=sys.stderr)
        fetch_data(level, args.years, args.reporter, args.partner, args.flow, data)
        fetched.update(level)
        raw = build_rows(sorted(fetched), args.years, codelist, data, args.reporter, args.partner)
        rows, filled, parents = finish(raw, codelist, args.lenient)
        write_csv(rows, out)  # checkpoint after every level

    with_data = {r["code"] for r in rows}
    print(
        f"Saved {len(rows)} rows to {out} "
        f"({len(with_data)} of {len(codes)} codes had data for {args.years})",
        file=sys.stderr,
    )
    for price, n in filled.items():
        print(f"  parent {price}: {n} of {parents} parent rows filled", file=sys.stderr)


if __name__ == "__main__":
    main()
