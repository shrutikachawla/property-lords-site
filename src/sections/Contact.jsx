import { Phone, Mail, MapPin } from "lucide-react";
import { siteConfig } from "../data/siteConfig";
import LeadForm from "../components/LeadForm";

export default function Contact() {
  return (
    <section id="contact" className="bg-cream py-24">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-[0.8fr_1.2fr] gap-12">
        <div>
          <p className="text-clay text-sm font-medium tracking-wide uppercase mb-3">Contact</p>
          <h2 className="font-display text-4xl text-ink leading-tight">Let's talk about your move.</h2>
          <p className="mt-4 text-slate">
            Tell me a bit about what you're after — buying, selling, or just curious about the
            market. I personally read and respond to every message.
          </p>

          <div className="mt-8 space-y-4">
            <a href={`tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`} className="flex items-center gap-3 text-ink hover:text-clay transition-colors">
              <Phone size={18} className="text-sage-dark" />
              {siteConfig.phone}
            </a>
            <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-3 text-ink hover:text-clay transition-colors">
              <Mail size={18} className="text-sage-dark" />
              {siteConfig.email}
            </a>
            <div className="flex items-center gap-3 text-ink">
              <MapPin size={18} className="text-sage-dark" />
              Serving {siteConfig.areasServed.join(", ")}
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-stone border border-ink/10 p-6 sm:p-8">
          <LeadForm type="General Inquiry" source="contact-section" submitLabel="Send message" />
        </div>
      </div>
    </section>
  );
}
