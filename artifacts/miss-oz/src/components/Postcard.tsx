import PawMark from './PawMark';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bunting } from './Decor';
import OrderChooser from './OrderChooser';
import { SITE_NAV_LINKS, SiteNavigationLink, navTarget, sectionTarget } from './SiteNavigation';
import { UBEREATS_URL } from './menuCatalog';

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);

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
    if (!showHero || paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 11000);
    return () => clearInterval(t);
  }, [paused, slide, showHero]);

  // Prevent page scrolling behind the fixed mobile menu overlay
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const current = SLIDES[slide] ?? SLIDES[0];
  const compactHeader = isHeaderScrolled || !showHero;
  return (
    <>
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
        className="fixed top-0 left-0 right-0 z-[970] px-[3vw] hidden lg:block transition-[padding,background-color,box-shadow] duration-300 ease-out"
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
                  className="whitespace-nowrap uppercase font-bold text-[var(--cocoa)] hover:text-[var(--berry)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] rounded-sm"
                  style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(9px,0.8vw,11px)', letterSpacing: 'clamp(0.5px,0.1vw,1.5px)' }}
                >
                  {n.label}
                </SiteNavigationLink>
              ))}
            </nav>
            <SiteNavigationLink
              to="/about#oz"
              className="group relative text-center leading-snug hidden xl:block cursor-pointer transition-transform duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] rounded-sm"
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
                  className="whitespace-nowrap uppercase font-bold text-[var(--cocoa)] hover:text-[var(--berry)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] rounded-sm"
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
      <div className="relative w-full z-[955] pointer-events-none">
        <div
          className="w-full relative max-w-none px-0"
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
          <div className="relative w-full aspect-[5/8] sm:aspect-[4/3] md:aspect-[16/7] overflow-hidden">

            {/* ── LAYER 1: rotating café backdrop ── */}
            <AnimatePresence initial={false}>
              <motion.img
                key={current.src}
                src={current.src}
                alt={current.alt}
                initial={{ opacity: 0, scale: 1 }}
                animate={{ opacity: 1, scale: 1.06 }}
                exit={{ opacity: 0, scale: 1.07 }}
                transition={{
                  opacity: { duration: 1.4, ease: [0.4, 0, 0.2, 1] },
                  scale: { duration: 8, ease: 'linear' },
                }}
                className="absolute inset-0 w-full h-full object-cover saturate-[1.05] contrast-[1.03]"
                style={{ objectPosition: current.pos ?? 'center' }}
              />
            </AnimatePresence>

            {/* ── LAYER 2: soft darkening behind the text ── */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 55% 70% at 50% 52%, rgba(20,8,12,0.6) 0%, rgba(20,8,12,0.34) 55%, transparent 100%)',
              }}
            />

            {/* ── LAYER 3: brand text — centered over the slideshow ── */}
            <div
              className="absolute flex flex-col items-center text-center pointer-events-none left-[4%] right-[4%] sm:left-[18%] sm:right-[18%]"
              style={{
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            >
              {/* Miss Oz — Higante display, gold, matching the logo lettering */}
              <div
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
              {/* Tagline — cream script */}
              <div
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
                className="hidden sm:block"
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
                className="flex items-center justify-center gap-[clamp(10px,1vw,16px)]"
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
                className="flex items-center justify-center gap-[7px]"
                style={{ color: '#F4A9C7', marginTop: 'clamp(6px,0.7vw,10px)', textShadow: '0 1px 6px rgba(20,8,12,0.6)' }}
              >
                <span aria-hidden="true" style={{ fontSize: 'clamp(11px,1vw,15px)' }}>♥</span>
                <PawMark size={14} className="text-[#F4A9C7]" />
                <span
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
              <div className="flex justify-center mt-[clamp(12px,1.6vw,20px)] pointer-events-auto">
                <SiteNavigationLink
                  to={sectionTarget('menu', showHero)}
                  className="group relative inline-flex items-center justify-center gap-[clamp(6px,0.6vw,9px)] rounded-full overflow-hidden font-bold uppercase tracking-[2.5px] text-[#FBF2DF] transition-all duration-300 hover:scale-[1.06] hover:-translate-y-[2px] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
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
                    className="inline-block not-italic transition-transform duration-200 group-hover:translate-x-[3px]"
                    style={{ color: 'var(--gold-hi)', fontSize: '0.88em', marginLeft: '-2px' }}
                  >→</span>
                </SiteNavigationLink>
              </div>
            </div>

            {/* ── slide dots — bottom-center horizontal row, like the reference ── */}
            <div
              className="absolute left-1/2 -translate-x-1/2 bottom-[clamp(10px,1.6vw,20px)] flex flex-row gap-[8px] pointer-events-auto"
              aria-label="Storefront slideshow controls"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onFocus={() => setPaused(true)}
              onBlur={() => setPaused(false)}
            >
              {SLIDES.map((s, i) => (
                <button
                  key={s.src}
                  type="button"
                  aria-current={i === slide}
                  aria-label={`Show slide ${i + 1} of ${SLIDES.length}`}
                  onClick={() => setSlide(i)}
                  className="w-[9px] h-[9px] rounded-full transition-all duration-300"
                  style={{
                    background: i === slide ? '#F4A9C7' : 'rgba(244,169,199,0.4)',
                    transform: i === slide ? 'scale(1.3)' : 'scale(1)',
                    boxShadow: i === slide ? '0 0 0 2px rgba(244,169,199,0.3)' : '0 1px 3px rgba(20,8,12,0.4)',
                  }}
                />
              ))}
            </div>

          </div>

        </div>

        {/* "PORTLAND'S HOMEGROWN ICE CREAM CAFE" — dark ribbon below the hero photo */}
        <div
          className="mx-auto max-w-[1400px] px-[4vw] sm:px-[4vw]"
          aria-hidden="true"
        >
          <div
            className="flex items-center justify-center gap-[clamp(10px,2vw,24px)] py-[10px]"
            style={{ background: 'var(--cocoa)' }}
          >
            <span className="w-6 sm:w-10 h-px bg-[var(--gold-hi)] opacity-50" />
            <span
              className="text-[var(--cream-hi)] tracking-[1.5px] sm:tracking-[5px] uppercase font-bold whitespace-nowrap"
              style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(8px,0.85vw,11px)' }}
            >
              Portland's Homegrown Ice Cream Cafe
            </span>
            <span className="w-6 sm:w-10 h-px bg-[var(--gold-hi)] opacity-50" />
          </div>
        </div>
      </div>
      </>}

      {/* MOBILE: keep navigation controls outside the masked/overflow-hidden hero layers for reliable taps */}
      <button
        type="button"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((o) => !o)}
        className="lg:hidden fixed top-4 left-4 z-[970] flex flex-col justify-center items-center gap-[5px] w-[42px] h-[42px] rounded-xl pointer-events-auto touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
        style={{ background: 'rgba(242,225,194,0.88)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
      >
        <span className="block h-[2px] w-[18px] bg-[var(--cocoa)] rounded-full transition-all duration-300 origin-center" style={{ transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none' }} />
        <span className="block h-[2px] w-[18px] bg-[var(--cocoa)] rounded-full transition-all duration-300" style={{ opacity: menuOpen ? 0 : 1 }} />
        <span className="block h-[2px] w-[18px] bg-[var(--cocoa)] rounded-full transition-all duration-300 origin-center" style={{ transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none' }} />
      </button>
      <div aria-hidden={isHeaderScrolled} className={`lg:hidden fixed top-3 left-1/2 -translate-x-1/2 z-[970] pointer-events-none transition-opacity duration-200 ${isHeaderScrolled ? 'opacity-0' : 'opacity-100'}`}>
        <img
          src="/images/logo-official.webp"
          alt="Miss Oz, Ice Cream Cafe, Portland Oregon"
          className="h-auto"
          style={{ width: '88px', filter: 'drop-shadow(0 2px 10px rgba(20,8,12,0.35))' }}
        />
      </div>

      {/* MOBILE MENU — fixed full-screen overlay, slides in from top */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu-overlay"
            className="lg:hidden fixed inset-0 z-[980] flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
          >
            {/* Tap-outside-to-close backdrop */}
            <div
              className="absolute inset-0"
              style={{ background: 'rgba(20,8,12,0.72)' }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.nav
              aria-label="Mobile navigation"
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-110%' }}
              transition={{ type: 'spring', stiffness: 360, damping: 36, mass: 0.85 }}
              className="relative flex max-h-[100dvh] flex-col items-center gap-0 overflow-y-auto overscroll-contain px-6 pt-14 pb-8 rounded-b-[24px]"
              style={{ background: 'rgba(242,225,194,0.98)', boxShadow: '0 12px 40px rgba(20,8,12,0.28)' }}
            >
              {/* ✕ close */}
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full text-[var(--cocoa)] hover:bg-[rgba(178,78,121,0.08)] transition-colors text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
              >✕</button>
              {/* small logo */}
              <motion.img
                src="/images/logo-official.webp"
                alt=""
                aria-hidden="true"
                className="h-auto mb-5"
                style={{ width: '68px', opacity: 0.88 }}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 0.88, scale: 1 }}
                transition={{ delay: 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              />
              {SITE_NAV_LINKS.map((n, idx) => (
                <SiteNavigationLink
                  key={n.label}
                  asChild
                  to={navTarget(n.target, showHero)}
                  onClick={() => {
                    document.body.style.overflow = '';
                    setMenuOpen(false);
                  }}
                >
                  <motion.a
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.09 + idx * 0.045, duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full text-center py-3.5 uppercase font-bold text-[var(--cocoa)] hover:text-[var(--berry)] hover:bg-[rgba(178,78,121,0.06)] transition-colors rounded-md"
                    style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', letterSpacing: '2.5px' }}
                  >
                    {n.label}
                  </motion.a>
                </SiteNavigationLink>
              ))}
              <SiteNavigationLink
                asChild
                to="/about#oz"
                onClick={() => {
                  document.body.style.overflow = '';
                  setMenuOpen(false);
                }}
              >
                <motion.a
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.09 + SITE_NAV_LINKS.length * 0.045, duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full text-center py-3.5 font-bold hover:bg-[rgba(178,78,121,0.06)] transition-colors rounded-md"
                  style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--berry)', letterSpacing: '1.5px' }}
                >
                  ♥ Meet Oz!
                </motion.a>
              </SiteNavigationLink>
              <motion.div
                aria-hidden="true"
                className="w-12 h-px bg-[var(--marionberry)] opacity-30 my-3"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 0.3, scaleX: 1 }}
                transition={{ delay: 0.09 + (SITE_NAV_LINKS.length + 1) * 0.045, duration: 0.3 }}
              />
              <motion.a
                href={UBEREATS_URL}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.09 + (SITE_NAV_LINKS.length + 2) * 0.045, duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-full bg-[var(--berry-deep)] text-[var(--cream-hi)] font-bold uppercase tracking-[2px] text-[11px] px-7 py-3 transition-colors hover:bg-[var(--berry)]"
                style={{ fontFamily: 'var(--font-sans)' }}
                onClick={() => setMenuOpen(false)}
              >
                Place an Order
              </motion.a>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
    </>
  );
}
