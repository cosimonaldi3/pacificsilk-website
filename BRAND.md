# Pacific Silk Consulting — Brand Reference

Source of truth for colours, fonts, logo variants, and placement rules.

---

## Colours

| Token | Hex | Use |
|---|---|---|
| `--brand-red` | `#e82020` | Primary brand accent |
| `--brand-ink` | `#1a1a1a` | Primary text / dark backgrounds |
| `--brand-white` | `#ffffff` | Pure white |
| `--brand-cream` | `#faf7f2` | Warm off-white background |
| `--brand-stone` | `#8a8376` | Secondary text / muted |

Legacy PSC tokens (in `globals.css` under `--color-psc-*`) remain valid for existing components. New components should prefer `brand-*` tokens.

---

## Fonts

| Role | Family | Weights |
|---|---|---|
| Display / headings | Cormorant Garamond | 400, 500, 600 |
| Body / UI | Inter | 400, 500, 600 |
| Chinese text | Noto Serif SC | 400, 500 (load when i18n ships) |

---

## Brand Architecture

| Entity | Role on this site |
|---|---|
| **PSC** (Pacific Silk Consulting) | Client-facing brand — primary identity throughout |
| **PSA** (Pacific Silk Alliance) | The three-company JV — show where alliance membership is relevant |
| **Lance Trade** | Alliance sibling — source, produce |
| **SPL** | Alliance sibling — logistics, freight |

---

## Logo Inventory (`/public/logos/`)

### PSC Wordmarks (horizontal, 2:1 ratio)
- `psc-horizontal-red.png` — red marks, transparent background
- `psc-horizontal-white.png` — white marks, transparent background
- `psc-horizontal-black.png` — black marks, transparent background

### PSA Wordmarks (horizontal, 2:1 ratio)
- `psa-horizontal-red.png`
- `psa-horizontal-white.png`
- `psa-horizontal-black.png`

### Symbol-only — transparent background (1:1 ratio)
- `logo-only-red.png`
- `logo-only-white.png`
- `logo-only-black.png`

### Symbol with coloured background (1:1 ratio)
- `logo-red.png` — red symbol on white
- `logo-white-red.png` — white symbol on red
- `logo-black-white.png` — black symbol on white
- `logo-white-black.png` — white symbol on black

### Endorsement lockups — PSC + PSA together (3.75:1 ratio)
- `endorsement-light.png` — for light backgrounds
- `endorsement-dark.png` — for dark backgrounds

### Subsidiary logos (2:1 ratio)
- `lance-primary.png` / `lance-reversed.png`
- `spl-primary.png` / `spl-reversed.png`

> **Note:** `psc-stacked-*` variants are not in the current asset set. Do not reference them.

---

## Logo Placement Convention

1. **Nav — always use wordmark.** `psc-horizontal-black` on light nav backgrounds. This is the primary brand touchpoint on every page.

2. **Footer — always use wordmark.** `psc-horizontal-white` on the dark (`psc-ink`) footer background. Reinforces brand at page end without repetition.

3. **One logo family per section.** Never show a wordmark and a symbol-only on the same section — pick one based on context.

4. **Symbol-only is decorative or compact.** Use `logo-only-*` for watermarks, avatars, favicons, or tight spaces where context already establishes the brand. Do not use as a primary identifier.

5. **Coloured-background symbols are bold accents.** Use sparingly — one per page max. Pick the variant that contrasts the surrounding section background.

6. **Endorsement lockup where alliance is the subject.** `endorsement-light` on light sections, `endorsement-dark` on dark sections. Reserve for content that explicitly discusses the PSA (e.g., the Alliance section on the home page).

7. **Subsidiary logos in alliance context only.** `lance-primary`, `spl-primary`, etc. belong in sections that explicitly name the alliance siblings. Do not scatter them across unrelated pages.

8. **Empty space has value.** Do not add a logo to a section just because space exists. If placement feels forced, skip it.
