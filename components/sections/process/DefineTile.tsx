import TileShell from "@/components/sections/capabilities/TileShell";
import PlusIcon from "./PlusIcon";

interface DefineTileProps {
  title: string;
  expandLabel: string;
  /* Id of the overlay this tile opens, for aria-controls */
  panelId: string;
  open: boolean;
  glowAt: string;
  className?: string;
  /* "ink" for the near-black tile (Beyond's network), cream type and button on it */
  tone?: "cream" | "ink";
  buttonRef: (el: HTMLButtonElement | null) => void;
  onOpen: () => void;
  children: React.ReactNode;
}

/* One closed Define tile: the cream capability card with a title, the "+" button and its live
   visual. Opening is handled by DefineBento, which grows an overlay over the whole grid. */
export default function DefineTile({
  title,
  expandLabel,
  panelId,
  open,
  glowAt,
  className = "",
  tone = "cream",
  buttonRef,
  onOpen,
  children,
}: DefineTileProps) {
  const ink = tone === "ink";
  return (
    <TileShell glowAt={glowAt} tone={tone} className={`min-h-[18rem] ${className}`}>
      <header className="relative z-10 flex items-start justify-between gap-6 p-6 md:p-8">
        <h3 className={`font-display text-h3 leading-snug font-medium ${ink ? "text-psc-bg" : "text-psc-ink"}`}>{title}</h3>
        <button
          ref={buttonRef}
          type="button"
          onClick={onOpen}
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={expandLabel}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-psc-red ${
            ink ? "bg-psc-bg/10 text-psc-bg hover:bg-psc-bg/20" : "bg-psc-muted text-psc-red hover:bg-psc-border"
          }`}
        >
          <PlusIcon />
        </button>
      </header>
      <div className="relative flex flex-1 flex-col justify-center">{children}</div>
    </TileShell>
  );
}
