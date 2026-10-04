import AnatomyButton from "./ui/AnatomyButton";

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
        className="marquee marquee-light border-y border-black/10 bg-white py-4 sm:py-5"
      >
        <div className="marquee-track">
          <MarqueeGroup />
          <MarqueeGroup />
        </div>
      </div>

      {/* Editorial footer: identity header, statement, and navigation matrix */}
      <div className="mx-auto w-full max-w-[1240px] px-6 pb-10 pt-10 sm:px-8 md:px-12 md:pt-12">

        <div className="grid gap-7 py-9 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-16 md:py-12">
          <p className="max-w-[48rem] font-[family-name:var(--font-heading)] text-[clamp(2.2rem,6vw,5.5rem)] font-medium leading-[0.94] tracking-[-0.07em] text-[var(--text)]">
            Make ideas
            <span className="block bg-[linear-gradient(90deg,#2D86CE,#A3E0FC)] bg-clip-text text-transparent">
              impossible to ignore.
            </span>
          </p>
          <div className="flex flex-col items-center gap-4 md:items-end">
            <p className="max-w-[15rem] text-center text-sm leading-5 text-[var(--muted)] md:text-right">
              A 24-hour designathon for ideas that deserve to be felt.
            </p>
            <AnatomyButton href="#schedule">
              Join us
            </AnatomyButton>
          </div>
        </div>

        <div className="grid gap-6 border-t border-[var(--line)] pt-5 sm:grid-cols-[auto_1fr_auto] sm:gap-9">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-[var(--muted)]/50">
            Explore
          </p>
          <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3">
            {footerNav.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                className="group flex items-center gap-3 text-sm text-[var(--muted)] transition-colors duration-300 hover:text-[var(--text)] focus-visible:text-[var(--text)]"
              >
                <span className="font-mono text-[0.6rem] text-[var(--blue)]/70">0{index + 1}</span>
                <span className="relative">
                  {item.label}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-[var(--blue-light)] transition-all duration-300 group-hover:w-full group-focus-visible:w-full" />
                </span>
                <span className="-translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">↗</span>
              </a>
            ))}
          </nav>
          <div className="flex flex-col gap-3 text-sm text-[var(--muted)] sm:items-end">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-[var(--muted)]/50">Connect</p>
            <a href="mailto:hello@dvine.in" className="transition-colors duration-300 hover:text-[var(--blue-light)]">hello@dvine.in</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 transition-colors duration-300 hover:text-[var(--blue-light)]">
              <InstagramIcon className="size-4 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
              Instagram
            </a>
          </div>
        </div>
      </div>

      {/* Giant wordmark */}
      <div className="relative overflow-hidden px-6 pb-6 pt-0 sm:px-8 sm:pb-8 md:px-12">
        <p
          aria-hidden="true"
          className="select-none whitespace-nowrap bg-[linear-gradient(90deg,#2D86CE_0%,#2D86CE_18%,#A3E0FC_23%,#fff_31%,#fff_100%)] bg-clip-text text-center font-[family-name:var(--font-owners)] text-[clamp(3.1rem,15.5vw,16rem)] font-black uppercase leading-[0.85] tracking-[-0.04em] text-transparent transition-transform duration-500 hover:scale-[1.015]"
        >
          D&apos;vine <span className="font-[family-name:var(--font-heading)]">2.0</span>
        </p>
      </div>

    </footer>
  );
}
