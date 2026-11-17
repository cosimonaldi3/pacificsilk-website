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
  buttonRef,
  onOpen,
  children,
}: DefineTileProps) {
  return (
    <TileShell glowAt={glowAt} className={`min-h-[18rem] ${className}`}>
      <header className="relative z-10 flex items-start justify-between gap-6 p-6 md:p-8">
        <h3 className="font-display text-h3 leading-snug font-medium text-psc-ink">{title}</h3>
        <button
          ref={buttonRef}
          type="button"
          onClick={onOpen}
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={expandLabel}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-psc-muted text-psc-red transition-colors hover:bg-psc-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-psc-red"
        >
          <PlusIcon />
        </button>
      </header>
      <div className="relative flex flex-1 flex-col justify-center">{children}</div>
    </TileShell>
  );
}
