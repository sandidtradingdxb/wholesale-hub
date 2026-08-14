import { useEffect, useState } from "react";
import api from "../api/client";

const emptyForm = {
  sku: "",
  name: "",
  brand: "",
  category: "",
  description: "",
  images: "",
  moq: 1,
  unit: "pcs",
  stockQty: 0,
  priceTiers: [{ minQty: 1, maxQty: "", pricePerUnit: "" }],
};

export default function Admin() {
  const [tab, setTab] = useState("pending");
  const [buyers, setBuyers] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  function loadBuyers(status) {
    api.get("/admin/buyers", { params: status !== "all" ? { status } : {} }).then((res) => setBuyers(res.data.buyers));
  }

  function loadQuotes() {
    api.get("/admin/quotes").then((res) => setQuotes(res.data.quotes));
  }

  function loadProducts() {
    api.get("/products", { params: { limit: 100 } }).then((res) => setProducts(res.data.products));
  }

  function loadCategories() {
    api.get("/categories").then((res) => setCategories(res.data.categories));
  }

  useEffect(() => {
    if (tab === "quotes") loadQuotes();
    else if (tab === "products") {
      loadProducts();
      loadCategories();
    } else loadBuyers(tab);
  }, [tab]);

  async function approve(id) {
    await api.put(`/admin/buyers/${id}/approve`, { pricingTier: "standard" });
    loadBuyers(tab);
  }

  async function reject(id) {
    const reason = prompt("Reason for rejection (optional):") || "";
    await api.put(`/admin/buyers/${id}/reject`, { reason });
    loadBuyers(tab);
  }

  function updateTier(index, field, value) {
    setForm((f) => {
      const priceTiers = [...f.priceTiers];
      priceTiers[index] = { ...priceTiers[index], [field]: value };
      return { ...f, priceTiers };
    });
  }

  function addTier() {
    setForm((f) => ({
      ...f,
      priceTiers: [...f.priceTiers, { minQty: "", maxQty: "", pricePerUnit: "" }],
    }));
  }

  function removeTier(index) {
    setForm((f) => ({ ...f, priceTiers: f.priceTiers.filter((_, i) => i !== index) }));
  }

  function startEdit(p) {
    setEditingId(p.id);
    setForm({
      sku: p.sku,
      name: p.name,
      brand: p.brand || "",
      category: p.category?._id || p.category || "",
      description: p.description || "",
      images: (p.images || []).join(", "),
      moq: p.moq,
      unit: p.unit,
      stockQty: p.stockQty ?? 0,
      priceTiers: (p.priceTiers && p.priceTiers.length > 0
        ? p.priceTiers
        : [{ minQty: 1, maxQty: "", pricePerUnit: "" }]
      ).map((t) => ({ minQty: t.minQty, maxQty: t.maxQty ?? "", pricePerUnit: t.pricePerUnit })),
    });
    setFormError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
  }

  async function saveProduct(e) {
    e.preventDefault();
    setFormError("");

    if (!form.sku || !form.name || !form.category) {
      setFormError("SKU, name, and category are required.");
      return;
    }
    if (form.priceTiers.length === 0 || form.priceTiers.some((t) => !t.minQty || !t.pricePerUnit)) {
      setFormError("Every price tier needs at least a minimum quantity and a price per unit (AED).");
      return;
    }

    const payload = {
      sku: form.sku,
      name: form.name,
      brand: form.brand,
      category: form.category,
      description: form.description,
      images: form.images
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      moq: Number(form.moq) || 1,
      unit: form.unit,
      stockQty: Number(form.stockQty) || 0,
      priceTiers: form.priceTiers.map((t) => ({
        minQty: Number(t.minQty),
        ...(t.maxQty !== "" && t.maxQty != null ? { maxQty: Number(t.maxQty) } : {}),
        pricePerUnit: Number(t.pricePerUnit),
      })),
    };

    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post("/products", payload);
      }
      cancelEdit();
      loadProducts();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(id) {
    if (!confirm("Remove this product from the catalog?")) return;
    await api.delete(`/products/${id}`);
    loadProducts();
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="font-display font-700 text-3xl mb-6">Admin</h1>

      <div className="flex gap-1 border-b border-ink/10 mb-6 font-mono text-sm uppercase">
        {["pending", "approved", "rejected", "quotes", "products"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 border-b-2 transition ${
              tab === t ? "border-copper text-copper" : "border-transparent text-ink/50 hover:text-ink"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "quotes" ? (
        <div className="space-y-3">
          {quotes.length === 0 && <p className="font-mono text-sm text-ink/50">No quote requests yet.</p>}
          {quotes.map((q) => (
            <div key={q._id} className="border border-ink/10 rounded p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">{q.buyer?.businessName}</p>
                  <p className="text-xs text-ink/50 font-mono">{new Date(q.createdAt).toLocaleString()}</p>
                </div>
                <span className="font-mono text-xs uppercase text-copper">{q.status}</span>
              </div>
              <table className="w-full text-sm font-mono mt-2">
                <tbody>
                  {q.items.map((it, i) => (
                    <tr key={i} className="ledger-row">
                      <td className="py-1">{it.productName} ({it.sku})</td>
                      <td className="py-1 text-right">{it.quantity} × AED {it.unitPriceAtRequest?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-right font-mono text-sm mt-2 font-medium">
                Est. total: AED {q.estimatedTotal?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
            </div>
          ))}
        </div>
      ) : tab === "products" ? (
        <div className="space-y-8">
          <form onSubmit={saveProduct} className="border border-ink/10 rounded p-5 space-y-4">
            <h2 className="font-display font-700 text-lg">
              {editingId ? "Edit product" : "Add a new product"}
            </h2>

            {formError && (
              <p className="text-sm bg-red-50 text-red-700 border border-red-200 rounded px-3 py-2">{formError}</p>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-ink/50 mb-1">SKU *</label>
                <input
                  className="w-full border border-ink/20 rounded px-3 py-2 text-sm"
                  value={form.sku}
                  onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
                  placeholder="MOB-1003"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-ink/50 mb-1">Name *</label>
                <input
                  className="w-full border border-ink/20 rounded px-3 py-2 text-sm"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Product name shown to buyers"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-ink/50 mb-1">Brand</label>
                <input
                  className="w-full border border-ink/20 rounded px-3 py-2 text-sm"
                  value={form.brand}
                  onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-ink/50 mb-1">Category *</label>
                <select
                  className="w-full border border-ink/20 rounded px-3 py-2 text-sm bg-white"
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                >
                  <option value="">Select a category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-ink/50 mb-1">MOQ</label>
                <input
                  type="number"
                  min="1"
                  className="w-full border border-ink/20 rounded px-3 py-2 text-sm"
                  value={form.moq}
                  onChange={(e) => setForm((f) => ({ ...f, moq: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-ink/50 mb-1">Unit</label>
                <input
                  className="w-full border border-ink/20 rounded px-3 py-2 text-sm"
                  value={form.unit}
                  onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
                  placeholder="pcs, box, carton..."
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-ink/50 mb-1">Stock quantity</label>
                <input
                  type="number"
                  min="0"
                  className="w-full border border-ink/20 rounded px-3 py-2 text-sm"
                  value={form.stockQty}
                  onChange={(e) => setForm((f) => ({ ...f, stockQty: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-ink/50 mb-1">Description</label>
              <textarea
                className="w-full border border-ink/20 rounded px-3 py-2 text-sm"
                rows={2}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-ink/50 mb-1">
                Photo URL(s) — comma-separated
              </label>
              <input
                className="w-full border border-ink/20 rounded px-3 py-2 text-sm"
                value={form.images}
                onChange={(e) => setForm((f) => ({ ...f, images: e.target.value }))}
                placeholder="https://example.com/photo.jpg"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-ink/50 mb-2">
                Bulk price tiers (AED per unit) *
              </label>
              <div className="space-y-2">
                {form.priceTiers.map((t, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      placeholder="Min qty"
                      className="w-24 border border-ink/20 rounded px-2 py-1.5 text-sm"
                      value={t.minQty}
                      onChange={(e) => updateTier(i, "minQty", e.target.value)}
                    />
                    <span className="text-ink/40 text-sm">to</span>
                    <input
                      type="number"
                      min="1"
                      placeholder="Max qty (blank = and up)"
                      className="w-40 border border-ink/20 rounded px-2 py-1.5 text-sm"
                      value={t.maxQty}
                      onChange={(e) => updateTier(i, "maxQty", e.target.value)}
                    />
                    <span className="text-ink/40 text-sm">AED</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Price/unit"
                      className="w-28 border border-ink/20 rounded px-2 py-1.5 text-sm"
                      value={t.pricePerUnit}
                      onChange={(e) => updateTier(i, "pricePerUnit", e.target.value)}
                    />
                    {form.priceTiers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTier(i)}
                        className="text-ink/40 hover:text-copper text-sm px-2"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addTier}
                className="mt-2 text-sm text-copper hover:underline"
              >
                + Add another price tier
              </button>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-teal text-white px-5 py-2 rounded text-sm hover:opacity-90 disabled:opacity-50"
              >
                {saving ? "Saving..." : editingId ? "Save changes" : "Add product"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="border border-ink/20 px-5 py-2 rounded text-sm hover:border-copper"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div>
            <h2 className="font-display font-700 text-lg mb-3">Current catalog ({products.length})</h2>
            <div className="space-y-2">
              {products.length === 0 && <p className="font-mono text-sm text-ink/50">No products yet.</p>}
              {products.map((p) => (
                <div
                  key={p.id}
                  className="border border-ink/10 rounded p-3 flex items-center gap-4"
                >
                  {p.images?.[0] && (
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-14 h-14 object-cover rounded flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{p.name}</p>
                    <p className="text-xs text-ink/50 font-mono">
                      {p.sku} · {p.category?.name || "Uncategorized"} · MOQ {p.moq} {p.unit}
                    </p>
                    {p.priceTiers?.[0] && (
                      <p className="text-xs text-ink/50 font-mono">
                        from AED {Math.min(...p.priceTiers.map((t) => t.pricePerUnit)).toFixed(2)}/{p.unit}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => startEdit(p)}
                      className="text-sm px-3 py-1.5 border border-ink/20 rounded hover:border-copper"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="text-sm px-3 py-1.5 border border-ink/20 rounded hover:border-red-400 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {buyers.length === 0 && <p className="font-mono text-sm text-ink/50">No buyers in this state.</p>}
          {buyers.map((b) => (
            <div key={b._id} className="border border-ink/10 rounded p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{b.businessName}</p>
                <p className="text-sm text-ink/60">
                  {b.fullName} · {b.email} · {b.businessType}
                </p>
                {b.taxId && <p className="text-xs font-mono text-ink/40">Tax ID: {b.taxId}</p>}
              </div>
              {tab === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => approve(b._id)}
                    className="bg-teal text-white px-4 py-2 rounded text-sm hover:opacity-90"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => reject(b._id)}
                    className="border border-ink/20 px-4 py-2 rounded text-sm hover:border-copper"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
