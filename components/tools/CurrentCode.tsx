"use client";

import { useEffect, useRef, useState } from "react";
import { fill, spaced } from "@/lib/tools/format";
import type { TreeNode } from "@/lib/tools/types";
import CodeLevel from "./CodeLevel";
import CodeStrip from "./CodeStrip";
import CodeTrail from "./CodeTrail";
import ImportEstimate, { type QuantityInput } from "./ImportEstimate";
import PriceBox from "./PriceBox";
import Problem from "./Problem";
import { ServiceLink } from "./Services";
import TariffPanel from "./TariffPanel";
import { useToolsContent } from "./ToolsContent";
import { useBranch } from "./useBranch";
import { usePrice } from "./usePrice";

interface CurrentCodeProps {
  node: TreeNode;
  onOpen: (node: TreeNode) => void;
  onBack: () => void;
}

// The current code: where it sits, its price, its children and its tariff.
export default function CurrentCode({ node, onOpen, onBack }: CurrentCodeProps) {
  const { current: c, finder } = useToolsContent();
  const branch = useBranch(node.code);
  const priceState = usePrice(node.code);
  const leaf = branch.options ? branch.options.length === 0 : null;
  const price = priceState.price;
  // the typed quantity is kept down the tree while the price basis stays the same
  const [qty, setQty] = useState<QuantityInput & { basis: string | null }>({ text: "", kg: false, basis: null });
  const qtyNow: QuantityInput = price && qty.basis === price.basis ? qty : { text: "", kg: false };
  const [copyLabel, setCopyLabel] = useState(c.copy);
  const title = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    title.current?.focus();
    setCopyLabel(c.copy);
  }, [node.code, c.copy]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(node.code);
      setCopyLabel(c.copied);
    } catch {
      setCopyLabel(fill(c.copyByHand, { code: node.code }));
    }
  }

  return (
    <div className="current">
      <button className="back" type="button" onClick={onBack}>
        {c.back}
      </button>
      <CodeStrip code={node.code} final={leaf === true} />
      {branch.breadcrumb && <CodeTrail nodes={branch.breadcrumb} onJump={onOpen} />}
      <p className="level">
        {node.level} <span className="digits">{spaced(node.code, node.code.length)}</span>
      </p>
      <h2 ref={title} tabIndex={-1}>
        {node.description}
      </h2>
      <PriceBox code={node.code} state={priceState} />
      {price && (
        <ImportEstimate price={price} input={qtyNow} onInput={(q) => setQty({ ...q, basis: price.basis })} />
      )}
      {branch.error ? (
        <Problem title={c.treeFailed}>{fill(finder.details, { message: branch.error.message })}</Problem>
      ) : leaf === false && branch.options ? (
        <CodeLevel options={branch.options} onChoose={onOpen} />
      ) : leaf === true ? (
        <div className="actions">
          <button className="btn" type="button" onClick={copy}>
            {copyLabel}
          </button>
        </div>
      ) : null}
      <TariffPanel code={node.code} leaf={leaf} />
      <p className="svc-hints">
        <ServiceLink id="logistics">{c.hint}</ServiceLink>
      </p>
      {leaf && <p className="caveat">{c.caveat}</p>}
    </div>
  );
}
