import Image from "next/image";
import { ArrowUpRight, MapPin } from "lucide-react";
import campus from "../../public/assets/jain/jain_campus.webp";
import Reveal from "./Reveal";

export default function Venue() {
  return (
    <section
      id="venue"
      aria-labelledby="venue-title"
      className="mt-16 border-t border-[var(--line)] pt-6 sm:mt-20 sm:pt-8 lg:mt-24"
    >
      <Reveal>
        <div className="mb-6 flex items-center justify-between gap-4 font-mono text-[0.65rem] uppercase tracking-[0.16em] sm:mb-8 sm:text-xs">
          <span className="text-[var(--blue-light)]">The venue</span>
          <span className="flex items-center gap-2 text-[var(--muted)]">
            <MapPin aria-hidden="true" className="size-3.5" />
            Kochi, Kerala
          </span>
        </div>
      </Reveal>

      <div className="grid items-center gap-8 md:grid-cols-12 md:gap-10 lg:gap-14">
        <Reveal className="md:col-span-7">
          <figure className="relative isolate aspect-[6/5] overflow-hidden bg-[var(--surface)] sm:aspect-[4/3]">
            <Image
              src={campus}
              alt="JAIN university signage on the Kochi campus building"
              fill
              placeholder="blur"
              sizes="(max-width: 767px) calc(100vw - 48px), (max-width: 1335px) 54vw, 700px"
              className="object-cover object-[center_42%]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#020817]/80 via-transparent to-transparent"
            />
            <figcaption className="absolute inset-x-5 bottom-5 flex items-center gap-3 border-t border-white/30 pt-3 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-white sm:inset-x-7 sm:bottom-6 sm:text-[0.65rem]">
              <span
                aria-hidden="true"
                className="size-1.5 bg-[var(--blue-light)]"
              />
              JAIN (Deemed-to-be University), Kochi
            </figcaption>
          </figure>
        </Reveal>

        <Reveal delay={100} className="md:col-span-5">
          <div>
            <p className="mb-4 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[var(--muted)]">
              From vision to creation. On campus.
            </p>
            <h3
              id="venue-title"
              className="font-[family-name:var(--font-heading)] text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.06em]"
            >
              <span className="block">JAIN</span>
              <span className="block text-[var(--blue-light)]">UNIVERSITY</span>
              <span className="mt-3 block text-[0.4em] font-medium tracking-[-0.02em] text-[var(--muted)]">
                Kochi, Kerala.
              </span>
            </h3>
            <p className="mt-6 max-w-[27rem] text-sm leading-[1.85] text-[var(--muted)] sm:text-base">
              The venue for D&apos;VINE 2.0. Meet us at Jain University, Kochi,
              for 24 hours of ideas, design, and creation.
            </p>

            <dl className="mt-7 border-y border-[var(--line)] py-5 sm:mt-8">
              <dt className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-[var(--muted)]">
                Save the dates / 2026
              </dt>
              <dd className="mt-2 font-[family-name:var(--font-heading)] text-xl font-medium tracking-[-0.03em] sm:text-2xl md:text-xl lg:text-2xl">
                <time dateTime="2026-10-31" className="whitespace-nowrap">
                  31 October
                </time>
                <span className="px-2 text-[var(--blue)]">—</span>
                <time dateTime="2026-11-01" className="whitespace-nowrap">
                  01 November
                </time>
              </dd>
            </dl>

            <a
              href="https://www.google.com/maps/search/?api=1&query=JAIN+%28Deemed-to-be+University%29+Kochi"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-5 inline-flex min-h-11 items-center gap-3 text-sm font-medium text-[var(--blue-light)] transition-colors hover:text-[var(--text)]"
            >
              Find the venue
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 transition-transform motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
              />
              <span className="sr-only">
                on Google Maps (opens in a new tab)
              </span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
