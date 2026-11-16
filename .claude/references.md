# Working with Visual References

How to organize reference assets and prompt Claude Code with them effectively.

## Where references live

```
/references/
├── inspiration/          # Whole-site or section references (Atlason, Opal, etc.)
│   ├── atlason-home.png
│   ├── opal-hero.png
│   └── tatem-process.png
├── brand/                # PSC brand assets (logo variants, colors, fonts)
│   ├── logo-horizontal-red.svg
│   ├── logo-horizontal-black.svg
│   └── logo-horizontal-white.svg
└── content/              # Real photography for the site
    └── [not yet organized]
```

Everything in `/references/` is a reference — **not** content that ships. Content that ships lives in `/public/` and `/content/`.

## How to reference an image in a Claude Code prompt

### Bad (vague)
> "Make the hero look like this."
> [screenshot]

Claude Code has to guess what you mean by "like this." The output will be mediocre.

### Good (specific)
> "Look at `/references/inspiration/atlason-home.png`.
>
> I want to match:
> - The overall layout proportions (hero takes full viewport height, text left-aligned, large display serif, one CTA)
> - The restrained color palette (single accent color, otherwise neutral)
> - The calm vertical rhythm (generous padding between sections)
>
> I do NOT want to match:
> - Their specific colors — use PSC tokens
> - Their exact copy — use the content in `content/home.ts`
> - Their imagery style — we have our own photo direction in CLAUDE.md Section 6
>
> Follow the workflow in `.claude/design-recreation.md`. Show me the result, compare it to the reference, and iterate at least twice before declaring done."

Notice what's happening:
- The reference is a **specific file** Claude Code can read
- You're explicit about what to take AND what to ignore
- You invoke the existing workflow doc
- You set the iteration expectation upfront

## How to reference multiple sources

Good pattern for composite inspiration:

> "For this section, I'm combining influences:
>
> - Layout structure from `/references/inspiration/tatem-steps.png` — the vertical step-by-step progression
> - Typography treatment from `/references/inspiration/atlason-home.png` — large display serif, restrained
> - Interaction style from `/references/inspiration/opal-hover.png` — subtle hover reveals
>
> Translate all of this into PSC's design system. Don't reproduce any single reference."

## When you don't have a reference

If you're building something without a visual reference, don't fake one. Instead, describe the intended feel verbally:

> "Build a contact page. No reference image. The feel should be:
> - Calm and confident, not salesy
> - One clear form, not a wall of fields
> - Short intro paragraph in the PSC voice
> - Generous whitespace
>
> Follow CLAUDE.md. Show me a first pass, I'll iterate."

Claude Code can work well from verbal direction when it's this specific.

## Reference screenshot hygiene

- **Capture at reasonable size** — don't zoom into one button; capture the whole section you're referencing
- **Name files descriptively** — `atlason-home-hero.png`, not `Screenshot 2026-04-17.png`
- **Keep a short note** of what you liked about each — a `.txt` or `.md` note alongside helps you remember weeks later
- **Don't include copyrighted imagery you'd copy verbatim** — references are for structure and feel, not content

## For brand assets (logo, existing brand guides)

When Claude Code needs to place the logo:

> "Use `/references/brand/logo-horizontal-black.svg` for the header on light backgrounds. Use `/references/brand/logo-horizontal-white.svg` on dark backgrounds. The logo should be approximately 40px tall in the header. Preserve aspect ratio."

Be specific about size and context every time.
