"use client";

import { useEffect, useState } from "react";
import { getPrice, getPriceRange } from "@/lib/tools/api";
import type { Price, PriceRange } from "@/lib/tools/types";

export interface PriceState {
  loading?: boolean;
  error?: Error;
  price?: Price | null;
  range?: PriceRange | null;
}

// { loading } | { error } | { price, range } where price is getPrice()'s result (null = no data)
// and range is getPriceRange()'s (null = no range to show; a failed range lookup never hides the price).
export function usePrice(code: string): PriceState {
  const [state, setState] = useState<PriceState & { code: string | null }>({ code: null });
  useEffect(() => {
    let stale = false;
    Promise.all([getPrice(code), getPriceRange(code).catch(() => null)]).then(
      ([price, range]) => {
        if (!stale) setState({ code, price, range: price && !price.isFallback ? range : null });
      },
      (error: Error) => {
        if (!stale) setState({ code, error });
      },
    );
    return () => {
      stale = true;
    };
  }, [code]);
  // an answer for another code is never shown with this one
  return state.code === code ? state : { loading: true };
}
