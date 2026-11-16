"""Fetch tariff codes for one or more terms and save them to a CSV.

Usage: python3 tariff_to_csv.py 8112 8517 -o tariffs.csv
"""
import argparse
import csv

from tariff_lookup import lookup


def main():
    p = argparse.ArgumentParser()
    p.add_argument("terms", nargs="+", help="code prefixes or keywords, e.g. 8112 8517")
    p.add_argument("-o", "--output", default="tariffs.csv")
    p.add_argument("--lang", default="en")
    args = p.parse_args()

    rows = []
    for term in args.terms:
        year, _, results = lookup(term, args.lang)
        for r in results:
            if not r["code"]:  # skip the "Find matching HS codes with AI" promo entry
                continue
            rows.append({"term": term, "year": year, "code": r["code"], "description": r["description"]})
        print(f"{term}: {len(results)} results")

    fields = ["term", "year", "code", "description"]
    existing = set()
    try:
        with open(args.output, newline="", encoding="utf-8") as f:
            existing = {(r["term"], r["year"], r["code"]) for r in csv.DictReader(f)}
    except FileNotFoundError:
        pass

    new = [r for r in rows if (r["term"], str(r["year"]), r["code"]) not in existing]
    with open(args.output, "a", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fields)
        if not existing:
            w.writeheader()
        w.writerows(new)
    rows = new
    print(f"Added {len(rows)} new rows to {args.output}")


if __name__ == "__main__":
    main()
