import { useMemo, useState } from "react";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import { useLeadSubmit } from "../lib/useLeadSubmit";

function monthlyPayment(principal, annualRatePct, years) {
  const r = annualRatePct / 100 / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

const formatMoney = (n) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function MortgageCalculator() {
  const [price, setPrice] = useState(650000);
  const [downPct, setDownPct] = useState(20);
  const [rate, setRate] = useState(6.25);
  const [years, setYears] = useState(25);
  const [emailGate, setEmailGate] = useState(false);
  const [email, setEmail] = useState("");
  const { submit, status } = useLeadSubmit();

  const { downPayment, loanAmount, payment } = useMemo(() => {
    const dp = price * (downPct / 100);
    const loan = price - dp;
    return { downPayment: dp, loanAmount: loan, payment: monthlyPayment(loan, rate, years) };
  }, [price, downPct, rate, years]);

  const onEmailEstimate = async (e) => {
    e.preventDefault();
    await submit({
      fullName: email.split("@")[0] || "Website visitor",
      email,
      type: "General Inquiry",
      source: "mortgage-calculator",
      message: `Mortgage calculator estimate requested — price ${formatMoney(price)}, ${downPct}% down, ${rate}% rate, ${years}yr term. Estimated monthly payment ${formatMoney(payment)}.`,
    });
  };

  return (
    <div className="rounded-2xl bg-cream/95 backdrop-blur-sm shadow-xl shadow-ink/10 border border-ink/10 p-6 sm:p-8 w-full max-w-md">
      <p className="text-xs uppercase tracking-wider text-sage-dark font-medium mb-1">Try it now</p>
      <h3 className="font-display text-2xl text-ink mb-6">What could you afford?</h3>

      <div className="space-y-5">
        <Slider label="Home price" value={price} min={150000} max={2000000} step={5000} format={formatMoney} onChange={setPrice} />
        <Slider label="Down payment" value={downPct} min={5} max={50} step={1} format={(v) => `${v}%`} onChange={setDownPct} />
        <Slider label="Interest rate" value={rate} min={2} max={10} step={0.05} format={(v) => `${v.toFixed(2)}%`} onChange={setRate} />
        <Slider label="Term" value={years} min={10} max={30} step={5} format={(v) => `${v} yrs`} onChange={setYears} />
      </div>

      <div className="mt-6 pt-6 border-t border-ink/10">
        <p className="text-sm text-slate">Estimated monthly payment</p>
        <p className="font-display num text-4xl text-ink mt-1">
          {formatMoney(payment)}
          <span className="text-base text-slate font-body">/mo</span>
        </p>
        <div className="flex gap-4 mt-3 text-xs text-slate">
          <span>Down: <span className="num">{formatMoney(downPayment)}</span></span>
          <span>Loan: <span className="num">{formatMoney(loanAmount)}</span></span>
        </div>
      </div>

      {status === "success" ? (
        <div className="mt-5 flex items-center gap-2 text-sage-dark text-sm">
          <CheckCircle2 size={18} />
          Sent — check your inbox shortly.
        </div>
      ) : emailGate ? (
        <form onSubmit={onEmailEstimate} className="mt-5 flex gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="flex-1 rounded-full border border-ink/15 bg-stone px-4 py-2.5 text-sm text-ink placeholder:text-slate/60 focus:border-clay outline-none"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-full bg-clay px-4 py-2.5 text-cream disabled:opacity-60"
            aria-label="Email me this estimate"
          >
            {status === "loading" ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
          </button>
        </form>
      ) : (
        <button
          onClick={() => setEmailGate(true)}
          className="mt-5 w-full rounded-full border border-ink/20 px-5 py-2.5 text-sm font-medium text-ink hover:bg-ink hover:text-cream transition-colors"
        >
          Email me this estimate
        </button>
      )}
    </div>
  );
}

function Slider({ label, value, min, max, step, format, onChange }) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1.5">
        <label className="text-sm text-slate">{label}</label>
        <span className="num text-sm text-ink font-medium">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full bg-ink/10 accent-clay cursor-pointer"
      />
    </div>
  );
}
