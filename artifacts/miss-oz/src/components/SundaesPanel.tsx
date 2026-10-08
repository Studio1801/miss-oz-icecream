import MenuProductList from './MenuProductList';
import { SUNDAES, SUNDAE_PHOTOS } from './menuCatalog';
import { MenuDivider } from './MenuPanelShared';

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
      <div className="mt-[clamp(18px,2.2vw,28px)] flex flex-col gap-[clamp(18px,2vw,26px)]">
        {SUNDAES_WITHOUT_PHOTOS.length > 0 && (
          <MenuProductList items={SUNDAES_WITHOUT_PHOTOS} descriptionSize="large" />
        )}
        {SUNDAE_ROWS.map(({ photo, item }, index) => {
          const photoOrder = index % 2 === 0 ? 'lg:order-1' : 'lg:order-2';
          const descriptionOrder = index % 2 === 0 ? 'lg:order-2' : 'lg:order-1';

          return (
            <article
              key={photo.src}
              className="grid grid-cols-1 items-center gap-[clamp(14px,2vw,24px)] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]"
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
                <h3 className="text-[13px] sm:text-[14px] font-bold uppercase tracking-[0.08em] leading-snug text-[var(--berry-deep)]">
                  {item.name}
                </h3>
                {item.seasonalLabel && (
                  <p className="mt-1 text-[10px] font-semibold text-[var(--marionberry)]">
                    {item.seasonalLabel}
                  </p>
                )}
                {item.note && (
                  <p className="mt-2 leading-relaxed text-[15px] text-[#604C4F]">
                    {item.note}
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </div>
      <div className="mt-auto">
        <MenuDivider className="mt-[clamp(16px,2vw,22px)]" />
        <div
          className="mt-[clamp(14px,1.8vw,20px)] rounded-[8px] px-[clamp(14px,1.8vw,22px)] py-[clamp(13px,1.6vw,19px)] text-center"
          style={{ background: 'rgba(94,23,53,0.05)', border: '1px dashed rgba(94,23,53,0.2)' }}
        >
          <div className="text-[var(--marionberry)]" style={{ fontFamily: 'var(--font-script)', fontSize: 'clamp(20px,1.8vw,26px)', lineHeight: 1.1 }}>
            Make it your own
          </div>
          <p className="mt-[8px] text-[#6E5A54] leading-relaxed" style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(10.5px,0.9vw,12.5px)' }}>
            Add a second scoop, swap the base flavor, or upgrade with house-made hot fudge or berry compote. Ask your scooper. We love a custom order!
          </p>
        </div>
      </div>
    </div>
  );
}
