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
          <motion.h2
            {...rise}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative inline-block leading-[1.02] mb-1"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(40px, calc(6.8vw + 8px), 96px)',
              color: 'var(--berry)',
              textShadow: '2px 4px 10px rgba(28,13,12,0.16)',
            }}
          >
            Meet Miss Oz
          </motion.h2>
          <motion.p
            {...rise}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-[clamp(16px,2.2vw,32px)] leading-[1.15] text-[var(--cocoa)]"
            style={macklin}
          >
            The <span className="text-[var(--marionberry)]">real</span> flavor tester
          </motion.p>
        </div>

        {/* Copy */}
        <motion.div {...rise} transition={{ duration: 0.7, delay: 0.25 }} className="mt-8 max-w-[640px] mx-auto text-center">
          <p className="mb-[16px] text-[18px] leading-[1.5] text-[#1d0e0d]">
            The shop is named after Oz, our beloved dog, and the reason we do things the way we do.
            Oregon is about as dog-friendly as a place can be, and she made every corner of it hers.
          </p>
          <p className="mb-[16px] text-[18px] leading-[1.5] text-[#1d0e0d]">
            She keeps a close eye on the kitchen, stars in her own daily vlog for our guests, and comes
            along when we travel to hunt down new flavors. Nothing goes on the menu until it passes her
            inspection.
          </p>
          <p className="mt-10 text-[clamp(22px,2vw,28px)] leading-[1.35] text-[var(--berry)] md:mt-12" style={macklin}>
            Oz has tested every flavor before you have.
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
