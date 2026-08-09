import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/client";
import ProductCard from "../components/ProductCard";

const VERTICALS = ["mobile", "computer", "camera"];

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const vertical = searchParams.get("vertical") || "";
  const kind = searchParams.get("kind") || "";
  const category = searchParams.get("category") || "";

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data.categories));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (vertical) params.vertical = vertical;
    if (kind) params.kind = kind;
    if (category) params.category = category;
    if (search) params.search = search;

    api.get("/products", { params }).then((res) => {
      setProducts(res.data.products);
      setLoading(false);
    });
  }, [vertical, kind, category, search]);

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key === "vertical") next.delete("category");
    setSearchParams(next);
  }

  const visibleCategories = categories.filter((c) => !vertical || c.vertical === vertical);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
      {/* Filters */}
      <aside className="space-y-6">
        <div>
          <input
            type="text"
            placeholder="Search SKU, brand, name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-ink/15 rounded px-3 py-2 text-sm font-mono focus:border-copper outline-none"
          />
        </div>

        <div>
          <h4 className="font-mono text-xs uppercase text-ink/50 mb-2">Vertical</h4>
          <ul className="space-y-1 text-sm">
            <li>
              <button
                onClick={() => updateParam("vertical", "")}
                className={`hover:text-copper ${!vertical ? "text-copper font-medium" : ""}`}
              >
                All
              </button>
            </li>
            {VERTICALS.map((v) => (
              <li key={v}>
                <button
                  onClick={() => updateParam("vertical", v)}
                  className={`capitalize hover:text-copper ${vertical === v ? "text-copper font-medium" : ""}`}
                >
                  {v}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-mono text-xs uppercase text-ink/50 mb-2">Type</h4>
          <ul className="space-y-1 text-sm">
            {["", "device", "accessory"].map((k) => (
              <li key={k}>
                <button
                  onClick={() => updateParam("kind", k)}
                  className={`capitalize hover:text-copper ${kind === k && k ? "text-copper font-medium" : ""}`}
                >
                  {k || "All"}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {visibleCategories.length > 0 && (
          <div>
            <h4 className="font-mono text-xs uppercase text-ink/50 mb-2">Category</h4>
            <ul className="space-y-1 text-sm">
              {visibleCategories.map((c) => (
                <li key={c._id}>
                  <button
                    onClick={() => updateParam("category", c._id)}
                    className={`hover:text-copper ${category === c._id ? "text-copper font-medium" : ""}`}
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>

      {/* Results */}
      <div>
        <div className="flex justify-between items-baseline mb-6">
          <h1 className="font-display font-600 text-2xl">
            {vertical ? vertical[0].toUpperCase() + vertical.slice(1) : "All"} catalog
          </h1>
          <span className="font-mono text-xs text-ink/50">{products.length} items</span>
        </div>

        {loading ? (
          <p className="font-mono text-sm text-ink/50">Loading…</p>
        ) : products.length === 0 ? (
          <p className="font-mono text-sm text-ink/50">No products match these filters.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
