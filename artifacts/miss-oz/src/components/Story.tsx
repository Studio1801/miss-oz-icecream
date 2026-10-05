import { motion } from 'framer-motion';
import { Bunting } from './Decor';

const macklin = { fontFamily: 'var(--font-groovy)', fontWeight: 400, fontStyle: 'italic' as const };

const rise = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function Story() {
  return (
    <section className="parlour-paper relative py-[76px] md:py-[112px] px-[6vw] bg-[var(--cream)] overflow-hidden">
      <Bunting className="absolute top-0 left-0 right-0" />
      {/* Faint decorative laurels in the far corners */}
      <svg aria-hidden="true" className="hidden md:block absolute top-[60px] left-[4vw] opacity-[0.12]" width="120" height="120" viewBox="0 0 100 100">
        <path d="M50 8 C30 20 30 50 50 62 C70 50 70 20 50 8 Z M50 40 C38 48 38 70 50 82 C62 70 62 48 50 40 Z" fill="none" stroke="var(--cocoa)" strokeWidth="1.5" />
      </svg>
      <svg aria-hidden="true" className="hidden md:block absolute bottom-[60px] right-[4vw] opacity-[0.12] -scale-x-100" width="120" height="120" viewBox="0 0 100 100">
        <path d="M50 8 C30 20 30 50 50 62 C70 50 70 20 50 8 Z M50 40 C38 48 38 70 50 82 C62 70 62 48 50 40 Z" fill="none" stroke="var(--cocoa)" strokeWidth="1.5" />
      </svg>

      {/* Aged paper panel */}
      <motion.div
        {...rise}
        transition={{ duration: 0.7 }}
        className="relative z-10 max-w-[1000px] mx-auto rounded-[6px] px-[8vw] py-[64px] md:px-[80px] md:pt-[92px] md:pb-[76px]"
        style={{
          background: 'var(--cream-hi)',
          boxShadow: '0 24px 60px rgba(28,13,12,0.12), inset 0 0 90px rgba(199,154,59,0.10)',
          backgroundImage: 'radial-gradient(120% 90% at 50% 0%, transparent 62%, rgba(28,13,12,0.05) 100%)',
        }}
      >
        {/* Double-rule frame — echoes the hero label */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-[12px] rounded-[4px] border border-[rgba(28,13,12,0.22)]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-[18px] rounded-[2px] stitch-border border-[rgba(28,13,12,0.22)]" />

        {/* Wax-seal stamp riding the top edge */}
        <div aria-hidden="true" className="absolute left-1/2 -translate-x-1/2 -top-[40px] z-10">
          <div
            className="wax-seal relative flex items-center justify-center rounded-full cursor-pointer"
            style={{ width: 84, height: 84, background: 'var(--berry)', boxShadow: '0 8px 24px rgba(28,13,12,0.3), inset 0 4px 8px rgba(255,255,255,0.2), inset 0 -4px 8px rgba(0,0,0,0.3)' }}
          >
            <div className="wax-seal-crack" />
            <svg width="84" height="84" viewBox="0 0 100 100" aria-hidden="true" className="absolute inset-0">
              <defs><path id="storyseal" d="M50,50 m-34,0 a34,34 0 1,1 68,0 a34,34 0 1,1 -68,0" /></defs>
              <text style={{ fontFamily: 'var(--font-sans)', fontSize: 10.5, letterSpacing: '2px', fontWeight: 600, textTransform: 'uppercase', fill: 'var(--cream)' }}>
                <textPath href="#storyseal">· est. 2007 · Pearl District ·</textPath>
              </text>
            </svg>
            {/* little cone glyph */}
                <img loading="lazy" decoding="async" src="/images/icon-icecream-outline.webp" alt="" aria-hidden="true" width={60} height={60} className="relative z-10" style={{ width: 30, height: 30, filter: 'brightness(0) invert(0.93) sepia(0.25)' }} />
          </div>
        </div>

        {/* Header */}
        <div className="text-center">
          <motion.span {...rise} transition={{ duration: 0.7, delay: 0.05 }}
            className="block text-[12px] tracking-[5px] uppercase font-bold text-[var(--cocoa)] opacity-60 mb-3">
            Pull up a stool
          </motion.span>
          <motion.span {...rise} transition={{ duration: 0.7, delay: 0.1 }}
            className="block font-script text-[var(--berry-deep)] text-[clamp(30px,3.6vw,44px)] mb-1">
            a Pearl District story
          </motion.span>
          <motion.h2 {...rise} transition={{ duration: 0.7, delay: 0.15 }}
            className="text-[clamp(36px,5.4vw,72px)] leading-[1.02] text-[var(--cocoa)]" style={macklin}>
            Seventeen years by the fountain
          </motion.h2>
        </div>

        {/* Ornamental divider */}
        <motion.div {...rise} transition={{ duration: 0.7, delay: 0.2 }}
          className="flex items-center justify-center gap-3 my-9 text-[var(--gold)]" aria-hidden="true">
          <span className="h-px w-16 md:w-24" style={{ background: 'currentColor', opacity: 0.5 }} />
          <span className="text-[14px]">✦</span>
          <span className="h-px w-16 md:w-24" style={{ background: 'currentColor', opacity: 0.5 }} />
        </motion.div>

        {/* Narrative with a vintage drop cap */}
        <motion.p {...rise} transition={{ duration: 0.7, delay: 0.25 }}
          className="mb-[18px] leading-[1.9] text-[18px] md:text-[19px] text-[#1d0e0d] text-left">
          <span
            className="float-left mr-3 mt-1 leading-[0.72] text-[var(--berry)]"
            style={{ ...macklin, fontSize: '68px', textShadow: '1px 2px 0 rgba(28,13,12,0.15), -1px -1px 0 rgba(255,255,255,0.4)' }}
          >
            F
          </span>
          or 17 years we served this neighborhood as Cool Moon Ice Cream, scooping beside the Jamison Square fountain, made on-site in small batches with all natural ingredients.
        </motion.p>
        <motion.p {...rise} transition={{ duration: 0.7, delay: 0.3 }}
          className="mb-[18px] leading-[1.9] text-[18px] md:text-[19px] text-[#1d0e0d] text-left">
          Now we're Miss Oz, named after our beloved dog and everything she stood for: nature, animals, and slowing down for the sweet parts. Same hands, same traditions, new chapter.
        </motion.p>
        <motion.p {...rise} transition={{ duration: 0.7, delay: 0.35 }}
          className="leading-[1.9] text-[18px] md:text-[19px] text-[#1d0e0d] text-left">
          Push open the door and it's the same as it's always been. Cones are hand-dipped to order, a record turns in the corner, and there's a stool with your name on it. No rush here. Stay as long as you like.
        </motion.p>

        {/* Then → Now chapter strip */}
        <motion.div {...rise} transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-12 grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-6 sm:gap-4">
          <div className="text-center sm:text-right">
            <div className="text-[13px] tracking-[3px] uppercase font-bold text-[var(--gold)] mb-1">2007</div>
            <div className="text-[22px] text-[var(--cocoa)]" style={macklin}>Cool Moon Ice Cream</div>
            <div className="text-[15px] italic text-[#1d0e0d] opacity-70">scooping by the fountain</div>
          </div>

          <div aria-hidden="true" className="flex sm:flex-col items-center justify-center gap-2 text-[var(--berry)]">
            <span className="hidden sm:block h-8 w-px" style={{ background: 'currentColor', opacity: 0.35 }} />
            <span className="text-[20px]">❧</span>
            <span className="hidden sm:block h-8 w-px" style={{ background: 'currentColor', opacity: 0.35 }} />
            <span className="sm:hidden h-px w-10" style={{ background: 'currentColor', opacity: 0.35 }} />
          </div>

          <div className="text-center sm:text-left">
            <div className="text-[13px] tracking-[3px] uppercase font-bold text-[var(--gold)] mb-1">Today</div>
            <div className="text-[22px] text-[var(--cocoa)]" style={macklin}>Miss Oz Ice Cream</div>
            <div className="text-[15px] italic text-[#1d0e0d] opacity-70">same hands, new name</div>
          </div>
        </motion.div>

        {/* Signed closing */}
        <motion.div {...rise} transition={{ duration: 0.7, delay: 0.5 }} className="mt-12 text-center">
          <p className="font-script text-[clamp(26px,3.2vw,38px)] text-[var(--berry)] leading-snug">
            Come slow down with us.
          </p>
          <p className="font-script text-[clamp(26px,3.2vw,38px)] text-[var(--berry-deep)] leading-snug">
            The old music's already playing.
          </p>
          <span className="mt-3 inline-block text-[12px] tracking-[4px] uppercase font-bold text-[var(--cocoa)] opacity-50">
            The Miss Oz family.
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
