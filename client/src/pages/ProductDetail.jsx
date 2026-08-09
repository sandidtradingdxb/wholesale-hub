import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function ProductDetail() {
  const { id } = useParams();
  const { user, isApproved } = useAuth();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => {
      setProduct(res.data.product);
      setQty(res.data.product.moq);
    });
  }, [id]);

  if (!product) return <div className="max-w-5xl mx-auto px-6 py-16 font-mono text-sm">Loading…</div>;

  const currentPrice = product.priceTiers
    ?.filter((t) => qty >= t.minQty && (!t.maxQty || qty <= t.maxQty))
    .sort((a, b) => b.minQty - a.minQty)[0]?.pricePerUnit;

  async function requestQuote() {
    setStatus("submitting");
    try {
      await api.post("/quotes", { items: [{ productId: product.id, quantity: qty }] });
      setStatus("success");
    } catch (err) {
      setStatus(err.response?.data?.message || "Failed to submit request");
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Image */}
      <div className="aspect-square bg-white border border-ink/10 flex items-center justify-center">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span className="font-mono text-xs text-ink/30">NO IMAGE</span>
        )}
      </div>

      {/* Details */}
      <div>
        <p className="font-mono text-xs text-ink/50">{product.sku}</p>
        <h1 className="font-display font-700 text-3xl mt-1">{product.name}</h1>
        {product.brand && <p className="text-ink/60 mt-1">{product.brand}</p>}
        <p className="mt-4 text-ink/80 leading-relaxed">{product.description}</p>

        {product.specs?.length > 0 && (
          <table className="w-full mt-6 text-sm font-mono">
            <tbody>
              {product.specs.map((s, i) => (
                <tr key={i} className="ledger-row">
                  <td className="py-1.5 text-ink/50">{s.label}</td>
                  <td className="py-1.5 text-right">{s.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="mt-8 border border-ink/15 rounded p-5">
          {product.pricingLocked ? (
            <div>
              <p className="font-mono text-sm text-copper mb-3">Pricing hidden</p>
              <p className="text-sm text-ink/70 mb-4">{product.priceHint}</p>
              {!user && (
                <div className="flex gap-3">
                  <Link to="/login" className="bg-ink text-paper px-4 py-2 rounded text-sm">Sign in</Link>
                  <Link to="/register" className="border border-ink/20 px-4 py-2 rounded text-sm">Apply for account</Link>
                </div>
              )}
              {user && !isApproved && (
                <p className="text-sm text-copper font-mono">Your account is pending admin approval.</p>
              )}
            </div>
          ) : (
            <>
              <p className="font-mono text-xs uppercase text-ink/50 mb-3">Bulk pricing</p>
              <table className="w-full text-sm font-mono mb-4">
                <tbody>
                  {product.priceTiers.map((t, i) => (
                    <tr key={i} className="ledger-row">
                      <td className="py-1.5">
                        {t.minQty}
                        {t.maxQty ? `–${t.maxQty}` : "+"} {product.unit}
                      </td>
                      <td className="py-1.5 text-right font-medium">AED {t.pricePerUnit.toFixed(2)} / unit</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className="font-mono text-xs text-ink/50 mb-2">
                MOQ {product.moq} {product.unit} · In stock: {product.stockQty}
              </p>

              <div className="flex items-center gap-3 mt-3">
                <label className="font-mono text-xs text-ink/50">Quantity</label>
                <input
                  type="number"
                  min={product.moq}
                  value={qty}
                  onChange={(e) => setQty(Math.max(product.moq, Number(e.target.value)))}
                  className="border border-ink/20 rounded px-3 py-2 w-28 font-mono text-sm"
                />
                {currentPrice && (
                  <span className="font-mono text-sm text-ink/70">
                    = AED {(currentPrice * qty).toLocaleString(undefined, { maximumFractionDigits: 2 })} total
                  </span>
                )}
              </div>

              <button
                onClick={requestQuote}
                disabled={status === "submitting"}
                className="mt-5 w-full bg-copper hover:bg-copper-light text-ink font-medium py-3 rounded transition disabled:opacity-50"
              >
                {status === "submitting" ? "Submitting…" : "Request quote / place order"}
              </button>

              {status === "success" && (
                <p className="text-teal text-sm mt-3 font-mono">
                  Request submitted — our team will confirm shortly.
                </p>
              )}
              {status && status !== "submitting" && status !== "success" && (
                <p className="text-copper text-sm mt-3 font-mono">{status}</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
