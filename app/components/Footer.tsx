const footerNav = [
  { label: "About", href: "#about-event" },
  { label: "Organizers", href: "#about-organizers" },
  { label: "Prizepool", href: "#prizepool" },
  { label: "Partners", href: "#partners" },
  { label: "Schedule", href: "#schedule" },
  { label: "FAQ", href: "#faq" },
];

const MARQUEE_ITEMS = [0, 1, 2, 3];

function MarqueeGroup() {
  return (
    <div className="flex shrink-0 items-center">
      {MARQUEE_ITEMS.map((item) => (
        <span
          key={item}
          className="flex shrink-0 items-center gap-5 px-5 sm:gap-7 sm:px-7"
        >
          <span
            className={`whitespace-nowrap font-[family-name:var(--font-heading)] text-[clamp(1.6rem,5.5vw,4rem)] font-extrabold uppercase leading-none tracking-[-0.03em] ${
              item % 2 === 0 ? "marquee-out" : "marquee-solid"
            }`}
          >
            From vision to creation
          </span>
          <span
            aria-hidden="true"
            className="marquee-dot text-[clamp(0.85rem,1.8vw,1.35rem)]"
          >
            ✦
          </span>
        </span>
      ))}
    </div>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="footer"
      className="relative w-full overflow-hidden bg-[var(--ink)] text-[var(--text)]"
    >
      {/* Kinetic marquee strip on a white band */}
      <div
        aria-hidden="true"
        className="marquee marquee-light border-y border-black/10 bg-white py-6 sm:py-8"
      >
        <div className="marquee-track">
          <MarqueeGroup />
          <MarqueeGroup />
        </div>
      </div>

      {/* Content row: description left · nav right */}
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-12 px-6 pb-12 pt-16 sm:px-8 sm:pb-14 sm:pt-20 md:flex-row md:items-start md:justify-between md:gap-16 md:px-12 md:pt-24">
        {/* Left: tagline + CTA + social */}
        <div className="flex max-w-sm flex-col gap-6">
          <p className="text-[clamp(1rem,2.5vw,1.25rem)] leading-[1.6] text-[var(--muted)]">
            A 24-hour designathon bringing together the brightest
            creative minds.
          </p>
          <div className="flex items-center gap-5">
            <a
              href="#schedule"
              className="group inline-flex items-center gap-2 font-[family-name:var(--font-heading)] text-xs font-bold uppercase tracking-[0.16em] text-[var(--blue)] transition-colors hover:text-[var(--blue-light)]"
            >
              Register now
              <span
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
            <span aria-hidden="true" className="text-[var(--line)]">
              ·
            </span>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Instagram"
              className="text-[var(--muted)] transition-colors duration-200 hover:text-[var(--text)]"
            >
              <InstagramIcon className="size-[18px]" />
            </a>
          </div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]/50">
            IEEE SB CEC × IEDC
          </p>
        </div>

        {/* Right: nav columns */}
        <div className="flex gap-16 sm:gap-20">
          <nav aria-label="Footer navigation">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]/50">
              Navigate
            </p>
            <ul className="flex flex-col gap-3 text-sm text-[var(--muted)]">
              {footerNav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="transition-colors duration-200 hover:text-[var(--text)] focus-visible:text-[var(--text)]"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]/50">
              Contact
            </p>
            <ul className="flex flex-col gap-3 text-sm text-[var(--muted)]">
              <li>
                <a
                  href="mailto:hello@dvine.in"
                  className="transition-colors duration-200 hover:text-[var(--text)]"
                >
                  hello@dvine.in
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-200 hover:text-[var(--text)]"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-auto max-w-[1240px] px-6 sm:px-8 md:px-12">
        <div className="h-px w-full bg-[var(--line)]" />
      </div>

      {/* Giant wordmark */}
      <div className="relative overflow-hidden px-6 pb-6 pt-8 sm:px-8 sm:pt-10 md:px-12 md:pt-12">
        <p
          aria-hidden="true"
          className="footer-wordmark select-none whitespace-nowrap text-center font-[family-name:var(--font-heading)] text-[clamp(5rem,18vw,16rem)] font-black uppercase leading-[0.85] tracking-[-0.04em]"
        >
          D&apos;vine 2.0
        </p>
      </div>

      {/* Copyright bar */}
      <div className="mx-auto flex w-full max-w-[1240px] items-center justify-between px-6 pb-6 text-xs tracking-wide text-[var(--muted)]/40 sm:px-8 md:px-12">
        <p>© {year} D&apos;VINE 2.0</p>
        <a
          href="#hero"
          className="transition-colors duration-200 hover:text-[var(--text)]"
        >
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}

