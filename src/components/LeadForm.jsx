import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useLeadSubmit } from "../lib/useLeadSubmit";

/**
 * Reusable lead form. Pass `type` to control the FUB event type
 * ("General Inquiry" | "Property Inquiry" | "Seller Inquiry" | "Registration").
 */
export default function LeadForm({
  type = "General Inquiry",
  source = "website-form",
  submitLabel = "Send message",
  showMessage = true,
  compact = false,
}) {
  const { submit, status, error, reset } = useLeadSubmit();
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", message: "" });

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    const ok = await submit({ ...form, type, source });
    if (ok) setForm({ fullName: "", email: "", phone: "", message: "" });
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <CheckCircle2 className="text-sage-dark" size={36} />
        <p className="font-display text-xl text-ink">Got it — thank you.</p>
        <p className="text-sm text-slate max-w-xs">
          {siteConfigMessage()} I'll be in touch shortly.
        </p>
        <button
          onClick={reset}
          className="mt-2 text-sm text-clay underline underline-offset-2 hover:text-clay-dark"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={`grid gap-4 ${compact ? "" : "sm:grid-cols-2"}`}>
      <div className={compact ? "" : "sm:col-span-2"}>
        <label htmlFor="fullName" className="sr-only">
          Full name
        </label>
        <input
          id="fullName"
          name="fullName"
          required
          value={form.fullName}
          onChange={onChange}
          placeholder="Full name"
          className="w-full rounded-lg border border-ink/15 bg-cream px-4 py-3 text-ink placeholder:text-slate/60 focus:border-clay outline-none transition-colors"
        />
      </div>

      <div>
        <label htmlFor="email" className="sr-only">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
          placeholder="Email"
          className="w-full rounded-lg border border-ink/15 bg-cream px-4 py-3 text-ink placeholder:text-slate/60 focus:border-clay outline-none transition-colors"
        />
      </div>

      <div>
        <label htmlFor="phone" className="sr-only">
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={onChange}
          placeholder="Phone"
          className="w-full rounded-lg border border-ink/15 bg-cream px-4 py-3 text-ink placeholder:text-slate/60 focus:border-clay outline-none transition-colors"
        />
      </div>

      {showMessage && (
        <div className={compact ? "" : "sm:col-span-2"}>
          <label htmlFor="message" className="sr-only">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={3}
            value={form.message}
            onChange={onChange}
            placeholder="What are you looking for?"
            className="w-full rounded-lg border border-ink/15 bg-cream px-4 py-3 text-ink placeholder:text-slate/60 focus:border-clay outline-none transition-colors resize-none"
          />
        </div>
      )}

      <p className={`text-xs text-slate/70 ${compact ? "" : "sm:col-span-2"}`}>
        Provide either an email or phone number so I can follow up.
      </p>

      {error && (
        <p className={`text-sm text-clay-dark ${compact ? "" : "sm:col-span-2"}`} role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className={`inline-flex items-center justify-center gap-2 rounded-full bg-clay px-6 py-3 font-medium text-cream hover:bg-clay-dark transition-colors disabled:opacity-60 ${
          compact ? "" : "sm:col-span-2"
        }`}
      >
        {status === "loading" && <Loader2 size={18} className="animate-spin" />}
        {status === "loading" ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}

function siteConfigMessage() {
  return "I read every message myself.";
}
