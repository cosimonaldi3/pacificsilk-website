"use client";

import { useEffect, useRef, useState } from "react";

// Eases a displayed number towards its new value.
export function useTweened(value: number, ms = 900): number {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(value);
      from.current = value;
      return;
    }
    const start = performance.now();
    const a = from.current;
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      const v = a + (value - a) * (1 - Math.pow(1 - t, 3));
      setShown(v);
      from.current = v;
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, ms]);
  return shown;
}
