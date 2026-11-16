"""Look up every code in codes.txt and add the results to tariffs.csv.

Safe to re-run or interrupt: terms already in the CSV are skipped and rows are
written as they arrive, so nothing is lost or duplicated.

Usage: python3 codes_to_csv.py [codes.txt] [-o tariffs.csv]
"""
import argparse
import csv
import os
import time

import requests

from tariff_lookup import lookup

FIELDS = ["term", "year", "code", "description"]
MAX_WAIT = 300  # longer Retry-After than this means we're blocked: stop instead of sleeping


class Blocked(Exception):
    def __init__(self, wait):
        super().__init__(f"blocked by the server for {wait}s (~{wait / 3600:.1f}h)")
        self.wait = wait


def fetch(term, lang, tries=5):
    for i in range(tries):
        try:
            return lookup(term, lang)
        except requests.HTTPError as e:
            if e.response is not None and e.response.status_code == 429:
                # rate limit is 30 requests per window: wait it out, then retry
                wait = int(e.response.headers.get("Retry-After", 65))
                if wait > MAX_WAIT:
                    raise Blocked(wait)
                print(f"  rate limited, waiting {wait}s")
                time.sleep(wait)
            elif i == tries - 1:
                raise
            else:
                time.sleep(2 * (i + 1))
        except requests.RequestException:
            if i == tries - 1:
                raise
            time.sleep(2 * (i + 1))
    raise requests.RequestException("still rate limited after retries")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("input", nargs="?", default="codes.txt")
    p.add_argument("-o", "--output", default="tariffs.csv")
    p.add_argument("--lang", default="en")
    p.add_argument("--delay", type=float, default=2.2, help="seconds between requests")
    args = p.parse_args()

    with open(args.input, encoding="utf-8") as f:
        terms = list(dict.fromkeys(line.strip() for line in f if line.strip()))

    seen, done_terms = set(), set()
    if os.path.exists(args.output):
        with open(args.output, newline="", encoding="utf-8") as f:
            for r in csv.DictReader(f):
                seen.add((r["term"], r["year"], r["code"]))
                done_terms.add(r["term"])

    todo = [t for t in terms if t not in done_terms]
    print(f"{len(terms)} codes, {len(terms) - len(todo)} already done, {len(todo)} to fetch")

    write_header = not seen
    failed, added = [], 0
    with open(args.output, "a", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=FIELDS)
        if write_header:
            w.writeheader()
        for i, term in enumerate(todo, 1):
            try:
                year, _, results = fetch(term, args.lang)
            except Blocked as e:
                print(f"\nStopping: {e}. Progress is saved; re-run later to resume.")
                return
            except requests.RequestException as e:
                print(f"[{i}/{len(todo)}] {term}: FAILED ({e})")
                failed.append(term)
                continue
            new = [
                {"term": term, "year": year, "code": r["code"], "description": r["description"]}
                for r in results
                if r["code"] and (term, str(year), r["code"]) not in seen
            ]
            for row in new:
                seen.add((row["term"], str(row["year"]), row["code"]))
            w.writerows(new)
            f.flush()
            added += len(new)
            print(f"[{i}/{len(todo)}] {term}: +{len(new)}")
            time.sleep(args.delay)

    print(f"Added {added} rows to {args.output}")
    if failed:
        print(f"{len(failed)} failed (re-run to retry): {', '.join(failed)}")


if __name__ == "__main__":
    main()
