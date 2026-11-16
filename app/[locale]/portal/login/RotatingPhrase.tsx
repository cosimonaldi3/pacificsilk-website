"use client";

import { useEffect, useState } from "react";

const PHRASES = [
  "Your China operation starts here.",
  "你的中国业务，从这里开始。",
  "Tu operación en China empieza aquí.",
  "One contract. Every capability.",
  "一份合同。全面能力。",
  "Un contrato. Todas las capacidades.",
];

interface Props {
  colorClass?: string;
}

export default function RotatingPhrase({ colorClass = "text-psc-ink" }: Props) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % PHRASES.length);
        setVisible(true);
      }, 400);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <p
      className={`font-display font-medium ${colorClass} transition-opacity duration-400`}
      style={{
        fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)",
        lineHeight: 1.15,
        opacity: visible ? 1 : 0,
      }}
    >
      {PHRASES[index]}
    </p>
  );
}
