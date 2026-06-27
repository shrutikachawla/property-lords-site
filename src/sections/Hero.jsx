import { siteConfig } from "../data/siteConfig";
import MortgageCalculator from "../components/MortgageCalculator";

export default function Hero() {
  return (
    <section id="top" className="relative bg-ink overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* Ambient texture: faint topographic-style lines, evokes land/property without stock photography */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.07] pointer-events-none"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {[...Array(10)].map((_, i) => (
          <path
            key={i}
            d={`M -100 ${80 + i * 75} Q 300 ${20 + i * 75}, 600 ${80 + i * 75} T 1300 ${80 + i * 75}`}
            stroke="#F2EDE4"
            strokeWidth="1"
            fill="none"
          />
        ))}
      </svg>

      <div className="relative max-w-6xl mx-auto px-6 grid lg:grid-cols-[1.1fr_1fr] gap-14 items-center">
        <div className="text-stone animate-fade-up">
          <p className="text-clay text-sm font-medium tracking-wide uppercase mb-4">
            {siteConfig.areasServed.join(" · ")}
          </p>
          <h1 className="font-display text-5xl sm:text-6xl leading-[1.05] tracking-tight">
            Real estate,
            <br />
            handled <span className="text-clay">clearly.</span>
          </h1>
          <p className="mt-6 text-lg text-stone/75 max-w-md">
            I'm {siteConfig.agentName}, and I help buyers and sellers in{" "}
            {siteConfig.areasServed[0]} move with confidence — straight answers, no pressure.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#contact"
              className="rounded-full bg-clay px-7 py-3.5 font-medium text-cream hover:bg-clay-dark transition-colors"
            >
              Start a conversation
            </a>
            <a
              href="#listings"
              className="rounded-full border border-stone/25 px-7 py-3.5 font-medium text-stone hover:bg-stone/10 transition-colors"
            >
              See listings
            </a>
          </div>
        </div>

        <div className="animate-reveal lg:justify-self-end" style={{ animationDelay: "120ms" }}>
          <MortgageCalculator />
        </div>
      </div>
    </section>
  );
}
