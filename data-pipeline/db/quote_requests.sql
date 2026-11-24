-- Quote requests from /start (the details form + project builder blueprint).
-- Run once in the Supabase SQL editor.
--
-- Access: row-level security is ON and there are NO policies, so the publishable
-- (browser) key can neither read nor write this table. Only the server-side
-- service-role key (used by app/api/quote/route.ts) can. Never expose that key.

create table if not exists public.quote_requests (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),

  -- details form
  name          text not null check (char_length(name)    between 1 and 200),
  email         text not null check (char_length(email)   between 3 and 320),
  company       text not null check (char_length(company) between 1 and 200),
  country       text          check (char_length(country) <= 200),
  phone         text          check (char_length(phone)   <= 60),
  message       text          check (char_length(message) <= 5000),

  -- blueprint from the project builder
  services      text[] not null default '{}',   -- service ids, in blueprint order
  builder       jsonb  not null default '{}',   -- raw builder answers (mode, answers, manual picks)

  -- context
  locale        text not null default 'en' check (locale in ('en', 'es', 'zh')),
  status        text not null default 'new' check (status in ('new', 'contacted', 'won', 'lost', 'spam')),
  email_sent    boolean not null default false  -- set once the team notification went out
);

create index if not exists quote_requests_created_at_idx on public.quote_requests (created_at desc);
create index if not exists quote_requests_status_idx on public.quote_requests (status);

alter table public.quote_requests enable row level security;
-- Deliberately no policies: deny-by-default for anon and authenticated roles.
-- The service role bypasses RLS.

-- Newer Supabase projects do not grant new tables to service_role automatically.
-- Only the server role gets access; anon and authenticated get nothing.
grant select, insert, update on public.quote_requests to service_role;
revoke all on public.quote_requests from anon, authenticated;

comment on table public.quote_requests is 'Quote requests submitted from /start. Written only by the server (service role).';
