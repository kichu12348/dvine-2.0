"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const headingLineClass = "mb-[-0.06em] block overflow-clip pt-[0.05em] pb-[0.1em] [&>span]:block";

const organizers = [
  {
    name: "IEDC BOOTCAMP CEC",
    title: ["IEDC", "BOOTCAMP CEC"],
    focus: "Innovation & entrepreneurship",
    logo: "/assets/IEDC_logosvg.svg",
    width: 99,
    height: 60,
    paragraphs: [
      "IEDC BOOTCAMP CEC is an innovation and entrepreneurship-focused student community that encourages young minds to explore ideas, develop solutions, and turn creativity into impact.",
      "Through innovation programs, workshops, competitions, and hands-on activities, IEDC BOOTCAMP CEC fosters design thinking, entrepreneurial skills, and a culture of innovation.",
    ],
  },
  {
    name: "IEEE Student Branch CEC",
    title: ["IEEE", "Student Branch CEC"],
    focus: "Technology & community",
    logo: "/assets/ieee_logo.svg",
    width: 302,
    height: 65,
    paragraphs: [
      "The IEEE Student Branch CEC is a student-driven community at the College of Engineering Chengannur that promotes technical learning, innovation, leadership, and professional development.",
      "Through workshops, competitions, technical events, and collaborative initiatives, IEEE SB CEC provides students with opportunities to learn, experiment, and connect with the wider technology community.",
    ],
  },
];

export default function AboutOrganizers() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = sectionRef.current;
    if (!root) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      root.querySelectorAll<HTMLElement>("[data-organizer-heading]").forEach((line) => {
        gsap.fromTo(line.firstElementChild, { yPercent: 105 }, {
          yPercent: 0, ease: "power2.out",
          scrollTrigger: { trigger: line, start: "top 95%", end: "top 60%", scrub: .7 },
        });
      });
      root.querySelectorAll<HTMLElement>("[data-organizer]").forEach((organizer, index) => {
        gsap.fromTo(organizer.querySelectorAll("[data-brand-part]"),
          { x: index === 0 ? -24 : 24, y: 20, opacity: .15 },
          { x: 0, y: 0, opacity: 1, stagger: .1, ease: "power2.out",
            scrollTrigger: { trigger: organizer, start: "top 92%", end: "top 56%", scrub: .8 } },
        );
        gsap.fromTo(organizer.querySelector("[data-brand-logo]"),
          { clipPath: "inset(0 100% 0 0)", scale: .94 },
          { clipPath: "inset(0 0% 0 0)", scale: 1, ease: "power2.out",
            scrollTrigger: { trigger: organizer, start: "top 92%", end: "top 60%", scrub: .8 } },
        );
      });
      root.querySelectorAll<HTMLElement>("[data-organizer-copy]").forEach((paragraph) => {
        gsap.fromTo(paragraph, { y: 16, opacity: .3 }, {
          y: 0, opacity: 1, ease: "power2.out",
          scrollTrigger: { trigger: paragraph, start: "top 95%", end: "top 77%", scrub: .5 },
        });
      });
      const together = root.querySelector("[data-together]");
      const connectionParts = Array.from(
        root.querySelectorAll<SVGPathElement>("[data-connection]"),
      );
      connectionParts.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
          opacity: 1,
        });
      });
      const togetherTimeline = gsap.timeline({ paused: true });
      togetherTimeline
        .to(
          root.querySelectorAll("[data-line-outer]"),
          { strokeDashoffset: 0, duration: .6, stagger: .08, ease: "power2.inOut" },
        )
        .to(
          root.querySelectorAll("[data-line-vertical]"),
          { strokeDashoffset: 0, duration: .65, ease: "power2.inOut" },
        )
        .to(
          root.querySelectorAll("[data-line-curve]"),
          { strokeDashoffset: 0, duration: .7, ease: "power2.inOut" },
        )
        .to(
          root.querySelectorAll("[data-line-center]"),
          { strokeDashoffset: 0, duration: .3, ease: "power2.inOut" },
        )
        .to({}, { duration: .2 })
        .fromTo(
          root.querySelectorAll("[data-together-intro]"),
          { opacity: 0, y: 26, scale: .97 },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: .75,
            stagger: .08,
            ease: "power3.out",
          },
        );
      ScrollTrigger.create({
        trigger: together,
        start: "top 75%",
        once: true,
        onEnter: () => togetherTimeline.play(),
      });
    }, root);
    let cancelled = false;
    document.fonts.ready.then(() => { if (!cancelled) ScrollTrigger.refresh(); });
    return () => { cancelled = true; media.revert(); };
  }, []);

  return (
    <section ref={sectionRef} id="about-organizers" aria-labelledby="organizers-title" className="relative overflow-clip bg-[var(--ink)] px-6 py-[70px] text-[var(--text)] max-[400px]:px-5 md:px-8 md:py-20 min-[68.8125rem]:px-12 min-[68.8125rem]:pt-[100px] min-[68.8125rem]:pb-[90px]">
      <div className="mx-auto max-w-[1240px]">
        <header className="border-b border-[var(--line)] pb-[30px] md:pb-[42px]">
          {/* <div className="flex justify-between gap-5 font-mono text-[7px] tracking-[0.05em] text-[var(--muted)] max-[400px]:gap-2.5 max-[400px]:text-[6px] md:text-[9px] md:tracking-[0.1em]"><span className="text-[var(--blue-light)]">THE PEOPLE BEHIND THE SPRINT</span><span>02 COMMUNITIES / 01 VISION</span></div> */}
          <h2 id="organizers-title" aria-label="About the organizers" className="mt-8 mb-0 font-[family-name:var(--font-heading)] text-[clamp(45px,9.8vw,74px)] leading-[0.98] font-semibold tracking-[-0.07em] max-[400px]:text-[clamp(39px,10.3vw,45px)] md:text-[clamp(54px,8.6vw,122px)]">
            <span data-organizer-heading className={headingLineClass}><span>ABOUT THE</span></span>
            <span data-organizer-heading className={`${headingLineClass} text-transparent [-webkit-text-stroke:1px_#9de4ffaa]`}><span>ORGANIZERS<span className="text-[var(--blue)] [-webkit-text-stroke:0]">.</span></span></span>
          </h2>
        </header>

        <div className="grid grid-cols-1 pt-[30px] md:grid-cols-2 md:pt-[42px]">
          {organizers.map((organizer, index) => (
            <article key={organizer.name} data-organizer className={`min-w-0 ${index === 0 ? "pb-[35px] md:pr-9 md:pb-0 min-[68.8125rem]:pr-[60px]" : "border-t border-[var(--line)] pt-[30px] md:border-t-0 md:border-l md:pt-0 md:pl-9 min-[68.8125rem]:pl-[60px]"}`} aria-labelledby={`organizer-${index}`}>
              <div data-brand-part className="flex justify-between gap-3.5 font-mono text-[8px] tracking-[0.04em] text-[var(--muted)] uppercase max-[400px]:text-[7px]"><span className="text-[var(--blue-light)]">0{index + 1}</span><span>{organizer.focus}</span></div>
              <div data-brand-part className="relative flex min-h-[145px] items-center py-[30px] md:min-h-[175px]">
                <Image data-brand-logo src={organizer.logo} width={organizer.width} height={organizer.height} alt={`${organizer.name} logo`} className={index === 0 ? "h-auto w-[140px] md:w-40" : "h-auto w-[285px] max-w-[90%] md:w-[410px]"} />
                <span className="absolute top-1/2 right-0 font-mono text-lg text-[#9de4ff40]" aria-hidden="true">+</span>
              </div>
              <h3 data-brand-part id={`organizer-${index}`} aria-label={organizer.name} className="mt-1 mb-[22px] font-[family-name:var(--font-heading)] text-[32px] leading-[1.13] font-medium tracking-[-0.045em] md:mt-2 md:mb-[27px] md:text-[34px] min-[68.8125rem]:text-[39px]">
                <span className="block text-[var(--blue-light)]">{organizer.title[0]}</span><span className="mt-[5px] block text-[0.76em]">{organizer.title[1]}</span>
              </h3>
              <div>
                {organizer.paragraphs.map((paragraph) => <p data-organizer-copy key={paragraph} className="mt-0 mb-[22px] text-sm leading-[1.85] text-[var(--muted)] last:mb-0 md:max-w-[500px] md:leading-[1.9] min-[68.8125rem]:text-[15px]">{paragraph}</p>)}
              </div>
            </article>
          ))}
        </div>

        <div data-together className="relative pt-[180px] text-center md:px-[15px] md:pt-[198px] min-[68.8125rem]:px-[70px]">
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[45px] bottom-[-90px] bg-[radial-gradient(ellipse_at_50%_55%,#1abaff0b,transparent_65%)]" />
          <svg viewBox="0 0 1000 180" preserveAspectRatio="none" className="absolute top-[22px] left-0 h-[152px] w-full stroke-[var(--blue)] stroke-1 opacity-50 md:top-7 md:h-[176px]" fill="none" aria-hidden="true">
            <path data-connection data-line-outer d="M120 0V45" />
            <path data-connection data-line-outer d="M880 0V45" />
            <path data-connection data-line-vertical d="M120 45V72" />
            <path data-connection data-line-vertical d="M880 45V72" />
            <path data-connection data-line-curve d="M120 72Q120 105 165 105H400Q500 105 500 145" />
            <path data-connection data-line-curve d="M880 72Q880 105 835 105H600Q500 105 500 145" />
            <path data-connection data-line-center d="M500 145V180" />
          </svg>
          <span data-together-intro className="relative font-mono text-[9px] tracking-[0.17em] text-[var(--blue-light)] uppercase">Together</span>
          <h3 data-together-intro aria-label="IEDC Bootcamp CEC and IEEE Student Branch CEC" className="relative my-[22px] flex flex-col items-center justify-center gap-5 md:my-[25px] md:flex-row md:gap-5 min-[68.8125rem]:gap-[30px]">
            <Image
              data-together-intro
              src="/assets/IEDC_logosvg.svg"
              width={99}
              height={60}
              alt="IEDC Bootcamp CEC"
              className="h-auto w-[190px] max-w-[72vw] md:w-[220px]"
            />
            <span data-together-intro className="inline-block text-[30px] leading-none font-normal text-[var(--blue)] md:text-[40px]" aria-hidden="true">×</span>
            <Image
              data-together-intro
              src="/assets/ieee_logo.svg"
              width={302}
              height={65}
              alt="IEEE Student Branch CEC"
              className="h-auto w-[345px] max-w-[82vw] md:w-[370px]"
            />
          </h3>
          <p data-together-intro data-organizer-copy className="relative mx-auto my-0 max-w-[760px] text-[15px] leading-[1.85] text-[var(--muted)] md:text-[19px] md:leading-[1.8]">Two communities coming together to create a platform where <span className="text-[var(--blue-light)]">design, technology, creativity, and innovation</span> meet.</p>
        </div>
      </div>
    </section>
  );
}
