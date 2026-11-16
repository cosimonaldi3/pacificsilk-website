import Image from "next/image";

/**
 * Wordmark variants (`psc-horizontal-*`, `psa-horizontal-*`, `lance-*`, `spl-*`):
 *   Primary brand identification on key pages — nav, footer, hero areas.
 *
 * Symbol-only variants (`logo-only-*`):
 *   When context already establishes the brand — favicons, avatars,
 *   decorative accents, watermarks in tight spaces.
 *
 * Symbol with coloured background (`logo-red`, `logo-white-red`, etc.):
 *   Bold decorative elements. Pick the variant that contrasts the surrounding
 *   section background. Use sparingly — one per page max.
 *
 * Endorsement lockups (`endorsement-light`, `endorsement-dark`):
 *   PSC + PSA together. Reserve for content that explicitly discusses the
 *   Pacific Silk Alliance. Light variant for light sections, dark for dark.
 */

export type LogoVariant =
  // PSC wordmarks — horizontal
  | "psc-horizontal-red"
  | "psc-horizontal-white"
  | "psc-horizontal-black"
  // PSA wordmarks — horizontal
  | "psa-horizontal-red"
  | "psa-horizontal-white"
  | "psa-horizontal-black"
  // Symbol-only, transparent background
  | "logo-only-red"
  | "logo-only-white"
  | "logo-only-black"
  // Symbol with coloured background (square)
  | "logo-red"
  | "logo-white-red"
  | "logo-black-white"
  | "logo-white-black"
  // Endorsement lockups — PSC + PSA together
  | "endorsement-light"
  | "endorsement-dark"
  // Subsidiary logos
  | "lance-primary"
  | "lance-reversed"
  | "spl-primary"
  | "spl-reversed";

// Aspect ratio (width / height) for each variant group
const ASPECT_RATIO: Record<LogoVariant, number> = {
  "psc-horizontal-red":   2,
  "psc-horizontal-white": 2,
  "psc-horizontal-black": 2,
  "psa-horizontal-red":   2,
  "psa-horizontal-white": 2,
  "psa-horizontal-black": 2,
  "logo-only-red":        1,
  "logo-only-white":      1,
  "logo-only-black":      1,
  "logo-red":             1,
  "logo-white-red":       1,
  "logo-black-white":     1,
  "logo-white-black":     1,
  "endorsement-light":    3.75,
  "endorsement-dark":     3.75,
  "lance-primary":        2,
  "lance-reversed":       2,
  "spl-primary":          2,
  "spl-reversed":         2,
};

function defaultAlt(variant: LogoVariant): string {
  if (variant.startsWith("psc"))         return "Pacific Silk Consulting";
  if (variant.startsWith("psa"))         return "Pacific Silk Alliance";
  if (variant.startsWith("lance"))       return "Lance Trade";
  if (variant.startsWith("spl"))         return "SPL";
  if (variant.startsWith("endorsement")) return "Pacific Silk Consulting — Pacific Silk Alliance";
  return "Pacific Silk Consulting";
}

interface LogoProps {
  variant: LogoVariant;
  /** Rendered width in px. Height is derived from the aspect ratio. Default: 200 */
  width?: number;
  /** Pass true for above-the-fold logos to skip lazy loading. Default: false */
  priority?: boolean;
  className?: string;
  alt?: string;
}

export default function Logo({
  variant,
  width = 200,
  priority = false,
  className,
  alt,
}: LogoProps) {
  const height = Math.round(width / ASPECT_RATIO[variant]);

  return (
    <Image
      src={`/logos/${variant}.png`}
      alt={alt ?? defaultAlt(variant)}
      width={width}
      height={height}
      priority={priority}
      className={className}
    />
  );
}
