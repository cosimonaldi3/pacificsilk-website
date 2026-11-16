"use client";

import Image from "next/image";
import Container from "@/components/ui/Container";
import Logo, { LogoVariant } from "@/components/Logo";
import { AllianceContent } from "@/content/about";

interface AllianceProps {
  content: AllianceContent;
}

export default function Alliance({ content }: AllianceProps) {

  return (
    <section className="bg-psc-bg py-24 md:py-32">
      <Container>

        {/* ── Desktop: split panel layout ── */}
        <div className="hidden md:flex border border-psc-border min-h-[580px]">

          {/* Left: PSA logo + headline + body */}
          <div className="w-72 flex-shrink-0 border-r border-psc-border p-10 flex flex-col justify-between gap-8">
            <div className="flex flex-col gap-6">
              <Logo
                variant="psa-horizontal-red"
                width={210}
                className="w-auto h-auto max-w-[210px]"
              />
              <h2 className="font-display text-h2 font-medium text-psc-ink leading-tight">
                {content.headline}
              </h2>
            </div>
            <p className="font-sans text-xs leading-body text-psc-gray">
              {content.body}
            </p>
          </div>

          {/* Three company panels */}
          {content.companies.map((company, i) => (
            <div
              key={company.name}
              className="relative flex-1 border-r border-psc-border last:border-r-0 bg-psc-ink overflow-hidden group cursor-default"
            >
              {/* Background image */}
              {company.image && (
                <Image
                  src={company.image}
                  alt=""
                  fill
                  className="object-cover opacity-60"
                />
              )}

              {/* Content layer */}
              <div className="relative z-10 flex flex-col justify-between p-10 min-h-[580px]">
                {/* Logo — always visible */}
                <Logo
                  variant={company.logo as LogoVariant}
                  width={220}
                  className={`w-auto h-auto max-w-[220px] ${company.logoClassName ?? ""} ${i === 0 ? "mt-6" : ""}`}
                />

                {/* Role text — fades up from bottom on hover */}
                <p className="font-sans text-xl font-semibold text-white leading-snug opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out translate-y-2 group-hover:translate-y-0">
                  {company.role}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Mobile: PSA logo + headline + tap-to-reveal panels ── */}
        <div className="md:hidden flex flex-col gap-8">
          <div className="flex flex-col gap-5">
            <Logo
              variant="psa-horizontal-red"
              width={160}
              className="w-auto h-auto max-w-[160px]"
            />
            <h2 className="font-display text-h2 font-medium text-psc-ink">
              {content.headline}
            </h2>
            <p className="font-sans text-body leading-body text-psc-gray">
              {content.body}
            </p>
          </div>

          {/* Three panels — hover swaps logo ↔ text */}
          <div className="flex border border-psc-border overflow-hidden">
            {content.companies.map((company) => (
              <div
                key={company.name}
                className="relative flex-1 bg-psc-ink overflow-hidden group"
                style={{ minHeight: "160px" }}
              >
                {/* Background image */}
                {company.image && (
                  <Image
                    src={company.image}
                    alt=""
                    fill
                    className="object-cover opacity-50"
                  />
                )}

                {/* Logo — fades out on hover */}
                <div className="relative z-10 flex items-center justify-center h-full p-4 transition-opacity duration-300 opacity-100 group-hover:opacity-0">
                  <Logo
                    variant={company.logo as LogoVariant}
                    width={100}
                    className={`w-auto h-auto max-w-[100px] ${company.logoClassName ?? ""}`}
                  />
                </div>

                {/* Role text — fades in on hover */}
                <p className="absolute inset-0 z-10 flex items-center justify-center p-4 font-sans text-sm font-semibold text-white text-center leading-snug transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                  {company.role}
                </p>
              </div>
            ))}
          </div>
        </div>

      </Container>
    </section>
  );
}
