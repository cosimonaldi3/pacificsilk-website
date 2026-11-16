"use client";

import { useEffect, useState } from "react";
import { getBreadcrumb, getChildren } from "@/lib/tools/api";
import type { TreeNode, TreeOption } from "@/lib/tools/types";

export interface BranchState {
  loading?: boolean;
  error?: Error;
  breadcrumb?: TreeNode[];
  options?: TreeOption[];
}

// The tree around one code: { loading } | { error } | { breadcrumb, options }.
// options are the children, each with hasChildren; none means code is a leaf.
export function useBranch(code: string): BranchState {
  const [state, setState] = useState<BranchState & { code: string | null }>({ code: null });
  useEffect(() => {
    let stale = false;
    Promise.all([getBreadcrumb(code), getChildren(code)]).then(
      ([breadcrumb, options]) => {
        if (!stale) setState({ code, breadcrumb, options });
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
