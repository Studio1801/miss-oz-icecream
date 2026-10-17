import MenuProductList from './MenuProductList';
import { DRINKS } from './menuCatalog';

const MILKSHAKE_PHOTOS = [
  {
    src: 'images/root-beer-float.webp',
    alt: "Root beer float in a Miss Oz cup next to a bottle of Dad's Root Beer",
    caption: 'Root Beer Float',
  },
  {
    src: 'images/coke-float.webp',
    alt: 'Coke float in a Miss Oz cup next to a bottle of Mexican Coke',
    caption: 'Coke Float',
  },
  {
    src: 'images/peanut-butter-fudge-milkshake.webp',
    alt: 'Peanut Butter Fudge milkshake in a Miss Oz cup',
    caption: 'Peanut Butter Fudge',
  },
];

export default function DrinksPanel() {
  const milkshake = DRINKS.find((item) => item.name === 'Milkshakes');

  return (
    <div className="flex flex-col">
      <div className="mt-[clamp(18px,2.2vw,28px)] flex flex-col text-center">
        <MenuProductList items={DRINKS.filter((item) => item.name !== 'Milkshakes')} align="center" />
        <div className="mt-4 border-t border-[rgba(94,23,53,0.12)] pt-4">
          <div className="mx-auto flex w-full flex-col items-center text-center">
            {milkshake && (
              <>
                <div className="text-[13px] sm:text-[14px] max-[430px]:text-[12px] font-bold uppercase tracking-[0.08em] leading-snug text-[var(--berry-deep)]">
                  {milkshake.name}
                </div>
                {milkshake.note && (
                  <p className="mt-1 w-full min-w-0 leading-relaxed max-[430px]:leading-[1.5] text-[#604C4F] text-[12px] sm:text-[13px] max-[639px]:text-[14px] min-[431px]:max-[800px]:max-w-[280px]">
                    {milkshake.note}
                  </p>
                )}
              </>
            )}
            <div className="mx-auto mt-[24px] flex w-full max-w-[702px] flex-wrap justify-center gap-6">
              {MILKSHAKE_PHOTOS.map((photo) => (
                <figure
                  key={photo.caption}
                  className="relative w-[210px] flex-[0_0_210px] overflow-hidden rounded-[12px] border border-[rgba(115,32,62,0.16)] bg-white/75 shadow-[0_12px_28px_rgba(28,13,12,0.17)] max-[639px]:w-[44%] max-[639px]:flex-[0_0_44%]"
                  style={{ position: 'relative' }}
                >
                  <img
                    src={`${import.meta.env.BASE_URL}${photo.src}`}
                    alt={photo.alt}
                    width={1000}
                    height={1250}
                    loading="lazy"
                    decoding="async"
                    className="block aspect-[4/5] w-full object-cover"
                    style={{ objectPosition: 'center 55%' }}
                  />
                  <figcaption
                    className="w-full whitespace-nowrap px-2 py-[10px] text-center text-[13px] leading-tight text-[var(--berry-deep)] max-[639px]:min-h-[58px] max-[639px]:whitespace-normal max-[639px]:flex max-[639px]:items-center max-[639px]:justify-center"
                    style={{
                      background: 'rgba(242,225,194,0.94)',
                      fontFamily: 'var(--font-display)',
                    }}
                  >
                    {photo.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
        <div
          className="mt-[36px] rounded-[8px] px-[clamp(14px,1.8vw,22px)] py-[clamp(13px,1.6vw,19px)] text-center"
          style={{ background: 'rgba(94,23,53,0.05)', border: '1px dashed rgba(94,23,53,0.2)' }}
        >
          <div className="text-[var(--marionberry)]" style={{ fontFamily: 'var(--font-script)', fontSize: 'clamp(20px,1.8vw,26px)', lineHeight: 1.1 }}>
            Seasonal Specials
          </div>
          <p className="mt-[8px] text-[#6E5A54] leading-relaxed mobile-body-14" style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(10.5px,0.9vw,12.5px)' }}>
            S&apos;mores Sundae, S&apos;more Hot Chocolate, Chai Latte, Pumpkin Spice Latte
          </p>
        </div>
      </div>
    </div>
  );
}
