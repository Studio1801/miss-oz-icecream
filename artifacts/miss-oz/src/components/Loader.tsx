import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export default function Loader({ enabled }: { enabled: boolean }) {
  const [loading, setLoading] = useState(enabled);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    const timer = setTimeout(() => setLoading(false), reduce ? 150 : 250);
    return () => clearTimeout(timer);
  }, [enabled, reduce]);

  return (
    <AnimatePresence>
      {enabled && loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, visibility: 'hidden' }}
          transition={{ duration: reduce ? 0.2 : 0.4, ease: 'easeInOut' }}
          className="fixed inset-0 bg-[var(--berry-deep)] flex flex-col items-center justify-center z-[999] overflow-hidden"
        >
          {/* warm glow behind the mark */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(42% 42% at 50% 42%, rgba(234,184,206,0.22), transparent 70%)' }}
          />

          {/* logo badge with orbiting ring */}
          <div className="relative flex items-center justify-center" style={{ width: 220, height: 220 }}>
            {/* rotating dashed gold ring */}
            <motion.svg
              aria-hidden="true"
              width="220" height="220" viewBox="0 0 220 220"
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 0.85, rotate: 0 }}
              animate={
                reduce
                  ? { opacity: 0.7, scale: 1, rotate: 0 }
                  : { opacity: 0.7, scale: 1, rotate: 360 }
              }
              transition={
                reduce
                  ? { duration: 0.6 }
                  : {
                      opacity: { duration: 0.6 },
                      scale: { duration: 0.6 },
                      rotate: { duration: 14, ease: 'linear', repeat: Infinity },
                    }
              }
            >
              <circle
                cx="110" cy="110" r="104"
                fill="none" stroke="var(--gold-hi)" strokeWidth="1.5"
                strokeDasharray="2 10" strokeLinecap="round" opacity="0.85"
              />
              <circle
                cx="110" cy="110" r="96"
                fill="none" stroke="var(--gold)" strokeWidth="1" opacity="0.4"
              />
            </motion.svg>

            {/* the logo icon springs in */}
            <motion.img
              src="/images/logo-icon.webp"
              alt="Miss Oz"
              width={150}
              height={150}
              className="relative object-contain"
              style={{ width: 150, height: 'auto', filter: 'drop-shadow(0 10px 26px rgba(0,0,0,0.45))' }}
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.4, rotate: -14 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={
                reduce
                  ? { duration: 0.5 }
                  : { type: 'spring', stiffness: 180, damping: 14, delay: 0.15 }
              }
            />
          </div>

          {/* script wordmark */}
          <motion.div
            className="text-[var(--pink)] text-[clamp(44px,8vw,68px)] leading-none mt-6"
            style={{ fontFamily: 'var(--font-accent)', fontStyle: 'italic', textShadow: '2px 2px 0 rgba(0,0,0,0.25)' }}
            initial={{ opacity: 0, y: reduce ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: reduce ? 0.2 : 0.6 }}
          >
            Miss Oz
          </motion.div>

          {/* est. line, tracking eases open */}
          <motion.div
            className="text-[var(--gold-hi)] text-[13px] mt-3.5 uppercase font-semibold"
            initial={{ opacity: 0, letterSpacing: reduce ? '5px' : '2px' }}
            animate={{ opacity: 0.9, letterSpacing: '5px' }}
            transition={{ duration: 0.7, delay: reduce ? 0.35 : 0.9 }}
          >
            est. 2007 · Portland, Oregon
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
