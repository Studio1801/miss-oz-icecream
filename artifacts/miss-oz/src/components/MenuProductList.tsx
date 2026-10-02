import type { MenuItem } from './menuCatalog';

/** Accessible, reusable text-only menu rows. */
export default function MenuProductList({
  items,
  align = 'left',
  descriptionSize = 'default',
}: {
  items: MenuItem[];
  align?: 'left' | 'center';
  descriptionSize?: 'default' | 'large';
}) {
  const centered = align === 'center';

  return (
    <ul className="divide-y divide-[rgba(94,23,53,0.12)]">
      {items.map((item) => (
        <li key={item.name} className="py-3.5 first:pt-0">
          <div className={`min-w-0 ${centered ? 'text-center' : ''}`}>
            <div className={`flex flex-wrap items-baseline gap-x-2 gap-y-1 ${centered ? 'justify-center' : ''}`}>
              <span className="text-[13px] sm:text-[14px] font-bold uppercase tracking-[0.08em] leading-snug text-[var(--berry-deep)]">
                {item.name}
              </span>
              {item.seasonalLabel && (
                <span className="text-[10px] font-semibold text-[var(--marionberry)]">
                  {item.seasonalLabel}
                </span>
              )}
            </div>
            {item.note && (
              <p className={`mt-1 leading-relaxed text-[#604C4F] ${descriptionSize === 'large' ? 'text-[15px]' : 'text-[12px] sm:text-[13px]'}`}>
                {item.note}
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}