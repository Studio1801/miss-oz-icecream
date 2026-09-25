import { motion } from 'framer-motion';

// ─── Featured Flavor Config ───────────────────────────────────────────────────
// To swap the featured flavor, update only this object.
//
// status:  'new'          → badge reads "New! / This Season"
//          'coming-soon'  → badge reads "Soon! / Coming"
//
// poster:  path to the product or seasonal photo.
//          Leave as '' to show a styled text-teaser card instead — useful when
//          the photo isn't ready yet (e.g. a "Coming Soon" tease).
//
// accent / badgeFrom / badgeTo: adjust the color palette to match the flavor.
//   Current palette → teal/coconut.
//   For fall pumpkin, try: accent '#C0512A', badgeFrom '#E08A4C', badgeTo '#A44C22'
// ─────────────────────────────────────────────────────────────────────────────
const FLAVOR = {
  name:        'Coconut Sorbet',
  status:      'coming-soon' as 'new' | 'coming-soon',
  script:      'something fresh is coming',
  headline:    'Pure Coconut',
  description: 'Smooth and creamy dairy-free sorbet made with natural coconut milk and coconut cream.',
  tags: [
    { label: 'Dairy-free' },
    { label: 'Coconut milk & cream' },
  ],
  poster:      '/images/coconut-sorbet-poster_2.jpg',
  accent:      '#2B8A84',
  badgeFrom:   '#6ECBC4',
  badgeTo:     '#1A6460',
  glow:        'rgba(43,138,132,0.35)',
  bgOverlay:   'rgba(234,248,246,0.76)',
};
// ─────────────────────────────────────────────────────────────────────────────

// 16-point starburst polygon for the badge
const BURST = `polygon(${Array.from({ length: 32 }, (_, i) => {
  const a = (Math.PI * 2 * i) / 32;
  const r = i % 2 === 0 ? 50 : 41;
  return `${(50 + r * Math.cos(a)).toFixed(2)}% ${(50 + r * Math.sin(a)).toFixed(2)}%`;
}).join(',')})`;

function Sparkle({
  size = 22,
  color = FLAVOR.accent,
  delay = 0,
  className = '',
  style = {} as React.CSSProperties,
}) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"
      className={className}
      style={{ animation: `twinkle 2.6s ${delay}s infinite`, ...style }}
    >
      <path d="M12 1 L14 9 L22 12 L14 15 L12 23 L10 15 L2 12 L10 9 Z" fill={color} />
    </svg>
  );
}

export default function FlavorDrop() {
  const badge =
    FLAVOR.status === 'new'
      ? { top: 'New!', bottom: 'This Season' }
      : { top: 'Soon!', bottom: 'Coming' };

  return (
    <section
      className="parlour-paper relative overflow-hidden py-[84px] md:py-[128px] px-[6vw]"
      style={{
        backgroundColor: 'var(--cream-hi)',
        backgroundImage: `linear-gradient(${FLAVOR.bgOverlay}, ${FLAVOR.bgOverlay}), url(/images/seasonbg-autumn.webp)`,
        backgroundSize: 'auto, 640px',
        backgroundRepeat: 'repeat',
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,360px)_1fr] gap-12 md:gap-[72px] items-center max-w-[1240px] mx-auto">

        {/* ── Framed seasonal poster ── */}
        <motion.div
          initial={{ opacity: 0, y: 30, rotate: -4 }}
          whileInView={{ opacity: 1, y: 0, rotate: -1.6 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-[min(340px,84vw)]"
        >
          {/* warm glow behind the frame */}
          <div
            className="absolute -inset-6 rounded-[30px] blur-2xl -z-0"
            style={{ background: `radial-gradient(60% 55% at 50% 42%, ${FLAVOR.glow}, transparent 70%)` }}
            aria-hidden="true"
          />

          {/* dark wood frame */}
          <div
            className="poster-lift group relative z-10 rounded-[8px] p-[9px]"
            style={{
              background: 'linear-gradient(150deg, #23100e, #3a1c17 55%, #23100e)',
              boxShadow: '0 24px 54px rgba(28,13,12,0.4), inset 0 0 0 1px rgba(255,244,214,0.14)',
            }}
          >
            <div className="tape-strip tape-peel top-[-10px] right-[10%] rotate-3"  aria-hidden="true" />
            <div className="tape-strip tape-peel top-[-6px]  left-[10%] -rotate-6" aria-hidden="true" />

            <div className="rounded-[4px] p-[6px]" style={{ background: 'var(--cream-hi)' }}>
              {FLAVOR.poster ? (
                /* Product photo — swap in the path via FLAVOR.poster above */
                <img
                  loading="lazy" decoding="async"
                  src={FLAVOR.poster}
                  alt={`${FLAVOR.name} — seasonal flavor at Miss Oz`}
                  className="block w-full h-auto rounded-[2px]"
                  style={{ boxShadow: 'inset 0 0 0 1px rgba(28,13,12,0.12)' }}
                />
              ) : (
                /* Text-teaser card — displayed until a product photo is set */
                <div
                  className="w-full rounded-[2px] flex flex-col items-center justify-center gap-6 py-16 px-8"
                  style={{
                    minHeight: '320px',
                    background: `linear-gradient(165deg, ${FLAVOR.accent}28 0%, #152F26 65%)`,
                    boxShadow: 'inset 0 0 0 1px rgba(28,13,12,0.12)',
                  }}
                >
                  <div
                    className="text-center leading-[1.1]"
                    style={{
                      fontFamily: 'var(--font-script)',
                      fontSize: 'clamp(28px, 8vw, 42px)',
                      color: 'var(--cream-hi)',
                    }}
                  >
                    {FLAVOR.name}
                  </div>
                  <div
                    className="text-center tracking-[4px] uppercase"
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '9px',
                      fontWeight: 700,
                      color: FLAVOR.accent,
                    }}
                  >
                    ✦&nbsp;{FLAVOR.status === 'coming-soon' ? 'Coming Soon' : 'Now Available'}&nbsp;✦
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* starburst badge */}
          <div
            className="absolute z-20 -top-7 left-1 -rotate-12 motion-safe:animate-[newBadgeSwing_3.5s_ease-in-out_infinite]"
            style={{ filter: 'drop-shadow(0 6px 12px rgba(28,13,12,0.4))' }}
          >
            <div
              className="relative flex items-center justify-center w-[92px] h-[92px]"
              style={{
                background: `radial-gradient(circle at 38% 32%, ${FLAVOR.badgeFrom} 0%, ${FLAVOR.badgeTo} 100%)`,
                clipPath: BURST,
              }}
            >
              <div
                className="flex flex-col items-center justify-center w-[62px] h-[62px] rounded-full text-center leading-none"
                style={{ border: '1.5px dashed var(--cream-hi)' }}
              >
                <span aria-hidden="true" className="text-[var(--gold-hi)] text-[10px] leading-none">★</span>
                <span
                  className="uppercase text-[var(--cream-hi)] mt-[3px]"
                  style={{ fontFamily: 'var(--font-display)', fontSize: '17px', letterSpacing: '1px', textShadow: '1px 1px 0 rgba(28,13,12,0.35)' }}
                >
                  {badge.top}
                </span>
                <span
                  className="uppercase text-[var(--cream-hi)] opacity-80 mt-[2px] tracking-[1.5px]"
                  style={{ fontFamily: 'var(--font-sans)', fontSize: '6.5px', fontWeight: 700 }}
                >
                  {badge.bottom}
                </span>
              </div>
            </div>
          </div>

          {/* Yum! script accent */}
          <div
            className="absolute z-20 -right-4 -bottom-5 font-script text-[36px] text-[var(--berry)] -rotate-6 select-none"
            style={{ textShadow: '2px 2px 0 var(--cream-hi)' }}
            aria-hidden="true"
          >
            Yum! Yum!
          </div>

          <Sparkle size={26} color="var(--gold-hi)" delay={0.4} className="absolute z-20 -left-4 top-8" />
        </motion.div>

        {/* ── Copy block ── */}
        <div className="relative text-center md:text-left">
          <Sparkle size={20} delay={0}   className="hidden md:block absolute -top-4 right-10" />
          <Sparkle size={16} color="var(--berry)" delay={0.8} className="hidden md:block absolute top-8 -right-2" />

          <motion.span
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 text-[12px] tracking-[4px] uppercase font-bold mb-3"
            style={{ color: FLAVOR.accent }}
          >
            <Sparkle size={15} delay={0.2} /> New Flavor Alert <Sparkle size={15} delay={0.6} />
          </motion.span>

          <motion.span
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.08 }}
            className="block font-script text-[var(--berry-deep)] text-[clamp(28px,3.4vw,40px)] mb-1"
          >
            {FLAVOR.script}
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.14 }}
            className="text-[clamp(40px,5.6vw,74px)] leading-[0.98] mb-5 text-[var(--cocoa)]"
            style={{ fontFamily: 'var(--font-groovy)', fontWeight: 400, fontStyle: 'italic' }}
          >
            {FLAVOR.headline}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
            className="italic text-[18px] leading-relaxed text-[#1d0e0d] opacity-85 max-w-[440px] mx-auto md:mx-0"
          >
            {FLAVOR.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.28 }}
            className="mt-7 flex flex-wrap gap-3 justify-center md:justify-start"
          >
            {FLAVOR.tags.map((tag) => (
              <span
                key={tag.label}
                className="py-2 px-4 rounded-full text-[14px] font-semibold text-[var(--cream-hi)] border-[1.5px] shadow-sm"
                style={{ background: FLAVOR.accent, borderColor: FLAVOR.badgeTo }}
              >
                {tag.label}
              </span>
            ))}
          </motion.div>
        </div>

      </div>

      {/* Checkerboard parlour-floor strip */}
    </section>
  );
}
