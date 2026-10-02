import { motion } from 'framer-motion';

const macklin = { fontFamily: 'var(--font-groovy)', fontWeight: 400, fontStyle: 'italic' as const };

const rise = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const PawPrint = ({ size = 34, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 34 34" aria-hidden="true" className={className}>
    <ellipse cx="17" cy="22" rx="7.5" ry="6.5" fill="currentColor" />
    <ellipse cx="7" cy="14" rx="3.2" ry="4.2" fill="currentColor" transform="rotate(-18 7 14)" />
    <ellipse cx="13.5" cy="9.5" rx="3.2" ry="4.2" fill="currentColor" transform="rotate(-6 13.5 9.5)" />
    <ellipse cx="20.5" cy="9.5" rx="3.2" ry="4.2" fill="currentColor" transform="rotate(6 20.5 9.5)" />
    <ellipse cx="27" cy="14" rx="3.2" ry="4.2" fill="currentColor" transform="rotate(18 27 14)" />
  </svg>
);

/** Vintage taped snapshot. When `src` is empty it renders a waiting-for-photo mat. */
function Snapshot({
  src,
  alt,
  caption,
  rotate,
}: {
  src?: string;
  alt: string;
  caption: string;
  rotate: string;
}) {
  return (
    <figure
      className="relative bg-[var(--cream-hi)] p-[10px] pb-[14px] rounded-[3px] w-full max-w-[280px] mx-auto"
      style={{
        transform: `rotate(${rotate})`,
        boxShadow: '0 10px 28px rgba(28,13,12,0.18), 0 2px 6px rgba(28,13,12,0.12)',
      }}
    >
      {/* tape */}
      <span
        aria-hidden="true"
        className="absolute -top-[12px] left-1/2 -translate-x-1/2 w-[76px] h-[24px] rotate-[-3deg]"
        style={{ background: 'rgba(214,193,150,0.75)', boxShadow: '0 1px 3px rgba(28,13,12,0.15)' }}
      />
      <div className="aspect-[4/5] overflow-hidden rounded-[2px] bg-[rgba(28,13,12,0.05)]">
        {src ? (
          <img loading="lazy" decoding="async"
            src={src}
            alt={alt}
           
            className="w-full h-full object-cover sepia-[10%] saturate-[0.94] contrast-[1.03]"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 border-2 border-dashed border-[rgba(28,13,12,0.22)] rounded-[2px] text-[var(--cocoa)]">
            <PawPrint className="opacity-30" />
            <span className="text-[11px] tracking-[3px] uppercase font-bold opacity-40 text-center px-4">
              Photo of Oz
              <br />
              coming soon
            </span>
          </div>
        )}
      </div>
      <figcaption className="font-script-alt text-[19px] text-[var(--berry-deep)] text-center mt-[10px] leading-tight">
        {caption}
      </figcaption>
    </figure>
  );
}

export default function MeetOz() {
  return (
    <section className="parlour-paper relative py-[90px] md:py-[130px] px-[6vw] bg-[var(--cream)] overflow-hidden">
      {/* faint paw trail wandering across the backdrop */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 text-[var(--cocoa)]">
        <PawPrint size={26} className="absolute top-[12%] left-[8%] opacity-[0.08] rotate-[20deg]" />
        <PawPrint size={22} className="absolute top-[22%] left-[13%] opacity-[0.08] rotate-[32deg]" />
        <PawPrint size={26} className="absolute bottom-[18%] right-[9%] opacity-[0.08] -rotate-[24deg]" />
        <PawPrint size={22} className="absolute bottom-[9%] right-[14%] opacity-[0.08] -rotate-[10deg]" />
      </div>

      <div className="relative z-10 max-w-[1220px] mx-auto">
        {/* Header */}
        <div className="text-center">
          <motion.span
            {...rise}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="block text-[12px] tracking-[5px] uppercase font-bold text-[var(--cocoa)] opacity-60 mb-3"
          >
            The namesake
          </motion.span>
          <motion.h2
            {...rise}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative inline-block leading-[1.02] mb-2"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(44px,6.4vw,92px)',
              color: 'var(--berry)',
              WebkitTextStroke: 'clamp(3px,0.4vw,6px) var(--cream-hi)',
              paintOrder: 'stroke fill',
              filter: 'drop-shadow(0 4px 0 rgba(178,78,121,0.35)) drop-shadow(0 8px 14px rgba(28,13,12,0.14))',
            }}
          >
            <span aria-hidden="true" className="absolute -top-[0.25em] -left-[0.7em] text-[0.32em] text-[var(--gold)]" style={{ WebkitTextStroke: 0, filter: 'none' }}>✦</span>
            Meet Miss Oz
            <span aria-hidden="true" className="absolute -bottom-[0.05em] -right-[0.75em] text-[0.26em] text-[var(--marionberry)]" style={{ WebkitTextStroke: 0, filter: 'none' }}>✦</span>
          </motion.h2>
          <motion.p
            {...rise}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-[clamp(24px,3vw,40px)] leading-[1.1] text-[var(--cocoa)]"
            style={macklin}
          >
            The <span className="text-[var(--marionberry)]">real</span> flavor tester
          </motion.p>
        </div>

        {/* Ornamental divider */}
        <motion.div
          {...rise}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex items-center justify-center gap-3 my-9 text-[var(--gold)]"
          aria-hidden="true"
        >
          <span className="h-px w-16 md:w-24" style={{ background: 'currentColor', opacity: 0.5 }} />
          <PawPrint size={18} className="text-[var(--gold)] opacity-70" />
          <span className="h-px w-16 md:w-24" style={{ background: 'currentColor', opacity: 0.5 }} />
        </motion.div>

        {/* Copy */}
        <motion.div {...rise} transition={{ duration: 0.7, delay: 0.25 }} className="max-w-[720px] mx-auto text-center">
          <p className="mb-[16px] leading-[1.9] text-[18px] md:text-[19px] text-[#1d0e0d]">
            The shop is named after Oz, our beloved dog, and the reason we do things the way we do.
            Oregon is about as dog-friendly as a place can be, and she made every corner of it hers.
          </p>
          <p className="mb-[16px] leading-[1.9] text-[18px] md:text-[19px] text-[#1d0e0d]">
            She keeps a close eye on the kitchen, stars in her own daily vlog for our guests, and comes
            along when we travel to hunt down new flavors. Nothing goes on the menu until it passes her
            inspection.
          </p>
          <p className="font-script-alt text-[clamp(22px,2.6vw,30px)] text-[var(--berry)] leading-snug mt-6">
            Oz has cared every flavor before you have.
          </p>
        </motion.div>

        {/* Snapshot row */}
        <motion.div
          {...rise}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6 items-start"
        >
          <Snapshot src="/images/oz-boots.webp" alt="Oz, a tricolor Cavalier King Charles Spaniel, wearing yellow boots in a carpet of autumn leaves" caption="yellow boots season" rotate="-2.5deg" />
          <Snapshot src="/images/oz-flowers.webp" alt="Oz smiling on a sunny trail beside yellow wildflowers" caption="research department" rotate="1.5deg" />
          <Snapshot src="/images/oz-taster.webp" alt="Oz looking up with a dab of cream on her lip" caption="quality control, on duty" rotate="-1deg" />
        </motion.div>
      </div>
    </section>
  );
}
