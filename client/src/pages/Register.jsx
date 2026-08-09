import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const initial = {
  fullName: "",
  email: "",
  password: "",
  phone: "",
  businessName: "",
  businessType: "retailer",
  taxId: "",
};

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(form);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center">
        <h1 className="font-display font-700 text-2xl mb-3">Application received</h1>
        <p className="text-ink/70 mb-6">
          Thanks — your business account is pending review. We'll email you once it's approved
          and wholesale pricing unlocks automatically.
        </p>
        <button onClick={() => navigate("/catalog")} className="text-copper hover:underline font-mono text-sm">
          Browse the catalog meanwhile →
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-16">
      <h1 className="font-display font-700 text-3xl mb-2">Apply for a wholesale account</h1>
      <p className="text-ink/60 mb-8">
        We review every application to keep pricing exclusive to genuine trade buyers.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Full name" value={form.fullName} onChange={(v) => update("fullName", v)} required />
        <Field label="Email" type="email" value={form.email} onChange={(v) => update("email", v)} required />
        <Field label="Password" type="password" value={form.password} onChange={(v) => update("password", v)} required />
        <Field label="Phone" value={form.phone} onChange={(v) => update("phone", v)} required />
        <Field label="Business name" value={form.businessName} onChange={(v) => update("businessName", v)} required />

        <div>
          <label className="font-mono text-xs uppercase text-ink/50">Business type</label>
          <select
            value={form.businessType}
            onChange={(e) => update("businessType", e.target.value)}
            className="w-full border border-ink/20 rounded px-3 py-2 mt-1 focus:border-copper outline-none bg-white"
          >
            <option value="retailer">Retailer</option>
            <option value="distributor">Distributor</option>
            <option value="repair_shop">Repair shop</option>
            <option value="reseller">Reseller</option>
            <option value="other">Other</option>
          </select>
        </div>

        <Field label="Tax / business registration ID (optional)" value={form.taxId} onChange={(v) => update("taxId", v)} />

        {error && <p className="text-copper text-sm font-mono">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-copper hover:bg-copper-light text-ink font-medium py-3 rounded transition disabled:opacity-50"
        >
          {loading ? "Submitting…" : "Submit application"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required = false }) {
  return (
    <div>
      <label className="font-mono text-xs uppercase text-ink/50">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-ink/20 rounded px-3 py-2 mt-1 focus:border-copper outline-none"
      />
    </div>
  );
}
