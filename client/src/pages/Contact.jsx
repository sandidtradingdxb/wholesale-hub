import { useState } from "react";
import { COMPANY } from "../config/company";

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
  const [form, setForm] = useState({ name: "", company: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // No backend endpoint wired up yet — this routes the message straight to WhatsApp
    // pre-filled, so it works out of the box. Swap for a POST to /api/contact later
    // if you want inquiries logged in the database instead.
    const text = encodeURIComponent(
      `New inquiry from ${form.name}${form.company ? ` (${form.company})` : ""}:\n${form.message}`
    );
    window.open(`https://wa.me/${COMPANY.phoneTel.replace("+", "")}?text=${text}`, "_blank");
    setSent(true);
  }

  if (sent) {
    return <p className="text-teal text-sm font-mono">Opened WhatsApp with your message — send it over there to finish.</p>;
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
        <label className="font-mono text-xs uppercase text-ink/50">Message</label>
        <textarea
          required
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full border border-ink/20 rounded px-3 py-2 mt-1 focus:border-copper outline-none"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-copper hover:bg-copper-light text-ink font-medium py-3 rounded transition"
      >
        Send via WhatsApp
      </button>
    </form>
  );
}
