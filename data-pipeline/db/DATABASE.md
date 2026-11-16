# Database reference

The Supabase (Postgres) database behind `/tools`. Read this before writing queries, API code or import scripts.

The website reads through `lib/tools/api.ts` only, with the publishable key. It never writes.

## How the app uses it

1. The user writes in plain English. `search_hs4(q)` returns ranked hs4 codes.
2. For the selected hs4, `price_for(code)` gives the average price (per unit if available, otherwise per kg).
3. The user drills down hs4 -> hs6 -> cn8 -> taric10. Children are the `nomenclature` rows with `parent_code = code`. The price is looked up again at every level and falls back to the parent if the level has no data.
4. For the selected code, `tariffs_for(code)` gives the measures (China and erga omnes), shown as text.
5. The shipping estimate reads `tariffs_hs4` for duty rates: `geo_group = 'ERGA_OMNES'` is the tariff, `geo_group = 'CHINA'` is the anti-dumping.

## Rules

- Codes are text. Never convert them to numbers: 0703 would become 703.
- Prices: show what the database has. Don't compute prices from value and quantity.
- `rate_text`: display as stored. Don't parse it.
- Default origin is China (`CN`).
- Read only: the app never writes to these tables.

## Schema

Source: Supabase `public` schema. For context only, not meant to be run.

```sql
CREATE TABLE public.geo_areas (
  code text NOT NULL CHECK (code ~ '^([A-Z]{2}|[0-9]{4})$'::text),
  name text NOT NULL,
  kind text DEFAULT
CASE
    WHEN (code ~ '^[A-Z]{2}$'::text) THEN 'country'::text
    ELSE 'group'::text
END,
  CONSTRAINT geo_areas_pkey PRIMARY KEY (code)
);
CREATE TABLE public.tariffs (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  goods_code text NOT NULL CHECK (goods_code ~ '^[0-9]{10}$'::text),
  geo_code text,
  measure text NOT NULL DEFAULT 'Third country duty'::text,
  rate_text text NOT NULL,
  goods_prefix text DEFAULT regexp_replace(goods_code, '(00)+$'::text, ''::text),
  rate_perc double precision,
  rate_dtn double precision,
  rate_nar double precision,
  rate_kgm double precision,
  rate_tne double precision,
  rate_mil double precision,
  rate_fix double precision,
  is_tariff text DEFAULT
CASE
    WHEN ((rate_perc IS NULL) AND (rate_dtn IS NULL) AND (rate_nar IS NULL) AND (rate_kgm IS NULL) AND (rate_tne IS NULL) AND (rate_mil IS NULL) AND (rate_fix IS NULL)) THEN 'no'::text
    ELSE 'yes'::text
END,
  CONSTRAINT tariffs_pkey PRIMARY KEY (id),
  CONSTRAINT tariffs_geo_code_fkey FOREIGN KEY (geo_code) REFERENCES public.geo_areas(code)
);
CREATE TABLE public.goods_keywords (
  word text NOT NULL,
  goods_code text NOT NULL,
  CONSTRAINT goods_keywords_pkey PRIMARY KEY (word, goods_code),
  CONSTRAINT goods_keywords_code_fkey FOREIGN KEY (goods_code) REFERENCES public.nomenclature(code)
);
CREATE TABLE public.geo_area_members (
  group_code text NOT NULL,
  member_code text NOT NULL CHECK (member_code ~ '^[A-Z]{2}$'::text),
  CONSTRAINT geo_area_members_pkey PRIMARY KEY (group_code, member_code),
  CONSTRAINT geo_area_members_group_code_fkey FOREIGN KEY (group_code) REFERENCES public.geo_areas(code)
);
CREATE TABLE public.nomenclature (
  code text NOT NULL CHECK (code ~ '^[0-9]{2}([0-9]{2}){0,4}$'::text),
  description text NOT NULL,
  extended_description text,
  common_terms text,
  pick_label text,
  level text DEFAULT
CASE length(code)
    WHEN 2 THEN 'chapter'::text
    WHEN 4 THEN 'hs4'::text
    WHEN 6 THEN 'hs6'::text
    WHEN 8 THEN 'cn8'::text
    ELSE 'taric10'::text
END,
  parent_code text DEFAULT
CASE
    WHEN (length(code) > 2) THEN "left"(code, (length(code) - 2))
    ELSE NULL::text
END,
  search_doc tsvector DEFAULT ((setweight(to_tsvector('simple'::regconfig, COALESCE(common_terms, ''::text)), 'A'::"char") || setweight(to_tsvector('english'::regconfig, COALESCE(description, ''::text)), 'B'::"char")) || setweight(to_tsvector('english'::regconfig, COALESCE(extended_description, ''::text)), 'C'::"char")),
  goods_code text DEFAULT rpad(code, 10, '0'::text),
  CONSTRAINT nomenclature_pkey PRIMARY KEY (code)
);
CREATE TABLE public.trade_stats (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  code text NOT NULL,
  year integer,
  reporter text,
  partner text,
  value_eur numeric,
  quantity_kg numeric,
  supplementary_qty numeric,
  eur_per_kg numeric,
  eur_per_unit numeric,
  kg_per_unit numeric,
  goods_code text DEFAULT rpad(code, 10, '0'::text),
  CONSTRAINT trade_stats_pkey PRIMARY KEY (id),
  CONSTRAINT trade_stats_code_fkey FOREIGN KEY (code) REFERENCES public.nomenclature(code)
);
CREATE TABLE public.hs4_tariff_stats (
  hs4 text NOT NULL,
  leaf_count integer NOT NULL,
  avg_rate double precision NOT NULL,
  min_rate double precision NOT NULL,
  max_rate double precision NOT NULL,
  computed_at timestamp with time zone NOT NULL DEFAULT now(),
  geo_code text NOT NULL,
  CONSTRAINT hs4_tariff_stats_pkey PRIMARY KEY (hs4, geo_code),
  CONSTRAINT hs4_tariff_stats_hs4_fkey FOREIGN KEY (hs4) REFERENCES public.nomenclature(code)
);
```

`tariffs_hs4` is used by the app but missing above, because its definition isn't in this repo. The live columns, read on 2026-11-04, are: `geo_group`, `hs4`, `hs4_code10`, `rate_min`, `rate_max`, `rate_avg`, `n_leaves`, `n_leaves_zero_filled`, `n_leaf_hs4`, `n_leaf_hs6`, `n_leaf_cn8`, `n_leaf_cn10`.

## Tables

| Table | Purpose | Key | Used by the app |
|---|---|---|---|
| `nomenclature` | Goods classification tree (chapter, hs4, hs6, cn8, taric10) | `code` | Yes |
| `tariffs_hs4` | Duty rate avg/min/max per hs4 and geo group | `hs4`, `geo_group` | Yes |
| `tariffs` | Duty measures per 10-digit goods code and geo area | `id` | Through `tariffs_for` |
| `trade_stats` | Trade value and quantity by code, year, reporter, partner | `id` | Through `price_for` |
| `goods_keywords` | Everyday word to code index, for search | `(word, goods_code)` | Through `search_hs4` |
| `geo_areas` | Countries (2-letter ISO) and groups (4-digit codes) | `code` | Indirectly |
| `geo_area_members` | Group to member-country mapping | `(group_code, member_code)` | Indirectly |
| `hs4_tariff_stats` | Older per-hs4 duty aggregates | `(hs4, geo_code)` | No longer |

## Functions and views

The SQL for these isn't in this repo. Behaviour is as documented by the app and checked against live responses.

**`search_hs4(q text, max_results int default 20)`** returns `code, description, common_terms, score, matched_by`. It combines exact, single and fuzzy keywords with full-text search on `nomenclature`. Only hs4 codes, sorted by score.

**`price_for(p_code text, p_partner text default null)`** returns 0 or 1 row from `v_prices`: `code, year, reporter, partner, avg_price, price_basis ('unit'|'kg'), eur_per_unit, eur_per_kg, kg_per_unit`. If `p_code` has no data it returns the nearest parent, so check the returned `code`.

**`price_range_for(p_code text, p_partner text default null)`** returns `min_price, max_price, n_codes, price_basis, year`: the spread of cn8 prices under the code.

**`tariffs_for(p_code text, p_origin text default 'CN', p_include_groups boolean default false, p_descendants boolean default false)`** returns rows of `tariffs`: measures on the code and all its parents, for the origin and erga omnes (1011).
- `p_descendants = true` also returns measures on all codes below.
- `p_include_groups = true` also returns 1008, groups the origin belongs to, and measures with no origin.

**`v_prices` (view)** holds the latest year per code, reporter and partner, with `avg_price` = `eur_per_unit` if present, otherwise `eur_per_kg`.

## Conventions and gotchas

- **Two code formats.** `nomenclature.code` is 2 to 10 digits. `goods_code` is the same code right-padded with zeros to 10 digits. `tariffs.goods_code` and `trade_stats.goods_code` use the padded form.
- **Joins.** `trade_stats.code` and `goods_keywords.goods_code` reference `nomenclature.code` (unpadded). `tariffs` has no foreign key to `nomenclature`: join through the padded `nomenclature.goods_code = tariffs.goods_code`.
- **`tariffs.goods_prefix`** is `goods_code` without trailing `00` pairs: the tree node the measure sits on.
- **`parent_code`** is `code` minus its last two digits (null for chapters).
- **`geo_areas.code`** is a 2-letter country or a 4-digit group. To find duties for a country, also check its groups through `geo_area_members`.
- **Duty rate columns.** `rate_perc` (% ad valorem), `rate_dtn` (per 100 kg), `rate_nar` (per item), `rate_kgm` (per kg), `rate_tne` (per tonne), `rate_mil` (per 1000 items), `rate_fix` (fixed amount). Unit meanings are inferred from TARIC unit codes. `is_tariff` is 'no' when every numeric rate is null, which usually means a non-duty or conditional measure.
- **Duplicates.** The import holds some measures twice, identical apart from `id`. The Tariff Finder shows one.
- **API row cap.** PostgREST returns at most 1000 rows per request. Very broad `tariffs_for` calls hit it: chapter 85 returns 1000 rows, so its "Show all 999 measures" is probably a truncated list.
- **`tariffs_hs4` zero fill.** When `n_leaves_zero_filled = n_leaves`, no measure exists for the heading. Rates are percentages.

## Two older docs disagreed

This file merges the old `DATABASE.md` and `docs/DATABASE.md`. They conflicted on the `tariffs` columns. A live read on 2026-11-04 settled it: the table has the `rate_*` columns above, and **no `ad_valorem`, `valid_from`, `valid_to` or `note`**. The code was corrected to match.

## Open questions

- What does `tariffs.geo_code IS NULL` mean?
- Which `measure` values exist in total?
- What format do `trade_stats.reporter` and `partner` use? (Live rows show `EU` and `CN`.)
- How are `tariffs_hs4` and `hs4_tariff_stats` populated?
