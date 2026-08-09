import { Link } from "react-router-dom";
import { COMPANY } from "../config/company";

const PILLARS = [
  {
    num: "01",
    title: "Three verticals, one supplier",
    body: "Mobile, computer, and camera gear under one account — so buyers stocking multi-category shelves don't need three different vendors, three MOQs, or three shipping schedules.",
  },
  {
    num: "02",
    title: "Trade-only pricing",
    body: "Every account is reviewed before it sees a price. That keeps our tiered bulk rates genuinely competitive for the retailers, repair shops, and resellers we work with.",
  },
  {
    num: "03",
    title: "Built for reorders",
    body: "SKU-based catalog, clear MOQs, and quantity break pricing on every listing, so repeat ordering is fast once your account is approved.",
  },
];

export default function About() {
  return (
    <div>
      {/* Intro */}
      <section className="bg-ink text-paper border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <p className="font-mono text-copper-light text-xs uppercase tracking-[0.2em] mb-4">About us</p>
          <h1 className="font-display font-700 text-4xl md:text-5xl leading-[1.1] max-w-2xl">
            A Dubai-based wholesale supplier for mobile, computer &amp; camera trade.
          </h1>
          <p className="mt-6 max-w-xl text-paper/70 text-lg">
            We supply retailers, repair shops, and resellers across the region with bulk
            stock and trade pricing — from handsets and laptops to the accessories that
            move alongside them.
          </p>
        </div>
      </section>

      {/* Pillars */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {PILLARS.map((p) => (
            <div key={p.num}>
              <span className="font-mono text-xs text-copper">{p.num}</span>
              <h3 className="font-display font-600 text-lg mt-2 mb-2">{p.title}</h3>
              <p className="text-sm text-ink/70 leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Location / visit */}
      <section className="border-t border-ink/10 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="font-display font-600 text-2xl mb-4">Visit or reach us</h2>
            <p className="text-ink/70 leading-relaxed mb-6">
              Our team is based at Al Mizhar First, Aswaaq Mall in Dubai, and takes trade
              inquiries by phone and WhatsApp. Approved buyers can also request quotes
              directly through the catalog.
            </p>
            <dl className="space-y-4 font-mono text-sm">
              <div>
                <dt className="text-ink/50 uppercase text-xs mb-1">Address</dt>
                <dd>{COMPANY.addressLine1}</dd>
                <dd>{COMPANY.city}, {COMPANY.country}</dd>
              </div>
              <div>
                <dt className="text-ink/50 uppercase text-xs mb-1">Phone / WhatsApp</dt>
                <dd>
                  <a href={`tel:${COMPANY.phoneTel}`} className="hover:text-copper transition">
                    {COMPANY.phoneDisplay}
                  </a>
                </dd>
              </div>
            </dl>
            <Link
              to="/contact"
              className="inline-block mt-6 bg-copper hover:bg-copper-light text-ink font-medium px-5 py-3 rounded transition"
            >
              Get in touch
            </Link>
          </div>

          <div className="border border-ink/10 rounded p-6">
            <p className="font-mono text-xs uppercase text-ink/50 mb-4">How to get trade pricing</p>
            <ol className="space-y-4 text-sm">
              <li className="flex gap-3">
                <span className="font-mono text-copper">1</span>
                <span>
                  <Link to="/register" className="text-copper hover:underline">Apply for an account</Link>{" "}
                  with your business details.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-copper">2</span>
                <span>Our team reviews the application, usually within one business day.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-copper">3</span>
                <span>Once approved, bulk pricing and MOQs unlock across the full catalog.</span>
              </li>
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
}
