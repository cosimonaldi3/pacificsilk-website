"use client";

import { useEffect, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { isConfigured, normalizeQuery, searchHs4 } from "@/lib/tools/api";
import { fill } from "@/lib/tools/format";
import type { SearchRow, TreeNode } from "@/lib/tools/types";
import CurrentCode from "./CurrentCode";
import Problem from "./Problem";
import SearchResults from "./SearchResults";
import { useToolsContent } from "./ToolsContent";

const DEBOUNCE_MS = 300;

interface SearchState {
  status: "idle" | "loading" | "done" | "error";
  q: string;
  rows: SearchRow[];
  error: Error | null;
}

// search -> results -> current code (price and estimate)
interface TariffFinderProps {
  // The page that embeds the finder already has an h1 when this is "h2"
  headingLevel?: "h1" | "h2";
}

export default function TariffFinder({ headingLevel: Heading = "h1" }: TariffFinderProps) {
  const { finder: c } = useToolsContent();
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState<SearchState>({ status: "idle", q: "", rows: [], error: null });
  // The code being looked at. The drill-down moves it up and down the tree.
  const [current, setCurrent] = useState<TreeNode | null>(null);

  const latest = useRef(0); // guards against slow answers overtaking fast ones
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isConfigured) return;
    input.current?.focus();
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function run(text: string) {
    const mine = ++latest.current;
    const q = normalizeQuery(text);
    setCurrent(null);
    if (!q) {
      setSearch({ status: "idle", q: "", rows: [], error: null });
      return;
    }
    setSearch((s) => ({ ...s, status: "loading", q }));
    try {
      const rows = await searchHs4(q);
      if (mine === latest.current) setSearch({ status: "done", q, rows, error: null });
    } catch (error) {
      if (mine === latest.current) setSearch({ status: "error", q, rows: [], error: error as Error });
    }
  }

  function onInput(e: ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setQuery(v);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => run(v), DEBOUNCE_MS);
  }

  function pickExample(x: string) {
    clearTimeout(timer.current);
    setQuery(x);
    run(x);
  }

  function open(r: SearchRow) {
    setCurrent({ code: r.code, description: r.description, level: "hs4" });
  }

  function status(): ReactNode {
    const { status: s, q, rows } = search;
    if (current) return null;
    if (s === "idle") return c.status.idle;
    if (s === "loading") {
      return (
        <>
          {c.status.searching} <strong>“{q}”</strong>…
        </>
      );
    }
    if (s === "error") return null;
    if (!rows.length) {
      return (
        <>
          {c.status.nothing} <strong>“{q}”</strong>. {c.status.nothingHint}
        </>
      );
    }
    return (
      <>
        <strong>{rows.length}</strong> {rows.length === 1 ? c.status.headingMatches : c.status.headingsMatch}{" "}
        <strong>“{q}”</strong>. {c.status.pick}
      </>
    );
  }

  return (
    <div className="finder">
      <div className="finder-main">
        <p className="eyebrow">{c.eyebrow}</p>
        <Heading className="tool-title">{c.headline}</Heading>
        <p className="lede">{c.lede}</p>

        <form
          className="search"
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            clearTimeout(timer.current);
            run(query);
          }}
        >
          <label className="sr-only" htmlFor="q">
            {c.searchLabel}
          </label>
          <input
            id="q"
            ref={input}
            type="search"
            autoComplete="off"
            spellCheck={false}
            disabled={!isConfigured}
            value={query}
            onChange={onInput}
            placeholder={c.searchPlaceholder}
          />
        </form>

        <p className="status" aria-live="polite">
          {status()}
        </p>

        <div>
          {!isConfigured ? (
            <Problem title={c.notConnectedTitle}>{c.notConnectedBody}</Problem>
          ) : current ? (
            <CurrentCode node={current} onOpen={setCurrent} onBack={() => setCurrent(null)} />
          ) : search.status === "error" ? (
            <Problem title={c.searchFailed}>{fill(c.details, { message: search.error?.message ?? "" })}</Problem>
          ) : search.status === "idle" ? (
            <div className="examples">
              {c.examples.map((x) => (
                <button key={x} type="button" onClick={() => pickExample(x)}>
                  {x}
                </button>
              ))}
            </div>
          ) : (
            <SearchResults rows={search.rows} onOpen={open} />
          )}
        </div>
      </div>
    </div>
  );
}
