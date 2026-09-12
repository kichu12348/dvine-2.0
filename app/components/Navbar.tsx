const navigationItems = [
  { label: "About", href: "#about-event" },
  { label: "Organizers", href: "#about-organizers" },
  { label: "Prizepool", href: "#prizepool" },
  { label: "Partners", href: "#partners" },
  { label: "Schedule", href: "#schedule" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-accent/20 bg-surface/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <a
          href="#hero"
          className="shrink-0 text-xl tracking-widest text-accent transition-colors hover:text-foreground"
          aria-label="Go to the Hero section"
        >
          D&apos;VINE
        </a>

        <nav
          aria-label="Main navigation"
          className="ml-auto overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <ul className="flex min-w-max items-center gap-5 text-sm text-foreground sm:gap-7">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="transition-colors hover:text-accent focus-visible:text-accent"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
