# Pacific Silk Consulting — Website Project Constitution

This file is the source of truth for all Claude Code sessions working on this project. Read it at the start of every session. If you're about to do something that contradicts this file, stop and ask.

---

## 1. Project Overview

The public-facing marketing website for **Pacific Silk Consulting (PSC)** at `pacificsilkconsulting.com`.

**Primary job of the site:** Convert qualified international clients into initial sales calls, by making it immediately clear that PSC operates a unique infrastructure for running China projects remotely — not just another advisory firm.

**Secondary job:** Serve as the public entry point for returning clients to access the invite-only client portal.

**What this site is NOT:**
- Not a directory of services (we don't list 47 things we do)
- Not a content marketing blog (no blog at launch)
- Not a self-service product site (no signup flows, no pricing calculator)
- Not a traditional consulting site with a "Team" wall of headshots and three generic services

## 2. Business Context

### The company
PSC is an international consulting firm that gives foreign companies **privileged, operational access to China — without requiring physical presence**. We are the only all-in-one solution: from first idea, to supplier quotation, to sample validation, to final contract, to delivery, to peace of mind.

PSC does not just advise. **PSC executes.**

### The Pacific Silk Alliance
PSC is the international face of a three-company joint venture:

- **Pacific Silk Consulting (PSC)** — international consulting, client-facing, strategy & expansion
- **SPL** — Chinese logistics (supply chain, shipping, customs, warehousing in/out of China)
- **Lance Trade** — sourcing, supplier vetting, production management inside China

Three separate companies, one coordinated operation under a JV agreement. When a client hires PSC, they access the full alliance's capabilities through a single contract.

### Core services (internal reference)
1. **Sourcing & supplier management** (primary workflow — most projects)
2. **Market entry into China** (expansion — finding partners, JVs with factories, new clients in China)
3. **Manufacturing & production** (execution with Lance Trade)
4. **Logistics & supply chain** (execution with SPL)
5. **General China advisory** (catch-all for bespoke projects)

Audience is **industry-agnostic** — manufacturing, consumer goods, hardware, F&B, fashion, industrial all welcome. Messaging stays broad, specific industries surface through case studies.

### The client portal (future)
A separate web application where engaged clients log in to submit project info, upload documents, and track progress. Controlled access — PSC chooses what each client sees.

**Relationship to this website:**
- The portal is a **separate codebase**, built later as a separate project
- The marketing website only **links to** the portal; it does not contain it
- Portal is **invite-only** — no self-service signup on the marketing site
- The marketing site's role re: portal is: a clear "Client Portal" nav link → simple explainer page → CTA for prospective clients to book a call, or existing clients to log in at a separate URL

## 3. Positioning & Messaging

### Elevator pitch
PSC and the Pacific Silk Alliance give international companies privileged access to China's sourcing, production, and logistics infrastructure — turning months of setup and risk into a seamless, remote-operated process.

### Why clients choose PSC (differentiator)
**Integrated alliance.** Competitors offer consulting OR sourcing OR logistics. PSC offers all three as a single, coordinated operation. One contract. One point of contact. Three companies executing together.

### The hero narrative of the site
The hero of every page is NOT a list of services — it's **our process and infrastructure**. The site should feel like we're showing the reader *how* we operate, not bragging about *what* we do. Services are proof points; process is the show and our diferentiator.

## 4. Audience

**Primary:** International companies (mid-market to enterprise) looking to source, manufacture, or expand into/out of China without building a local presence.

**Industries:** Any. Don't over-segment.

**What this audience responds to:**
- Confidence without arrogance
- Concrete operational details (timelines, process steps, handled problems)
- Proof of execution, not slideware
- Zero jargon, zero vague "solutions" language
- A sense that we've already thought about the hard parts

**What puts this audience off:**
- Generic consulting voice
- Stock photos of "diverse business team shaking hands"
- Flag graphics, globe icons, world-map-with-pulsing-dots clichés
- Every-competitor-looks-the-same design (blue/white corporate)
- Demands for their contact info before they understand what we do

## 5. Brand Direction

### Personality
**Bold & different.** The site must NOT look or feel like McKinsey / BCG / Deloitte (corporate blue, stock photography, vague promises). It must feel like a **modern operations brand** or a **premium product company** — confident, specific, slightly editorial, Silk-Road-heritage-meets-modern-infrastructure.

### Brand origin angle
"Pacific Silk" evokes the Silk Road — the historic trade route between China and the world. We are the modern Silk Road: an infrastructure of people, relationships, and operations that moves value between China and international markets. Subtle references welcome (typography, imagery metaphors, section names). Never heavy-handed.

### Reference websites (style inspiration)
- **opalcamera.com** — hero with image behind, confident product presentation, single clear CTA
- **atlason.com** — minimalism, interaction design, editorial feel, confident white space
- **oku.club** — color discipline, clean structure, elegant UI details
- **tatem.com** — step-by-step process showcase (directly relevant — we must showcase our process this way)

See `.claude/design-recreation.md` for the workflow when recreating elements inspired by references.

## 6. Visual Design System

### Colors
```
--psc-bg:       #FAFAF7   /* warm off-white — primary background */
--psc-ink:      #0A0A0A   /* near-black — primary text */
--psc-gray:     #6B6B6B   /* secondary text, metadata */
--psc-muted:    #EFECE4   /* subtle warm tone for section backgrounds */
--psc-red:      #E71F1F   /* brand accent — sparingly, confidently */
--psc-border:   #E5E3DC   /* subtle dividers */
--psc-gold:     #B8913A   /* golden sample accent — fill/stroke only, never text on cream */
```

### Typography
- **Display/headings:** `Cormorant Garamond` (Google Fonts) — heritage, elegance, confidence. Weights: 400, 500, 600.
- **Body & UI:** `Inter` (Google Fonts). Weights: 400, 500, 600.
- **Philosophy:** classical serif + modern sans = heritage meets operational modernity. This pairing alone makes us look different from 95% of consulting firms.

**Type scale (desktop):**
- Hero display: 72–96px Cormorant, weight 500, leading 1.05
- H1: 56–64px
- H2: 36–44px
- H3: 24–28px
- Body: 17–18px Inter weight 400, leading 1.6
- Small/meta: 14–15px Inter weight 400, color `gray`

### Spacing & layout
- Generous whitespace is a feature
- Max content width: 1280px (`max-w-7xl`)
- Reading-width content: 720px (`max-w-3xl`)
- Section vertical padding: 96–160px desktop, 64–96px mobile
- Grid: 12-column, 32px gap desktop

### Imagery
This is a known weak area. Rules:

- **Curate aggressively.** 8–12 carefully-chosen photos across the whole site beats 40 mismatched ones.
- **Unified treatment.** Every photo passes through the same filter: warm tone (+5 warmth), slightly desaturated (-10 to -15), subtle grain. This turns mismatched sources into a single visual language.
- **Prefer real photography** over illustration: ports, factories, streetscapes, team at work, product close-ups, warehouses, trucks, paperwork, container ships.
- **Forbidden photography types:** generic handshakes, stock "business meeting" imagery, skylines with city-name overlays, globe graphics, arrows-over-world-maps, fake diverse team stock shots.
- **Full-bleed beats small.** A few large, confident images beat many small tiles.

### Motion & interaction
- Subtle, intentional: hover states, scroll-triggered fade-and-rise (4–8px translate), smooth scroll
- Never flashy, never gratuitous
- Respect `prefers-reduced-motion`
- Inspiration: Atlason's calm, purposeful motion

## 7. Voice & Tone

### Do
- Declarative statements: "We operate." "We negotiate." "We deliver."
- Specific numbers, concrete verbs
- Acknowledge China is hard — and that we've solved that for the client
- "We" (PSC) and "you" (client). Rarely "our clients" (distancing).
- Short sentences. Confident rhythm.

### Don't
- Consulting jargon: synergize, leverage, world-class, cutting-edge, solutions, partner with you
- Hype: revolutionary, game-changing, disruptive, next-generation
- Vague superlatives: best-in-class, industry-leading, trusted
- Overly formal corporate voice
- Hedging: "we can potentially help you explore..."
- Emojis in website copy

### Examples

**Bad:** "Pacific Silk Consulting partners with international organizations to deliver world-class China market entry solutions."
**Good:** "We get your product made in China. We move it. We handle the paperwork. You run your business."

**Bad:** "Our comprehensive suite of services leverages local expertise to optimize your supply chain."
**Good:** "One contract. One point of contact. Your factory, your freight, your customs — all handled."

**Bad:** "Let us be your trusted advisor for navigating the complexities of the Chinese market."
**Good:** "You send us a product idea. We come back with a quote, a sample, and a factory."

## 8. Technical Stack (DO NOT CHANGE WITHOUT DISCUSSION)

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4
- **Fonts:** `next/font` loading Cormorant Garamond + Inter from Google Fonts (self-hosted by Next)
- **Images:** `next/image` for all images
- **Deployment:** Vercel (auto-deploy from GitHub `main`)
- **Version control:** Git + GitHub
- **Package manager:** npm

### Allowed libraries
- `next`, `react`, `react-dom`
- `tailwindcss`, `@tailwindcss/postcss`
- `clsx` or `tailwind-merge` (conditional classes)
- `lucide-react` (icons — clean, consistent)
- `d3-geo`, `topojson-client`, `world-atlas` (the route globe in `/tools`; `d3-geo` also measures route distances)

### Forbidden (for V1)
- No UI component libraries (shadcn, MUI, Chakra, Ant) — we build from scratch for a bespoke feel
- No animation libraries without explicit approval (start with CSS + Tailwind)
- No CMS integration yet (content hardcoded in `/content` data files)
- No third-party scripts without approval (each is a security + performance tax)
- No analytics that leak user data (preferred: Plausible or Vercel Analytics)

## 9. Quality Standards

### Security (NON-NEGOTIABLE)
- HTTPS enforced (Vercel default)
- Security headers in `next.config.js`: CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy
- No secrets in code — `.env.local` for keys, in `.gitignore`
- Every npm dependency justified
- Form submissions via secure handler (Formspree, Resend, or Vercel serverless)
- No tracking scripts that leak data

### SEO (FIRST-CLASS CITIZEN)
- Every page: unique `<title>` + `<meta description>` via Next.js `metadata` export
- JSON-LD structured data: `Organization`, `WebSite`, plus page-specific
- Semantic HTML: proper `<header>`, `<main>`, `<nav>`, `<footer>`, `<article>`, `<section>`, `<h1>`–`<h6>`
- `sitemap.xml` and `robots.txt` auto-generated
- Open Graph + Twitter Card meta with custom OG images
- All images have meaningful `alt`
- Target: Lighthouse 95+ across all categories

### Accessibility
- WCAG 2.1 AA minimum
- Keyboard-navigable interactive elements with visible focus
- Color contrast meets minimums (red on white is borderline — check every instance)
- `aria-label` on icon-only buttons
- Forms have proper `<label>` associations

### Performance
- Core Web Vitals targets: LCP < 2.0s, CLS < 0.05, INP < 150ms
- Images via `next/image` with `priority` on hero images
- Fonts preloaded via `next/font`
- No layout shift from font loading

## 10. Site Architecture

### Navigation (top nav, 6 items max)
1. **Process** — how we operate, end-to-end
2. **Capabilities** — what we can do (replaces generic "Services")
3. **About** — company, alliance, people
4. **Gallery** — visual record of the work
5. **Tools** — shipping estimate and tariff finder
6. **Portal** — client portal explainer + login link

Plus a primary CTA button, "Start a project". No "Home" link in nav — the logo links home (standard convention). Six links don't fit below 1024px, so the nav collapses to the hamburger menu under Tailwind's `lg` breakpoint.

### Pages

**1. Home (`/`)**
Hero (big statement, one clear CTA), short intro to the alliance as our differentiator, the process in preview form (expandable/link to full page), selected capabilities, social proof (logos / anonymized cases), final CTA.

**2. Process (`/process`)** ← the signature page
End-to-end walkthrough of how a PSC engagement runs: Inquiry → Scoping → Sourcing/Partner Identification → Samples/Validation → Negotiation → Production/Execution → Logistics → Delivery → Ongoing Management. Step-by-step, tatem.com-inspired. Each step concrete, with what PSC does and what the client sees.

**3. Capabilities (`/capabilities`)**
Five core capabilities presented as an interconnected system, not a list: Sourcing, Market Entry, Manufacturing, Logistics, Advisory. Each is a substantial section, not a card. Show how they fit together via the alliance.

**4. About (`/about`)**
The story: why PSC exists, what the alliance is, how the three companies coordinate, the people. Shorter than traditional consulting About pages — we're not selling credentials, we're selling operations.

**5. Portal (`/portal`)**
Brief explainer of the client portal (what it is, who has access, how to get access). **No self-service signup.** Primary CTA: "Book a call to get started." Secondary CTA: "Existing client? Log in →" (links to portal URL, TBD).

**6. Contact (`/contact`)**
Form + direct channels. Simple, confident, not salesy.

**7. Legal** — `/privacy`, `/terms`, `/cookies` (required)

**8. Tools (`/tools`)** — public, no login
`/tools/shipping-estimate` estimates landed cost and draws the route on a globe. `/tools/tariff-finder` finds the customs code, average import price and EU tariff measures. Both read Supabase from the browser through `lib/tools/api.ts`, read only, and lead to `/start`. See `docs/tools-testing.md`.

### Explicitly NOT in V1
- Blog / Insights (Phase 2 — only launch when we have 5+ articles ready)
- Interactive world map (needs 30+ real data points; revisit later)
- Team bios page (traditional; we're skipping)
- Case studies page (may merge into Capabilities; reconsider)
- Self-service registration / signup
- Multilingual support (English-first, add later)

## 11. Future Phases (don't build yet, but architect for)

Build the V1 with these futures in mind:

- **i18n (Chinese, possibly Spanish):** all text content lives in `/content` data files, never hardcoded in JSX. When we integrate `next-intl`, it's a mechanical migration.
- **CMS migration:** components take content as props, not hardcoded. We can move to Sanity / Contentful without rewriting components.
- **Alliance multi-site:** design tokens and shared components are isolated enough that forking for SPL / Lance Trade / Alliance umbrella is a weekend job, not a rebuild.
- **Client portal integration:** currently external link only. Future integration points: SSO link from marketing site, shared design tokens, consistent brand treatment.
- **Blog / Insights:** the `/app` structure should accommodate an `/insights` route without restructuring.

## 12. Project Structure

```
pacific-silk-website/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout (fonts, metadata defaults)
│   ├── page.tsx                  # Home (/)
│   ├── process/page.tsx          # Process (/process)
│   ├── capabilities/page.tsx     # Capabilities (/capabilities)
│   ├── about/page.tsx            # About (/about)
│   ├── portal/page.tsx           # Portal explainer (/portal)
│   ├── contact/page.tsx          # Contact (/contact)
│   ├── (legal)/                  # Privacy, Terms, Cookies
│   ├── globals.css               # Tailwind directives + global styles
│   ├── sitemap.ts                # Auto-generated sitemap
│   └── robots.ts                 # robots.txt
├── components/
│   ├── ui/                       # Primitives: Button, Link, Container, Nav
│   ├── sections/                 # Composed sections: Hero, ProcessStep, etc.
│   └── tools/                    # Shipping estimate, tariff finder, route globe, tools.css
├── content/                      # Content as data (prep for i18n + CMS)
│   ├── home.ts
│   ├── process.ts
│   ├── capabilities.ts
│   ├── tools.ts
│   └── ...
├── lib/                          # Utilities, helpers
│   └── tools/                    # Supabase client (api.ts), routes, landed-cost model, tests
├── data-pipeline/                # Python scrapers + database docs (never shipped; see its README)
├── docs/                         # Manual test checklists
├── public/                       # Static assets (images, favicons, OG images)
├── references/                   # Reference screenshots & brand assets (not shipped)
├── .claude/                      # Claude Code supporting docs
│   ├── design-recreation.md      # Workflow for recreating reference designs
│   └── references.md             # How to work with visual references
├── CLAUDE.md                     # THIS FILE — project constitution
├── TODO.md                       # Cross-session open items tracker
├── next.config.js                # Security headers, image config
├── tailwind.config.ts            # Design tokens (colors, fonts, spacing)
├── tsconfig.json                 # TypeScript config
├── .env.local                    # Local-only secrets (not committed)
├── .gitignore
└── package.json
```

## 13. Common Tasks

### Update the main tagline or brand copy
Edit the relevant file in `content/` (e.g., `content/home.ts` → `hero.tagline`). Never hardcode content in JSX.

### Update brand colors globally
Edit `tailwind.config.ts` under `theme.extend.colors.psc`. Never hardcode hex values in components.

### Add a new capability
1. Add entry to `content/capabilities.ts`
2. If it needs a detail page: `app/capabilities/[slug]/page.tsx`
3. Nav update only if it's top-level (it probably isn't)

### Update portal link
Currently placeholder. When the portal exists, update the href in `components/ui/Nav.tsx` and `content/portal.ts`.

### Change the favicon / OG image
Replace files in `public/` — keep filenames identical.

### Add a new page
1. Create `app/[page-name]/page.tsx`
2. Export a `metadata` object (title + description)
3. Add to nav in `components/ui/Nav.tsx` if top-level
4. Add to sitemap if custom logic needed

## 14. Git Workflow

### Rules
- `main` is always deployable. Broken main = broken live site.
- Commit often. Small commits > big commits.
- Commit messages explain WHY, not just what.
- Before any meaningful change, create a branch.

### Starting a feature
```bash
git checkout main
git pull
git checkout -b feature/process-page
```

### Finishing a feature
```bash
git add .
git commit -m "feat: process page layout and step-by-step section"
git push origin feature/process-page
```
Open PR on GitHub → check Vercel preview URL → merge to main when happy.

### Commit message prefixes
- `feat:` new feature
- `fix:` bug fix
- `style:` visual/formatting change
- `copy:` content/text change
- `chore:` maintenance (deps, config)
- `docs:` documentation (including this file)

## 15. Deployment

### Production
Vercel auto-deploys from `main`. Push to main = live in ~60 seconds.

### Preview
Every pushed branch gets a preview URL from Vercel. Always test previews before merging.

### Local development
```bash
npm run dev        # start local server at localhost:3000
npm run build      # production build (test before pushing)
npm run lint       # check for code issues
```

### Emergency rollback
Vercel dashboard → Deployments → [last working deploy] → "Promote to Production."

## 16. External Dependencies

Every external service is a security tax and potential failure point. Document them here. Adding new = update this table.

| Service | Used for | Notes |
|---|---|---|
| Vercel | Hosting, deployment, previews | vercel.com |
| GitHub | Version control | github.com |
| Google Fonts | Cormorant Garamond, Inter | Loaded via `next/font` (self-hosted) |
| Hostinger | Domain registration + email (email only, NOT hosting) | DNS will point to Vercel |
| Supabase | Database behind `/tools`; client portal auth (email + password, gated by `app_metadata.approved`) | Tools read only from the browser with the publishable key. `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_KEY`. Schema in `data-pipeline/db/DATABASE.md` |
| [TBD] | Contact form handler | Options: Formspree, Resend, Vercel form |
| [TBD] | Analytics | Options: Plausible, Vercel Analytics |

## 17. Working Rules for Claude Code

### Before every code-writing session
1. Confirm you've read this file (summarize one key principle to prove it)
2. State your plan before executing
3. Ask clarifying questions if a request is ambiguous
4. Propose approach → get confirmation → execute

### Code style
- TypeScript strict. No `any` without a comment justifying it.
- Components `PascalCase.tsx`, utilities `camelCase.ts`
- One component per file (unless tightly coupled)
- Explicit prop interfaces, not inline types
- Semantic, accessible HTML always
- Tailwind class order: layout → spacing → typography → color → states

### Content handling
- All user-facing copy lives in `content/` data files, never hardcoded in JSX
- When creating filler content, use realistic PSC-voice copy, never Lorem ipsum
- Content changes should be committed with `copy:` prefix, code changes with `feat:` or `fix:`

### Working from reference images
See `.claude/design-recreation.md` for the full workflow. Key principles:
- Describe what you see BEFORE writing code; get confirmation
- Reference colors/fonts get replaced with PSC tokens — always
- Iterate at least twice with specific, measurable comparisons
- Don't "improve" the reference — match structure/feel, then stop
- Verify responsive at 375px, 768px, 1280px+

### When in doubt
- Simple > clever
- Readable > clever
- Standard Next.js patterns > custom
- If building something non-obvious, leave a comment explaining why
- If unsure, ask — don't guess

### What NOT to do
- Don't install packages without proposing first
- Don't refactor large swathes unsolicited
- Don't add features beyond what was asked
- Don't "improve" requests beyond what was asked. Suggestions welcome AFTER the task is complete, as a question.
- Don't create Lorem ipsum placeholders
- Don't use emojis in website copy (site is confident, not cute)
- Don't hardcode content — always `content/*.ts`
- Don't hardcode colors — always Tailwind tokens

## 18. Verification Protocol

Every code-writing task is considered "done" only after running through this verification checklist. Do not declare work complete until each applicable item is checked.

### For any code change
- [ ] Does the change match what was requested? No more, no less?
- [ ] Does the build pass? (`npm run build` completes without errors)
- [ ] Does the lint pass? (`npm run lint` reports no errors)
- [ ] Are there any TypeScript errors?
- [ ] Did I avoid hardcoding content or colors?
- [ ] Are any new dependencies justified and documented?

### For a new page or section
- [ ] Semantic HTML used (correct heading hierarchy, landmarks)
- [ ] All images have meaningful `alt` text
- [ ] Keyboard navigation works (focus states visible)
- [ ] Color contrast meets WCAG AA
- [ ] Page has proper `metadata` export (title, description, OG tags)
- [ ] Responsive: verified at 375px (mobile), 768px (tablet), 1280px+ (desktop)
- [ ] Content is pulled from `content/` data files, not hardcoded in JSX

### For a visual/design change
- [ ] Design tokens used (no hex codes in components)
- [ ] Typography scale matches the system
- [ ] Spacing follows the established rhythm
- [ ] Motion respects `prefers-reduced-motion`
- [ ] At least 2 comparison passes if working from a reference (see `.claude/design-recreation.md`)

### For a content change
- [ ] Voice matches the examples in Section 7
- [ ] No jargon from the "don't" list
- [ ] No Lorem ipsum
- [ ] Content lives in `content/` files, not hardcoded

### Reporting back to the user
When a task is complete, tell the user:
1. What changed (specific files)
2. What verifications passed
3. Anything that could not be verified and why
4. Any TODOs added to `TODO.md` for follow-up

### If verification reveals a problem
- Fix the problem before declaring done
- Do not silently lower the quality bar
- If you can't fix it in the current session, document it in `TODO.md` clearly

## 19. Session Protocol

### Starting a session
1. Read `CLAUDE.md` fully
2. Read `TODO.md` for open items
3. Read any files directly relevant to the task
4. Summarize one key principle before writing any code
5. Confirm the plan with the user before executing

### Working through a session
- Stay focused on the session's stated purpose
- If the user goes off-scope, gently flag it and ask whether to continue or refocus
- Commit work in small, logical chunks — not one giant commit at the end

### Ending a session
Before the user closes the session, output:
1. **Summary:** what was changed (files, purpose)
2. **Verified:** which checklist items passed
3. **Open items:** append to `TODO.md` with clear descriptions
4. **Next session:** suggest what the next session should focus on
5. **Commits:** confirm all changes are committed with appropriate message prefixes

---

*Project constitution. Updated: April 2026. When this file changes materially, commit with `docs: update CLAUDE.md — [reason]`.*
