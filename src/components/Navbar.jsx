import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import { siteConfig } from "../data/siteConfig";

const links = [
  { href: "#listings", label: "Listings" },
  { href: "#calculator", label: "Calculator" },
  { href: "#about", label: "About" },
  { href: "#testimonials", label: "Reviews" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-stone/95 backdrop-blur-sm shadow-[0_1px_0_0_rgba(28,35,33,0.08)]" : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-18 flex items-center justify-between" style={{ height: "4.5rem" }}>
        <a href="#top" className="font-display text-xl tracking-tight text-ink">
          {siteConfig.agentName}
          <span className="text-clay">.</span>
        </a>

        <ul className="hidden md:flex items-center gap-8 font-body text-[0.95rem] text-ink/80">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="hover:text-clay transition-colors">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <a
            href={`tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`}
            className="flex items-center gap-2 text-sm text-ink/80 hover:text-clay transition-colors"
          >
            <Phone size={16} />
            {siteConfig.phone}
          </a>
          <a
            href="#contact"
            className="px-4 py-2 rounded-full bg-ink text-stone text-sm font-medium hover:bg-clay transition-colors"
          >
            Get in touch
          </a>
        </div>

        <button
          className="md:hidden p-2 -mr-2 text-ink"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-stone border-t border-ink/10 px-6 py-6">
          <ul className="flex flex-col gap-4 font-body text-base text-ink">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)} className="block py-1">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-4 block text-center px-4 py-3 rounded-full bg-ink text-stone text-sm font-medium"
          >
            Get in touch
          </a>
        </div>
      )}
    </header>
  );
}
