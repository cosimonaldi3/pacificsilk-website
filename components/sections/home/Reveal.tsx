"use client";

import { useEffect, useRef, useState } from "react";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li";
}

/* Fades its children up once they enter the viewport. Styles in home.css (.hm-rv). */
export default function Reveal({ children, className = "", as: Tag = "div" }: RevealProps) {
  const ref = useRef<HTMLDivElement & HTMLLIElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} data-on={on} className={`hm-rv ${className}`}>
      {children}
    </Tag>
  );
}
