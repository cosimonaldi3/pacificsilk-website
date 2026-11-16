-- Keyword index: type a word, get the TARIC codes tagged with it.
-- Run once in the Supabase SQL editor.
--
-- EDIT BEFORE RUNNING: in section 3, replace
--   goods_source  -> your table name
--   taric_code    -> the column holding the code
--   keywords      -> the column holding "fish; food; swim"
-- Those are the only references to your table.

-- ---------------------------------------------------------------
-- 1. Normalizer. Applied to both stored words and the user's query,
--    so "Caffè ", "caffe" and "CAFFE" all become "caffe".
-- ---------------------------------------------------------------
create extension if not exists unaccent with schema extensions;

create or replace function kw_norm(t text)
returns text
language sql immutable parallel safe
as $$
  select lower(trim(regexp_replace(
           extensions.unaccent('extensions.unaccent'::regdictionary, coalesce(t, '')),
           '\s+', ' ', 'g')));
$$;

-- ---------------------------------------------------------------
-- 2. The index: one row per (word, code).
--    The primary key doubles as the lookup index on word.
-- ---------------------------------------------------------------
create table if not exists goods_keywords (
  word       text not null,
  goods_code text not null,
  primary key (word, goods_code)
);

create index if not exists goods_keywords_code_idx on goods_keywords (goods_code);

-- ---------------------------------------------------------------
-- 3. Rebuild the index from your table.
--    Splits on ; or , and stores each keyword whole AND word by word,
--    so "fishing rod" is found by "fishing rod", "fishing" and "rod".
--    Codes are stripped to digits to match the tariffs table.
--    Re-run after every data import:  select rebuild_goods_keywords();
-- ---------------------------------------------------------------
create or replace function rebuild_goods_keywords()
returns bigint
language plpgsql
as $$
declare n bigint;
begin
  truncate goods_keywords;

  insert into goods_keywords (word, goods_code)
  select distinct x.w, regexp_replace(g.taric_code::text, '\D', '', 'g')
  from goods_source g
  cross join lateral regexp_split_to_table(coalesce(g.keywords, ''), '\s*[;,]\s*') as raw(term)
  cross join lateral (
    select kw_norm(raw.term)
    union
    select regexp_split_to_table(kw_norm(raw.term), ' ')
  ) as x(w)
  where x.w <> '' and g.taric_code is not null;

  get diagnostics n = row_count;
  return n;
end;
$$;

select rebuild_goods_keywords();

-- ---------------------------------------------------------------
-- 4. Search. Exact word match, multi-word aware.
--    "frozen fish" ranks codes tagged with both words above codes
--    tagged with one. A code tagged with the whole phrase ranks first.
-- ---------------------------------------------------------------
create or replace function search_keywords(q text, max_results int default 20)
returns table (
  goods_code   text,
  matched      int,      -- how many query words this code matched
  phrase_match boolean,  -- the whole query is one of its keywords
  words        text[]    -- which words matched
)
language sql stable
as $$
  with qn as (select kw_norm(q) as full_q),
  terms as (
    select distinct t
    from qn, regexp_split_to_table(qn.full_q, ' ') as t
    where t <> ''
  ),
  hits as (
    select k.goods_code, k.word
    from goods_keywords k
    where k.word in (select t from terms)
       or k.word = (select full_q from qn)
  )
  select h.goods_code,
         count(distinct h.word) filter (where h.word in (select t from terms))::int,
         bool_or(h.word = (select full_q from qn)),
         array_agg(distinct h.word)
  from hits h
  group by h.goods_code
  order by 3 desc, 2 desc, h.goods_code
  limit max_results;
$$;

-- ---------------------------------------------------------------
-- 5. Public, read-only access (same pattern as the tariffs table).
-- ---------------------------------------------------------------
alter table goods_keywords enable row level security;
drop policy if exists "goods_keywords readable" on goods_keywords;
create policy "goods_keywords readable" on goods_keywords for select using (true);

grant select on goods_keywords to anon, authenticated;
grant execute on function search_keywords(text, int) to anon, authenticated;
grant execute on function kw_norm(text) to anon, authenticated;

-- ---------------------------------------------------------------
-- Quick checks
-- ---------------------------------------------------------------
-- select count(*) from goods_keywords;
-- select * from search_keywords('fish');
-- select * from search_keywords('frozen fish');
