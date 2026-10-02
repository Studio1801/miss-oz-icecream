import type { MenuItem } from './menuCatalog';
import { sundaePhotos } from './MenuPhotos';

/** Accessible, reusable menu rows; seasonal labels do not require a product photo. */
export default function MenuProductList({
  items,
  align = 'left',
}: {
  items: MenuItem[];
  align?: 'left' | 'center';
}) {
  const centered = align === 'center';

  return (
    <ul className="divide-y divide-[rgba(94,23,53,0.12)]">
      {items.map((item) => {
        const photo = sundaePhotos[item.name];

        return (
          <li key={item.name} className="py-3.5 first:pt-0">
            <div
              className={photo ? 'grid items-start gap-4' : 'flex items-start gap-4'}
              style={photo ? { gridTemplateColumns: 'minmax(0, 1fr) clamp(130px, 20vw, 220px)' } : undefined}
            >
              <div className={`min-w-0 flex-1 ${centered ? 'text-center' : ''}`}>
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
                {item.note && <p className="mt-1 text-[12px] sm:text-[13px] leading-relaxed text-[#604C4F]">{item.note}</p>}
              </div>
              {photo && (
                <img
                  src={`${import.meta.env.BASE_URL}images/wholesale/${photo.fileName}`}
                  alt={photo.name}
                  width={960}
                  height={1280}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/5] w-[clamp(130px,20vw,220px)] shrink-0 rounded-[8px] object-cover"
                />
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}