import { Search, Calculator, Handshake } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Browse what fits",
    body: "Explore listings in your area, filtered to your budget and must-haves — no sales pitch required.",
  },
  {
    icon: Calculator,
    title: "Run the numbers",
    body: "Use the calculator to see real monthly payments before you fall in love with a place you can't swing.",
  },
  {
    icon: Handshake,
    title: "Talk to a real person",
    body: "When you're ready, I walk you through next steps — financing, offers, inspections — at your pace.",
  },
];

export default function ProcessSteps() {
  return (
    <section className="bg-stone py-20 border-y border-ink/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-10">
          {steps.map(({ icon: Icon, title, body }, i) => (
            <div key={title} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-6 left-[calc(100%-1rem)] w-[calc(100%-2rem)] border-t border-dashed border-sage/40" />
              )}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-ink text-clay">
                  <Icon size={20} />
                </div>
                <span className="num text-sm text-sage-dark">Step {i + 1}</span>
              </div>
              <h3 className="font-display text-xl text-ink">{title}</h3>
              <p className="mt-2 text-slate text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
