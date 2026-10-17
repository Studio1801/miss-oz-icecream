/**
 * PawTrail — a wandering trail of Oz's paw prints scattered down the page
 * toward the footer. Purely decorative; fades in on scroll via framer-motion
 * whileInView (respects MotionConfig reducedMotion="user" set in home.tsx).
 */
import { motion } from 'framer-motion';

// SVG paw print — main pad + 4 toe beans
function PawPrint({ fill = 'var(--berry)' }: { fill?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ display: 'block', width: '100%', height: '100%' }}
    >
      {/* Main pad */}
      <ellipse cx="50" cy="68" rx="22" ry="18" fill={fill} />
      {/* Toe beans */}
      <ellipse cx="24" cy="44" rx="10" ry="8"  fill={fill} transform="rotate(-25 24 44)" />
      <ellipse cx="38" cy="32" rx="10" ry="8"  fill={fill} transform="rotate(-8  38 32)" />
      <ellipse cx="55" cy="31" rx="10" ry="8"  fill={fill} transform="rotate( 8  55 31)" />
      <ellipse cx="70" cy="42" rx="10" ry="8"  fill={fill} transform="rotate( 25 70 42)" />
    </svg>
  );
}

// Each paw: position within the page (top/left as %), rotation, scale, opacity
const PAWS: {
  top: string; left: string; rot: number; scale: number; opacity: number;
}[] = [
  // Entering from left, trotting down
  { top: '7%',  left: '5%',  rot: -22, scale: 0.72, opacity: 0.18 },
  { top: '9%',  left: '9%',  rot:  14, scale: 0.72, opacity: 0.18 },
  { top: '13%', left: '8%',  rot: -18, scale: 0.78, opacity: 0.20 },
  { top: '15%', left: '13%', rot:  12, scale: 0.78, opacity: 0.20 },
  // Drifting toward center
  { top: '22%', left: '18%', rot: -14, scale: 0.82, opacity: 0.20 },
  { top: '24%', left: '23%', rot:  10, scale: 0.82, opacity: 0.20 },
  { top: '31%', left: '34%', rot: -10, scale: 0.88, opacity: 0.22 },
  { top: '33%', left: '39%', rot:   8, scale: 0.88, opacity: 0.22 },
  // Crossing to the right
  { top: '41%', left: '52%', rot:  -8, scale: 0.92, opacity: 0.20 },
  { top: '43%', left: '57%', rot:  10, scale: 0.92, opacity: 0.20 },
  { top: '51%', left: '70%', rot: -16, scale: 0.88, opacity: 0.18 },
  { top: '53%', left: '75%', rot:  12, scale: 0.88, opacity: 0.18 },
  // Far right, sniffing around
  { top: '60%', left: '81%', rot: -20, scale: 0.82, opacity: 0.18 },
  { top: '62%', left: '85%', rot:  15, scale: 0.82, opacity: 0.18 },
  // Turning back, heading for the footer
  { top: '70%', left: '72%', rot: -12, scale: 0.85, opacity: 0.20 },
  { top: '72%', left: '67%', rot:   9, scale: 0.85, opacity: 0.20 },
  { top: '80%', left: '54%', rot: -16, scale: 0.90, opacity: 0.22 },
  { top: '82%', left: '49%', rot:  11, scale: 0.90, opacity: 0.22 },
  // Final stretch to the footer
  { top: '88%', left: '38%', rot: -20, scale: 0.92, opacity: 0.22 },
  { top: '90%', left: '33%', rot:  14, scale: 0.92, opacity: 0.22 },
];

export default function PawTrail() {
  return (
    <div
      aria-hidden="true"
      className="paw-trail absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 5 }}
    >
      {PAWS.map((p, i) => (
        <motion.div
          key={i}
          initial={false}
          whileInView={{ opacity: p.opacity, scale: p.scale }}
          transition={{ duration: 0.6, delay: 0.05, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.1 }}
          style={{
            position: 'absolute',
            top: p.top,
            left: p.left,
            width: 44,
            height: 44,
            transform: `rotate(${p.rot}deg)`,
            willChange: 'opacity, transform',
          }}
        >
          <PawPrint />
        </motion.div>
      ))}
    </div>
  );
}
