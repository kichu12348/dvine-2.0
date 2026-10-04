"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Letter3DSwap from "./ui/Letter3DSwap";
import AnatomyButton from "./ui/AnatomyButton";

/* Primary destinations — the big stacked list inside the overlay */
const primaryLinks = [
  { label: "About", href: "#about-event" },
  { label: "Organizers", href: "#about-organizers" },
  { label: "Prizepool", href: "#prizepool" },
  { label: "Partners", href: "#partners" },
  { label: "Schedule", href: "#schedule" },
  { label: "FAQ", href: "#faq" },
];

/* Dimmed secondary cluster below the main list (mirrors the Footer's Connect) */
const secondaryLinks = [
  { label: "Email", href: "mailto:hello@dvine.in", external: false },
  { label: "Instagram", href: "https://instagram.com", external: true },
];

const MENU_EXIT_MS = 860;

/* Big menu links: brand heading face, tight leading, cyan flip on hover */
const menuLink =
  "focus-ring group flex w-full font-[family-name:var(--font-heading)] text-[clamp(3.2rem,4.6vw,2.6rem)] sm:text-[clamp(4rem,4.6vw,2.6rem)] font-medium leading-[1.14] tracking-[-0.02em] text-[var(--text)] transition-colors duration-300 hover:text-[var(--blue-light)] focus-visible:text-[var(--blue-light)]";

/* Secondary links: smaller, dimmed, brighten on hover */
const subLink =
  "focus-ring group flex w-fit font-[family-name:var(--font-heading)] text-[clamp(1.3rem,1.6vw,1.15rem)] font-medium text-[var(--muted)]/55 transition-colors duration-300 hover:text-[var(--text)] focus-visible:text-[var(--text)]";

export default function NavbarMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  /* True while the exit tween runs — the overlay stays mounted until it finishes */
  const [menuClosing, setMenuClosing] = useState(false);
  /* Circle-reveal origin (button centre) + coverage radius, captured on open */
  const [revealStyle, setRevealStyle] = useState<CSSProperties | null>(null);

  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);
  const closingRef = useRef(false);
  const exitTimerRef = useRef<number | null>(null);
  const closeMenuRef = useRef<() => void>(() => {});

  /* While the overlay is open: lock the page, close on Escape, focus the list. */
  useEffect(() => {
    if (!menuOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      closeMenuRef.current();
      toggleRef.current?.focus();
    };

    document.addEventListener("keydown", onKeyDown);
    const focusTimer = window.setTimeout(
      () => firstLinkRef.current?.focus(),
      60,
    );

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(focusTimer);
    };
  }, [menuOpen]);

  /* Closing = animated exit (links sink, veil dissolves), then unmount */
  const closeMenu = () => {
    if (!menuOpen || closingRef.current) return;
    /* Reduced motion collapses the tween to 0.01ms — unmount straight away */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMenuOpen(false);
      return;
    }
    closingRef.current = true;
    setMenuClosing(true);
    const exitDuration = window.matchMedia("(max-width: 640px)").matches
      ? 420
      : MENU_EXIT_MS;
    exitTimerRef.current = window.setTimeout(() => {
      exitTimerRef.current = null;
      closingRef.current = false;
      setMenuClosing(false);
      setMenuOpen(false);
    }, exitDuration);
  };

  /* Open: capture the button's centre so the veil grows out of it */
  const openMenu = () => {
    const rect = toggleRef.current?.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const x = rect ? rect.left + rect.width / 2 : vw / 2;
    const y = rect ? rect.top + rect.height / 2 : 24;
    /* Farthest viewport corner from the button — guarantees full coverage */
    const radius = Math.hypot(Math.max(x, vw - x), Math.max(y, vh - y));
    setRevealStyle({
      "--reveal-x": `${x}px`,
      "--reveal-y": `${y}px`,
      "--reveal-radius": `${radius}px`,
    } as CSSProperties);
    setMenuOpen(true);
  };

  /* Hand the freshest closeMenu to the long-lived Escape listener (lint-clean) */
  useEffect(() => {
    closeMenuRef.current = closeMenu;
  });

  /* Unmount cleanup: never leave a pending exit timer behind */
  useEffect(
    () => () => {
      if (exitTimerRef.current !== null)
        window.clearTimeout(exitTimerRef.current);
    },
    [],
  );

  /* Nav link click: dismiss the menu (animated) and park focus on the toggle */
  const handleNavClick = () => {
    closeMenu();
    toggleRef.current?.focus();
  };

  return (
    <>
      {/* Bare top bar: Menu (left) / wordmark (centre, open only) / Register (right) */}
      <header className="fixed inset-x-0 top-0 z-50">
        {/* Soft top scrim — imperceptible over dark sections, keeps the bar legible over light bands */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[rgba(2,8,23,0.8)] via-[rgba(2,8,23,0.35)] to-transparent"
        />
        <div className="relative mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between gap-4 px-5 sm:h-[4.5rem] sm:px-6 md:px-8">
          {/* Menu ⇄ Close — same spot in both states, as in the reference */}
          <button
            ref={toggleRef}
            type="button"
            onClick={() => (menuOpen ? closeMenu() : openMenu())}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            className="focus-ring text-[0.875rem] font-bold tracking-[0.01em] text-[var(--text)] transition-colors duration-300 hover:text-[var(--blue-light)]"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>

          {/* Wordmark takes centre stage only while the menu is open */}
          {menuOpen && (
            <a
              href="#hero"
              onClick={handleNavClick}
              aria-label="D'VINE 2.0 — back to the top"
              className={`${menuClosing ? "menu-fade-out" : "menu-fade"} group absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-baseline gap-1`}
              style={{ animationDelay: menuClosing ? "200ms" : "400ms" }}
            >
              <span className="font-[family-name:var(--font-owners)] bg-[linear-gradient(100deg,#ffffff_5%,#A3E0FC_55%,#1abaff_100%)] bg-clip-text text-[1.15rem] font-black uppercase leading-none tracking-[-0.03em] text-transparent transition-[filter] duration-300 group-hover:drop-shadow-[0_0_16px_rgba(26,186,255,0.55)] sm:text-[1.3rem]">
                D&apos;Vine
              </span>
              <span className="font-[family-name:var(--font-heading)] text-[0.7rem] font-black leading-none text-[var(--blue)] sm:text-[0.8rem]">
                2.0
              </span>
            </a>
          )}

          {/* Anatomy CTA — blue-gradient button with hover measurement callouts */}
          <AnatomyButton href="/register" variant="navbar">
            Register
          </AnatomyButton>
        </div>
      </header>

      {/* Fullscreen takeover: low-opacity veil that circles out of the Menu button (origin vars set in openMenu) */}
      {menuOpen && (
        <div
          id="site-menu"
          className={`menu-panel fixed inset-0 z-40 ${menuClosing ? "menu-panel-out pointer-events-none" : "menu-panel-in"}`}
          style={revealStyle ?? undefined}
        >
          <nav
            aria-label="Menu"
            className="flex h-full flex-col overflow-y-auto px-5 pb-8 pt-20 sm:px-6 sm:pt-24 md:px-8"
          >
            {/* my-auto: centres the lists when there's room, collapses to the top (scrollable) when not */}
            <div className="my-auto">
              <ul className="flex flex-col">
                {primaryLinks.map((item, index) => (
                  <li
                    key={item.href}
                    className={menuClosing ? "menu-item-out" : "menu-item"}
                    style={{
                      animationDelay: menuClosing
                        ? `${(primaryLinks.length + secondaryLinks.length - 1 - index) * 45}ms`
                        : `${220 + index * 60}ms`,
                    }}
                  >
                    <a
                      ref={index === 0 ? firstLinkRef : undefined}
                      href={item.href}
                      onClick={handleNavClick}
                      className={menuLink}
                    >
                      <Letter3DSwap
                        as="span"
                        mainClassName="grow"
                        rotateDirection="right"
                        staggerFrom="first"
                        staggerDuration={0.045}
                      >
                        {item.label}
                      </Letter3DSwap>
                    </a>
                  </li>
                ))}
              </ul>

              <ul className="mt-14 flex flex-col gap-3 sm:mt-20">
                {secondaryLinks.map((item, index) => (
                  <li
                    key={item.href}
                    className={menuClosing ? "menu-item-out" : "menu-item"}
                    style={{
                      animationDelay: menuClosing
                        ? `${(secondaryLinks.length - 1 - index) * 45}ms`
                        : `${220 + (primaryLinks.length + index) * 60}ms`,
                    }}
                  >
                    <a
                      href={item.href}
                      onClick={item.external ? undefined : handleNavClick}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      className={subLink}
                    >
                      <Letter3DSwap
                        as="span"
                        rotateDirection="right"
                        staggerDuration={0.03}
                      >
                        {item.label}
                      </Letter3DSwap>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
