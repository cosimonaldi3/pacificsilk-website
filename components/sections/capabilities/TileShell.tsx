interface TileShellProps {
  className?: string;
  /* Where the warm red glow sits, as a CSS position ("85% 0%") */
  glowAt?: string;
  /* "ink" flips the card to the near-black tone with cream type (used to set a tile apart) */
  tone?: "cream" | "ink";
  children: React.ReactNode;
}

/* The cream card shared by the capability tiles: border, rounded corners and the
   brand-red radial glow that brightens on hover. The ink tone keeps the same shape and glow. */
export default function TileShell({ className = "", glowAt = "85% 0%", tone = "cream", children }: TileShellProps) {
  const ink = tone === "ink";
  return (
    <article
      className={`cap-tile group relative flex flex-col overflow-hidden rounded-2xl border ${
        ink ? "border-psc-ink bg-psc-ink text-psc-bg" : "border-psc-border bg-psc-bg"
      } ${className}`}
    >
      {/* Warm wash: the brand red fading into the cream background (or into the ink, for the ink tone) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: ink
            ? `radial-gradient(circle at ${glowAt}, color-mix(in srgb, var(--color-psc-red) 28%, transparent), transparent 70%)`
            : `radial-gradient(circle at ${glowAt}, color-mix(in srgb, var(--color-psc-red) 18%, transparent), color-mix(in srgb, var(--color-psc-muted) 60%, transparent) 45%, transparent 75%)`,
        }}
      />
      {children}
    </article>
  );
}
