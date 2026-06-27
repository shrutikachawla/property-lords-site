import { siteConfig } from "../data/siteConfig";
import { about } from "../data/about";

function fillTemplate(text) {
  return text
    .replaceAll("{agentName}", siteConfig.agentName)
    .replaceAll("{brokerage}", siteConfig.brokerage)
    .replaceAll("{primaryArea}", siteConfig.areasServed[0] || "");
}

export default function About() {
  return (
    <section id="about" className="bg-stone py-24">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-[0.85fr_1.15fr] gap-12 items-center">
        <div className="aspect-[4/5] rounded-2xl bg-stone-dim border border-ink/10 overflow-hidden flex items-center justify-center">
          {about.photo ? (
            <img src={about.photo} alt={siteConfig.agentName} className="w-full h-full object-cover" />
          ) : (
            <span className="text-slate/40 text-sm">Your photo here</span>
          )}
        </div>

        <div>
          <p className="text-clay text-sm font-medium tracking-wide uppercase mb-3">About</p>
          <h2 className="font-display text-4xl text-ink leading-tight">{about.headline}</h2>

          {about.bioParagraphs.map((p, i) => (
            <p key={i} className={`text-slate leading-relaxed ${i === 0 ? "mt-5" : "mt-4"}`}>
              {fillTemplate(p)}
            </p>
          ))}

          {about.stats.length > 0 && (
            <div className="mt-8 grid grid-cols-3 gap-6 max-w-sm">
              {about.stats.map((s) => (
                <Stat key={s.label} label={s.label} value={s.value} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <p className="font-display num text-2xl text-ink">{value}</p>
      <p className="text-xs text-slate mt-1">{label}</p>
    </div>
  );
}
