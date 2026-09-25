import Loader from '../components/Loader';
import Postcard from '../components/Postcard';
import Marquee from '../components/Marquee';
import Story from '../components/Story';
import Wholesale from '../components/Wholesale';
import Events from '../components/Events';
import Guestbook from '../components/Guestbook';
import Footer from '../components/Footer';
import FlavorStation from '../components/FlavorStation';
import MeetOz from '../components/MeetOz';
import Reels from '../components/Reels';
import PawTrail from '../components/PawTrail';
import { MotionConfig } from 'framer-motion';

function GlobalMarqueeBorder() {
  const frameWidth = 'clamp(14px, 2vw, 26px)';
  const centerOffset = `calc(3px + (${frameWidth} / 2))`;
  
  return (
    <div className="fixed inset-0 z-[960] pointer-events-none" aria-hidden="true">
      {/* Outer gold ring */}
      <div className="absolute inset-0 border-[3px] border-[var(--gold)] opacity-80" />
      
      {/* Main marionberry frame — color sampled directly from the official Miss Oz logo */}
      <div 
        className="absolute inset-[3px] border-[var(--marionberry)]" 
        style={{ 
          borderWidth: frameWidth, 
          boxShadow: 'inset 0 0 0 2px var(--gold)',
        }} 
      />
      
      {/* Marquee Bulbs embedded in the frame */}
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

export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
    <main className="relative bg-[var(--cream)] min-h-screen">
      <Loader />
      <div className="paper-overlay" aria-hidden="true" />
      <div className="grain-overlay" aria-hidden="true" />
      
      <GlobalMarqueeBorder />
      <PawTrail />
      
      <Postcard />
      <Marquee />
      {/* New Flavor Alert + Vote for Next Flavor — merged below the menu panel */}
      <FlavorStation />
      <div className="my-3 mx-[6vw] h-px bg-[var(--pink)] opacity-50" aria-hidden="true" />
      <div id="about" style={{ scrollMarginTop: '32px' }}><Story /></div>
      <div id="oz" style={{ scrollMarginTop: '32px' }}><MeetOz /></div>
      <Reels />
      <div id="wholesale" style={{ scrollMarginTop: '32px' }}><Wholesale /></div>
      <div id="events" style={{ scrollMarginTop: '32px' }}><Events /></div>
      <div className="my-3 mx-[6vw] h-px bg-[var(--pink)] opacity-50" aria-hidden="true" />
      <div id="contact" style={{ scrollMarginTop: '32px' }}><Guestbook /></div>
      <Footer />
    </main>
    </MotionConfig>
  );
}
