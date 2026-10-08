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
          className="mb-[18px] leading-[1.9] text-[18px] md:text-[19px] text-[#1d0e0d] text-left">
          <span
            className="float-left mr-3 mt-1 leading-[0.72] text-[var(--berry)]"
            style={{ ...macklin, fontSize: '68px', textShadow: '1px 2px 0 rgba(28,13,12,0.15), -1px -1px 0 rgba(255,255,255,0.4)' }}
          >
            A
          </span>
          t Miss Oz Ice Cream &amp; Dessert, our mission is simple: people come first. Our shop exists because of the people who walk through our doors, our customers, our team, and our community. Great ice cream brings people in, but genuine hospitality is what keeps them coming back.
        </motion.p>
        <motion.p {...rise} transition={{ duration: 0.7, delay: 0.3 }}
          className="mb-[18px] leading-[1.9] text-[18px] md:text-[19px] text-[#1d0e0d] text-left">
          Our story began in 2007 as Cool Moon, a small shop devoted entirely to ice cream. In 2022, I took it over and gave it a new name: Miss Oz. I wanted to build something more than an ice cream shop, a place people could enjoy in every season of the year.
        </motion.p>
        <motion.p {...rise} transition={{ duration: 0.7, delay: 0.35 }}
          className="mb-[18px] leading-[1.9] text-[18px] md:text-[19px] text-[#1d0e0d] text-left">
          The name comes from Oz, my dog. This shop is my first business on my own, and Oz is my first dog on my own. I named the shop after her because these two are the most precious things I am responsible for, all by myself.
        </motion.p>
        <motion.p {...rise} transition={{ duration: 0.7, delay: 0.4 }}
          className="mb-[18px] leading-[1.9] text-[18px] md:text-[19px] text-[#1d0e0d] text-left">
          Since 2007, we have been crafting small-batch ice cream from scratch with premium ingredients and traditional methods. Alongside timeless classics, you will find globally inspired flavors like Kulfi, Thai Iced Tea, Horchata, and Mexican Vanilla, creations that celebrate diversity through flavor.
        </motion.p>
        <motion.p {...rise} transition={{ duration: 0.7, delay: 0.45 }}
          className="mb-1 leading-[1.9] text-[18px] md:text-[19px] text-[#1d0e0d] text-left">
          Our philosophy is simple:
        </motion.p>
        <motion.p {...rise} transition={{ duration: 0.7, delay: 0.5 }}
          className="mb-[18px] text-center font-script text-[clamp(26px,3.2vw,38px)] text-[var(--berry)] leading-snug">
          Small Batch. Big Heart.
        </motion.p>
        <motion.p {...rise} transition={{ duration: 0.7, delay: 0.55 }}
          className="mb-[18px] leading-[1.9] text-[18px] md:text-[19px] text-[#1d0e0d] text-left">
          We look back to the 1950s, when ice cream was served as a fine dessert. These days everything is fast, high-tech, and convenient. We go the other way. We insist on the classic methods, even if they take a little more time and trouble. We make our ice cream and our sauces the old-fashioned way and keep those flavors just as they were. And we play music from that era, so that while you are here, time slows down a little and you can feel the past.
        </motion.p>
        <motion.p {...rise} transition={{ duration: 0.7, delay: 0.6 }}
          className="mb-[18px] leading-[1.9] text-[18px] md:text-[19px] text-[#1d0e0d] text-left">
          We are not just serving dessert. We are creating a place where families gather, friends celebrate, and neighbors connect. Whether you are here for a favorite classic or something completely new, we hope you leave with a smile and a reason to come back.
        </motion.p>
        <motion.div {...rise} transition={{ duration: 0.7, delay: 0.65 }} className="mt-12 text-center">
          <p className="font-script text-[clamp(26px,3.2vw,38px)] text-[var(--berry-deep)] leading-snug">
            Welcome to Miss Oz, where sweet memories begin.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
