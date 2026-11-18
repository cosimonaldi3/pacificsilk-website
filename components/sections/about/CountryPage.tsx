import Image from "next/image";
import { Link } from "@/i18n/navigation";
import Container from "@/components/ui/Container";
import { presencePlaces } from "@/content/presence-places";
import type {
  PresenceAction,
  PresenceContent,
  PresenceCountry,
} from "@/content/about";
import "./about.css";

interface CountryPageProps {
  country: PresenceCountry;
  content: PresenceContent;
}

const fill = (s: string, name: string) => s.replace("{country}", name);

/* One country's page: photo hero, description, services as numbered cards,
   and the person who represents the country. */
export default function CountryPage({ country, content }: CountryPageProps) {
  const name = country.name ?? country.title;
  const place = presencePlaces[country.id];
  /* null = this country shows no contact block (only its actions) */
  const rep = country.representative === undefined ? content.representative : country.representative;

  return (
    <>
      {/* Header: photo in a rounded box, text on the right, then the country list */}
      <section className="relative overflow-hidden bg-psc-bg pt-28 md:pt-36">
        <Container>
          <div className="ab-fade grid grid-cols-1 gap-8 md:grid-cols-[6fr_6fr] md:gap-16">
            {/* The muted band runs edge to edge behind the top half of the photo, so the photo
                sits across the line between band and page. The section clips what runs off. */}
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute -left-[100vw] -right-[100vw] bottom-1/2 h-[100vh] bg-psc-muted"
              />
              <div className="relative z-10 aspect-[4/3] w-full overflow-hidden rounded-2xl bg-psc-ink">
              {place?.hqImage && (
                <Image
                  src={place.hqImage}
                  alt={`${content.hqLabel} ${country.hqCity ?? name}`}
                  fill
                  priority
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover [filter:sepia(0.08)_saturate(0.86)]"
                  style={place.hqImagePosition ? { objectPosition: place.hqImagePosition } : undefined}
                />
              )}
              </div>
            </div>
            <div className="self-end md:pb-6 md:pl-4">
              <Link
                href="/about#presence"
                className="mb-6 inline-flex items-center gap-2 font-sans text-small font-medium text-psc-gray transition-colors hover:text-psc-red focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-psc-red"
              >
                <span aria-hidden="true">←</span>
                {content.backLabel}
              </Link>
              <p className="font-sans text-small font-medium uppercase tracking-widest text-psc-gray">
                {country.hqCity}
              </p>
              <h1 className="mt-2 font-display text-h1 font-medium leading-none text-psc-ink">
                {name}
              </h1>
            </div>
          </div>

          <nav aria-label={content.chipsLabel} className="mt-10">
            <ul className="flex flex-wrap gap-2">
              {content.countries
                .filter((c) => c.services?.length)
                .map((c) => {
                  const active = c.id === country.id;
                  return (
                    <li key={c.id}>
                      <Link
                        href={`/about/${c.id}`}
                        aria-current={active ? "page" : undefined}
                        className={`inline-block rounded-full border px-4 py-2 font-sans text-small font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-psc-red ${
                          active
                            ? "border-psc-red bg-psc-red text-psc-bg"
                            : "border-psc-border bg-psc-bg text-psc-ink hover:border-psc-ink"
                        }`}
                      >
                        {c.chip}
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </nav>
        </Container>
      </section>

      {/* Description */}
      <section className="bg-psc-bg pt-12 md:pt-16">
        <Container>
          <p className="max-w-3xl font-display text-h3 font-medium leading-snug text-psc-ink">
            {country.servicesIntro ?? country.body}
          </p>
        </Container>
      </section>

      {/* Services */}
      {country.services && country.services.length > 0 && (
        <section className="bg-psc-bg py-16 md:py-24">
          <Container>
            <h2 className="font-sans text-small font-medium uppercase tracking-widest text-psc-gray">
              {fill(content.servicesHeading, name)}
            </h2>
            <ol className="mt-8 grid grid-cols-1 gap-x-8 gap-y-0 md:grid-cols-2">
              {country.services.map((service, i) => (
                <li
                  key={service}
                  className="group flex gap-6 border-t border-psc-border py-8 transition-colors hover:border-psc-red"
                >
                  <span
                    aria-hidden="true"
                    className="font-display text-h2 font-medium leading-none text-psc-gray/40 transition-colors group-hover:text-psc-red"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="pt-1 font-sans text-body leading-snug text-psc-ink">
                    {service}
                  </span>
                </li>
              ))}
            </ol>
          </Container>
        </section>
      )}

      {/* Representative (countries without one get only their actions) */}
      {rep ? (
      <section className="bg-psc-muted py-16 md:py-24">
        <Container>
          <h2 className="font-sans text-small font-medium uppercase tracking-widest text-psc-gray">
            {fill(content.representativeLabel, name)}
          </h2>
          <div className="mt-8 grid grid-cols-1 items-center gap-10 md:grid-cols-[4fr_8fr] md:gap-16">
            <div className="aspect-square w-full max-w-sm overflow-hidden bg-psc-bg">
              <Image
                src={rep.photo}
                alt={rep.name}
                width={600}
                height={600}
                className="h-full w-full object-cover"
                style={{
                  objectPosition: "center 15%",
                  filter: "grayscale(100%) brightness(0.88) contrast(1.05)",
                }}
              />
            </div>
            <div>
              <p className="font-sans text-small font-medium uppercase tracking-widest text-psc-red">
                {rep.company}
              </p>
              <p className="mt-2 font-display text-h2 font-medium text-psc-ink">{rep.name}</p>
              <p className="mt-1 font-sans text-small text-psc-gray">{rep.title}</p>
              {rep.bio && (
                <p className="mt-6 max-w-xl font-sans text-body leading-body text-psc-gray">{rep.bio}</p>
              )}
              <Actions actions={country.actions} />
            </div>
          </div>
        </Container>
      </section>
      ) : (
        <section className="bg-psc-bg pb-16 md:pb-24">
          <Container>
            <Actions actions={country.actions} />
          </Container>
        </section>
      )}
    </>
  );
}

function Actions({ actions }: { actions: PresenceAction[] }) {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      {actions.map((a) => {
        const cls = `inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-sans text-small font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-psc-red ${
          a.href === "/start"
            ? "bg-psc-ink text-psc-bg hover:bg-psc-red"
            : "border border-psc-ink text-psc-ink hover:border-psc-red hover:text-psc-red"
        }`;
        const inner = (
          <>
            {a.label}
            <span aria-hidden="true">→</span>
          </>
        );
        return a.href.startsWith("mailto:") ? (
          <a key={a.label} href={a.href} className={cls}>
            {inner}
          </a>
        ) : (
          <Link key={a.label} href={a.href} locale={a.locale} className={cls}>
            {inner}
          </Link>
        );
      })}
    </div>
  );
}
