# Pacific Silk Website — TODO

Open items carried across sessions. Claude Code reads this at the start of each session and appends to it at the end.

Format: one item per line. Use checkboxes. Group by category.

## Deferred decisions
- [ ] Form handler service (Formspree, Resend, or Vercel serverless) — decide before contact page build
- [ ] Analytics service (Plausible vs Vercel Analytics) — decide before launch
- [ ] Portal URL — will be placeholder until portal app exists

## Portal auth (Supabase)
- [ ] Supabase dashboard → Authentication → Sign In / Providers → Email: enabled, "Confirm email" OFF (accounts are gated by manual approval instead)
- [ ] Supabase dashboard → URL Configuration: add `http://localhost:3000/**`, the production domain and Vercel preview URLs as redirect URLs (signup confirmation and password reset land on `/portal/auth/callback`)
- [ ] Approve each new portal account: SQL Editor → `update auth.users set raw_app_meta_data = raw_app_meta_data || '{"approved": true}'::jsonb where email = '…';`. Unapproved users see a "reviewing your access" screen
- [ ] Optional: custom SMTP (Hostinger) so confirmation emails come from the PSC domain
- [ ] Portal auth copy is English only (`content/portal.ts`); add es/zh when the portal is localized

## Known open work
- [x] GitHub remote setup — create repo, push `main`, confirm CI is clean
- [x] Vercel deployment — connect GitHub repo to Vercel, confirm production deploy and preview URLs work
- [x] Fix package.json `name` field — currently "psc-scaffold" from scaffolding; rename to "pacific-silk-consulting-website" or similar
- [x] Telemetry opt-out — Next.js collected telemetry during build; add `NEXT_TELEMETRY_DISABLED=1` to `.env.local` if desired
- [ ] Security headers — add CSP, X-Frame-Options, Referrer-Policy etc. to `next.config.ts` (required by CLAUDE.md Section 9)
- [ ] Legal pages — fill in all [PLACEHOLDER] fields in `content/legal.ts`: company registration number, registered address, governing law jurisdiction, DPO/privacy contact email, legal contact email, analytics provider (affects cookies section), form handler service (affects third-party section). Then commit all legal page changes (content/legal.ts, app/(legal)/privacy/page.tsx, app/(legal)/terms/page.tsx, TODO.md, components/ui/Footer.tsx)
- [ ] Legal pages — review Privacy Policy and Terms of Use with a qualified lawyer before launch, especially: governing law jurisdiction, GDPR applicability, international transfer mechanisms, legal basis for processing

## /start page — placeholders needing real values
- [x] Google Calendar booking URL — set in `content/start.ts` (`bookingUrl`)
- [x] Contact email — set to `contact@pacificsilk.com` in `content/start.ts` (`emailAddress`)
- [x] LinkedIn URL — set in `content/start.ts` (`thanks.socialLinks[0].href`)
- [ ] Tally redirect URL — in Tally form settings, set the "Redirect on submit" URL to `https://pacificsilkconsulting.com/start/thanks`
- [ ] CSP headers (when added) — allowlist `tally.so` in `frame-src` and `script-src` directives in `next.config.ts`

## Tools (/tools) and data pipeline
- [ ] **Public visibility:** `/tools` and its nav, footer and tile links are hidden unless `NEXT_PUBLIC_SHOW_TOOLS=true` (`lib/features.ts`). Internal editors set it in their `.env.local`. At launch, set it in the Vercel production env (or remove the gate) and redeploy. Vercel production must not have it set until then
- [ ] **Launch blocker:** replace the placeholder freight rates in `lib/tools/estimate/model.ts` (`RATES`) and typical product figures in `lib/tools/estimate/productDefaults.ts` with real quotes. The results carry an "indicative estimate" caveat, but the pages are public
- [ ] **Launch blocker:** add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_KEY` in Vercel. Without them the tools show "not connected to a database"
- [ ] Confirm in the Supabase dashboard that row-level security blocks writes with the publishable key. Not tested, to avoid attempting a write on the live database
- [ ] Add the Supabase URL to `connect-src` when CSP headers are added
- [ ] Spanish and Chinese copy for `content/tools.ts`. `/es` and `/zh` show English tool copy under a translated nav. Add the files and switch on locale in `loadToolsContent`
- [ ] Add duties to the Tariff Finder estimate (the row reads "coming soon")
- [ ] Export the SQL for the RPCs and `tariffs_hs4` from Supabase into `data-pipeline/db/`. Today only `keyword_index.sql` is in the repo, so the database can't be rebuilt from here
- [ ] Write an import script: nothing in `data-pipeline/` loads data into Supabase
- [ ] Broad tariff lists hit the 1000-row API cap (chapter 85 shows "999 measures"): paginate, or show a "too many, narrow down" message
- [ ] Review search ranking: "cotton hoodie" suggests HS 5209 (woven cotton fabric) first in the estimate, not 6110 (hoodies)
- [ ] Add a route check to the `/tools/shipping-estimate` page so a future bad port shows a message: there is still no error boundary
- [ ] Delete `/Users/cosimo/Documents/work/silk-consulting-archive` once its 21 uncommitted files are committed or no longer needed

## Tooling and deployment found during the tools work
- [ ] Fix linting: `npm run lint` prints ESLint's help, and `next build` reports ESLint 4.19.1 as too old. `eslint`, `eslint-config-next` and `@eslint/eslintrc` are far behind Next 15, and lint hasn't been running on this project. Upgrading needs approval
- [ ] Set `metadataBase` in the root metadata: Open Graph URLs currently resolve to localhost:3000 at build time
- [ ] This folder isn't a git repo (looks like a ZIP of `main`): connect it to the GitHub repo, then commit this work on a feature branch
- [ ] Align `CLAUDE.md` with the code: sections 2, 10 and 12 still describe no i18n, a separate portal codebase, and `tailwind.config.ts`. Tally is missing from section 16

## Process page
- [ ] Validate stage: the quotation tile shows sample figures (USD 4.20 FOB Ningbo, 3,000 units, desk lamp) in `content/process.ts` → `validate.quote`. Swap them for numbers PSC is happy to show, or keep them as a clearly tagged example
- [ ] Give stage 4 (Beyond) the same bento treatment as Define, Validate and Execute
- [ ] Hydration warning on `/process`: `useId` values differ between server and browser (seen on `CapabilitiesGrid` tiles). Something above them renders differently on each side. The Define/Validate bentos now use fixed ids and no longer trigger it
- [ ] Chinese copy for the Validate and Execute tiles: `/zh/process` shows the English text

## Questions for the user

## Future phases (not V1)
- [ ] Blog / Insights section (Phase 2, when 5+ articles ready)
- [ ] Interactive world map (revisit when 30+ real data points)
- [ ] Chinese + Spanish translations (next-intl integration)
- [ ] Client portal integration (SSO, shared tokens)
- [ ] Fork for SPL, Lance Trade, Alliance umbrella sites

## Client impact carousel (/client-impact)
- [ ] Badges show facts taken from each project's own text (`impact` in `content/projects.ts`). Replace with real client figures (cost saved, lead time, units) once clients approve them
- [ ] Project names, summaries and badges are English only on `/es` and `/zh` (project data in `content/projects.ts` is not localized yet)
- [ ] `npm run lint` does nothing useful: ESLint 4.19 is installed with no config, so it only prints help. Upgrade to ESLint 9 + `eslint-config-next` flat config

## Projects map (/client-impact)
- [ ] HQ descriptions and the Chinese finder strings are English only on `/es` and `/zh` (`content/i18n/zh/capabilities.ts` reuses `en.finder`)
- [ ] `react-globe.gl` and `three` are no longer imported anywhere; remove them from `package.json` when you are ready (needs your OK per CLAUDE.md)

## About: "Where we are" (Presence section)
- [ ] Services per country are drafts (en + es) in `content/about.ts` and `content/i18n/es/about.ts`. Send the real list per country
- [ ] HQ cities for Italy (Rome), Mexico (Mexico City) and Panama (Panama City) are placeholders. Confirm them
- [ ] HQ photos: only Spain has one. Add the others to `public/countries/` and set `hqImage` in `content/presence-places.ts`
- [ ] Italy, Mexico and Panama card texts are new copy. `/zh` shows the English text for the whole section
