import type { ReactNode } from "react";

type AnatomyButtonProps = {
  /** Destination — both main CTAs are plain links. */
  href: string;
  /** Button label, kept from the original CTA. */
  children: ReactNode;
  /**
   * Glyph for the icon slot, rendered after the label. Defaults to the ↗
   * arrow used across the site's CTAs.
   */
  icon?: ReactNode;
  /**
   * `navbar` = text-only geometric CTA for the fixed top bar. `default` =
   * the reference's surrounding annotations.
   */
  variant?: "default" | "navbar";
  target?: string;
  rel?: string;
  className?: string;
};

/**
 * "Anatomy" CTA — a blue-gradient button whose hover state reveals pink
 * measurement callouts (padding ticks, background / border-radius labels,
 * icon highlight). Ported from the styled-components reference into the
 * project's plain-CSS stack; styles live under `.anatomy-btn` in globals.css.
 */
export default function AnatomyButton({
  href,
  children,
  icon = "↗",
  variant = "default",
  target,
  rel,
  className = "",
}: AnatomyButtonProps) {
  const navbar = variant === "navbar";

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={`anatomy-btn${navbar ? " anatomy-btn-navbar" : ""} ${className}`.trim()}
    >
      {navbar ? (
        <span className="navbar-cta-label">{children}</span>
      ) : (
        <>
          <span className="title">{children}</span>
          <div className="icon">
            <span className="text-icon hide">Icon</span>
            <span className="icon-slot">{icon}</span>
          </div>
          <div className="padding-left hide">
            <div className="padding-left-line">
              <span className="padding-left-text">Left Padding</span>
            </div>
          </div>
          <div className="padding-right hide">
            <div className="padding-right-line">
              <span className="padding-right-text">Right Padding</span>
            </div>
          </div>
          <div className="background hide">
            <span className="background-text">Background</span>
          </div>
          <div className="border hide">
            <span className="border-text">Border Radius</span>
          </div>
        </>
      )}
    </a>
  );
}
