"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import type { GalleryItem } from "@/content/gallery";

// Thumbnail dimensions — tweak these to adjust the strip feel
const ITEM_W = 130; // px
const ITEM_H = 88; // px
const GAP = 3; // px between thumbnails
const STRIDE = ITEM_W + GAP; // 133px per slot

// Easing factor for momentum scroll (lower = more "floaty")
const EASE = 0.12;

interface Props {
  items: GalleryItem[];
}

export default function GalleryClient({ items }: Props) {
  const COUNT = items.length;
  const SET_W = COUNT * STRIDE; // width of one full copy of the strip

  // DOM refs
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  // Animation state — all mutable refs, no re-renders during scroll
  const targetOffRef = useRef(-SET_W); // where we're easing toward
  const currentOffRef = useRef(-SET_W); // current animated position
  const prevActiveRef = useRef(-1); // last computed active index (avoids redundant setState)
  const rafRef = useRef<number | null>(null);

  // Drag state
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartOffRef = useRef(-SET_W);

  // React state — only updates when the active item actually changes
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // --------------------------------------------------------------------------
  // Animation loop — stored in a ref so it always captures the latest closure
  // (setSelectedIndex, COUNT, SET_W) even across re-renders.
  // --------------------------------------------------------------------------
  const animateFnRef = useRef<() => void>(() => {});

  // Reassigned on every render; RAF reads it via () => animateFnRef.current()
  animateFnRef.current = () => {
    const target = targetOffRef.current;
    const current = currentOffRef.current;
    let next = current + (target - current) * EASE;

    // Infinite-loop correction: if we drift into copy 1 (too far right) or
    // copy 3 (too far left), silently jump by one SET_W to stay in copy 2.
    if (next > -GAP) {
      const delta = -SET_W;
      next += delta;
      targetOffRef.current += delta;
    } else if (next < -(SET_W * 2 + GAP)) {
      const delta = SET_W;
      next += delta;
      targetOffRef.current += delta;
    }

    currentOffRef.current = next;

    // Apply transform directly to DOM — avoids per-frame React re-renders
    if (stripRef.current) {
      stripRef.current.style.transform = `translateX(${next}px)`;
    }

    // Determine which item sits under the anchor (horizontal center of container)
    const containerW = wrapperRef.current?.clientWidth ?? 0;
    if (containerW > 0) {
      const anchor = containerW / 2;
      const slotUnderAnchor = Math.round((anchor - next) / STRIDE);
      const activeItem = ((slotUnderAnchor % COUNT) + COUNT) % COUNT;
      if (activeItem !== prevActiveRef.current) {
        prevActiveRef.current = activeItem;
        setSelectedIndex(activeItem); // triggers re-render only on item change
      }
    }

    // Continue loop or stop
    if (Math.abs(target - next) > 0.3) {
      rafRef.current = requestAnimationFrame(() => animateFnRef.current());
    } else {
      rafRef.current = null;
    }
  };

  // --------------------------------------------------------------------------
  // Wheel + trackpad listener (must be non-passive to call preventDefault)
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (COUNT === 0) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Prefer horizontal delta (trackpad two-finger swipe); fall back to vertical wheel
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      targetOffRef.current -= delta;
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(() => animateFnRef.current());
      }
    };

    // Attach to window so scrolling anywhere on the page drives the strip
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [COUNT]);

  // Cancel any in-flight RAF on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Compute initial active item once container width is known
  useEffect(() => {
    if (COUNT === 0) return;
    const containerW = wrapperRef.current?.clientWidth ?? 0;
    if (containerW <= 0) return;
    const anchor = containerW / 2;
    const slotUnderAnchor = Math.round((anchor - currentOffRef.current) / STRIDE);
    const active = ((slotUnderAnchor % COUNT) + COUNT) % COUNT;
    prevActiveRef.current = active;
    setSelectedIndex(active);
  }, [COUNT]);

  // --------------------------------------------------------------------------
  // Mouse drag handlers
  // --------------------------------------------------------------------------
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartOffRef.current = targetOffRef.current;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    targetOffRef.current =
      dragStartOffRef.current + (e.clientX - dragStartXRef.current);
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(() => animateFnRef.current());
    }
  };

  const handleMouseUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  // --------------------------------------------------------------------------
  // Empty state — no photos in the array yet
  // --------------------------------------------------------------------------
  if (COUNT === 0) {
    return (
      <div className="h-full flex flex-col">
        <div
          className="flex-shrink-0 border-b border-psc-border"
          style={{ height: ITEM_H }}
        />
        <div className="flex-1 flex items-center justify-center">
          <p className="font-sans text-small text-psc-gray">
            Photographs coming soon.
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // Render — strip + featured panel
  // --------------------------------------------------------------------------
  // Three copies of items for seamless infinite loop
  const tripleItems = [...items, ...items, ...items];
  const selectedItem = items[selectedIndex] ?? items[0];

  return (
    <div className="h-full flex flex-col">
      {/* ── Thumbnail strip ────────────────────────────────────────────────── */}
      <div
        ref={wrapperRef}
        className="flex-shrink-0 overflow-hidden border-b border-psc-border select-none"
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          ref={stripRef}
          className="flex"
          style={{
            gap: `${GAP}px`,
            // Initial position: start of copy 2 (item 1 at left edge)
            transform: `translateX(${-SET_W}px)`,
            willChange: "transform",
          }}
        >
          {tripleItems.map((item, i) => {
            const realIndex = i % COUNT;
            const isActive = realIndex === selectedIndex;

            return (
              <div
                key={i}
                className="relative flex-shrink-0 overflow-hidden"
                style={{ width: ITEM_W, height: ITEM_H }}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={ITEM_W}
                  height={ITEM_H}
                  className="object-cover w-full h-full"
                />

                {/* Active indicator: bottom rule */}
                {isActive && (
                  <div
                    aria-hidden
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-psc-ink"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Featured panel ─────────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0">
        {/* Large image */}
        <div className="w-[40%] flex-shrink-0 relative overflow-hidden">
          <Image
            src={selectedItem.src}
            alt={selectedItem.alt}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Metadata */}
        <div className="flex-1 border-l border-psc-border p-12 overflow-y-auto flex flex-col justify-center">
          <p className="font-sans text-psc-gray uppercase tracking-widest text-small">
            {selectedItem.location}
          </p>
          <p className="font-sans text-psc-ink mt-6 text-body leading-relaxed">
            {selectedItem.description}
          </p>
          <p className="font-sans text-psc-gray mt-6 text-small">
            {selectedItem.date}
          </p>
        </div>
      </div>
    </div>
  );
}
