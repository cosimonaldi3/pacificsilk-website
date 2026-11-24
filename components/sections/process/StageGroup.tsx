"use client";

import { useEffect, useRef, useState } from "react";
import { scrollToCenter } from "./scrollToCenter";

interface StageGroupProps {
  /* Stage number as shown, "01" to "04" */
  number: string;
  name: string;
  span: string;
  showLabel: string;
  hideLabel: string;
  /* Stage index, used for the fixed element ids */
  index: number;
  /* Shown under the toggled block and never folded away (Beyond's network) */
  footer?: React.ReactNode;
  children: React.ReactNode;
}

/* One stage: its heading, and a plus/minus button that folds the stage's box grid open and shut.
   Only the first stage starts open; the rest start closed and open as they are scrolled to. The grid stays
   in the HTML either way. When a stage opens, the camera centres on the whole stage block; if that
   is taller than the screen, its heading is lined up under the nav instead so the title stays visible. */
export default function StageGroup({ number, name, span, showLabel, hideLabel, index, footer, children }: StageGroupProps) {
  const [open, setOpen] = useState(index === 1);
  const liRef = useRef<HTMLLIElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bodyId = `stage-${index}-body`;

  /* Scrolling a stage's heading to the middle of the screen opens it, once. Opening only pushes content
     below it down, so the scroll position never jumps. After that the button is in the reader's hands:
     closing a stage by hand is not undone by scrolling past it again. */
  useEffect(() => {
    const header = headerRef.current;
    if (!header || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setOpen(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-35% 0px -45% 0px" },
    );
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    /* Nothing above the stage moves while it opens, and its content is laid out at full height
       from the start, so the block's final height can be measured now rather than after the animation */
    if (next && liRef.current && headerRef.current && contentRef.current) {
      const height = headerRef.current.offsetHeight + contentRef.current.offsetHeight;
      scrollToCenter(liRef.current.getBoundingClientRect().top, height);
    }
  };

  return (
    <li ref={liRef} id={`stage-${index}`} className="scroll-mt-24">
      <div ref={headerRef} className="flex items-start justify-between gap-6">
        <div>
          <h2 className="font-display text-h2 font-medium leading-tight text-psc-ink">
            <span className="mr-3 font-mono text-base text-psc-red">{number}</span>
            {name}
          </h2>
          <p className="mb-6 mt-1 font-sans text-body text-psc-gray">{span}</p>
        </div>

        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-controls={bodyId}
          aria-label={open ? hideLabel : showLabel}
          className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-psc-muted text-psc-red transition-colors hover:bg-psc-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-psc-red"
        >
          <ToggleIcon open={open} />
        </button>
      </div>

      {/* Grid rows animate from 0fr to 1fr. Closed, the box grid is inert and hidden from keyboard and screen readers */}
      <div
        ref={bodyRef}
        id={bodyId}
        inert={!open}
        className={`grid transition-[grid-template-rows] duration-500 ease-out motion-reduce:transition-none ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div ref={contentRef} className="pb-2">
            {children}
          </div>
        </div>
      </div>

      {footer}
    </li>
  );
}

/* A plus when the stage is closed; the vertical bar folds away to leave a minus when it is open */
function ToggleIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" aria-hidden="true">
      <path d="M3 8h10" />
      <path
        d="M8 3v10"
        style={{ transform: open ? "scaleY(0)" : "scaleY(1)", transformOrigin: "8px 8px", transition: "transform 300ms ease" }}
      />
    </svg>
  );
}
