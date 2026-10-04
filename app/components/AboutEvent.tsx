import DitherStage from "./DitherStage";
import Reveal from "./Reveal";

const highlights = [
  { value: "24", label: "Hours" },
  { value: "02", label: "Per team" },
  { value: "₹2L", label: "Prize pool" },
];

/** Hairline rule used to separate words in the subheadline. */
function Divider() {
  return (
    <span
      aria-hidden="true"
      className="mx-[0.28em] inline-block h-[0.62em] w-px translate-y-[0.02em] bg-[var(--line)] align-baseline transition-colors duration-300 group-hover/sub:bg-[var(--line-strong)]"
    />
  );
}

export default function AboutEvent() {
  return (
    <section
      id="about-event"
      aria-labelledby="about-event-title"
      className="relative w-full overflow-hidden px-6 py-20 text-[var(--text)] sm:px-8 md:px-12 lg:py-28"
    >
      <div className="mx-auto w-full max-w-[1240px]">
        {/* Top Header Row with Oversized Stroke Title & Index */}
        <div className="relative mb-12 border-b border-[var(--line)] pb-8 transition-colors duration-300 hover:border-[var(--line-strong)] sm:mb-16">
          <h2
            id="about-event-title"
            className="select-none font-[family-name:var(--font-heading)] text-[clamp(3.8rem,14vw,11rem)] font-black tracking-[-0.05em] leading-[0.88] text-center md:text-left"
          >
            <span className="block text-stroke-huge md:inline">ABOUT</span>
            <span className="block text-[var(--text)] md:inline">the</span>
            <span className="block text-stroke-huge md:inline">EVENT</span>
          </h2>
        </div>

        {/* Main Content Grid: Minimal Typography Copy & Interactive Dither Canvas */}
        <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-12 md:gap-8 lg:gap-12">
          {/* Left Column: Bold statement, details & highlight telemetry */}
          <div className="flex flex-col justify-between md:col-span-6 lg:col-span-5">
            <div>
              {/* Subheadline — editorial ramp: quiet connectors, one dominant word */}
              <Reveal delay={0}>
                <h3 className="group/sub font-[family-name:var(--font-heading)] text-[clamp(1.3rem,5vw,1.4rem)] md:text-[clamp(0.8rem,2.9vw,1.9rem)] md:whitespace-nowrap uppercase sm:leading-[1.1] tracking-[-0.025em]">
                {/* 01 — outlined, the premise */}
                <span className="whitespace-nowrap">
                  <span className="text-stroke-key">Where</span>
                  <Divider />
                </span>
                <wbr />
                {/* 02 — solid black weight, the human half */}
                <span className="whitespace-nowrap">
                  <span className="font-black text-[var(--text)]">instinct</span>
                  <Divider />
                </span>
                <wbr />
                {/* 03 — small mono, the hinge */}
                <span className="whitespace-nowrap">
                  <span className="align-baseline font-[family-name:var(--font-body)] text-[0.34em] font-light tracking-[0.2em] text-[var(--muted)]/70">
                    meets
                  </span>
                  <Divider />
                </span>
                <wbr />
                {/* 04 — inverted fill, the payoff */}
                <span className="whitespace-nowrap">
                  <span className="bg-[var(--text)] px-[0.15em] pb-[0.05em] text-[var(--ink)]">
                    interface
                  </span>
                </span>
                </h3>
              </Reveal>

              {/* Two editorial blocks, separated by a single hairline */}
              <Reveal delay={110}>
              <dl className="mt-4 sm:mt-10 border-t border-[var(--line)]">
                <div className="group grid grid-cols-[4.5rem_1fr] gap-x-5 gap-y-2 border-b border-[var(--line)] py-5 transition-colors duration-300 hover:border-[var(--line-strong)] sm:grid-cols-[6rem_1fr] sm:gap-x-8">
                  <dt className="pt-1 font-mono text-md uppercase tracking-[0.18em] text-[var(--muted)] transition-colors duration-300 group-hover:text-[var(--blue-light)]">
                    What
                  </dt>
                  <dd className="text-[0.98rem] font-light leading-[1.85] text-white/90 sm:text-xl">
                    <span className="text-stroke-key text-stroke-key-hover uppercase tracking-tight">
                      D&apos;VINE 2.0
                    </span>{" "}
                    is a{" "}
                    <span className="font-semibold text-[var(--text)]">
                      24-hour UI/UX design sprint
                    </span>
                    . Teams are given a blank slate and a ticking clock — identify
                    real friction, discard the safe solution, and build something
                    people can feel.
                  </dd>
                </div>

                <div className="group grid grid-cols-[4.5rem_1fr] gap-x-5 gap-y-2 border-b border-[var(--line)] py-5 transition-colors duration-300 hover:border-[var(--line-strong)] sm:grid-cols-[6rem_1fr] sm:gap-x-8">
                  <dt className="pt-1 font-mono text-md uppercase tracking-[0.18em] text-[var(--muted)] transition-colors duration-300 group-hover:text-[var(--blue-light)]">
                    By
                  </dt>
                  <dd className="text-[0.98rem] font-light leading-[1.85] text-white/90 sm:text-xl">
                    <span className="text-stroke-key text-stroke-key-hover uppercase tracking-tight">
                      IEEE SB CEC
                    </span>{" "}
                    &amp;{" "}
                    <span className="text-stroke-key text-stroke-key-hover uppercase tracking-tight">
                      IEDC Bootcamp CEC
                    </span>{" "}
                    — two institutions that treat design as the sharpest tool in
                    engineering.
                  </dd>
                </div>
              </dl>
              </Reveal>
            </div>

            {/* Stat row: rule-separated, no boxes */}
            <Reveal delay={220}>
            <dl className="sm:mt-10 grid grid-cols-3 sm:mt-14">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="border-t border-[var(--line)] pt-3 pr-4 transition-colors last:pr-0 hover:border-[var(--line-strong)]"
                >
                  <dt className="sr-only">{item.label}</dt>
                  <dd>
                    <span className="block font-[family-name:var(--font-heading)] text-xl font-semibold tracking-[-0.02em] text-[var(--text)] sm:text-4xl">
                      {item.value}
                    </span>
                    <span className="mt-1 block font-mono text-[0.62rem] uppercase tracking-[0.15em] text-[var(--muted)]">
                      {item.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
            </Reveal>
          </div>

          {/* Right Column: Visual Veil Canvas with Minimal Frame */}
          <div className="relative order-first flex flex-col md:order-none md:col-span-6 lg:col-span-7">
            <DitherStage />
          </div>
        </div>
      </div>
    </section>
  );
}
