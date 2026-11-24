"use client";

import { useEffect, useState } from "react";
import type { GuidedAnswers } from "@/lib/home/blueprint";

export type BuilderMode = "guided" | "manual";

export interface BuilderState {
  mode: BuilderMode;
  answers: GuidedAnswers;
  manual: string[];
  otherText: string;
}

const STORAGE_KEY = "psc-builder";
/* Fired after every save, so a second builder instance (or the quote form) on the same page stays in sync */
const SYNC_EVENT = "psc-builder-change";

export const EMPTY_BUILDER: BuilderState = {
  mode: "guided",
  answers: { type: null, today: null, dest: "", worries: [] },
  manual: [],
  otherText: "",
};

function read(): BuilderState {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_BUILDER;
    const parsed = JSON.parse(raw) as Partial<BuilderState>;
    return {
      mode: parsed.mode === "manual" ? "manual" : "guided",
      answers: { ...EMPTY_BUILDER.answers, ...parsed.answers },
      manual: Array.isArray(parsed.manual) ? parsed.manual : [],
      otherText: typeof parsed.otherText === "string" ? parsed.otherText : "",
    };
  } catch {
    return EMPTY_BUILDER;
  }
}

/* Builder selections live in sessionStorage so they follow the visitor from the home page to /start.
   Storage can be unavailable (private mode, blocked site data): the builder then simply starts empty. */
export function useBuilderState() {
  const [state, setState] = useState<BuilderState>(EMPTY_BUILDER);

  useEffect(() => {
    // Read after mount, not during render, so server and client HTML match
    setState(read());
    const onSync = () => setState(read());
    window.addEventListener(SYNC_EVENT, onSync);
    return () => window.removeEventListener(SYNC_EVENT, onSync);
  }, []);

  const update = (fn: (s: BuilderState) => BuilderState) => {
    setState((prev) => {
      const next = fn(prev);
      try {
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        // Defer so listeners don't set state during this component's render
        queueMicrotask(() => window.dispatchEvent(new Event(SYNC_EVENT)));
      } catch {
        /* storage blocked: keep in-memory state only */
      }
      return next;
    });
  };

  return [state, update] as const;
}
