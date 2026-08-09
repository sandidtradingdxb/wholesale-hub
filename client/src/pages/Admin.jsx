import { useEffect, useState } from "react";
import api from "../api/client";

export default function Admin() {
  const [tab, setTab] = useState("pending");
  const [buyers, setBuyers] = useState([]);
  const [quotes, setQuotes] = useState([]);

  function loadBuyers(status) {
    api.get("/admin/buyers", { params: status !== "all" ? { status } : {} }).then((res) => setBuyers(res.data.buyers));
  }

  function loadQuotes() {
    api.get("/admin/quotes").then((res) => setQuotes(res.data.quotes));
  }

  useEffect(() => {
    if (tab === "quotes") loadQuotes();
    else loadBuyers(tab);
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

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="font-display font-700 text-3xl mb-6">Admin</h1>

      <div className="flex gap-1 border-b border-ink/10 mb-6 font-mono text-sm uppercase">
        {["pending", "approved", "rejected", "quotes"].map((t) => (
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

      {tab !== "quotes" ? (
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
      ) : (
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
      )}
    </div>
  );
}
