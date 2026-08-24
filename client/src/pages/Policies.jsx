import { Link } from "react-router-dom";
import { COMPANY } from "../config/company";

const GROUPS = [
  {
    id: "privacy",
    title: "Privacy Policy",
    paragraphs: [
      "All credit/debit card details and personally identifiable information will NOT be stored, sold, shared, rented, or leased to any third parties.",
      `${COMPANY.name} will not pass any debit/credit card details to third parties.`,
      `${COMPANY.name} takes appropriate steps to ensure data privacy and security, including through various hardware and software methodologies. However, ${COMPANY.name} cannot guarantee the security of any information that is disclosed online.`,
      `${COMPANY.name} is not responsible for the privacy policies of websites to which it links. If you provide any information to such third parties, different rules regarding the collection and use of your personal information may apply. You should contact these entities directly if you have any questions about their use of the information that they collect.`,
      "The Website Policies and Terms & Conditions may be changed or updated occasionally to meet requirements and standards. Customers are encouraged to frequently visit these sections to stay updated on any changes. Modifications will be effective on the day they are posted.",
    ],
  },
  {
    id: "cookies",
    title: "Cookie Policy",
    intro:
      'We use cookies, pixels, and other technologies (collectively, "cookies") to recognize your browser or device, learn more about your interests, and provide you with essential features and services, and for additional purposes, including:',
    bullets: [
      "Recognizing you when you sign in to use our services. This allows us to provide you with product recommendations, display personalized content, and provide other customized features and services.",
      "Keeping track of your specified preferences. This allows us to honor your preferences, such as whether or not you would like to see interest-based ads. You may set your preferences through your account.",
      "Keeping track of items stored in your shopping cart or quote request.",
      `Conducting research and diagnostics to improve ${COMPANY.name}'s content, products, and services.`,
      "Preventing fraudulent activity.",
      "Improving security.",
      `Delivering content, including ads, relevant to your interests on ${COMPANY.name} sites and third-party sites.`,
      "Reporting — this allows us to measure and analyze the performance of our services.",
    ],
  },
  {
    id: "delivery",
    title: "Delivery Policy",
    paragraphs: [
      "Orders are dispatched via trusted courier partners once payment or trade terms have been confirmed. Please retain your proof-of-delivery receipt, signed and confirmed by the receiving customer, for your records.",
      "Local deliveries within the UAE are typically fulfilled within 2–5 business days of order confirmation. International shipments, where applicable, may take 7–21 business days depending on destination and customs clearance.",
      "Delivery fees are calculated based on order size, weight, and destination, and will be shown before an order is confirmed. Free delivery may apply to qualifying bulk orders at our discretion.",
    ],
  },
  {
    id: "payment-confirmation",
    title: "Payment Confirmation",
    paragraphs: [
      "Once a payment is made, a confirmation notice will be sent to the client via email within 24 hours of receipt.",
    ],
  },
  {
    id: "refund",
    title: "Refund Policy",
    paragraphs: [
      "Refunds will be issued only through the original mode of payment used for the transaction.",
      "Refunds are processed within 10 to 45 days, depending on the policies of the issuing bank for the credit or debit card used.",
      "Refund requests may be made where an order is cancelled within the permitted window, or where goods are returned in accordance with our Return Policy below.",
    ],
  },
  {
    id: "return",
    title: "Return Policy",
    paragraphs: [
      "We accept returns within 7 days of receipt, only if the delivery packaging has not been opened, or if the products are damaged or incorrect.",
      "Please notify us and return the item in its original packaging. In such instances, we will endeavor to send a replacement or refund the payment.",
      "We can only accept returns of products that have not been tampered with, are sealed, and remain in their original packaging. If all conditions are met, please ship the products back to us using a registered courier service, and we will issue a full refund.",
      "We reserve the right to refuse any returned shipment if the product has been used or tampered with. Shipping and handling fees are non-refundable.",
    ],
  },
  {
    id: "cancellation",
    title: "Cancellation Policy",
    paragraphs: [
      "Customers can cancel their order or requested services within 24 hours of placing the order.",
      "Refunds for cancelled orders will be made back to the original payment method used by the customer. Please allow up to 45 days for the refund transfer to be completed.",
    ],
  },
  {
    id: "pricing",
    title: "Pricing & Description",
    paragraphs: [
      "Product listings on this site include a description, brand, minimum order quantity (MOQ), and tiered pricing by quantity, shown in AED to approved trade accounts.",
      "In line with card scheme and banking compliance requirements, we do not accept payments from cards issued in, or transactions originating from, sanctioned countries, including but not limited to Iran, Cuba, North Korea, Sudan, South Sudan, Ukraine, Syria, the Russian Federation, Myanmar, and Yemen.",
    ],
  },
];

function GroupSection({ group }) {
  return (
    <div id={group.id} className="scroll-mt-24">
      <h2 className="font-display font-700 text-2xl mb-4">{group.title}</h2>
      {group.intro && (
        <p className="text-sm text-ink/70 leading-relaxed mb-3">{group.intro}</p>
      )}
      {group.paragraphs?.map((p, i) => (
        <p key={i} className="text-sm text-ink/70 leading-relaxed mb-3">
          {p}
        </p>
      ))}
      {group.bullets && (
        <ul className="space-y-2 mt-2">
          {group.bullets.map((b, i) => (
            <li key={i} className="text-sm text-ink/70 leading-relaxed flex gap-2">
              <span className="text-copper mt-1">•</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Policies() {
  return (
    <div>
      {/* Intro */}
      <section className="bg-ink text-paper border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <p className="font-mono text-copper-light text-xs uppercase tracking-[0.2em] mb-4">
            Legal
          </p>
          <h1 className="font-display font-700 text-4xl md:text-5xl leading-[1.1] max-w-2xl">
            Website Policies
          </h1>
          <p className="mt-6 max-w-xl text-paper/70 text-lg">
            Our privacy, cookie, delivery, payment, refund, return, and cancellation
            policies for {COMPANY.name}.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-[200px_1fr] gap-12">
        {/* Jump nav */}
        <nav className="hidden md:block">
          <p className="font-mono text-xs uppercase tracking-wide text-ink/40 mb-3">
            On this page
          </p>
          <ul className="space-y-2 text-sm sticky top-24">
            {GROUPS.map((g) => (
              <li key={g.id}>
                <a href={`#${g.id}`} className="text-ink/60 hover:text-copper transition">
                  {g.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Content */}
        <div className="space-y-14 max-w-3xl">
          {GROUPS.map((g) => (
            <GroupSection key={g.id} group={g} />
          ))}

          <div className="pt-8 border-t border-ink/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-xs font-mono text-ink/40">Last updated: August 2026</p>
            <Link to="/contact" className="text-sm text-copper hover:underline">
              Have a question about these policies? Contact us →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
