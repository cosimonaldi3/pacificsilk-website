# Design Recreation Workflow

Use this workflow whenever the user provides a reference image (screenshot) and asks you to recreate it in the Pacific Silk Consulting codebase.

## Workflow

1. **Understand the reference first.** Before writing code, describe what you see: layout structure, hierarchy, spacing rhythm, colors, typography choices, and any interactive hints. Ask the user to confirm or correct your reading.

2. **Map to the PSC design system.** The reference is inspiration for *structure and feel*, not a pixel-copy. Translate the reference into PSC's actual design tokens from `CLAUDE.md`:
   - Replace the reference's colors with PSC's palette (`--psc-bg`, `--psc-ink`, `--psc-red`, etc.)
   - Replace the reference's fonts with Cormorant Garamond (display) + Inter (body)
   - Respect PSC's spacing scale and max-widths

3. **Build the component.** Create a new component in `components/sections/` or `components/ui/` as appropriate. TypeScript, accessible HTML, Tailwind classes. Use real content where possible, not Lorem ipsum — pull from `content/` data files if they exist.

4. **Screenshot the result.** Run the local dev server and capture a screenshot of the rendered component. If you cannot run Puppeteer or a screenshot tool directly, ask the user to send a screenshot of the preview.

5. **Compare against the reference.** Be specific:
   - Spacing and padding (measure in px)
   - Font sizes, weights, and line heights
   - Alignment and positioning
   - Border radii, shadows, effects
   - Responsive behavior at 375px (mobile), 768px (tablet), 1280px+ (desktop)
   - Image/icon sizing and placement

6. **Fix every mismatch.** Edit the component.

7. **Re-screenshot and compare.** Again. Specifically.

8. **Repeat** until differences are minor (~2–3px) or the user confirms the result is acceptable.

**Do not stop after one pass. Always do at least 2 comparison rounds.**

## Rules

- **Structure and feel, not pixel-perfect copy.** We are inspired by references, not cloning them. A reference hero's *layout and confidence* matters more than matching its specific color.
- **Respect the PSC design system.** Reference colors/fonts are replaced by PSC tokens — always.
- **Do not add features, sections, or content not in the reference.** Don't "improve" the design. If you have suggestions for improvement, mention them after the match is achieved — don't sneak them in.
- **When comparing, be concrete.** "Hero padding-top is 96px, reference looks like ~120px" beats "hero feels cramped."
- **Flag copyright concerns.** If the reference contains copyrighted imagery, illustrations, or specific text, note it — we'll source original or licensed versions.
- **Accessibility is not optional.** Even if the reference has poor contrast or inaccessible patterns, the PSC recreation must meet WCAG AA.
- **Responsive behavior matters as much as desktop.** Always verify mobile and tablet, not just desktop.
