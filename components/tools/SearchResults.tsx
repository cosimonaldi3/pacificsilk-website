"use client";

import type { SearchRow } from "@/lib/tools/types";
import { useToolsContent } from "./ToolsContent";

const MAX_TERMS = 6;

interface SearchResultsProps {
  rows: SearchRow[];
  onOpen: (row: SearchRow) => void;
}

// Ranked hs4 headings from searchHs4().
export default function SearchResults({ rows, onOpen }: SearchResultsProps) {
  const { finder: c } = useToolsContent();
  return (
    <ul className="rows">
      {rows.map((r) => {
        const terms = r.common_terms ? r.common_terms.split(/;\s*/).filter(Boolean) : [];
        return (
          <li key={r.code}>
            <button className="row" type="button" onClick={() => onOpen(r)}>
              <span className="digits">{r.code}</span>
              <span className="name">{r.description}</span>
              {terms.length > 0 && (
                <span className="why">
                  {c.alsoCalled}{" "}
                  {terms.slice(0, MAX_TERMS).map((t, i) => (
                    <span key={i}>
                      {i ? ", " : ""}
                      <mark>{t}</mark>
                    </span>
                  ))}
                  {terms.length > MAX_TERMS && "…"}
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
