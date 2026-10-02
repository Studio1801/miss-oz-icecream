import { useState, type ReactNode } from 'react';
import { MotionConfig } from 'framer-motion';
import Footer from './Footer';
import Loader from './Loader';
import PawTrail from './PawTrail';
import Postcard from './Postcard';

const INTRO_SESSION_KEY = 'miss-oz-intro-seen';
let cachedIntroDecision: boolean | undefined;

function shouldShowIntroForSession(isHome: boolean) {
  if (cachedIntroDecision !== undefined) return cachedIntroDecision;
  try {
    const hasSeenIntro = window.sessionStorage.getItem(INTRO_SESSION_KEY) === '1';
    window.sessionStorage.setItem(INTRO_SESSION_KEY, '1');
    cachedIntroDecision = isHome && !hasSeenIntro;
  } catch {
    cachedIntroDecision = false;
  }
  return cachedIntroDecision;
}

function GlobalMarqueeBorder() {
  const frameWidth = 'clamp(14px, 2vw, 26px)';
  const centerOffset = `calc(3px + (${frameWidth} / 2))`;

  return (
    <div className="fixed inset-0 z-[960] pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0 border-[3px] border-[var(--gold)] opacity-80" />
      <div
        className="absolute inset-[3px] border-[var(--marionberry)]"
        style={{ borderWidth: frameWidth, boxShadow: 'inset 0 0 0 2px var(--gold)' }}
      />
      <span className="bulbstrip bulbstrip-h" style={{ left: centerOffset, right: centerOffset, top: centerOffset, transform: 'translateY(-50%)' }}>
        <span className="bulbs bulbs-a" /><span className="bulbs bulbs-b" />
      </span>
      <span className="bulbstrip bulbstrip-h" style={{ left: centerOffset, right: centerOffset, bottom: centerOffset, transform: 'translateY(50%)' }}>
        <span className="bulbs bulbs-a" /><span className="bulbs bulbs-b" />
      </span>
      <span className="bulbstrip bulbstrip-v" style={{ top: centerOffset, bottom: centerOffset, left: centerOffset, transform: 'translateX(-50%)' }}>
        <span className="bulbs bulbs-a" /><span className="bulbs bulbs-b" />
      </span>
      <span className="bulbstrip bulbstrip-v" style={{ top: centerOffset, bottom: centerOffset, right: centerOffset, transform: 'translateX(50%)' }}>
        <span className="bulbs bulbs-a" /><span className="bulbs bulbs-b" />
      </span>
    </div>
  );
}

export default function SiteLayout({ children, showHero }: { children: ReactNode; showHero: boolean }) {
  const [showIntro] = useState(() => shouldShowIntroForSession(showHero));

  return (
    <MotionConfig reducedMotion="user">
      <main className="relative min-h-screen bg-[var(--cream)]">
        <Loader enabled={showHero && showIntro} />
        <div className="paper-overlay" aria-hidden="true" />
        <div className="grain-overlay" aria-hidden="true" />
        <GlobalMarqueeBorder />
        <PawTrail />
        <Postcard showHero={showHero} />
        {children}
        <Footer />
      </main>
    </MotionConfig>
  );
}