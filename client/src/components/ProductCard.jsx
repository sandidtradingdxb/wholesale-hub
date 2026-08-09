import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const lowestTier = product.priceTiers?.[0];

  return (
    <Link
      to={`/product/${product.id}`}
      className="group border border-ink/10 bg-white hover:border-copper transition rounded-sm overflow-hidden flex flex-col"
    >
      <div className="aspect-[4/3] bg-slate-850/5 flex items-center justify-center border-b border-ink/10">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span className="font-mono text-xs text-ink/30">NO IMAGE</span>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex justify-between items-start gap-2">
          <span className="font-mono text-[11px] text-ink/50 tracking-wide">{product.sku}</span>
          <span className="font-mono text-[11px] uppercase text-teal">{product.category?.vertical}</span>
        </div>

        <h3 className="font-display font-600 text-base leading-snug group-hover:text-copper transition">
          {product.name}
        </h3>

        {product.brand && <p className="text-xs text-ink/50">{product.brand}</p>}

        <div className="mt-auto pt-3 border-t border-dashed border-ink/15 flex items-end justify-between">
          <div>
            <p className="font-mono text-[11px] text-ink/50">MOQ {product.moq} {product.unit}</p>
          </div>

          {product.pricingLocked ? (
            <span className="font-mono text-xs text-copper">Sign in for price</span>
          ) : (
            <span className="font-mono text-sm font-medium">
              from AED {lowestTier?.pricePerUnit?.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
