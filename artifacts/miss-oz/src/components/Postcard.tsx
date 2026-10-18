import PawMark from './PawMark';

import { useEffect, useRef, useState, type FocusEvent, type MouseEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useLocation } from 'wouter';
import { Bunting } from './Decor';
import OrderChooser from './OrderChooser';
import { SITE_NAV_LINKS, SiteNavigationLink, navTarget, sectionTarget } from './SiteNavigation';
import { UBEREATS_URL } from './menuCatalog';
import { useIsMobile } from '../hooks/use-mobile';

/* Full-width homepage slideshow — real storefront photos */
const SLIDES: { src: string; alt: string; pos?: string }[] = [
  {
    src: '/images/slide-cones.webp',
    alt: 'Two waffle cones with scoops of marionberry ice cream held up inside the shop',
    pos: 'center 55%',
  },
  {
    src: '/images/slide-interior-bar.webp',
    alt: 'The Miss Oz interior, chalkboard menus, colorful bunting, pendant lights, and a full display case of flavors behind the counter',
    pos: 'center 58%',
  },
  {
    src: '/images/storefront-photo-wide2.webp',
    alt: "The Miss Oz storefront in Portland's Pearl District, a corner shop with a neon Open sign in the window, lantern lights glowing inside, and a bike parked out front",
  },
  {
    src: '/images/slide-corner.webp',
    alt: 'The brick corner of the shop at dusk, with a glowing ice cream cone sculpture of string lights above the awning and the pink Miss Oz sidewalk sign out front',
    pos: 'center 62%',
  },
];

// Desktop header split: two links left of the logo, three to the right.

/* Soft ink-on-paper fade on all four edges of the hero scene */
const HERO_MASK =
  'linear-gradient(to bottom, transparent 0%, black 8%, black 96%, transparent 100%), linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%)';

export default function Postcard({ showHero = true }: { showHero?: boolean }) {
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const [fingerDown, setFingerDown] = useState(false);
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const [location] = useLocation();
  const [reduceMotion, setReduceMotion] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const menuTriggerRef = useRef<HTMLButtonElement | null>(null);
  const firstMenuLinkRef = useRef<HTMLAnchorElement | null>(null);
  const wasMenuOpenRef = useRef(false);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(preference.matches);
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const close = (e: MediaQueryListEvent) => { if (e.matches) setMenuOpen(false); };
    mq.addEventListener('change', close);
    return () => mq.removeEventListener('change', close);
  }, []);

  useEffect(() => {
    const onScroll = () => setIsHeaderScrolled(window.scrollY > 72);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!showHero || paused || focusPaused || fingerDown || reduceMotion) return;
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 11000);
    return () => clearInterval(t);
  }, [paused, focusPaused, fingerDown, reduceMotion, slide, showHero]);

  useEffect(() => {
    const release = () => setFingerDown(false);
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);
    window.addEventListener('blur', release);
    return () => {
      window.removeEventListener('pointerup', release);
      window.removeEventListener('pointercancel', release);
      window.removeEventListener('blur', release);
    };
  }, []);

  const carouselInteraction = {
    onPointerDownCapture: () => { if (isMobile) setFingerDown(true); },
    onMouseEnter: () => { if (window.matchMedia('(hover: hover)').matches) setPaused(true); },
    onMouseLeave: () => setPaused(false),
    onFocus: (event: FocusEvent<HTMLDivElement>) =>
      setFocusPaused(!isMobile || event.target.matches(':focus-visible')),
    onBlur: (event: FocusEvent<HTMLDivElement>) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setFocusPaused(false);
    },
  };

  // Prevent page scrolling behind the fixed mobile menu overlay
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setMenuOpen(false);
      }
      if (event.key !== 'Tab') return;
      const panel = document.getElementById('mobile-menu-panel');
      const targets = [
        menuTriggerRef.current,
        ...Array.from(panel?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex="0"]') ?? []),
      ].filter((element): element is HTMLElement => !!element && element.getBoundingClientRect().width > 0);
      const first = targets[0];
      const last = targets[targets.length - 1];
      if (!first || !last) return;
      if (!targets.includes(document.activeElement as HTMLElement)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) {
      wasMenuOpenRef.current = true;
      firstMenuLinkRef.current?.focus({ preventScroll: true });
    } else if (wasMenuOpenRef.current) {
      wasMenuOpenRef.current = false;
      menuTriggerRef.current?.focus({ preventScroll: true });
    }
  }, [menuOpen]);

  const toggleMenu = (event: MouseEvent<HTMLButtonElement>) => {
    menuTriggerRef.current = event.currentTarget;
    setMenuOpen((open) => !open);
  };

  const current = SLIDES[slide] ?? SLIDES[0];
  const compactHeader = isHeaderScrolled || !showHero;
  const currentPath = location.split('#')[0] || '/';
  const activeNavTarget = showHero && window.location.hash === '#visit'
    ? '/contact'
    : currentPath;
  const renderSlideDots = () => SLIDES.map((s, i) => (
    <button
      key={s.src}
      type="button"
      aria-current={i === slide}
      aria-label={`Show slide ${i + 1} of ${SLIDES.length}`}
      onClick={() => setSlide(i)}
      className="hero-slide-dot w-[9px] h-[9px] rounded-full transition-all duration-500"
      style={{
        background: isMobile
          ? i === slide ? 'var(--cream-hi)' : 'rgba(251,242,223,0.45)'
          : i === slide ? '#F4A9C7' : 'rgba(244,169,199,0.4)',
        transform: i === slide ? 'scale(1.3)' : 'scale(1)',
        boxShadow: i === slide ? '0 0 0 2px rgba(244,169,199,0.3)' : '0 1px 3px rgba(20,8,12,0.4)',
      }}
    />
  ));
  return (
    <>
    <header className="mobile-site-header relative z-[970] hidden h-14 w-full items-center justify-between border-b border-[var(--berry)] bg-[var(--cream)] px-4 max-[639px]:flex">
      <button
        type="button"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        aria-controls="mobile-menu-panel"
        onClick={toggleMenu}
        className="mobile-header-toggle flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
        style={{ background: 'rgba(94,23,53,0.06)' }}
      >
        <span className="block h-[2px] w-[18px] rounded-full bg-[var(--cocoa)] transition-transform duration-150" style={{ transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none' }} />
        <span className="block h-[2px] w-[18px] rounded-full bg-[var(--cocoa)] transition-opacity duration-150" style={{ opacity: menuOpen ? 0 : 1 }} />
        <span className="block h-[2px] w-[18px] rounded-full bg-[var(--cocoa)] transition-transform duration-150" style={{ transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none' }} />
      </button>
      <img
        src="/images/logo-official.webp"
        alt="Miss Oz, Ice Cream Cafe, Portland Oregon"
        className="absolute left-1/2 top-1/2 h-10 w-auto max-w-[92px] -translate-x-1/2 -translate-y-1/2 object-contain"
      />
      <a
        href={UBEREATS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="interaction-primary inline-flex h-11 min-w-[72px] items-center justify-center rounded-full bg-[var(--berry-deep)] px-4 text-[14px] font-bold text-[var(--cream-hi)]"
      >
        Order
      </a>
    </header>
    <section
      id="home"
      className={showHero
        ? 'relative pt-0 lg:pt-[clamp(56px,7.5vw,100px)] pb-[clamp(30px,5vw,60px)] overflow-hidden'
        : 'relative pt-[72px] lg:pt-[110px] overflow-hidden'}
      aria-label="Miss Oz Ice Cream & Dessert Cafe"
    >
      {showHero && <h1 className="sr-only">Miss Oz Ice Cream &amp; Dessert Cafe in the Pearl District, Portland, Oregon</h1>}
      {/* Bunting hanging below the global border */}
      <div
        className="absolute left-0 right-0 z-10 pointer-events-none"
        style={{ top: 'clamp(14px, 2vw, 26px)' }}
        aria-hidden="true"
      >
        <Bunting />
      </div>

      {/* MASTHEAD — desktop only; mobile nav overlays the hero photo */}
      {showHero && <div aria-hidden="true" className="hidden lg:block h-[clamp(130px,13vw,170px)]" />}
      <header
        className="fixed top-0 left-0 right-0 z-[970] px-[var(--edge)] md:px-[3vw] hidden lg:block transition-[padding,background-color,box-shadow] duration-300 ease-out"
        style={{
          left: 'clamp(14px, 2vw, 26px)',
          right: 'clamp(14px, 2vw, 26px)',
          paddingTop: compactHeader ? '7px' : '12px',
          paddingBottom: compactHeader ? '7px' : '16px',
          background: 'var(--cream)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          boxShadow: compactHeader ? '0 6px 22px rgba(20,8,12,0.2)' : '0 5px 18px rgba(20,8,12,0.12)',
        }}
      >

        {/* ── DESKTOP HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="relative hidden lg:grid items-stretch transition-[grid-template-columns,min-height] duration-300 ease-out"
          style={{
            gridTemplateColumns: compactHeader
              ? 'minmax(0,1fr) clamp(90px,10vw,120px) minmax(0,1fr)'
              : 'minmax(0,1fr) clamp(150px,16vw,190px) minmax(0,1fr)',
            minHeight: compactHeader ? '68px' : 'clamp(122px,14vw,160px)',
            overflow: 'visible',
          }}
        >
          {/* LEFT */}
          <div className="flex flex-col justify-center py-[clamp(10px,1.1vw,14px)]" style={{ borderTop: '1.5px solid var(--marionberry)', borderBottom: '1.5px solid var(--marionberry)' }}>
            <div className="flex items-center justify-center gap-[clamp(8px,1.3vw,18px)]">
            <nav aria-label="Primary" className="flex items-center justify-center gap-[clamp(8px,1.3vw,18px)]">
              {SITE_NAV_LINKS.slice(0, 2).map((n) => (
                <SiteNavigationLink
                  key={n.label}
                  to={navTarget(n.target, showHero)}
                  className="mobile-minimum-12 whitespace-nowrap uppercase font-bold text-[var(--cocoa)] hover:text-[var(--berry)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] rounded-sm"
                  style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(9px,0.8vw,11px)', letterSpacing: 'clamp(0.5px,0.1vw,1.5px)' }}
                >
                  {n.label}
                </SiteNavigationLink>
              ))}
            </nav>
            <SiteNavigationLink
              to="/about#oz"
              className="mobile-minimum-12 group relative text-center leading-snug hidden xl:block cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] rounded-sm"
              style={{
                fontFamily: 'var(--font-sans)',
                color: '#9A6E0B',
                letterSpacing: '2px',
                fontSize: 'clamp(9px,0.75vw,11px)',
                fontWeight: 800,
                textTransform: 'uppercase',
              }}
            >
              <span aria-hidden="true" className="absolute -top-[10px] -left-[12px] text-[9px] text-[var(--gold,#B8860B)]" style={{ animation: 'twinkle 2.6s 0s infinite' }}>✦</span>
              <span aria-hidden="true" className="absolute -bottom-[9px] -right-[10px] text-[8px] text-[var(--berry)]" style={{ animation: 'twinkle 2.6s 0.9s infinite' }}>✦</span>
              <span aria-hidden="true" className="absolute -top-[8px] -right-[16px] text-[7px] text-[var(--gold,#B8860B)]" style={{ animation: 'twinkle 2.6s 1.7s infinite' }}>✦</span>
              <span className="block transition-colors group-hover:text-[var(--berry)] meet-oz-wiggle">
                Small Batch, Big Heart
                <br />
                <span className="inline-block mt-[2px] tracking-[1.5px] text-[var(--berry)] group-hover:text-[var(--gold,#B8860B)]">
                  <span aria-hidden="true" className="inline-block mr-[3px] meet-oz-heart">♥</span>
                  Meet Oz!
                  <span aria-hidden="true" className="inline-block ml-[3px] meet-oz-arrow">→</span>
                </span>
              </span>
            </SiteNavigationLink>
            </div>
          </div>

          {/* CENTER — open gap */}
          <div aria-hidden="true" />

          {/* RIGHT */}
          <div className="flex flex-col justify-center py-[clamp(10px,1.1vw,14px)]" style={{ borderTop: '1.5px solid var(--marionberry)', borderBottom: '1.5px solid var(--marionberry)' }}>
            <nav aria-label="Primary continued" className="flex items-center justify-center gap-[clamp(8px,1.3vw,18px)]">
              {SITE_NAV_LINKS.slice(2).map((n) => (
                <SiteNavigationLink
                  key={n.label}
                  to={navTarget(n.target, showHero)}
                  className="mobile-minimum-12 whitespace-nowrap uppercase font-bold text-[var(--cocoa)] hover:text-[var(--berry)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] rounded-sm"
                  style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(9px,0.8vw,11px)', letterSpacing: 'clamp(0.5px,0.1vw,1.5px)' }}
                >
                  {n.label}
                </SiteNavigationLink>
              ))}
            </nav>
          </div>

          {/* LOGO — absolutely centered */}
          <div
            className="absolute left-1/2 top-1/2 z-20 flex flex-col items-center"
            style={{
              transform: 'translate(-52.18%, -50%)',
              overflow: 'visible',
            }}
          >
            <img
              src="/images/logo-official.webp"
              alt="Miss Oz, Ice Cream Cafe, Portland Oregon"
              className="h-auto transition-[width] duration-300 ease-out"
              style={{
                width: compactHeader ? 'clamp(64px,6.2vw,78px)' : 'clamp(240px,22.5vw,285px)',
                filter: 'drop-shadow(0 2px 10px rgba(93,26,58,0.18))',
              }}
            />
          </div>
        </motion.div>
        <div
          aria-hidden="true"
          className="absolute left-0 right-0 bottom-[-32px] h-[32px] pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, var(--cream) 0%, rgba(242,225,194,0.72) 36%, rgba(242,225,194,0) 100%)',
          }}
        />
      </header>

      {showHero && <>
      {/* HERO SCENE — composite: cone foreground left + rotating café backdrop right.
          z-[955] lifts the photo above the fixed paper (940) / grain (950) overlays so it stays
          bright and natural, while staying below the marquee frame (960). */}
      <div className="hero-scene-shell relative w-full z-[955] pointer-events-none">
        <div
          className="hero-photo-mask w-full relative max-w-none px-0"
          style={{
            maskImage: HERO_MASK,
            WebkitMaskImage: HERO_MASK,
            maskComposite: 'intersect',
            WebkitMaskComposite: 'source-in',
            maskSize: '100% 100%',
            WebkitMaskSize: '100% 100%',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
          }}
        >
          {/* 16:7 aspect mirrors the wide-cinema feel of the reference */}
          <motion.div
            className="hero-scene-frame relative w-full aspect-[5/8] sm:aspect-[4/3] md:aspect-[16/7] overflow-hidden"
            drag={isMobile ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={reduceMotion ? 0 : 0.08}
            dragMomentum={false}
            dragTransition={{ bounceStiffness: 400, bounceDamping: 30 }}
            style={{ touchAction: isMobile ? 'pan-y' : undefined, pointerEvents: isMobile ? 'auto' : undefined }}
            onPointerDownCapture={() => { if (isMobile) setFingerDown(true); }}
            onDragEnd={(_, info) => {
              setFingerDown(false);
              if (Math.abs(info.offset.x) < 50) return;
              setSlide((current) => (current + (info.offset.x < 0 ? 1 : -1) + SLIDES.length) % SLIDES.length);
            }}
          >

            {/* ── LAYER 1: rotating café backdrop ── */}
            <img
              key={current.src}
              src={current.src}
              alt={current.alt}
              fetchPriority="high"
              loading="eager"
              decoding="async"
              draggable={false}
              className="hero-scene-photo absolute inset-0 w-full h-full object-cover saturate-[1.05] contrast-[1.03]"
              style={{ objectPosition: current.pos ?? 'center' }}
            />

            {/* ── LAYER 2: soft darkening behind the text ── */}
            <div
              aria-hidden="true"
              className="hero-dark-overlay absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 55% 70% at 50% 52%, rgba(20,8,12,0.6) 0%, rgba(20,8,12,0.34) 55%, transparent 100%)',
              }}
            />

            {/* ── LAYER 3: brand text — centered over the slideshow ── */}
            <div
              className="hero-title-block absolute flex flex-col items-center text-center pointer-events-none left-[4%] right-[4%] sm:left-[18%] sm:right-[18%]"
              style={{
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            >
              {/* Miss Oz — Higante display, gold, matching the logo lettering */}
              <div className="hero-entrance hero-enter-title relative inline-block">
                <div
                  className="hero-title-text"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(56px,8.8vw,126px)',
                    lineHeight: 1,
                    color: '#EBC77F',
                    WebkitTextStroke: 'clamp(3px,0.45vw,7px) var(--berry)',
                    paintOrder: 'stroke fill',
                    filter: 'drop-shadow(0 4px 5px rgba(20,8,12,0.45))',
                  }}
                >
                  <span style={{ fontSize: '1.18em', position: 'relative', zIndex: 2, display: 'inline-block', verticalAlign: 'baseline' }}>M</span>
                  <span style={{ position: 'relative', zIndex: 1, display: 'inline-block' }}>iss</span>
                  {' '}
                  <span style={{ fontSize: '1.18em', position: 'relative', zIndex: 2, display: 'inline-block', verticalAlign: 'baseline' }}>O</span>
                  <span style={{ position: 'relative', zIndex: 1, display: 'inline-block' }}>z</span>
                </div>
                <div
                  aria-label="Since 2007"
                  className="hero-year-stamp hero-stamp-entrance absolute right-[-8px] top-[-68px] hidden h-[76px] w-[76px] items-center justify-center rounded-full max-[767px]:flex"
                  style={{
                    background: '#F3E7C9',
                    color: 'var(--berry)',
                    fontFamily: 'var(--font-script)',
                    fontSize: '15px',
                    fontStyle: 'italic',
                    zIndex: 3,
                    pointerEvents: 'none',
                    boxShadow: '0 6px 18px rgba(0,0,0,0.32)',
                  }}
                >
                  <span aria-hidden="true" className="absolute inset-[5px] rounded-full border border-dotted border-[var(--berry)]" />
                  <span className="hero-year-stamp-copy relative"><span>Since</span><span>2007</span></span>
                </div>
              </div>
              {/* Tagline — cream script */}
              <div
                className="hero-entrance hero-enter-tagline hero-tagline"
                style={{
                  fontFamily: 'var(--font-script)',
                  fontSize: 'clamp(17px,2.3vw,32px)',
                  color: 'var(--cream-hi)',
                  textShadow: '0 1px 10px rgba(20,8,12,0.65)',
                  marginTop: 'clamp(2px,0.4vw,6px)',
                }}
              >
                Sweet Memories Start Here.
              </div>
              {/* Subtext — hidden on mobile (too long to fit), shown sm+ */}
              <div
                className="hero-entrance hero-enter-subtext hidden sm:block"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(12px,1.15vw,17px)',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  color: '#EBC77F',
                  textShadow: '0 1px 6px rgba(20,8,12,0.75)',
                  marginTop: 'clamp(8px,1vw,14px)',
                }}
              >
                Ice Cream &amp; Handmade Desserts · Portland, Oregon
              </div>
              <div
                className="hero-since-line mobile-minimum-12 max-[767px]:hidden flex items-center justify-center gap-[clamp(10px,1vw,16px)]"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(11px,1vw,15px)',
                  letterSpacing: '2.5px',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  color: 'rgba(251,242,223,0.95)',
                  textShadow: '0 1px 6px rgba(20,8,12,0.75)',
                  marginTop: 'clamp(6px,0.7vw,10px)',
                }}
              >
                <span aria-hidden="true" className="inline-block h-px w-[clamp(24px,3vw,48px)]" style={{ background: 'rgba(251,242,223,0.6)' }} />
                Since 2007
                <span aria-hidden="true" className="inline-block h-px w-[clamp(24px,3vw,48px)]" style={{ background: 'rgba(251,242,223,0.6)' }} />
              </div>
              <div
                className="hero-pet-line max-[767px]:hidden flex items-center justify-center gap-[7px]"
                style={{ color: '#F4A9C7', marginTop: 'clamp(6px,0.7vw,10px)', textShadow: '0 1px 6px rgba(20,8,12,0.6)' }}
              >
                <span aria-hidden="true" style={{ fontSize: 'clamp(11px,1vw,15px)' }}>♥</span>
                <PawMark size={14} className="text-[#F4A9C7]" />
                <span className="mobile-minimum-12"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'clamp(7px,0.65vw,9px)',
                    fontWeight: 700,
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                  }}
                >
                  Dogs welcome
                </span>
              </div>
              {/* CTA button */}
              <div className="hero-entrance hero-enter-button hero-cta-wrap relative flex justify-center mt-[clamp(12px,1.6vw,20px)] pointer-events-auto">
                <SiteNavigationLink
                  to={sectionTarget('menu', showHero)}
                  className="hero-menu-button interaction-primary mobile-minimum-12 group relative inline-flex min-h-[44px] items-center justify-center gap-[clamp(6px,0.6vw,9px)] rounded-full overflow-hidden font-bold uppercase tracking-[2.5px] text-[#FBF2DF] transition-all duration-300 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'clamp(11px,0.95vw,14px)',
                    padding: 'clamp(10px,1vw,13px) clamp(26px,2.4vw,40px)',
                    background: 'linear-gradient(145deg, #943260 0%, #5E1735 52%, #481027 100%)',
                    border: '1.5px solid rgba(251,242,223,0.38)',
                    boxShadow: '0 8px 28px rgba(94,23,53,0.55), 0 2px 8px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,244,214,0.18)',
                  }}
                >
                  {/* shine sweep on hover */}
                  <span
                    className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(255,244,214,0.14), transparent)' }}
                    aria-hidden="true"
                  />
                  View Menu
                  <span
                    aria-hidden="true"
                    className="hero-menu-arrow inline-block not-italic"
                    style={{ color: 'var(--gold-hi)', fontSize: '0.88em', marginLeft: '-2px' }}
                  >→</span>
                </SiteNavigationLink>
              </div>
              <div className="hero-entrance hero-enter-dogs hero-mobile-dogs hidden max-[767px]:flex items-center justify-center gap-2">
                <PawMark size={18} className="text-[#F4A9C7]" />
                <span>Dogs welcome</span>
              </div>
              <div
                className="hero-mobile-carousel hidden pointer-events-auto"
                role="group"
                aria-label="Storefront slideshow controls"
                {...carouselInteraction}
              >
                {renderSlideDots()}
              </div>
            </div>

            {/* ── slide dots — bottom-center horizontal row, like the reference ── */}
            <div
              className="hero-desktop-carousel absolute left-1/2 -translate-x-1/2 bottom-[clamp(10px,1.6vw,20px)] flex flex-row gap-[8px] pointer-events-auto"
              aria-label="Storefront slideshow controls"
              {...carouselInteraction}
            >
              {renderSlideDots()}
            </div>

          </motion.div>

        </div>

        {/* "PORTLAND'S HOMEGROWN ICE CREAM CAFE" — dark ribbon below the hero photo */}
        <div
          className="mx-auto max-w-[1400px] px-[var(--edge)] md:px-[4vw]"
        >
          <div
            className="hero-ribbon-bar flex items-center justify-center gap-[clamp(10px,2vw,24px)] py-[10px] max-[639px]:flex-col max-[639px]:gap-[4px]"
            style={{ background: 'var(--cocoa)' }}
          >
            <span className="w-6 sm:w-10 h-px bg-[var(--gold-hi)] opacity-50 max-[639px]:hidden" />
            <span className="hero-ribbon-mobile hidden">Portland's homegrown ice cream cafe</span>
            <span
              className="hero-ribbon-copy mobile-minimum-12 text-center text-[var(--cream-hi)] tracking-[1.5px] sm:tracking-[5px] uppercase font-bold max-[639px]:whitespace-nowrap"
              style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(8px,0.85vw,11px)' }}
            >
              Portland's Homegrown Ice Cream Cafe
            </span>
            <span className="w-6 sm:w-10 h-px bg-[var(--gold-hi)] opacity-50 max-[639px]:hidden" />
          </div>
        </div>
      </div>
      </>}

      {/* MOBILE: keep navigation controls outside the masked/overflow-hidden hero layers for reliable taps */}
      <button
        type="button"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        aria-controls="mobile-menu-panel"
        onClick={toggleMenu}
        className="tablet-menu-toggle lg:hidden max-[639px]:hidden fixed top-4 left-4 z-[970] flex flex-col justify-center items-center gap-[5px] w-[42px] h-[42px] max-[639px]:w-11 max-[639px]:h-11 rounded-xl pointer-events-auto touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
        style={{ background: 'rgba(242,225,194,0.88)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
      >
        <span className="block h-[2px] w-[18px] bg-[var(--cocoa)] rounded-full transition-transform duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] origin-center" style={{ transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none' }} />
        <span className="block h-[2px] w-[18px] bg-[var(--cocoa)] rounded-full transition-opacity duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]" style={{ opacity: menuOpen ? 0 : 1 }} />
        <span className="block h-[2px] w-[18px] bg-[var(--cocoa)] rounded-full transition-transform duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] origin-center" style={{ transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none' }} />
      </button>
      <div aria-hidden={isHeaderScrolled} className={`tablet-menu-logo lg:hidden max-[639px]:hidden fixed top-3 left-1/2 -translate-x-1/2 z-[970] pointer-events-none transition-opacity duration-200 ${isHeaderScrolled ? 'opacity-0' : 'opacity-100'}`}>
        <img
          src="/images/logo-official.webp"
          alt="Miss Oz, Ice Cream Cafe, Portland Oregon"
          className="h-auto"
          style={{ width: '88px', filter: 'drop-shadow(0 2px 10px rgba(20,8,12,0.35))' }}
        />
      </div>

    </section>
    {createPortal(
      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.div
            key="mobile-menu-overlay"
            id="mobile-menu-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className="mobile-menu-overlay parlour-paper lg:hidden fixed inset-0 z-[955]"
            style={{ backgroundColor: '#f1e4c8' }}
            initial={{ opacity: 0, y: reduceMotion ? 0 : '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              y: reduceMotion ? 0 : '-100%',
              transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
            }}
            transition={{ duration: reduceMotion ? 0.18 : 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mobile-menu-content">
                <nav aria-label="Primary mobile navigation" className="mobile-menu-links">
                  {SITE_NAV_LINKS.map((item, index) => {
                    const isCurrent = activeNavTarget === item.target;
                    return (
                      <SiteNavigationLink
                        key={item.label}
                        asChild
                        to={navTarget(item.target, showHero)}
                        className="mobile-menu-link"
                        onClick={() => setMenuOpen(false)}
                      >
                        <motion.a
                          ref={index === 0 ? firstMenuLinkRef : undefined}
                          aria-current={isCurrent ? 'page' : undefined}
                          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{
                            opacity: 0,
                            y: reduceMotion ? 0 : 16,
                            transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
                          }}
                          transition={{
                            opacity: { duration: reduceMotion ? 0.18 : 0.24, delay: 0.12 + index * 0.05 },
                            y: { duration: reduceMotion ? 0.18 : 0.24, delay: 0.12 + index * 0.05, ease: [0.22, 1, 0.36, 1] },
                          }}
                          className="mobile-menu-link"
                        >
                          {item.label}
                        </motion.a>
                      </SiteNavigationLink>
                    );
                  })}
                  <SiteNavigationLink
                    asChild
                    to="/about#oz"
                    className="mobile-menu-link mobile-menu-meet"
                    onClick={() => setMenuOpen(false)}
                  >
                    <motion.a
                      initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{
                        opacity: 0,
                        y: reduceMotion ? 0 : 16,
                        transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
                      }}
                      transition={{
                        opacity: { duration: reduceMotion ? 0.18 : 0.24, delay: 0.37 },
                        y: { duration: reduceMotion ? 0.18 : 0.24, delay: 0.37, ease: [0.22, 1, 0.36, 1] },
                      }}
                      className="mobile-menu-link mobile-menu-meet"
                    >
                      <span aria-hidden="true">♥</span> Meet Oz!
                    </motion.a>
                  </SiteNavigationLink>
                </nav>

                <motion.div
                  className="mobile-menu-bottom"
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    y: reduceMotion ? 0 : 16,
                    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
                  }}
                  transition={{
                    opacity: { duration: reduceMotion ? 0.18 : 0.24, delay: 0.42 },
                    y: { duration: reduceMotion ? 0.18 : 0.24, delay: 0.42, ease: [0.22, 1, 0.36, 1] },
                  }}
                >
                  <a
                    href={UBEREATS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mobile-menu-order"
                    onClick={() => setMenuOpen(false)}
                  >
                    Place an Order
                  </a>
                  <div className="mobile-menu-meta">
                    <img
                      src="/images/logo-official.webp"
                      alt=""
                      aria-hidden="true"
                      className="mobile-menu-mark"
                    />
                    <p>Pearl District, Portland. Dogs welcome.</p>
                  </div>
                </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body,
    )}
    </>
  );
}
