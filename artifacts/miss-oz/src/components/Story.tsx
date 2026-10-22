import { motion } from 'framer-motion';
import { Bunting } from './Decor';

const macklin = { fontFamily: 'var(--font-groovy)', fontWeight: 400, fontStyle: 'italic' as const };

const rise = {
  initial: false,
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
};

export default function Story() {
  return (
    <section className="story-section parlour-paper relative py-[56px] md:py-[112px] px-[var(--edge)] md:px-[6vw] bg-[var(--cream)] overflow-hidden">
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
        className="relative z-10 max-w-[1000px] mx-auto rounded-[6px] px-0 py-0 md:px-[80px] md:pt-[92px] md:pb-[76px]"
        style={{
          background: 'var(--cream-hi)',
          boxShadow: '0 24px 60px rgba(28,13,12,0.12), inset 0 0 90px rgba(199,154,59,0.10)',
          backgroundImage: 'radial-gradient(120% 90% at 50% 0%, transparent 62%, rgba(28,13,12,0.05) 100%)',
        }}
      >
        {/* Double-rule frame — echoes the hero label */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-[12px] max-[639px]:inset-[8px] rounded-[4px] border border-[rgba(28,13,12,0.22)]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-[18px] max-[639px]:inset-[12px] rounded-[2px] stitch-border border-[rgba(28,13,12,0.22)]" />

        {/* Wax-seal stamp riding the top edge */}
        <div aria-hidden="true" className="story-stamp absolute left-1/2 -translate-x-1/2 -top-[40px] z-10">
          <div
            className="wax-seal relative flex items-center justify-center rounded-full cursor-pointer"
            style={{ width: 84, height: 84, background: 'var(--berry)', boxShadow: '0 8px 24px rgba(28,13,12,0.3), inset 0 4px 8px rgba(255,255,255,0.2), inset 0 -4px 8px rgba(0,0,0,0.3)' }}
          >
            <div className="wax-seal-crack" />
            <svg width="84" height="84" viewBox="0 0 100 100" aria-hidden="true" className="absolute inset-0">
              <defs><path id="storyseal" d="M50,50 m-34,0 a34,34 0 1,1 68,0 a34,34 0 1,1 -68,0" /></defs>
              <text className="mobile-minimum-12 mobile-about-seal-copy" style={{ fontFamily: 'var(--font-sans)', fontSize: 10.5, letterSpacing: '2px', fontWeight: 600, textTransform: 'uppercase', fill: 'var(--cream)' }}>
                <textPath href="#storyseal" startOffset="4" textLength={2 * Math.PI * 34 - 8} lengthAdjust="spacing">est. 2007 · Pearl District ·</textPath>
              </text>
            </svg>
            {/* little cone glyph */}
                <img loading="lazy" decoding="async" src="/images/icon-icecream-outline.webp" alt="" aria-hidden="true" width={60} height={60} className="relative z-10" style={{ width: 30, height: 30, filter: 'brightness(0) invert(0.93) sepia(0.25)' }} />
          </div>
        </div>

        {/* Header */}
        <div className="text-center">
          <motion.h2 {...rise} transition={{ duration: 0.7, delay: 0.15 }}
            className="text-[clamp(36px,5.4vw,72px)] leading-[1.02] text-[var(--cocoa)]" style={macklin}>
            About Miss Oz Ice Cream &amp; Dessert
          </motion.h2>
        </div>

        {/* Ornamental divider */}
        <motion.div {...rise} transition={{ duration: 0.7, delay: 0.2 }}
          className="flex items-center justify-center gap-3 my-9 text-[var(--gold)]" aria-hidden="true">
          <span className="h-px w-16 md:w-24" style={{ background: 'currentColor', opacity: 0.5 }} />
          <span className="text-[14px]">✦</span>
          <span className="h-px w-16 md:w-24" style={{ background: 'currentColor', opacity: 0.5 }} />
        </motion.div>

        {/* Story copy */}
        <motion.p {...rise} transition={{ duration: 0.7, delay: 0.25 }}
          className="mb-[18px] max-[639px]:mb-[14px] leading-[1.9] max-[639px]:leading-[1.6] text-[18px] max-[639px]:text-[16px] md:text-[19px] text-[#1d0e0d] text-left">
          <span
            className="story-drop-cap float-left mr-3 mt-1 leading-[0.72] text-[var(--berry)]"
            style={{ ...macklin, fontSize: '68px', textShadow: '1px 2px 0 rgba(28,13,12,0.15), -1px -1px 0 rgba(255,255,255,0.4)' }}
          >
            O
          </span>
          ur story began in 2007 as Cool Moon Ice Cream, a neighborhood ice cream shop in Portland's Pearl District. When I took over in 2022, I wanted to honor what people already loved while bringing my own vision to life: a welcoming place to enjoy something sweet in every season.
        </motion.p>
        <motion.p {...rise} transition={{ duration: 0.7, delay: 0.3 }}
          className="mb-[18px] max-[639px]:mb-[14px] leading-[1.9] max-[639px]:leading-[1.6] text-[18px] max-[639px]:text-[16px] md:text-[19px] text-[#1d0e0d] text-left">
          Over time, that vision became Miss Oz Ice Cream &amp; Dessert. Alongside our ice cream, made in small batches, we added coffee and homemade desserts, giving people more reasons to stop in, settle down, and enjoy a little time together.
        </motion.p>
        <motion.p {...rise} transition={{ duration: 0.7, delay: 0.35 }}
          className="mb-[18px] max-[639px]:mb-[14px] leading-[1.9] max-[639px]:leading-[1.6] text-[18px] max-[639px]:text-[16px] md:text-[19px] text-[#1d0e0d] text-left">
          The name comes from my dog, Oz. This shop is the first business I've owned on my own, and Oz is the first dog I've raised as my own. Both hold a special place in my heart, and naming the shop after her felt like a natural way to bring that love into everything we do.
        </motion.p>
        <motion.p {...rise} transition={{ duration: 0.7, delay: 0.4 }}
          className="mb-[18px] max-[639px]:mb-[14px] leading-[1.9] max-[639px]:leading-[1.6] text-[18px] max-[639px]:text-[16px] md:text-[19px] text-[#1d0e0d] text-left">
          Today, we carry on the tradition of making ice cream that began here in 2007, crafting our ice cream from scratch in small batches. Our flavors range from familiar favorites to Kulfi, Thai Iced Tea, and Horchata, offering a taste of home for some and a little discovery for others.
        </motion.p>
        <motion.p {...rise} transition={{ duration: 0.7, delay: 0.45 }}
          className="mb-[18px] max-[639px]:mb-[14px] leading-[1.9] max-[639px]:leading-[1.6] text-[18px] max-[639px]:text-[16px] md:text-[19px] text-[#1d0e0d] text-left">
          At the heart of Miss Oz are the people who make it what it is: our customers, our team, and our neighbors. Whether you've been visiting since the Cool Moon days or are walking in for the first time, we're glad you're here. We hope you'll find a favorite flavor, a warm welcome, and a place that feels like part of your neighborhood.
        </motion.p>
        <motion.p {...rise} transition={{ duration: 0.7, delay: 0.5 }}
          className="mb-1 leading-[1.9] max-[639px]:leading-[1.6] text-[18px] max-[639px]:text-[16px] md:text-[19px] text-[#1d0e0d] text-left">
          Our philosophy is simple:
        </motion.p>
        <motion.p {...rise} transition={{ duration: 0.7, delay: 0.55 }}
          className="mb-[18px] text-center font-script text-[clamp(26px,3.2vw,38px)] text-[var(--berry)] leading-snug">
          Small Batch. Big Heart.
        </motion.p>
        <motion.p {...rise} transition={{ duration: 0.7, delay: 0.6 }}
          className="mb-[18px] max-[639px]:mb-[14px] leading-[1.9] max-[639px]:leading-[1.6] text-[18px] max-[639px]:text-[16px] md:text-[19px] text-[#1d0e0d] text-left">
          We make our ice cream in small batches and our sauces from scratch, giving each the time and care it deserves. To us, that extra effort is part of the pleasure: a familiar flavor that makes you smile, or a new favorite you can't wait to share.
        </motion.p>
        <motion.p {...rise} transition={{ duration: 0.7, delay: 0.65 }}
          className="mb-[18px] max-[639px]:mb-[14px] leading-[1.9] max-[639px]:leading-[1.6] text-[18px] max-[639px]:text-[16px] md:text-[19px] text-[#1d0e0d] text-left">
          Inspired by the charm of 1950s ice cream parlors, we've created a place where you can slow down and enjoy the moment. The music, the atmosphere, and a scoop served with care are all invitations to stay a little longer.
        </motion.p>
        <motion.p {...rise} transition={{ duration: 0.7, delay: 0.7 }}
          className="mb-[18px] max-[639px]:mb-[14px] leading-[1.9] max-[639px]:leading-[1.6] text-[18px] max-[639px]:text-[16px] md:text-[19px] text-[#1d0e0d] text-left">
          And the heart of it all is the people who walk through our door. Whether you're catching up with a friend, making memories with family, or simply treating yourself, we want you to feel welcome. At Miss Oz, we hope a little sweetness becomes a lovely part of your day.
        </motion.p>
      </motion.div>
    </section>
  );
}
