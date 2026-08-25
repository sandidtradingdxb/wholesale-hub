// Simple, self-contained SVG badges for the card networks we accept.
// Drawn as clean flat marks rather than reproducing any stock photo/artwork.

function VisaBadge() {
  return (
    <svg viewBox="0 0 100 64" className="h-10 w-auto" role="img" aria-label="Visa">
      <rect width="100" height="64" rx="6" fill="#1A1F71" />
      <text
        x="50"
        y="40"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontStyle="italic"
        fontWeight="700"
        fontSize="24"
        fill="#ffffff"
        letterSpacing="1"
      >
        VISA
      </text>
    </svg>
  );
}

function MastercardBadge() {
  return (
    <svg viewBox="0 0 100 64" className="h-10 w-auto" role="img" aria-label="Mastercard">
      <rect width="100" height="64" rx="6" fill="#16171a" />
      <circle cx="42" cy="32" r="16" fill="#EB001B" />
      <circle cx="58" cy="32" r="16" fill="#F79E1B" />
      <path
        d="M50 20a16 16 0 0 1 0 24 16 16 0 0 1 0-24z"
        fill="#FF5F00"
      />
    </svg>
  );
}

function AmexBadge() {
  return (
    <svg viewBox="0 0 100 64" className="h-10 w-auto" role="img" aria-label="American Express">
      <rect width="100" height="64" rx="6" fill="#2E77BC" />
      <text
        x="50"
        y="29"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fontSize="13"
        fill="#ffffff"
        letterSpacing="0.5"
      >
        AMERICAN
      </text>
      <text
        x="50"
        y="45"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fontSize="13"
        fill="#ffffff"
        letterSpacing="1"
      >
        EXPRESS
      </text>
    </svg>
  );
}

export default function PaymentBadges({ className = "" }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <VisaBadge />
      <MastercardBadge />
      <AmexBadge />
    </div>
  );
}
