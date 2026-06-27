import { useState } from "react";
import { BellRing, Loader2, CheckCircle2 } from "lucide-react";
import { listings } from "../data/listings";
import { siteConfig } from "../data/siteConfig";
import ListingCard from "../components/ListingCard";
import { useLeadSubmit } from "../lib/useLeadSubmit";

function NotifyMeForm() {
  const { submit, status } = useLeadSubmit();
  const [form, setForm] = useState({ fullName: "", email: "", criteria: "" });

  const onSubmit = async (e) => {
    e.preventDefault();
    await submit({
      fullName: form.fullName,
      email: form.email,
      type: "Registration",
      source: "listing-alerts",
      message: `Wants to be notified of new listings. Criteria: ${form.criteria || "not specified"}`,
    });
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-2 text-center py-4">
        <CheckCircle2 className="text-sage-dark" size={28} />
        <p className="text-ink font-medium">You're on the list — I'll reach out the moment something fits.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
      <input
        required
        placeholder="Full name"
        value={form.fullName}
        onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
        className="rounded-lg border border-ink/15 bg-cream px-4 py-3 text-ink placeholder:text-slate/60 focus:border-clay outline-none"
      />
      <input
        required
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        className="rounded-lg border border-ink/15 bg-cream px-4 py-3 text-ink placeholder:text-slate/60 focus:border-clay outline-none"
      />
      <input
        placeholder="What are you looking for? (optional)"
        value={form.criteria}
        onChange={(e) => setForm((f) => ({ ...f, criteria: e.target.value }))}
        className="rounded-lg border border-ink/15 bg-cream px-4 py-3 text-ink placeholder:text-slate/60 focus:border-clay outline-none"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="sm:col-span-3 inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 font-medium text-cream hover:bg-clay transition-colors disabled:opacity-60"
      >
        {status === "loading" ? <Loader2 size={18} className="animate-spin" /> : <BellRing size={18} />}
        Notify me about new listings
      </button>
    </form>
  );
}

export default function Listings() {
  const hasListings = siteConfig.listingsEnabled && listings.length > 0;

  return (
    <section id="listings" className="bg-cream py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-xl">
          <p className="text-clay text-sm font-medium tracking-wide uppercase mb-3">Listings</p>
          <h2 className="font-display text-4xl text-ink">
            {hasListings ? "Available now" : "Listings are on their way"}
          </h2>
        </div>

        {hasListings ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl bg-stone border border-ink/10 p-10 text-center">
            <p className="text-slate max-w-md mx-auto">
              I'm actively listing properties — this section will fill in soon. In the meantime,
              tell me what you're after and I'll personally reach out as soon as a match comes
              up.
            </p>
            <div className="mt-8">
              <NotifyMeForm />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
