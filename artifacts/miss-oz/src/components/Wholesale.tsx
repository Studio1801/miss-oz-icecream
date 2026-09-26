import { motion, useReducedMotion } from 'framer-motion';
import InquireForm from './InquireForm';

type WholesaleItem = {
  name: string;
  photoUrl?: string;
};

// Millie's supplied flavor-to-file mapping. When the exact files are available,
// place them in public/images/wholesale/ and present them separately from the
// product offerings below. Do not show broken images or substitute other photos.
export type WholesaleFlavorPhoto = { name: string; fileName: string };
export const wholesaleFlavorPhotos: readonly WholesaleFlavorPhoto[] = [
  { name: 'Midnight Sundae', fileName: 'image0.jpeg' },
  { name: 'Matcha', fileName: 'image1.jpeg' },
  { name: 'Birthday Cake', fileName: 'image2.jpeg' },
  { name: 'Butter Pecan', fileName: 'image3.jpeg' },
  { name: 'Kulfi', fileName: 'image4.jpeg' },
  { name: 'Thai Iced Tea', fileName: 'image5.jpeg' },
  { name: 'Marionberry', fileName: 'image6.jpeg' },
  { name: 'Cookie and Cream', fileName: 'image7.jpeg' },
  { name: 'Belgian Chocolate', fileName: 'image8.jpeg' },
  { name: 'Coffee Crackle', fileName: 'image9.jpeg' },
  { name: 'Mint Chocolate Chip', fileName: 'image10.jpeg' },
  { name: 'Rose City Split', fileName: 'image11.jpeg' },
];

const items: WholesaleItem[] = [
  { name: '1.5-Gallon Ice Cream Tubs' },
  { name: '2.5-Gallon Ice Cream Tubs' },
  { name: 'Original Basque Cheesecake (10-inch, serves 12)' },
  { name: 'Chocolate Chip Cookies' },
  { name: 'Walnut Chocolate Chip Cookies' },
  { name: 'Pecan Chocolate Chip Cookies' },
];

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
      className="relative overflow-hidden bg-[var(--cream-hi)] px-[6vw] py-[76px] text-[var(--cocoa)] md:py-[112px]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[8px] bg-[var(--berry)]" aria-hidden="true" />

      <div className="relative mx-auto max-w-[980px]">
        <motion.div {...rise} transition={{ duration: 0.65 }} className="mb-9 text-center md:mb-12">
          <span className="mb-3 block text-[11px] font-bold uppercase tracking-[3px] text-[var(--berry)]">
            Wholesale Program · Est. 2007
          </span>
          <h2
            className="text-[clamp(42px,6vw,70px)] leading-[0.98] text-[var(--berry-deep)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Become our Wholesale Partner
          </h2>
          <p className="mx-auto mt-4 max-w-[500px] text-[16px] leading-relaxed text-[var(--cocoa)]/75">
            The same small-batch case, in sizes built for your menu.
          </p>
        </motion.div>

        <motion.div
          {...rise}
          transition={{ duration: 0.65, delay: 0.08 }}
          className="grid overflow-hidden rounded-[18px] border border-[rgba(115,32,62,0.16)] bg-white/75 shadow-[0_18px_50px_rgba(57,22,34,0.09)] md:grid-cols-[0.8fr_1.2fr]"
        >
          <div className="flex flex-col justify-center bg-[var(--berry)] px-7 py-9 text-center text-[var(--cream-hi)] md:px-10 md:py-12">
            <span className="text-[12px] font-bold uppercase tracking-[3px] text-[var(--pink)]">
              For shops &amp; restaurants
            </span>
            <p className="mx-auto mt-5 max-w-[330px] text-[17px] leading-relaxed text-[var(--cream-hi)]/85">
              Small batches, churned fresh in the Pearl District. Let’s bring Miss Oz to your menu.
            </p>
          </div>

          <div className="px-6 py-8 md:px-10 md:py-10">
            <h3
              className="text-center text-[25px] text-[var(--berry-deep)] md:text-[29px]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Wholesale Offerings
            </h3>

            <ul className="mt-5 divide-y divide-[rgba(115,32,62,0.14)]">
              {items.map((item, i) => (
                <motion.li
                  key={item.name}
                  initial={reduce ? false : { opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: 0.08 + i * 0.07 }}
                  className="flex items-center gap-4 py-4"
                >
                  {item.photoUrl && (
                    <img
                      src={item.photoUrl}
                      alt=""
                      loading="lazy"
                      className="h-14 w-14 shrink-0 rounded-lg object-cover"
                    />
                  )}
                  <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--berry)]" />
                  <span className="min-w-0 text-[16px] leading-relaxed text-[var(--cocoa)] md:text-[17px]" style={{ fontFamily: 'var(--font-sans)' }}>
                    {item.name}
                  </span>
                </motion.li>
              ))}
            </ul>

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
        </motion.div>
      </div>
    </section>
  );
}