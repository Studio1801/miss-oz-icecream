import MenuProductList from './MenuProductList';
import { SUNDAES, SUNDAE_PHOTOS } from './menuCatalog';

function normalizeName(name: string) {
  return name.replace(/[’']/g, '').toLowerCase();
}

const SUNDAE_ROWS = SUNDAE_PHOTOS.map((photo) => {
  const item = SUNDAES.find((sundae) => normalizeName(sundae.name) === normalizeName(photo.caption));
  if (!item) throw new Error(`No sundae description found for ${photo.caption}`);
  return { photo, item };
});

const SUNDAES_WITHOUT_PHOTOS = SUNDAES.filter(
  (sundae) => !SUNDAE_ROWS.some((row) => row.item.name === sundae.name),
);

export default function SundaesPanel() {
  return (
    <div className="flex-1 flex flex-col">
      <div className="mt-[clamp(18px,2.2vw,28px)] flex flex-col gap-[clamp(18px,2vw,26px)] max-[430px]:gap-5">
        {SUNDAES_WITHOUT_PHOTOS.length > 0 && (
          <MenuProductList items={SUNDAES_WITHOUT_PHOTOS} descriptionSize="large" />
        )}
        {SUNDAE_ROWS.map(({ photo, item }, index) => {
          const photoOrder = index % 2 === 0 ? 'lg:order-1' : 'lg:order-2';
          const descriptionOrder = index % 2 === 0 ? 'lg:order-2' : 'lg:order-1';

          return (
            <article
              key={photo.src}
              className="menu-sundae-item grid grid-cols-1 items-center gap-[clamp(14px,2vw,24px)] max-[430px]:gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]"
            >
              <img
                src={`${import.meta.env.BASE_URL}${photo.src}`}
                alt={photo.alt}
                width={960}
                height={1200}
                loading="lazy"
                decoding="async"
                className={`block aspect-[4/5] w-full rounded-[10px] object-cover ${photoOrder}`}
                style={{ objectPosition: photo.objectPosition, boxShadow: '0 12px 28px rgba(28,13,12,0.17)' }}
              />
              <div className={`min-w-0 ${descriptionOrder}`}>
                <div className="menu-product-heading">
                <h3 className="menu-product-name text-[13px] sm:text-[14px] max-[430px]:text-[12px] font-bold uppercase tracking-[0.08em] leading-snug text-[var(--berry-deep)]">
                  {item.name}
                </h3>
                {item.price && <span className="menu-product-price hidden">{item.price}</span>}
                </div>
                {item.seasonalLabel && (
                  <p className="mt-1 text-[10px] max-[639px]:text-[12px] font-semibold text-[var(--marionberry)]">
                    {item.seasonalLabel}
                  </p>
                )}
                {item.note && (
                  <p className="menu-product-note mt-2 max-[430px]:mt-1 leading-relaxed max-[430px]:leading-[1.5] text-[15px] max-[639px]:text-[14px] text-[#604C4F]">
                    {item.note}
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
