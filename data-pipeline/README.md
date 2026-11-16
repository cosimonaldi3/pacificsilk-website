# Data pipeline

Python scripts that prepare the data behind the Shipping Estimate and Tariff Finder pages (`/tools`). Nothing here ships with the website: this folder is excluded from Vercel, TypeScript, ESLint and Tailwind.

The website only reads from Supabase. Its one data module is `lib/tools/api.ts`.

## Setup

Python 3.14 is what the data was built with.

```bash
cd data-pipeline
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
```

`nomenclature.py` also needs [Ollama](https://ollama.com) running locally with the model you pass to it. No script needs API keys or database credentials.

## What each step does

| Step | Run | Reads | Writes |
|---|---|---|---|
| **Prices** | `cd prices && python3 prices.py` | Eurostat Comext API (DS-045409); cached code list `cxt_nc.xml` | `comext_<prefix>_<years>.csv` (the current one was renamed `prices_2025.csv`) |
| **Common terms** | `cd nomenclature && python3 nomenclature.py ../prices/prices_2025.csv --level HS4 --out prices_2025_hs4_terms.csv` | Prices CSV, local Ollama model | `*_terms.csv`, `*_terms_long.csv` |
| **Duties** | `python3 duties/duties.py` | `duties/duties.csv` | `duties/duties_perc.csv`, `duties/duties_errors.csv` |
| **Names lookup** | `cd names_api && python3 codes_to_csv.py` | `codes.txt`, tariffnumber.com | Appends to `tariffs.csv` |

- `names_api/tariff_lookup.py` is a helper and small CLI used by the other two `names_api` scripts. `tariff_to_csv.py` looks up terms given on the command line.
- `prices.py` and `codes_to_csv.py` call public services, and long runs can take hours. `codes_to_csv.py` can resume.
- `duties.py` needs no network. It accepts optional `input output errors` paths, which is a quick way to test it without touching the data.

## From these files to Supabase

**There is no import script.** No script here connects to the database, so the tables were loaded by hand. The expected mapping below is inferred from the columns, not recorded anywhere:

| File | Table |
|---|---|
| `prices/prices_2025.csv` | `trade_stats`, `nomenclature` |
| `nomenclature/prices_2025_hs4_terms.csv` | `nomenclature.common_terms` |
| `duties/duties_perc.csv` | `tariffs` |

See `db/DATABASE.md` for the schema and `db/keyword_index.sql` for the search index.

## Known gaps

- `duties/duties.csv` has no script that creates it in this repo.
- `db/keyword_index.sql` can't run as is: replace the placeholder table `goods_source` and its columns first. The app doesn't call the `search_keywords` function it creates.
- `nomenclature/prices_2025_terms_cn8_partial.csv` is from a stopped run: 53 of 8,246 rows have terms.
- `duties/duties_errors.csv` holds 5,487 rate texts that didn't parse (e.g. `NAR`, `EUR TNE I`).

## What is in git

`.gitignore` keeps `*.csv`, `*.xml`, `*.log` and `.venv` in this folder out of the website repo (about 75 MB). The scripts, `codes.txt` and the docs are tracked. The original data, including `prices/test.csv` and a duplicate of `prices_2025.csv` that were not copied here, stays in the `pacificsilk-tariff` repo and in `silk-consulting-archive`, next to this project.
