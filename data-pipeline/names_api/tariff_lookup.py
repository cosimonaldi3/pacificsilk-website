"""Look up CN/TARIC codes via tariffnumber.com.  Usage: python tariff_lookup.py 8112"""
import html
import re
import sys

import requests

URL = "https://www.tariffnumber.com/api/v1/cnSuggest"


def lookup(term, lang="en"):
    r = requests.get(
        URL,
        params={"term": term, "lang": lang},
        headers={"Accept": "application/json"},
        timeout=15,
    )
    r.raise_for_status()
    data = r.json()
    out = []
    for s in data.get("suggestions", []):
        text = html.unescape(re.sub(r"<[^>]+>", "", s["value"]))
        desc = text[len(s["code"]):].strip() if text.startswith(s["code"]) else text
        out.append({"code": s["code"], "description": desc, "url": s["data"]})
    return data.get("year"), data.get("total"), out


if __name__ == "__main__":
    term = sys.argv[1] if len(sys.argv) > 1 else "8112"
    year, total, results = lookup(term)
    print(f"Tariff {year} - {total} matches for '{term}'\n")
    for r in results:
        print(f"{r['code']:<10} {r['description']}\n           {r['url']}")
