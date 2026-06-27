import { siteConfig } from "../data/siteConfig";

// lucide-react no longer ships brand/social icons, so these are small inline SVGs.
function IconInstagram(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconLinkedin(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...props}>
      <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM3 9h4v12H3V9zm6.5 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.3-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V21h-4V9z" />
    </svg>
  );
}
function IconFacebook(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...props}>
      <path d="M13.5 21v-7.2h2.4l.4-2.8h-2.8V9.2c0-.8.3-1.4 1.5-1.4h1.4V5.1C15.9 5 15 5 14 5c-2.2 0-3.7 1.3-3.7 3.8V11H8v2.8h2.3V21h3.2z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-ink text-stone/70">
      <div className="max-w-6xl mx-auto px-6 py-14 grid gap-10 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl text-stone">
            {siteConfig.agentName}
            <span className="text-clay">.</span>
          </p>
          <p className="mt-2 text-sm">{siteConfig.brokerage}</p>
          <p className="mt-4 text-sm max-w-xs">{siteConfig.tagline}</p>
        </div>

        <div>
          <p className="text-stone text-sm font-medium mb-3 tracking-wide uppercase">Areas served</p>
          <ul className="space-y-1.5 text-sm">
            {siteConfig.areasServed.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-stone text-sm font-medium mb-3 tracking-wide uppercase">Get in touch</p>
          <p className="text-sm">
            <a href={`tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`} className="hover:text-clay transition-colors">
              {siteConfig.phone}
            </a>
          </p>
          <p className="text-sm mt-1">
            <a href={`mailto:${siteConfig.email}`} className="hover:text-clay transition-colors">
              {siteConfig.email}
            </a>
          </p>
          <div className="flex gap-4 mt-4">
            <a href={siteConfig.social.instagram} aria-label="Instagram" className="hover:text-clay transition-colors">
              <IconInstagram />
            </a>
            <a href={siteConfig.social.linkedin} aria-label="LinkedIn" className="hover:text-clay transition-colors">
              <IconLinkedin />
            </a>
            <a href={siteConfig.social.facebook} aria-label="Facebook" className="hover:text-clay transition-colors">
              <IconFacebook />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-stone/10 py-5 text-center text-xs text-stone/50">
        © {new Date().getFullYear()} {siteConfig.brokerage}. All rights reserved.
      </div>
    </footer>
  );
}
