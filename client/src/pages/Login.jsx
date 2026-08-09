import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/catalog");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="font-display font-700 text-3xl mb-2">Sign in</h1>
      <p className="text-ink/60 mb-8">Access your wholesale account and pricing.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-mono text-xs uppercase text-ink/50">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-ink/20 rounded px-3 py-2 mt-1 focus:border-copper outline-none"
          />
        </div>
        <div>
          <label className="font-mono text-xs uppercase text-ink/50">Password</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border border-ink/20 rounded px-3 py-2 mt-1 focus:border-copper outline-none"
          />
        </div>

        {error && <p className="text-copper text-sm font-mono">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ink text-paper font-medium py-3 rounded hover:bg-slate-850 transition disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="text-sm text-ink/60 mt-6">
        No account yet?{" "}
        <Link to="/register" className="text-copper hover:underline">
          Apply for a wholesale account
        </Link>
      </p>
    </div>
  );
}
