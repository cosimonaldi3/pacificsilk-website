import { Link } from "@/i18n/navigation";
import TileShell from "@/components/sections/capabilities/TileShell";
import { NetworkVisual } from "./beyondVisuals";
import type { BeyondContent } from "@/content/process";
import { isHiddenHref } from "@/lib/features";

interface BeyondNetworkProps {
  content: BeyondContent["network"];
}

/* Become part of the network: a full-width black block with cream type, under the three Beyond
   tiles. Always open, so it has no plus button. The graph's dots and lines are turned cream by
   .pr-net-dark in process.css. */
export default function BeyondNetwork({ content }: BeyondNetworkProps) {
  return (
    <TileShell tone="ink" glowAt="100% 0%" className="mt-4 md:mt-5">
      <div className="relative z-10 grid gap-10 p-6 md:p-10 lg:grid-cols-2 lg:items-center lg:gap-16 lg:p-12">
        <div>
          <h3 className="font-display text-h2 leading-tight font-medium text-psc-bg">{content.title}</h3>
          <p className="mt-5 font-sans text-lg leading-body text-psc-bg md:text-xl">{content.body}</p>
          <ul className="mt-6 space-y-3">
            {content.points.map((p) => (
              <li key={p} className="flex items-start gap-3 font-sans text-body leading-body text-psc-bg/75">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-psc-red text-psc-bg">
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3.5 8.5l3 3 6-7" />
                  </svg>
                </span>
                {p}
              </li>
            ))}
          </ul>
          {!isHiddenHref(content.link.href) && (
            <Link
              href={content.link.href}
              className="mt-8 inline-flex w-fit items-center gap-2 font-sans text-small font-medium text-psc-bg underline underline-offset-4 hover:text-psc-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-psc-red"
            >
              {content.link.label}
              <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>

        <div className="pr-net-dark">
          <NetworkVisual c={content} large />
        </div>
      </div>
    </TileShell>
  );
}
