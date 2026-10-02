import Image from "next/image";
import { ShootingStars } from "./ui/shootingstar";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[100dvh] flex-col justify-center items-center isolate overflow-hidden px-5 py-24 sm:px-8 md:px-12 sm:items-start sm:text-left text-center"
      style={{
        background: [
          "linear-gradient(90deg, rgba(2,8,23,0.89), rgba(2,8,23,0.5) 60%, rgba(2,8,23,0.13))",
          "linear-gradient(180deg, rgba(2,8,23,0.16), rgba(2,8,23,0.88))",
          'url("/hero-bg.jpg") 68% center / cover',
        ].join(", "),
      }}
      aria-labelledby="hero-title"
    >
      <ShootingStars
        background="transparent"
        starCount={80}
        nebula={false}
        interval={3000}
        maxActiveShootingStars={2}
        trailColor="#38BDF8"
        angle={42}
        parallax={true}
        clickToSpawn={true}
        className="!absolute inset-0 z-0 pointer-events-auto"
      />

      {/* Decorative orbits */}
      <div
        className="pointer-events-none absolute -z-1 border border-[rgba(68,172,255,0.38)] rounded-full -rotate-[18deg] -right-48 -bottom-32 w-[34rem] h-40 hidden sm:block"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -z-1 border border-[rgba(47,112,222,0.38)] rounded-full -rotate-[18deg] -right-64 -bottom-52 w-[43rem] h-60 hidden sm:block"
        aria-hidden="true"
      />

      {/* Decorative wedge */}
      <div
        className="pointer-events-none absolute -z-1 -right-16 -bottom-16 w-56 aspect-square border border-[rgba(154,224,255,0.3)] rounded-[var(--radius)] rotate-[30deg] opacity-60 sm:opacity-100"
        style={{
          background:
            "linear-gradient(135deg, rgba(41,149,255,0.17), transparent 68%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-[1110px] mx-auto animate-[hero-enter_900ms_cubic-bezier(0.16,1,0.3,1)_both] flex flex-col items-center sm:items-start">
        <h1 id="hero-title" className="sr-only">
          D&apos;VINE 2.0
        </h1>

        {/* Main Logo */}
        <div className="w-full max-w-[21rem] xs:max-w-[24rem] sm:max-w-[32rem] md:max-w-[38rem] lg:max-w-[41rem]">
          <Image
            src="/dvine.svg"
            alt="D'VINE 2.0"
            className="block w-full h-auto drop-shadow-[0_0_26px_rgba(74,184,255,0.18)]"
            width={831}
            height={322}
            priority
          />
        </div>

        <p className="w-fit mt-4 sm:mt-5 pt-2.5 sm:pt-3 border-t border-[var(--line-strong)] text-[var(--blue-light)] text-[clamp(0.72rem,2.8vw,0.9rem)] font-bold tracking-[0.24em] sm:tracking-[0.28em] uppercase">
          From <em className="not-italic text-[var(--text)]">vision</em> to
          creation
        </p>

        {/* Hero Mobile/Tablet CTAs */}
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center sm:justify-start gap-3.5 sm:gap-4 w-full">
          <a
            href="#schedule"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-cyan-200/50 bg-gradient-to-r from-[#1abaff] to-[#0088ff] px-6 py-2.5 sm:px-7 sm:py-3 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#020817] shadow-[0_0_24px_rgba(26,186,255,0.45)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_35px_rgba(26,186,255,0.7)] active:scale-95"
          >
            Register Now
            <span className="text-sm font-bold">→</span>
          </a>
          <a
            href="#about-event"
            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#c2d7e9] backdrop-blur-sm transition-all duration-200 hover:bg-white/10 hover:border-cyan-400/40 hover:text-white"
          >
            Explore Event ↓
          </a>
        </div>
      </div>
    </section>
  );
}
