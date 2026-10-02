import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const rise = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const CLIPS: { src: string; poster: string; label: string; caption: string; rotate: string }[] = [
  {
    src: '/videos/reel-corner.mp4',
    poster: '/videos/reel-corner-poster.jpg',
    label: 'Video of the Pearl District street corner outside the shop',
    caption: 'our corner of the Pearl',
    rotate: '-2deg',
  },
  {
    src: '/videos/reel-counter.mp4',
    poster: '/videos/reel-counter-poster.jpg',
    label: 'Video inside the cafe, looking over the counter and menu board',
    caption: 'behind the counter',
    rotate: '1.5deg',
  },
  {
    src: '/videos/reel-oz.mp4',
    poster: '/videos/reel-oz-poster.jpg',
    label: 'Video of Oz the dog among spring wildflowers',
    caption: 'Oz, out on assignment',
    rotate: '-1.5deg',
  },
];

/** Vintage taped "home movie" — a muted looping clip in a snapshot frame. */
function Reel({
  src,
  poster,
  label,
  caption,
  rotate,
}: {
  src: string;
  poster: string;
  label: string;
  caption: string;
  rotate: string;
}) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);

  // Only play while on screen (and never when reduced motion is on)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (inView && !prefersReduced) {
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [inView, prefersReduced]);

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
        className="absolute -top-[12px] left-1/2 -translate-x-1/2 w-[76px] h-[24px] rotate-[2deg]"
        style={{ background: 'rgba(214,193,150,0.75)', boxShadow: '0 1px 3px rgba(28,13,12,0.15)' }}
      />
      <div className="relative aspect-[9/16] overflow-hidden rounded-[2px] bg-[rgba(28,13,12,0.05)]">
        <video
          ref={ref}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="none"
          aria-label={label}
          className="w-full h-full object-cover sepia-[10%] saturate-[0.94] contrast-[1.03]"
        />
        {/* soft vignette to match the photo treatment */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: 'inset 0 0 34px rgba(28,13,12,0.28)' }}
        />
      </div>
      <figcaption className="font-script-alt text-[19px] text-[var(--berry-deep)] text-center mt-[10px] leading-tight">
        {caption}
      </figcaption>
    </figure>
  );
}

export default function Reels() {
  return (
    <section className="parlour-paper relative py-[80px] md:py-[110px] px-[6vw] bg-[var(--cream)] overflow-hidden">
      <div className="max-w-[1300px] mx-auto">
        <motion.div {...rise} transition={{ duration: 0.7 }} className="text-center mb-[52px]">
          <span className="flex items-center justify-center gap-[10px] text-[var(--gold)] mb-[14px]" aria-hidden="true">
            <span className="inline-block w-[42px] h-px bg-[var(--gold)] opacity-70" />
            <span className="text-[10px] leading-none rotate-45 inline-block">◆</span>
            <span className="inline-block w-[42px] h-px bg-[var(--gold)] opacity-70" />
          </span>
          <h2
            className="text-[var(--berry-deep)]"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px, 4.4vw, 52px)', lineHeight: 1.08 }}
          >
            Little Home Movies
          </h2>
          <p className="mt-[12px] text-[var(--cocoa)] text-[16px] md:text-[17px] max-w-[540px] mx-auto">
            A few seconds of everyday life. Our street corner, the counter, and the shop dog hard at work.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-[28px] gap-y-[56px] items-start">
          {CLIPS.map((c, i) => (
            <motion.div key={c.src} {...rise} transition={{ duration: 0.7, delay: i * 0.12 }}>
              <Reel {...c} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
