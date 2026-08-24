import { useState } from "react";
import { COMPANY } from "../config/company";
import api from "../api/client";

export default function Contact() {
  const [copied, setCopied] = useState(false);

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
      <div>
        <p className="font-mono text-xs uppercase text-copper tracking-widest mb-3">Get in touch</p>
        <h1 className="font-display font-700 text-3xl mb-6">Talk to our trade desk</h1>
        <p className="text-ink/70 leading-relaxed mb-8">
          For bulk orders, custom quotes, or account approval questions, reach us directly —
          our team responds fastest over WhatsApp during UAE business hours.
        </p>

        <dl className="space-y-5 font-mono text-sm">
          <div>
            <dt className="text-ink/50 uppercase text-xs mb-1">Address</dt>
            <dd>{COMPANY.addressLine1}</dd>
            <dd>{COMPANY.city}, {COMPANY.country}</dd>
          </div>
          <div>
            <dt className="text-ink/50 uppercase text-xs mb-1">Phone</dt>
            <dd>
              <a href={`tel:${COMPANY.phoneTel}`} className="hover:text-copper transition">
                {COMPANY.phoneDisplay}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-ink/50 uppercase text-xs mb-1">WhatsApp</dt>
            <dd>
              <a
                href={`https://wa.me/${COMPANY.phoneTel.replace("+", "")}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-copper transition"
              >
                Chat with the trade desk →
              </a>
            </dd>
          </div>
        </dl>

        <button
          onClick={() => {
            navigator.clipboard.writeText(COMPANY.phoneTel);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="mt-8 border border-ink/20 hover:border-copper px-4 py-2 rounded text-sm transition"
        >
          {copied ? "Copied!" : "Copy phone number"}
        </button>
      </div>

      <div className="bg-white border border-ink/10 p-6 rounded">
        <p className="font-mono text-xs uppercase text-ink/50 mb-4">Quick inquiry</p>
        <ContactForm />
      </div>
    </div>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name: "", company: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSending(true);
    try {
      await api.post("/contact", form);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't send your message — please try WhatsApp instead.");
    } finally {
      setSending(false);
    }
  }

  function openWhatsApp() {
    const text = encodeURIComponent(
      `New inquiry from ${form.name}${form.company ? ` (${form.company})` : ""}:\n${form.message}`
    );
    window.open(`https://wa.me/${COMPANY.phoneTel.replace("+", "")}?text=${text}`, "_blank");
  }

  if (sent) {
    return (
      <p className="text-teal text-sm font-mono">
        Thanks — your message has been sent. We'll be in touch soon.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="font-mono text-xs uppercase text-ink/50">Name</label>
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border border-ink/20 rounded px-3 py-2 mt-1 focus:border-copper outline-none"
        />
      </div>
      <div>
        <label className="font-mono text-xs uppercase text-ink/50">Company (optional)</label>
        <input
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          className="w-full border border-ink/20 rounded px-3 py-2 mt-1 focus:border-copper outline-none"
        />
      </div>
      <div>
        <label className="font-mono text-xs uppercase text-ink/50">Email (optional)</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-ink/20 rounded px-3 py-2 mt-1 focus:border-copper outline-none"
        />
      </div>
      <div>
        <label className="font-mono text-xs uppercase text-ink/50">Message</label>
        <textarea
          required
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full border border-ink/20 rounded px-3 py-2 mt-1 focus:border-copper outline-none"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={sending}
        className="w-full bg-copper hover:bg-copper-light text-ink font-medium py-3 rounded transition disabled:opacity-50"
      >
        {sending ? "Sending..." : "Send message"}
      </button>

      <button
        type="button"
        onClick={openWhatsApp}
        className="w-full border border-ink/20 hover:border-copper py-2.5 rounded text-sm transition"
      >
        Or send via WhatsApp instead
      </button>
    </form>
  );
}
