import { Link } from "react-router-dom";
import { COMPANY } from "../config/company";

const SECTIONS = [
  {
    title: "1. About this site",
    body: `${COMPANY.name} maintains the https://www.trinity-plus-trading.com/ website (the "Site"). By registering for an account, browsing the catalog, or placing an order through the Site, you agree to be bound by these Terms & Conditions.`,
  },
  {
    title: "2. Governing law",
    body: "The United Arab of Emirates is our country of domicile, and these terms are governed by local UAE law. Any purchase, dispute, or claim arising out of or in connection with this website shall be governed and construed in accordance with the laws of the UAE.",
  },
  {
    title: "3. Trade accounts only",
    body: `This platform is intended for verified business buyers only — retailers, repair shops, resellers, and other trade customers. Pricing, minimum order quantities (MOQs), and catalog access are only unlocked after ${COMPANY.name} reviews and approves an account application. We reserve the right to decline or revoke access to any account at our discretion.`,
  },
  {
    title: "4. Accepted payment methods",
    body: "Visa or MasterCard debit and credit cards in AED will be accepted for payment. Additional trade payment terms may be confirmed separately with your account manager for approved wholesale accounts.",
  },
  {
    title: "5. Pricing and currency",
    body: "The displayed price and currency at the checkout page will be the same price and currency printed on the transaction receipt, and the amount charged to the card will be shown in your card currency. Prices are tiered by quantity and are subject to change without prior notice, including due to supplier cost changes, currency fluctuation, or stock availability.",
  },
  {
    title: "6. Sanctioned countries",
    body: "We will not trade with or provide any services to OFAC and sanctioned countries.",
  },
  {
    title: "7. Age restriction",
    body: "Customers using the website who are minors / under the age of 18 shall not register as a User of the website and shall not transact on or use the website.",
  },
  {
    title: "8. Transaction records",
    body: `Cardholders must retain a copy of transaction records and ${COMPANY.name}'s website policies and rules.`,
  },
  {
    title: "9. Account responsibility",
    body: "The User is responsible for maintaining the confidentiality of their account, including login credentials. Notify us promptly if you suspect unauthorized access to your account.",
  },
  {
    title: "10. Orders and minimum quantities",
    body: "Each product listing specifies its MOQ and unit of sale (pcs, carton, pack, etc.). Orders below the stated MOQ may be declined or adjusted. We reserve the right to limit order quantities based on stock availability.",
  },
  {
    title: "11. Shipping and delivery",
    body: "Delivery timelines communicated at checkout or by our sales team are estimates only and are not guaranteed. Risk of loss or damage passes to the buyer upon dispatch from our warehouse, unless otherwise agreed.",
  },
  {
    title: "12. Product condition and warranty",
    body: "Unless a listing states otherwise, products are supplied new and sealed. Any manufacturer warranty is passed through to the buyer as provided by the manufacturer; we do not offer additional warranty coverage beyond what is stated on the product listing.",
  },
  {
    title: "13. Returns and disputes",
    body: "Returns for defective or incorrectly shipped items must be reported within 48 hours of delivery, with photos or other evidence where applicable. Bulk and made-to-order items may not be eligible for return. We will work in good faith to resolve any discrepancy in an order.",
  },
  {
    title: "14. Changes to these terms",
    body: `${COMPANY.name} may update these Terms & Conditions from time to time. Continued use of this platform after changes are posted constitutes acceptance of the updated terms.`,
  },
  {
    title: "15. Contact",
    body: "Questions about these terms can be directed to our team via the contact page, phone, or WhatsApp.",
  },
];

export default function Terms() {
  return (
    <div>
      {/* Intro */}
      <section className="bg-ink text-paper border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <p className="font-mono text-copper-light text-xs uppercase tracking-[0.2em] mb-4">
            Legal
          </p>
          <h1 className="font-display font-700 text-4xl md:text-5xl leading-[1.1] max-w-2xl">
            Terms &amp; Conditions
          </h1>
          <p className="mt-6 max-w-xl text-paper/70 text-lg">
            These terms govern trade purchases made through {COMPANY.name}. Please read
            them carefully before applying for an account or placing an order.
          </p>
        </div>
      </section>

      {/* Sections */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <div className="space-y-10">
          {SECTIONS.map((s) => (
            <div key={s.title}>
              <h2 className="font-display font-600 text-lg mb-2">{s.title}</h2>
              <p className="text-sm text-ink/70 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-ink/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs font-mono text-ink/40">Last updated: August 2026</p>
          <Link
            to="/contact"
            className="text-sm text-copper hover:underline"
          >
            Have a question about these terms? Contact us →
          </Link>
        </div>
      </section>
    </div>
  );
}
