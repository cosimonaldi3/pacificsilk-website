"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { fill } from "@/lib/tools/format";
import { useToolsContent } from "./ToolsContent";

// The context, its dialog and the links that open it only make sense together,
// so they share this file.

interface ServicesContextValue {
  open: (id: string) => void;
}

const ServicesContext = createContext<ServicesContextValue | null>(null);

function useServices(): ServicesContextValue {
  const value = useContext(ServicesContext);
  if (!value) throw new Error("useServices must be used inside ServicesProvider");
  return value;
}

export function ContactButton({ className = "" }: { className?: string }) {
  const { services } = useToolsContent();
  return (
    <Link href="/start" className={`cta svc-contact ${className}`.trim()}>
      <span>{services.contact}</span>
      <span aria-hidden="true">→</span>
    </Link>
  );
}

interface ServiceDialogProps {
  index: number | null;
  onIndex: (index: number) => void;
  onClose: () => void;
}

function ServiceDialog({ index, onIndex, onClose }: ServiceDialogProps) {
  const { services } = useToolsContent();
  const items = services.items;
  const ref = useRef<HTMLDialogElement>(null);
  const service = index == null ? null : items[index];
  const isOpen = service != null;

  // showModal() traps focus and handles Esc; close() hands focus back to the opener
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    else if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  const prev = index != null && index > 0 ? items[index - 1] : null;
  const next = index != null && index < items.length - 1 ? items[index + 1] : null;

  return (
    <dialog
      ref={ref}
      className="svc-dialog"
      aria-labelledby="svc-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      {service && index != null && (
        <div className="svc-sheet">
          <div className="svc-top">
            <p className="eyebrow">{fill(services.counter, { index: index + 1, total: items.length })}</p>
            <button type="button" className="svc-close" aria-label={services.close} onClick={onClose}>
              ✕
            </button>
          </div>
          <h2 id="svc-title" className="svc-title">
            {service.title}
          </h2>
          <p className="svc-promise">{service.promise}</p>
          <ul className="svc-points">
            {service.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <ContactButton />
          <nav className="svc-steps" aria-label={services.otherServices}>
            {prev ? (
              <button type="button" onClick={() => onIndex(index - 1)}>
                ← {prev.title}
              </button>
            ) : (
              <span />
            )}
            {next ? (
              <button type="button" onClick={() => onIndex(index + 1)}>
                {next.title} →
              </button>
            ) : (
              <span />
            )}
          </nav>
        </div>
      )}
    </dialog>
  );
}

export function ServicesProvider({ children }: { children: ReactNode }) {
  const { services } = useToolsContent();
  const items = services.items;
  const [index, setIndex] = useState<number | null>(null);
  const open = useCallback(
    (id: string) => {
      const i = items.findIndex((s) => s.id === id);
      setIndex(i < 0 ? 0 : i);
    },
    [items],
  );
  const close = useCallback(() => setIndex(null), []);
  const value = useMemo(() => ({ open }), [open]);

  return (
    <ServicesContext.Provider value={value}>
      {children}
      <ServiceDialog index={index} onIndex={setIndex} onClose={close} />
    </ServicesContext.Provider>
  );
}

// A quiet text link in the results that opens one service.
export function ServiceLink({ id, children }: { id: string; children: ReactNode }) {
  const { open } = useServices();
  return (
    <button type="button" className="svc-link" onClick={() => open(id)}>
      {children}
    </button>
  );
}

// The last thing on the page after an estimate.
export function ServicesBand() {
  const { services } = useToolsContent();
  const { open } = useServices();
  return (
    <section className="svc-band" aria-labelledby="svc-band-title">
      <p className="eyebrow">{services.bandEyebrow}</p>
      <h2 id="svc-band-title" className="svc-band-title">
        {services.bandTitle}
      </h2>
      <ol className="svc-cards">
        {services.items.map((s, i) => (
          <li key={s.id}>
            <button type="button" className="svc-card" onClick={() => open(s.id)}>
              <span className="svc-num" aria-hidden="true">
                {i + 1}
              </span>
              <span className="svc-card-title">{s.title}</span>
              <span className="svc-card-blurb">{s.blurb}</span>
            </button>
          </li>
        ))}
      </ol>
      <ContactButton className="svc-band-contact" />
    </section>
  );
}
