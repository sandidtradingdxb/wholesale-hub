import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import ProductCard from "../components/ProductCard";
import PaymentBadges from "../components/PaymentBadges";

const VERTICAL_INFO = [
  { slug: "mobile", label: "Mobile", desc: "Smartphones, cases, chargers, screen protectors" },
  { slug: "computer", label: "Computer", desc: "Laptops, desktops, peripherals, storage" },
  { slug: "camera", label: "Camera", desc: "Bodies, lenses, tripods, memory & bags" },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.get("/products?limit=8").then((res) => {
      setFeatured(res.data.products.filter((p) => p));
    });
  }, []);

  return (
    <div>
      {/* Hero: trade ledger strip */}
      <section className="bg-ink text-paper border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <p className="font-mono text-copper-light text-xs uppercase tracking-[0.2em] mb-4">
            B2B Wholesale · Est. buyers only
          </p>
          <h1 className="font-display font-700 text-4xl md:text-6xl leading-[1.05] max-w-3xl">
            Stock your shelves at trade prices.
          </h1>
          <p className="mt-6 max-w-xl text-paper/70 text-lg">
            Bulk pricing on mobile, computer, and camera gear — for retailers, repair shops,
            and resellers. Apply once, unlock tiered pricing across the whole catalog.
          </p>
          <div className="mt-8 flex gap-4">
            <Link to="/catalog" className="bg-copper hover:bg-copper-light text-ink font-medium px-6 py-3 rounded transition">
              Browse catalog
            </Link>
            <Link to="/register" className="border border-paper/30 hover:border-copper-light px-6 py-3 rounded transition">
              Apply for wholesale account
            </Link>
          </div>
        </div>

        {/* Ledger strip */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3">
            {VERTICAL_INFO.map((v, i) => (
              <Link
                key={v.slug}
                to={`/catalog?vertical=${v.slug}`}
                className={`px-6 py-6 hover:bg-white/5 transition ${
                  i > 0 ? "sm:border-l border-white/10" : ""
                }`}
              >
                <span className="font-mono text-xs text-copper-light">0{i + 1}</span>
                <h3 className="font-display font-600 text-xl mt-1">{v.label}</h3>
                <p className="text-sm text-paper/60 mt-1">{v.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-display font-600 text-2xl">Featured this week</h2>
          <Link to="/catalog" className="font-mono text-xs uppercase text-teal hover:text-copper transition">
            View full catalog →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* We accept */}
      <section className="border-t border-ink/10 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <p className="font-mono text-xs uppercase tracking-wide text-ink/50">We accept</p>
          <PaymentBadges />
        </div>
      </section>
    </div>
  );
}
