import { BedDouble, Bath, Ruler } from "lucide-react";

const statusStyles = {
  active: "bg-sage-dark text-cream",
  pending: "bg-clay text-cream",
  sold: "bg-ink/70 text-cream",
};

const statusLabel = {
  active: "Active",
  pending: "Pending",
  sold: "Sold",
};

const formatMoney = (n) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function ListingCard({ listing }) {
  const { address, city, price, beds, baths, sqft, image, status = "active" } = listing;

  return (
    <article className="group rounded-2xl overflow-hidden bg-cream border border-ink/10 hover:shadow-lg hover:shadow-ink/10 transition-shadow">
      <div className="relative aspect-[4/3] bg-stone-dim overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={address}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate/40 text-sm">
            Photo coming soon
          </div>
        )}
        <span
          className={`absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[status]}`}
        >
          {statusLabel[status]}
        </span>
      </div>

      <div className="p-5">
        <p className="font-display num text-2xl text-ink">{formatMoney(price)}</p>
        <p className="mt-1 text-ink font-medium">{address}</p>
        <p className="text-sm text-slate">{city}</p>

        <div className="flex gap-4 mt-3 pt-3 border-t border-ink/10 text-sm text-slate">
          <span className="flex items-center gap-1.5">
            <BedDouble size={15} /> {beds}
          </span>
          <span className="flex items-center gap-1.5">
            <Bath size={15} /> {baths}
          </span>
          <span className="flex items-center gap-1.5">
            <Ruler size={15} /> {sqft.toLocaleString()} sqft
          </span>
        </div>
      </div>
    </article>
  );
}
