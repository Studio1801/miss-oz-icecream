import type { MenuItem } from './menuCatalog';

/** Accessible, reusable menu rows; seasonal labels do not require a product photo. */
export default function MenuProductList({ items }: { items: MenuItem[] }) {
  return (
    <ul className="divide-y divide-[rgba(94,23,53,0.12)]">
      {items.map((item) => (
        <li key={item.name} className="py-3.5 first:pt-0">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-[13px] sm:text-[14px] font-bold uppercase tracking-[0.08em] leading-snug text-[var(--berry-deep)]">
              {item.name}
            </span>
            {item.seasonalLabel && (
              <span className="rounded-full border border-[var(--marionberry)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.05em] text-[var(--berry-deep)]">
                {item.seasonalLabel}
              </span>
            )}
          </div>
          {item.note && <p className="mt-1 text-[12px] sm:text-[13px] leading-relaxed text-[#604C4F]">{item.note}</p>}
        </li>
      ))}
    </ul>
  );
}