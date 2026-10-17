import { motion, useReducedMotion } from 'framer-motion';
import InquireForm from './InquireForm';
import { Starburst } from './Decor';

type WholesaleItem = {
  name: string;
};

const items: WholesaleItem[] = [
  { name: '1.5-Gallon Ice Cream Tubs' },
  { name: '2.5-Gallon Ice Cream Tubs' },
  { name: 'Original Basque Cheesecake (10-inch, serves 12)' },
  { name: 'Chocolate Chip Cookies' },
  { name: 'Walnut Chocolate Chip Cookies' },
  { name: 'Butter Pecan Cookies' },
];

const itemGroups = [
  { label: 'Ice cream', icon: 'cone', items: items.slice(0, 2) },
  { label: 'Bakes', icon: 'bakes', items: items.slice(2) },
] as const;

const polaroidPhotos = [
  {
    src: 'images/wholesale/image6.webp',
    alt: 'A scoop of Oregon Marionberry ice cream in a silver dessert dish, with the full dish visible.',
    caption: 'Ice cream',
    objectPosition: 'center',
    rotation: '-1.5deg',
  },
  {
    src: 'images/whole-basque-cheesecake.webp',
    alt: 'A whole golden-brown Original Basque cheesecake with its baked top clearly visible.',
    caption: 'Bakes',
    objectPosition: 'center',
    rotation: '0.5deg',
  },
  {
    src: 'images/cookie-chocolate-chip-new.webp',
    alt: 'A stack of chocolate chip cookies on a green-checkered plate.',
    caption: 'Cookies',
    objectPosition: 'center',
    rotation: '1.5deg',
  },
];

const awningStyle = {
  background: 'repeating-linear-gradient(90deg, var(--cream-hi) 0 22px, var(--berry-deep) 22px 44px)',
  boxShadow: 'inset 0 -4px 8px rgba(28,13,12,0.2), 0 3px 8px rgba(0,0,0,0.18)',
};

const scallopStyle = {
  background: 'repeating-linear-gradient(90deg, var(--cream-hi) 0 22px, var(--berry-deep) 22px 44px)',
  WebkitMaskImage: 'radial-gradient(11px at 50% 0, #000 98%, transparent 100%)',
  maskImage: 'radial-gradient(11px at 50% 0, #000 98%, transparent 100%)',
  WebkitMaskSize: '22px 100%',
  maskSize: '22px 100%',
  WebkitMaskRepeat: 'repeat-x',
  maskRepeat: 'repeat-x',
  filter: 'drop-shadow(0 3px 4px rgba(0,0,0,0.18))',
};

function WholesaleAwning() {
  return (
    <div aria-hidden="true" className="relative z-10 -mb-[2px]">
      <div className="h-[14px] rounded-t-[10px]" style={awningStyle} />
      <div className="h-[9px]" style={scallopStyle as React.CSSProperties} />
    </div>
  );
}

function PolaroidStack() {
  return (
    <div className="mx-auto mb-6 grid w-full max-w-[400px] grid-cols-2 gap-4">
      {polaroidPhotos.map((photo, index) => (
        <figure
          key={photo.src}
          className="relative min-w-0 bg-[#fffdf6] p-[6px] pb-[12px] shadow-[0_8px_18px_rgba(20,7,13,0.32)]"
          style={{
            transform: `rotate(${photo.rotation})`,
            gridColumn: index === 2 ? 'span 2' : 'auto',
            width: index === 2 ? 'calc((100% - 16px) / 2)' : '100%',
            justifySelf: 'center',
          }}
        >
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-[-7px] z-10 h-[14px] w-[42px] -translate-x-1/2 rotate-[-3deg] bg-[#ead8a5]/90 shadow-sm"
          />
          <img
            src={`${import.meta.env.BASE_URL}${photo.src}`}
            alt={photo.alt}
            width={768}
            height={960}
            loading="lazy"
            decoding="async"
            className="block aspect-[4/5] w-full object-cover object-center"
          />
          <figcaption className="mt-[4px] break-words text-center font-script-alt text-[12px] leading-tight text-[var(--berry-deep)] lg:text-[14px]">
            {photo.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

function PawPrintMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <ellipse cx="50" cy="68" rx="22" ry="18" fill="currentColor" />
      <ellipse cx="24" cy="44" rx="10" ry="8" fill="currentColor" transform="rotate(-25 24 44)" />
      <ellipse cx="38" cy="32" rx="10" ry="8" fill="currentColor" transform="rotate(-8 38 32)" />
      <ellipse cx="55" cy="31" rx="10" ry="8" fill="currentColor" transform="rotate(8 55 31)" />
      <ellipse cx="70" cy="42" rx="10" ry="8" fill="currentColor" transform="rotate(25 70 42)" />
    </svg>
  );
}

function BakesMark() {
  return (
    <svg viewBox="0 0 32 32" className="h-[25px] w-[25px] shrink-0 text-[var(--berry)]" aria-hidden="true">
      <path
        d="M7 25 18 14m-2-2c-3-4-2-8 1-8 2 0 3 4 2 8m1 1c4-4 8-4 8-1 0 2-4 4-8 4m-4 1 6 6"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path d="m5 27 3-1-2-2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

export default function Wholesale() {
  const reduce = useReducedMotion();
  const rise = {
    initial: reduce ? false : { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
  };

  return (
    <section
      id="wholesale"
      className="relative overflow-hidden bg-[var(--cream-hi)] px-[6vw] pt-[100px] pb-[76px] text-[var(--cocoa)] md:pt-[136px] md:pb-[112px]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[8px] bg-[var(--berry)]" aria-hidden="true" />
      <Starburst
        size={96}
        color="var(--berry)"
        className="pointer-events-none absolute right-[3vw] top-[18%] z-0 hidden opacity-[0.10] md:block"
      />
      <PawPrintMark className="pointer-events-none absolute left-[3vw] top-[48%] z-0 hidden h-8 w-8 -rotate-[18deg] text-[var(--berry)] opacity-[0.10] md:block" />
      <PawPrintMark className="pointer-events-none absolute left-[6vw] top-[54%] z-0 hidden h-6 w-6 rotate-[13deg] text-[var(--berry)] opacity-[0.09] md:block" />
      <PawPrintMark className="pointer-events-none absolute bottom-[10%] right-[4vw] z-0 hidden h-8 w-8 rotate-[16deg] text-[var(--berry)] opacity-[0.10] md:block" />

      <div className="relative z-10 mx-auto max-w-[980px]">
        <motion.div {...rise} transition={{ duration: 0.65 }} className="mb-6 text-center">
          <span className="mb-4 block text-[11px] max-[639px]:text-[12px] font-bold tracking-[3px] text-[var(--berry-deep)]">
            Wholesale program · Est. 2007
          </span>
          <h2
            className="mb-4 text-[clamp(42px,6vw,70px)] leading-[0.98] text-[var(--berry-deep)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Become our Wholesale Partner
          </h2>
          <p className="mx-auto max-w-[500px] text-[18px] leading-relaxed text-[var(--cocoa)] md:text-[19px]">
            The same small-batch case, in sizes built for your menu.
          </p>
        </motion.div>

        <motion.div
          {...rise}
          transition={{ duration: 0.65, delay: 0.08 }}
          className="overflow-hidden rounded-[18px] border border-[rgba(115,32,62,0.16)] bg-white/75 shadow-[0_18px_50px_rgba(57,22,34,0.09)]"
        >
          <WholesaleAwning />
          <div className="grid md:grid-cols-[0.8fr_1.2fr]">
            <div className="flex flex-col items-center justify-center bg-[var(--berry)] px-7 py-9 text-center text-[var(--cream-hi)] md:px-8 md:py-10">
              <PolaroidStack />
              <span className="text-[12px] font-bold tracking-[3px] text-[var(--cream-hi)]">
                For shops &amp; restaurants
              </span>
              <p className="mx-auto mt-5 max-w-[330px] text-[18px] leading-relaxed text-[var(--cream-hi)] md:text-[19px]">
                Small batches, churned fresh in the Pearl District. Let’s bring Miss Oz to your menu.
              </p>
            </div>

            <div className="flex flex-col justify-center px-6 py-8 md:px-10 md:py-10">
              <h3
                className="text-center text-[25px] text-[var(--berry-deep)] md:text-[29px]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Wholesale Offerings
              </h3>

              <div className="mt-5 space-y-4">
                {itemGroups.map((group, groupIndex) => (
                  <section
                    key={group.label}
                    className={groupIndex > 0 ? 'border-t border-[rgba(115,32,62,0.14)] pt-4' : ''}
                  >
                    <h4 className="mb-1 text-[14px] font-bold text-[var(--berry)]">
                      {group.label}
                    </h4>
                    <ul className="divide-y divide-[rgba(115,32,62,0.14)]">
                      {group.items.map((item, index) => {
                        const animationIndex = groupIndex === 0 ? index : index + 2;
                        return (
                          <motion.li
                            key={item.name}
                            initial={reduce ? false : { opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ duration: 0.4, delay: 0.08 + animationIndex * 0.07 }}
                            className="flex items-center gap-4 py-3.5"
                          >
                            {group.icon === 'cone' ? (
                              <img
                                src={`${import.meta.env.BASE_URL}images/icon-icecream-cone.webp`}
                                alt=""
                                aria-hidden="true"
                                width={25}
                                height={25}
                                loading="lazy"
                                className="h-[25px] w-[25px] shrink-0 object-contain"
                              />
                            ) : (
                              <BakesMark />
                            )}
                            <span className="min-w-0 text-[16px] leading-relaxed text-[var(--cocoa)] md:text-[17px]" style={{ fontFamily: 'var(--font-sans)' }}>
                              {item.name}
                            </span>
                          </motion.li>
                        );
                      })}
                    </ul>
                  </section>
                ))}
              </div>

              <p className="mt-4 text-[13px] leading-relaxed text-[var(--cocoa)]/65" style={{ fontFamily: 'var(--font-sans)' }}>
                Wholesale minimums: $300 minimum total order. One dozen (12 cookies) minimum per cookie order.
              </p>

              <div className="mt-2 text-center">
                <InquireForm
                  type="wholesale"
                  submitLabel="Become our Wholesale Partner"
                  buttonClassName="inline-flex items-center gap-2 rounded-full bg-[var(--berry)] px-7 py-[13px] text-[14px] font-bold tracking-[0.4px] text-[var(--cream-hi)] transition-transform duration-200 mech-btn hover:-translate-y-0.5 hover:bg-[var(--berry-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--berry)] focus-visible:ring-offset-2"
                />
                <div className="mt-4 text-[13px] text-[var(--cocoa)]/65" style={{ fontFamily: 'var(--font-sans)' }}>
                  Or say hello at @missozicecreamcafe
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}