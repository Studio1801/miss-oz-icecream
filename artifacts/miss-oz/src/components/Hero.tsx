import { useState, useEffect, useRef } from 'react';
import OrderChooser from './OrderChooser';

const FLAVORS = [
  {
    title: 'Marionberry',
    kicker: 'hand crafted',
    sub: 'Deep Oregon berry, churned in small batches right in the shop.',
    bg: '#EAB8CE',
    blob: '#8C2A54',
    photo: '/images/cone-marionberry.webp',
    ink: '#241110',
    shadow: 'rgba(255,255,255,0.4)',
    tag: 'the OG',
  },
  {
    title: 'Thai Iced Tea',
    kicker: 'parlor favorite',
    sub: 'Sweet, spiced, and impossible to have just once.',
    bg: '#E3B44C',
    blob: '#5E1735',
    photo: '/images/cone-orange.webp',
    ink: '#241110',
    shadow: 'rgba(251,242,223,0.5)',
    tag: 'sells out. often.',
  },
  {
    title: 'Oreo Croffle Pop',
    kicker: 'fresh from the iron',
    sub: 'Croissant-waffle, cookies, cream. The neighborhood legend.',
    bg: '#8C2A54',
    blob: '#EAB8CE',
    photo: '/images/cone-strawberry.webp',
    ink: '#F2E1C2',
    shadow: 'rgba(36,17,16,0.45)',
    tag: 'neighborhood legend',
  },
];

export default function Hero() {
  const [idx, setIdx] = useState(0);
  const [artOpacity, setArtOpacity] = useState(1);
  const [artRotate, setArtRotate] = useState(-3);
  const [artScale, setArtScale] = useState(1);
  const [blobTransform, setBlobTransform] = useState('rotate(-4deg) scale(1)');
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const idxRef = useRef(0);

  const f = FLAVORS[idx];
  const dark = f.ink === '#F2E1C2';
  const frameColor = dark ? 'rgba(242,225,194,0.42)' : 'rgba(36,17,16,0.30)';
  const frameColorSoft = dark ? 'rgba(242,225,194,0.22)' : 'rgba(36,17,16,0.15)';

  function spin(dir: number, currentIdx: number) {
    setArtOpacity(0);
    setArtRotate(dir * 14);
    setArtScale(0.7);
    setBlobTransform(`rotate(${dir * 10 - 4}deg) scale(0.92)`);
    setTimeout(() => {
      const nextIdx = (currentIdx + dir + FLAVORS.length) % FLAVORS.length;
      idxRef.current = nextIdx;
      setIdx(nextIdx);
      setArtOpacity(1);
      setArtRotate(nextIdx % 2 === 0 ? -3 : 3);
      setArtScale(1);
      setBlobTransform('rotate(-4deg) scale(1)');
    }, 230);
  }

  function go(dir: number) {
    if (autoRef.current) clearInterval(autoRef.current);
    spin(dir, idxRef.current);
    autoRef.current = setInterval(() => spin(1, idxRef.current), 5500);
  }

  useEffect(() => {
    const reduce = typeof window !== 'undefined'
      && window.matchMedia
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return; // respect motion preference — no auto-advancing carousel
    autoRef.current = setInterval(() => spin(1, idxRef.current), 5500);
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, []);

  return (
    <div
      id="hero"
      className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden px-[5vw] pt-16 pb-[128px] text-center"
      style={{ background: f.bg, transition: 'background 0.7s ease' }}
    >
      {/* Vintage double-rule frame, like an old label */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-[12px] md:inset-[18px] z-[35] rounded-[5px] border" style={{ borderColor: frameColor }} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-[19px] md:inset-[26px] z-[35] rounded-[3px] border" style={{ borderColor: frameColorSoft }} />

      {/* Content column with clean vertical rhythm */}
      <div className="relative z-20 flex flex-col items-center w-full max-w-[1000px] mx-auto">
        <span className="block text-[12px] tracking-[5px] uppercase font-bold mb-2.5" style={{ color: f.ink, opacity: 0.85 }}>
          Small batch · Portland, Oregon
        </span>

        {/* Vintage swash divider */}
        <div className="flex items-center gap-2 mb-1" style={{ color: f.ink }}>
          <span className="h-px w-7" style={{ background: 'currentColor', opacity: 0.4 }} />
          <span style={{ opacity: 0.6, fontSize: 11 }}>✦</span>
          <span className="h-px w-7" style={{ background: 'currentColor', opacity: 0.4 }} />
        </div>

        <div
          className="text-[clamp(26px,3.6vw,38px)] leading-none"
          style={{ fontFamily: 'var(--font-script)', color: f.ink, opacity: 0.95, transition: 'color 0.5s ease' }}
        >
          {f.kicker}
        </div>

        {/* Fixed-height title box so 1-line vs 2-line flavor names don't change hero height */}
        <div
          className="mt-2 flex items-center justify-center min-h-[2.12em] sm:min-h-[1.06em]"
          style={{ fontSize: 'clamp(40px, 8.2vw, 100px)' }}
        >
          {/* Visually hidden h1 for crawlers — the business name is the true page title */}
          <h1 className="sr-only">Miss Oz Ice Cream &amp; Dessert Cafe in the Pearl District, Portland, Oregon</h1>
          <div
            className="max-w-[94vw]"
            aria-hidden="true"
            style={{
              fontFamily: 'var(--font-groovy)',
              fontWeight: 400,
              fontStyle: 'italic',
              fontSize: '1em',
              lineHeight: 1.06,
              letterSpacing: '0.5px',
              color: f.ink,
              textShadow: `2px 3px 0 ${f.shadow}`,
              transition: 'color 0.5s ease',
            }}
          >
            {f.title}
          </div>
        </div>

        {/* Flavor tag — a little ticket, safely below the title */}
        <div className="mt-4">
          <span
            className="inline-block px-5 py-1.5 rounded-full text-[18px]"
            style={{
              fontFamily: 'var(--font-script)',
              background: 'var(--cocoa)', color: 'var(--cream)',
              transform: 'rotate(-2deg)', boxShadow: '2px 4px 12px rgba(36,17,16,0.22)',
            }}
          >
            {f.tag}
          </span>
        </div>

        {/* Stage */}
        <div
          className="relative flex items-center justify-center mt-8"
          style={{ width: 'min(400px, 80vw)', height: 'min(400px, 80vw)' }}
        >
          {/* Retro sunburst rays */}
          <div
            aria-hidden="true"
            className="absolute inset-[-15%] z-0"
            style={{
              background: 'repeating-conic-gradient(from 0deg at 50% 50%, rgba(255,255,255,0.14) 0deg 6deg, transparent 6deg 13deg)',
              borderRadius: '50%',
              WebkitMaskImage: 'radial-gradient(circle, #000 58%, transparent 62%)',
              maskImage: 'radial-gradient(circle, #000 58%, transparent 62%)',
              animation: 'spinbadge 90s linear infinite',
            }}
          />

          {/* Twinkle stars */}
          <svg style={{ position: 'absolute', top: '2%', right: '0%', zIndex: 3, animation: 'twinkle 3.4s infinite', opacity: 0.7 }} width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1 L14 9 L22 12 L14 15 L12 23 L10 15 L2 12 L10 9 Z" fill="#241110"/></svg>
          <svg style={{ position: 'absolute', bottom: '6%', left: '-2%', zIndex: 3, animation: 'twinkle 3.9s infinite 0.9s', opacity: 0.7 }} width="15" height="15" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1 L14 9 L22 12 L14 15 L12 23 L10 15 L2 12 L10 9 Z" fill="#241110"/></svg>

          {/* Blob */}
          <div
            className="absolute inset-[8%] z-10"
            style={{
              background: f.blob,
              opacity: 0.42,
              animation: 'blobmorph 10s ease-in-out infinite',
              transform: blobTransform,
              transition: 'background 0.7s ease, transform 0.7s ease',
            }}
          />

          {/* Ice cream cone photo — LCP candidate, load with high priority */}
          <img
            src={f.photo}
            alt="A scoop of ice cream served in a waffle cone"
            fetchPriority="high"
            className="absolute z-20"
            style={{
              inset: '4%',
              width: '92%',
              height: '92%',
              objectFit: 'contain',
              objectPosition: 'center bottom',
              filter: 'drop-shadow(4px 8px 16px rgba(36,17,16,0.3))',
              animation: 'bob 4s ease-in-out infinite',
              opacity: artOpacity,
              transform: `rotate(${artRotate}deg) scale(${artScale})`,
              transition: 'transform 0.4s cubic-bezier(.34,1.56,.64,1), opacity 0.3s ease',
            }}
          />
        </div>

        {/* Fixed-height description box so varying line counts don't change hero height.
            min-height is typography-relative: 20px × 1.4 line-height → 2.8em = 2 lines, 4.2em = 3 lines. */}
        <div
          className="flex items-center justify-center mt-8 mb-6 min-h-[4.2em] sm:min-h-[2.8em]"
          style={{ fontSize: '20px' }}
        >
          <p
            className="max-w-[440px] mx-auto italic font-semibold text-center leading-[1.4]"
            style={{ fontSize: '1em', color: f.ink, transition: 'color 0.5s ease' }}
          >
            {f.sub}
          </p>
        </div>

        <OrderChooser variant="dark" label="Order Online" />

        {/* Dots */}
        <div className="flex gap-[10px] justify-center mt-6">
          {FLAVORS.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show ${FLAVORS[i].title}`}
              aria-current={i === idx}
              onClick={() => { if (autoRef.current) clearInterval(autoRef.current); idxRef.current = i; setIdx(i); setArtOpacity(1); setArtRotate(i % 2 === 0 ? -3 : 3); setArtScale(1); }}
              className="w-[13px] h-[13px] rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--marionberry)] focus-visible:ring-offset-2"
              style={{
                background: i === idx ? 'var(--marionberry)' : 'rgba(178,78,121,0.3)',
                border: '1.5px solid var(--marionberry)',
                boxShadow: i === idx ? '0 0 0 3px rgba(178,78,121,0.25)' : 'none',
                transform: i === idx ? 'scale(1.35)' : 'scale(1)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Nav arrows */}
      <button
        type="button"
        aria-label="Previous flavor"
        onClick={() => go(-1)}
        className="absolute left-[4vw] md:left-[6vw] top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full border-2 border-[var(--cream)] text-[var(--cream)] bg-[var(--cocoa)] z-30 hover:scale-110 transition-transform focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--cream)]"
        style={{ width: 54, height: 54, fontSize: 22 }}
      >←</button>
      <button
        type="button"
        aria-label="Next flavor"
        onClick={() => go(1)}
        className="absolute right-[4vw] md:right-[6vw] top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full border-2 border-[var(--cream)] text-[var(--cream)] bg-[var(--cocoa)] z-30 hover:scale-110 transition-transform focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--cream)]"
        style={{ width: 54, height: 54, fontSize: 22 }}
      >→</button>

      {/* Scallop bottom */}
      <div className="clip-scallop absolute bottom-[-1px] left-0 right-0 h-[46px] z-40" />
    </div>
  );
}
