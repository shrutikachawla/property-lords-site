import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { testimonials } from "../data/testimonials";

export default function Testimonials() {
  const [i, setI] = useState(0);

  if (testimonials.length === 0) return null;

  const t = testimonials[i % testimonials.length];

  const go = (dir) => setI((prev) => (prev + dir + testimonials.length) % testimonials.length);

  return (
    <section id="testimonials" className="bg-ink py-24">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <p className="text-clay text-sm font-medium tracking-wide uppercase mb-3">Client stories</p>
        <Quote className="mx-auto text-sage mb-6" size={32} />
        <p key={i} className="font-display text-2xl sm:text-3xl text-stone leading-snug animate-fade-up">
          "{t.quote}"
        </p>
        <p className="mt-6 text-clay font-medium">{t.name}</p>
        <p className="text-stone/60 text-sm">{t.role}</p>

        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={() => go(-1)}
            aria-label="Previous testimonial"
            className="p-2 rounded-full border border-stone/20 text-stone hover:bg-stone/10 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                aria-label={`Go to testimonial ${idx + 1}`}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === i ? "bg-clay" : "bg-stone/25"
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => go(1)}
            aria-label="Next testimonial"
            className="p-2 rounded-full border border-stone/20 text-stone hover:bg-stone/10 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
