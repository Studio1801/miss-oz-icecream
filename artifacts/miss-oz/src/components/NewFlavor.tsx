import { motion } from 'framer-motion';

// Keep the current artwork in one obvious place for a future real asset swap.
const FLAVOR_POSTER_ASSET = '/images/coconut-sorbet-selected.png';

const FLAVOR = {
  name: 'Coconut Sorbet',
  status: 'coming-soon' as 'new' | 'coming-soon',
  headline: 'Pure Coconut',
  script: 'something fresh is coming',
  description: 'Smooth and creamy dairy-free sorbet, made with real coconut milk and cream. No shortcuts.',
  tags: ['Dairy-free', 'Coconut milk & cream'],
  poster: FLAVOR_POSTER_ASSET,
};

const macklin = { fontFamily: 'var(--font-groovy)', fontWeight: 400, fontStyle: 'italic' as const };

// 16-pt starburst
const BURST = `polygon(${Array.from({ length: 32 }, (_, i) => {
  const a = (Math.PI * 2 * i) / 32;
  const r = i % 2 === 0 ? 50 : 41;
  return `${(50 + r * Math.cos(a)).toFixed(2)}% ${(50 + r * Math.sin(a)).toFixed(2)}%`;
}).join(',')})`;

export default function NewFlavor() {
  const badgeLabel = FLAVOR.status === 'new' ? { top: 'New!', bottom: 'This Season' } : { top: 'Soon!', bottom: 'Coming' };

  return (
    <div className="flex flex-col gap-0 items-center text-center">
      {/* Eyebrow + script + headline */}
      <motion.div
        initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full"
      >
        {/* Eyebrow — heboh edition */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 280, damping: 18 }}
          className="inline-flex items-center gap-[10px] mb-[20px] px-[18px] py-[8px] rounded-full relative"
          style={{
            background: 'var(--pink)',
            boxShadow: '0 4px 14px rgba(115,32,62,0.12)',
          }}
        >
          <span className="text-[11px] tracking-[3px] uppercase font-bold"
            style={{ color: 'var(--berry-deep)', fontFamily: 'var(--font-sans)' }}>
            ★ New Flavor Alert ★
          </span>
        </motion.div>

        {/* Script lead */}
        <div
          className="text-[clamp(22px,2.6vw,34px)] leading-[1.1] mb-[6px]"
          style={{ fontFamily: 'var(--font-script)', color: 'var(--berry)' }}
        >{FLAVOR.script}</div>

        {/* Groovy headline */}
        <h2
          className="text-[clamp(56px,7vw,96px)] leading-[0.92] mb-[24px]"
          style={{ ...macklin, color: 'var(--berry-deep)', letterSpacing: '-0.02em' }}
        >{FLAVOR.headline}</h2>
      </motion.div>

      {/* Poster — centered below the headline */}
      <motion.div
        initial={{ opacity: 0, y: 36, rotate: -5 }}
        whileInView={{ opacity: 1, y: 0, rotate: -2 }}
        viewport={{ once: true }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="relative mb-[28px] w-full max-w-[320px]"
      >
        {/* Neutral warmth keeps the existing poster artwork in focus. */}
        <div className="absolute -inset-8 rounded-[40px] blur-3xl -z-0"
          style={{ background: 'radial-gradient(55% 55% at 50% 46%, rgba(195,128,145,0.2), transparent 70%)' }}
          aria-hidden="true" />

        {/* Berry frame */}
        <div className="poster-lift relative z-10 rounded-[9px] p-[10px]"
          style={{
            background: 'linear-gradient(150deg, #6d3045, #8c4158 55%, #6d3045)',
            boxShadow: '0 18px 40px rgba(57,22,34,0.2), inset 0 0 0 1px rgba(255,244,214,0.4)',
          }}>
          <div className="tape-strip tape-peel top-[-10px] right-[10%]  rotate-3" aria-hidden="true" />
          <div className="tape-strip tape-peel top-[-6px]  left-[10%] -rotate-6" aria-hidden="true" />
          <div className="rounded-[5px] p-[5px]" style={{ background: 'var(--cream-hi)' }}>
            <img loading="lazy" decoding="async" src={FLAVOR.poster}
              alt={`Illustration of a scoop of ${FLAVOR.name} in a waffle cone, topped with coconut shavings and surrounded by coconuts`}
              width={1024}
              height={1024}
              className="block w-full h-auto rounded-[2px]" />
          </div>
        </div>

        {/* Starburst badge */}
        <div className="absolute z-20 -top-5 left-0 -rotate-12 motion-safe:animate-[newBadgeSwing_3.5s_ease-in-out_infinite]"
          style={{ filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.5))' }}>
          <div className="relative flex items-center justify-center w-[82px] h-[82px]"
            style={{ background: 'radial-gradient(circle at 38% 32%, #d47f98 0%, var(--berry-deep) 100%)', clipPath: BURST }}>
            <div className="flex flex-col items-center justify-center w-[56px] h-[56px] rounded-full text-center leading-none"
              style={{ border: '1.5px dashed var(--cream-hi)' }}>
              <span className="text-[var(--pink)] text-[9px]">★</span>
              <span className="uppercase text-[var(--cream-hi)] mt-[2px]"
                style={{ fontFamily: 'var(--font-display)', fontSize: '14px', letterSpacing: '1px' }}>
                {badgeLabel.top}
              </span>
              <span className="uppercase text-[var(--cream-hi)] opacity-80 mt-[2px] tracking-[1.5px]"
                style={{ fontFamily: 'var(--font-sans)', fontSize: '5.5px', fontWeight: 700 }}>
                {badgeLabel.bottom}
              </span>
            </div>
          </div>
        </div>

        {/* Small playful pink accent */}
        <div className="absolute z-20 -right-2 -bottom-3 -rotate-6 select-none"
          style={{ fontFamily: 'var(--font-script)', fontSize: '28px', color: 'var(--berry)', textShadow: '0 2px 8px rgba(57,22,34,0.12)' }}
          aria-hidden="true">Yum! Yum!</div>
      </motion.div>

      {/* Description + tags — centered below the poster */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
        className="w-full"
      >
        <p className="text-[15px] italic leading-relaxed mb-[16px] mx-auto max-w-[380px]"
          style={{ color: 'rgba(28,13,12,0.72)' }}>
          {FLAVOR.description}
        </p>
        <div className="flex flex-wrap gap-[9px] justify-center">
          {FLAVOR.tags.map(tag => (
            <span key={tag}
              className="py-[5px] px-[14px] rounded-full text-[11.5px] font-semibold"
              style={{
                color: 'var(--berry-deep)',
                background: 'rgba(232,177,190,0.28)',
                border: '1px solid rgba(115,32,62,0.2)',
                fontFamily: 'var(--font-sans)',
              }}>
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}