import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Bunting } from './Decor';
import OrderChooser from './OrderChooser';

/* Full-width homepage slideshow — real storefront photos */
const SLIDES: { src: string; alt: string; pos?: string }[] = [
  {
    src: '/images/slide-cones.webp',
    alt: 'Two waffle cones with scoops of marionberry ice cream held up inside the shop',
    pos: 'center 55%',
  },
  {
    src: '/images/slide-interior-bar.webp',
    alt: 'The Miss Oz interior — chalkboard menus, colorful bunting, pendant lights, and a full display case of flavors behind the counter',
    pos: 'center 58%',
  },
  {
    src: '/images/storefront-photo-wide2.webp',
    alt: "The Miss Oz storefront in Portland's Pearl District — a corner shop with a neon Open sign in the window, lantern lights glowing inside, and a bike parked out front",
  },
  {
    src: '/images/slide-corner.webp',
    alt: 'The brick corner of the shop at dusk, with a glowing ice cream cone sculpture of string lights above the awning and the pink Miss Oz sidewalk sign out front',
    pos: 'center 62%',
  },
];

const NAV = [
  { label: 'Home', target: 'home' },
  { label: 'About', target: 'about' },
  { label: 'Wholesale', target: 'wholesale' },
  { label: 'Event', target: 'events' },
  { label: 'Contact', target: 'contact' },
];
// Desktop header split: NAV.slice(0, 2) → left | NAV.slice(2) → right

type Tone = 'cream' | 'teal' | 'pink' | 'gold';

const TONES: Record<Tone, { bg: string; border: string; title: string; desc: string; eyebrow: string; scrim: string; bgimg: string }> = {
  cream: { bg: 'var(--paper)', border: 'var(--teal-deep)', title: 'var(--cocoa)', desc: 'var(--cocoa)', eyebrow: 'var(--teal-deep)', scrim: 'rgba(239,226,196,0.42)', bgimg: '/images/panelbg-cream.webp' },
  teal: { bg: 'var(--teal-deep)', border: 'var(--gold)', title: 'var(--cream-hi)', desc: 'var(--gold-hi)', eyebrow: 'var(--gold-hi)', scrim: 'rgba(23,63,60,0.5)', bgimg: '/images/panelbg-teal.webp' },
  pink: { bg: 'var(--pink)', border: 'var(--berry)', title: 'var(--berry-deep)', desc: 'var(--cocoa)', eyebrow: 'var(--berry)', scrim: 'rgba(234,184,206,0.4)', bgimg: '/images/panelbg-pink.webp' },
  gold: { bg: 'var(--gold)', border: 'var(--brick)', title: 'var(--cocoa)', desc: 'var(--cocoa)', eyebrow: 'var(--cocoa)', scrim: 'rgba(199,154,59,0.48)', bgimg: '/images/panelbg-gold.webp' },
};


const FLAVORS: { name: string; desc: string }[] = [
  { name: 'Mexican Vanilla', desc: 'Extra rich vanilla flavor from 4-fold vanilla extract.' },
  { name: 'Matcha', desc: 'Ceremonial-grade matcha with an earthy, smooth flavor.' },
  { name: 'Kulfi', desc: 'Traditional Indian cardamom & pistachio' },
  { name: 'Birthday Cake', desc: 'Sweet yellow cake with confetti sprinkles.' },
  { name: 'Butter Pecan', desc: 'Toasted pecans in our house-made Scotch sauce.' },
  { name: 'Salty Caramel', desc: 'Buttery caramel with sea salt' },
  { name: 'Mint Chip', desc: 'Fresh mint steeped with loose-leaf tea and mixed with semi-sweet chocolate chips.' },
  { name: 'Coffee Crackle', desc: 'Coffee ice cream with chocolate crackle' },
  { name: 'Fresh Banana', desc: 'Real banana. Naturally sweet' },
  { name: 'Belgian Chocolate', desc: 'House-made chocolate base with premium Sudan cocoa powder.' },
  { name: 'Cookies & Cream', desc: 'Oreo cookies folded into sweet cream.' },
  { name: 'Marionberry', desc: 'Oregon marionberries in creamy goodness' },
];

const MENU_CATEGORIES = ['Flavors', 'Sundaes', 'Croffles & Desserts', 'Drinks', 'Whole Cakes'];

type MenuItem = { name: string; note?: string; details?: string[] };
const MENU_ITEMS: Record<string, MenuItem[]> = {
  Sundaes: [
    { name: 'Miss Oz Cherry Crown Sundae', note: 'Three mini scoops and One single scoop topped with our house-made cherry syrup for a classic old-fashioned sundae.' },
    { name: 'Midnight Fudge Sundae', note: 'Two scoops with our house-made hot fudge, whipped cream, rainbow sprinkles and a cherry on top.' },
    { name: 'Rose City Banana Split', note: 'Vanilla, strawberry, and chocolate ice cream with three different sauces, topped with whipped cream, sprinkles, and cherries.' },
  ],
  Drinks: [
    { name: 'Root Beer Float', note: 'Creamy house vanilla in an icy frosted mug' },
    { name: 'Coke Float', note: 'Classic cola with a generous scoop — simple perfection' },
    { name: 'Milkshakes', note: 'Blended thick & rich in any of our rotating flavors' },
  ],
  'Whole Cakes': [
    {
      name: 'Original Basque Cheesecake',
      details: ['6" — $55', '8" — $85 (8 slices)', '10" — $85 (12 slices)'],
    },
  ],
};

const UBEREATS_URL = 'https://www.ubereats.com/store/miss-oz-ice-cream-cafe-aka-cool-moon-ice-creams/YEfj7ZgZS2m7Wm2og7PphQ';

const hrefFor = (t: string) => (t === 'ubereats' ? UBEREATS_URL : t === 'home' ? '#home' : `#${t}`);

function getFollowingWednesday() {
  const date = new Date();
  const daysUntilWednesday = (3 - date.getDay() + 7) % 7 || 7;
  date.setDate(date.getDate() + daysUntilWednesday);
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function BasqueCheesecakeIllustration() {
  return (
    <svg viewBox="0 0 180 150" role="img" aria-label="Illustration of a Basque cheesecake" className="w-full h-full">
      <ellipse cx="90" cy="126" rx="68" ry="13" fill="#6b3a3b" opacity=".14" />
      <path d="M28 112c5 9 29 16 62 16s57-7 62-16l-4-16H32Z" fill="#e5c992" stroke="#6b3a3b" strokeWidth="3" />
      <path d="M32 97c0-15 26-28 58-28s58 13 58 28-26 24-58 24-58-9-58-24Z" fill="#dcae68" stroke="#6b3a3b" strokeWidth="3" />
      <path d="M37 91c4-16 25-29 53-29s49 13 53 29c-12 8-30 12-53 12s-41-4-53-12Z" fill="#70402f" stroke="#48252a" strokeWidth="3" />
      <path d="M48 82c9-10 23-15 42-15 18 0 32 5 42 15-12 5-26 8-42 8-17 0-31-3-42-8Z" fill="#9a5b3d" opacity=".7" />
      <path d="M64 76c5-5 8-8 10-13M91 83c-2-7 0-13 4-19M116 79c-2-4-2-8 0-12" fill="none" stroke="#e0a56b" strokeWidth="3" strokeLinecap="round" opacity=".75" />
      <circle cx="137" cy="48" r="10" fill="#9b3553" stroke="#6b3a3b" strokeWidth="2" />
      <path d="M133 45c3-4 7-4 9-1" fill="none" stroke="#f4d9a0" strokeWidth="2" strokeLinecap="round" opacity=".7" />
    </svg>
  );
}

function scrollToId(target: string, behavior: ScrollBehavior = 'smooth') {
  if (target === 'home') { window.scrollTo({ top: 0, behavior }); return; }
  const el = document.getElementById(target);
  if (!el) return;
  // Capture position at click-time so mid-scroll layout shifts (framer-motion) can't redirect us
  const top = Math.round(el.getBoundingClientRect().top + window.scrollY);
  window.scrollTo({ top, behavior });
}

function handleNav(e: React.MouseEvent<HTMLAnchorElement>, target: string) {
  if (target === 'ubereats') return;
  e.preventDefault();
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  scrollToId(target, reduce ? 'auto' : 'smooth');
}

/* Soft ink-on-paper fade on all four edges of the hero scene */
const HERO_MASK =
  'linear-gradient(to bottom, transparent 0%, black 8%, black 96%, transparent 100%), linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%)';

export default function Postcard() {
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Flavors');
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const [cakeOrderStatus, setCakeOrderStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [cakeOrderOpen, setCakeOrderOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
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
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 11000);
    return () => clearInterval(t);
  }, [paused, slide]);

  // Prevent page scrolling behind the fixed mobile menu overlay
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    if (!cakeOrderOpen) return;
    const closeOnEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') setCakeOrderOpen(false); };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [cakeOrderOpen]);

  const current = SLIDES[slide] ?? SLIDES[0];
  const followingWednesday = getFollowingWednesday();

  async function handleCakeOrderSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCakeOrderStatus('sending');
    const form = e.currentTarget;
    const values = new FormData(form);
    const message = [
      'Whole Basque Cheesecake pre-order',
      `Cake size: ${values.get('cakeSize')}`,
      `Quantity: ${values.get('quantity')}`,
      `Pickup date: ${values.get('pickupDate')}`,
      `Order notes: ${values.get('notes') || 'None'}`,
    ].join('\n');
    const base = import.meta.env.BASE_URL.replace(/\/$/, '');
    try {
      const response = await fetch(`${base}/api/inquire`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.get('name'),
          email: values.get('email'),
          phone: values.get('phone'),
          type: 'general',
          message,
        }),
      });
      if (!response.ok) throw new Error('Order request failed');
      form.reset();
      setCakeOrderStatus('sent');
    } catch {
      setCakeOrderStatus('error');
    }
  }

  return (
    <>
    <section
      id="home"
      className="relative pt-0 md:pt-[clamp(56px,7.5vw,100px)] pb-[clamp(30px,5vw,60px)] overflow-hidden"
      aria-label="Miss Oz Ice Cream & Dessert Cafe"
    >
      {/* Bunting hanging below the global border */}
      <div
        className="absolute left-0 right-0 z-10 pointer-events-none"
        style={{ top: 'clamp(14px, 2vw, 26px)' }}
        aria-hidden="true"
      >
        <Bunting />
      </div>

      {/* MASTHEAD — desktop only; mobile nav overlays the hero photo */}
      <div aria-hidden="true" className="hidden md:block h-[clamp(130px,13vw,170px)]" />
      <header
        className="fixed top-0 left-0 right-0 z-[970] px-[4vw] hidden md:block transition-[padding,background-color,box-shadow] duration-300 ease-out"
        style={{
          left: 'clamp(14px, 2vw, 26px)',
          right: 'clamp(14px, 2vw, 26px)',
          paddingTop: isHeaderScrolled ? '7px' : '12px',
          paddingBottom: isHeaderScrolled ? '7px' : '16px',
          background: 'var(--cream)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          boxShadow: isHeaderScrolled ? '0 6px 22px rgba(20,8,12,0.2)' : '0 5px 18px rgba(20,8,12,0.12)',
        }}
      >

        {/* ── DESKTOP HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="relative hidden md:grid items-stretch transition-[grid-template-columns,min-height] duration-300 ease-out"
          style={{
            gridTemplateColumns: isHeaderScrolled
              ? 'minmax(0,1fr) clamp(104px,12vw,140px) minmax(0,1fr)'
              : 'minmax(0,1fr) clamp(150px,16vw,190px) minmax(0,1fr)',
            minHeight: isHeaderScrolled ? '68px' : 'clamp(122px,14vw,160px)',
            overflow: 'visible',
          }}
        >
          {/* LEFT */}
          <div className="flex flex-col justify-center py-[clamp(10px,1.1vw,14px)]" style={{ borderTop: '1.5px solid var(--marionberry)', borderBottom: '1.5px solid var(--marionberry)' }}>
            <div className="flex items-center justify-center gap-[clamp(14px,2.6vw,44px)]">
            <nav aria-label="Primary" className="flex items-center justify-center gap-[clamp(14px,2.6vw,44px)]">
              {NAV.slice(0, 2).map((n) => (
                <a
                  key={n.label}
                  href={hrefFor(n.target)}
                  onClick={(e) => handleNav(e, n.target)}
                  className="whitespace-nowrap uppercase font-bold text-[var(--cocoa)] hover:text-[var(--berry)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] rounded-sm"
                  style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(10px,0.95vw,12px)', letterSpacing: 'clamp(1.5px,0.2vw,2.5px)' }}
                >
                  {n.label}
                </a>
              ))}
            </nav>
            <a
              href="#oz"
              onClick={(e) => handleNav(e, 'oz')}
              className="group relative text-center leading-snug hidden md:block cursor-pointer transition-transform duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] rounded-sm"
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
            </a>
            </div>
          </div>

          {/* CENTER — open gap */}
          <div aria-hidden="true" />

          {/* RIGHT */}
          <div className="flex flex-col justify-center py-[clamp(10px,1.1vw,14px)]" style={{ borderTop: '1.5px solid var(--marionberry)', borderBottom: '1.5px solid var(--marionberry)' }}>
            <nav aria-label="Primary continued" className="flex items-center justify-center gap-[clamp(10px,1.8vw,30px)]">
              {NAV.slice(2).map((n) => (
                <a
                  key={n.label}
                  href={hrefFor(n.target)}
                  {...(n.target === 'ubereats' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  onClick={(e) => handleNav(e, n.target)}
                  className="whitespace-nowrap uppercase font-bold text-[var(--cocoa)] hover:text-[var(--berry)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] rounded-sm"
                  style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(10px,0.95vw,12px)', letterSpacing: 'clamp(1.5px,0.2vw,2.5px)' }}
                >
                  {n.label}
                </a>
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
              alt="Miss Oz — Ice Cream Cafe, Portland Oregon"
              className="h-auto transition-[width] duration-300 ease-out"
              style={{
                width: isHeaderScrolled ? 'clamp(64px,6.2vw,78px)' : 'clamp(240px,22.5vw,285px)',
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
                  fontFamily: "'Libertinus Math', serif",
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
                  fontFamily: "'Libertinus Math', serif",
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
              <div aria-hidden="true" style={{ color: '#F4A9C7', fontSize: 'clamp(11px,1vw,15px)', marginTop: 'clamp(6px,0.7vw,10px)', textShadow: '0 1px 6px rgba(20,8,12,0.6)' }}>♥</div>
              {/* CTA button */}
              <div className="flex justify-center mt-[clamp(12px,1.6vw,20px)] pointer-events-auto">
                <a
                  href="#step-inside"
                  onClick={(e) => handleNav(e, 'step-inside')}
                  className="group relative inline-flex items-center justify-center gap-[clamp(6px,0.6vw,9px)] rounded-full overflow-hidden font-bold uppercase tracking-[2.5px] text-[#FBF2DF] transition-all duration-300 hover:scale-[1.06] hover:-translate-y-[2px] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
                  style={{
                    fontFamily: "'Libertinus Math', serif",
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
                </a>
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

      {/* MOBILE: keep navigation controls outside the masked/overflow-hidden hero layers for reliable taps */}
      <button
        type="button"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((o) => !o)}
        className="md:hidden fixed top-4 left-4 z-[970] flex flex-col justify-center items-center gap-[5px] w-[42px] h-[42px] rounded-xl pointer-events-auto touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
        style={{ background: 'rgba(242,225,194,0.88)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
      >
        <span className="block h-[2px] w-[18px] bg-[var(--cocoa)] rounded-full transition-all duration-300 origin-center" style={{ transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none' }} />
        <span className="block h-[2px] w-[18px] bg-[var(--cocoa)] rounded-full transition-all duration-300" style={{ opacity: menuOpen ? 0 : 1 }} />
        <span className="block h-[2px] w-[18px] bg-[var(--cocoa)] rounded-full transition-all duration-300 origin-center" style={{ transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none' }} />
      </button>
      <div className="md:hidden fixed top-3 left-1/2 -translate-x-1/2 z-[970] pointer-events-none">
        <img
          src="/images/logo-official.webp"
          alt="Miss Oz — Ice Cream Cafe, Portland Oregon"
          className="h-auto"
          style={{ width: '88px', filter: 'drop-shadow(0 2px 10px rgba(20,8,12,0.35))' }}
        />
      </div>

      {/* MOBILE MENU — fixed full-screen overlay, slides in from top */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu-overlay"
            className="md:hidden fixed inset-0 z-[980] flex flex-col"
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
              className="relative flex flex-col items-center gap-0 pt-14 pb-8 px-6 rounded-b-[24px]"
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
              {NAV.map((n, idx) => (
                <motion.a
                  key={n.label}
                  href={hrefFor(n.target)}
                  {...(n.target === 'ubereats' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.09 + idx * 0.045, duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
                  onClick={(e) => {
                    document.body.style.overflow = '';
                    handleNav(e, n.target);
                    setMenuOpen(false);
                  }}
                  className="w-full text-center py-3.5 uppercase font-bold text-[var(--cocoa)] hover:text-[var(--berry)] hover:bg-[rgba(178,78,121,0.06)] transition-colors rounded-md"
                  style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', letterSpacing: '2.5px' }}
                >
                  {n.label}
                </motion.a>
              ))}
              <motion.a
                href={hrefFor('oz')}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.09 + NAV.length * 0.045, duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => {
                  document.body.style.overflow = '';
                  handleNav(e, 'oz');
                  setMenuOpen(false);
                }}
                className="w-full text-center py-3.5 font-bold hover:bg-[rgba(178,78,121,0.06)] transition-colors rounded-md"
                style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--berry)', letterSpacing: '1.5px' }}
              >
                ♥ Meet Oz!
              </motion.a>
              <motion.div
                aria-hidden="true"
                className="w-12 h-px bg-[var(--marionberry)] opacity-30 my-3"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 0.3, scaleX: 1 }}
                transition={{ delay: 0.09 + (NAV.length + 1) * 0.045, duration: 0.3 }}
              />
              <motion.a
                href={UBEREATS_URL}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.09 + (NAV.length + 2) * 0.045, duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
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

      {/* SECTION PANELS — poster-like taped cards, click to explore */}
      <div id="step-inside" className="relative z-20 mx-auto max-w-none px-0 mt-[clamp(18px,2.4vw,30px)]" style={{ scrollMarginTop: '32px' }}>
        <div className="flex items-center justify-center gap-3 mb-[clamp(14px,1.8vw,22px)]">
          <span className="w-10 h-px bg-[var(--gold)] opacity-60" aria-hidden="true" />
          <span className="text-[var(--berry-deep)] text-[12px] tracking-[4px] uppercase font-bold" style={{ fontFamily: 'var(--font-sans)' }}>Step Inside</span>
          <span className="w-10 h-px bg-[var(--gold)] opacity-60" aria-hidden="true" />
        </div>

        {/* MOBILE: striped awning + green category strip — visible only on mobile */}
        <div className="md:hidden">
          {/* awning — same cream+berry alternating stripe + scalloped edge as desktop panels */}
          <div aria-hidden="true" className="relative z-10 -mb-[2px]">
            <div
              className="h-[14px] rounded-t-[10px]"
              style={{
                background: 'repeating-linear-gradient(90deg, var(--cream-hi) 0 22px, var(--berry-deep) 22px 44px)',
                boxShadow: 'inset 0 -4px 8px rgba(28,13,12,0.2), 0 3px 8px rgba(0,0,0,0.18)',
              }}
            />
            <div
              className="h-[9px]"
              style={{
                background: 'repeating-linear-gradient(90deg, var(--cream-hi) 0 22px, var(--berry-deep) 22px 44px)',
                WebkitMaskImage: 'radial-gradient(11px at 50% 0, #000 98%, transparent 100%)',
                maskImage: 'radial-gradient(11px at 50% 0, #000 98%, transparent 100%)',
                WebkitMaskSize: '22px 100%',
                maskSize: '22px 100%',
                WebkitMaskRepeat: 'repeat-x',
                maskRepeat: 'repeat-x',
                filter: 'drop-shadow(0 3px 4px rgba(0,0,0,0.18))',
              } as React.CSSProperties}
            />
          </div>
          {/* forest-green bar with horizontally scrollable category buttons */}
          <div
            className="px-3 py-[10px]"
            style={{ background: 'linear-gradient(180deg, #1D4234 0%, #152B23 100%)' }}
          >
            <div
              className="flex gap-[7px] overflow-x-auto"
              style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
            >
              {MENU_CATEGORIES.map((c) => {
                const active = activeCategory === c;
                return (
                  <motion.button
                    key={c}
                    type="button"
                    onClick={() => setActiveCategory(c)}
                    whileTap={{ scale: 0.93 }}
                    className="relative shrink-0 font-bold uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
                    style={{
                      fontFamily: "'Libertinus Math', serif",
                      fontSize: '10px',
                      letterSpacing: '2px',
                      padding: '6px 13px',
                      borderRadius: '999px',
                      whiteSpace: 'nowrap',
                      color: active ? '#152F26' : 'rgba(242,225,194,0.85)',
                      border: '1.5px solid transparent',
                      transition: 'color 0.25s ease',
                    }}
                  >
                    {active && (
                      <motion.span
                        layoutId="mobile-pill-active"
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: 'linear-gradient(135deg, #FFE099 0%, #FFD068 100%)',
                          boxShadow: '0 2px 14px rgba(255,209,104,0.4)',
                        }}
                        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                      />
                    )}
                    <span className="relative">{c}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[minmax(170px,220px)_minmax(380px,1fr)_minmax(170px,220px)] lg:grid-cols-[minmax(210px,270px)_minmax(420px,1fr)_minmax(210px,270px)] gap-[clamp(14px,1.8vw,22px)] items-stretch md:px-[clamp(20px,3vw,48px)]">

          {/* LEFT — forest-green menu category card with striped awning (decorative list, like a painted parlor sign) */}
          <aside aria-label="Menu categories" className="relative mx-auto w-full max-w-[320px] md:max-w-none hidden md:flex flex-col">
            {/* striped awning — cream + marionberry */}
            <div aria-hidden="true" className="relative z-10 -mb-[2px]">
              <div className="h-[14px] rounded-t-[10px]" style={{ background: 'repeating-linear-gradient(90deg, var(--cream-hi) 0 22px, var(--berry-deep) 22px 44px)', boxShadow: 'inset 0 -4px 8px rgba(28,13,12,0.2), 0 3px 8px rgba(0,0,0,0.18)' }} />
              <div className="h-[9px]" style={{ background: 'repeating-linear-gradient(90deg, var(--cream-hi) 0 22px, var(--berry-deep) 22px 44px)', WebkitMaskImage: 'radial-gradient(11px at 50% 0, #000 98%, transparent 100%)', maskImage: 'radial-gradient(11px at 50% 0, #000 98%, transparent 100%)', WebkitMaskSize: '22px 100%', maskSize: '22px 100%', WebkitMaskRepeat: 'repeat-x', maskRepeat: 'repeat-x', filter: 'drop-shadow(0 3px 4px rgba(0,0,0,0.18))' }} />
            </div>
            <div
              className="flex-1 flex flex-col items-center rounded-b-[12px] px-3 py-[clamp(14px,1.6vw,20px)]"
              style={{
                background: 'linear-gradient(165deg, #17352B 0%, #122B23 55%, #16332A 100%)',
                boxShadow: '0 14px 34px rgba(28,13,12,0.3), inset 0 0 0 1.5px rgba(242,225,194,0.3)',
              }}
            >
              {/* inner frame — double tan lines with chamfered "dent" corners, lighter green inside */}
              <div className="flex-1 w-full flex flex-col" style={{ background: 'rgba(242,225,194,0.55)', clipPath: 'polygon(22px 0, calc(100% - 22px) 0, 100% 22px, 100% calc(100% - 22px), calc(100% - 22px) 100%, 22px 100%, 0 calc(100% - 22px), 0 22px)', padding: '1px' }}>
                <div className="flex-1 flex flex-col" style={{ background: '#152F26', clipPath: 'polygon(21px 0, calc(100% - 21px) 0, 100% 21px, 100% calc(100% - 21px), calc(100% - 21px) 100%, 21px 100%, 0 calc(100% - 21px), 0 21px)', padding: '3px' }}>
                  <div className="flex-1 flex flex-col" style={{ background: 'rgba(242,225,194,0.8)', clipPath: 'polygon(18px 0, calc(100% - 18px) 0, 100% 18px, 100% calc(100% - 18px), calc(100% - 18px) 100%, 18px 100%, 0 calc(100% - 18px), 0 18px)', padding: '1px' }}>
              <div className="flex-1 w-full flex flex-col items-center justify-center px-4 py-[clamp(18px,2vw,28px)]"
                style={{
                  background: 'radial-gradient(120% 90% at 30% 15%, rgba(255,255,255,0.07), transparent 60%), linear-gradient(165deg, #2B5D4C 0%, #224C3E 55%, #275544 100%)',
                  clipPath: 'polygon(17px 0, calc(100% - 17px) 0, 100% 17px, 100% calc(100% - 17px), calc(100% - 17px) 100%, 17px 100%, 0 calc(100% - 17px), 0 17px)',
                  gap: 'clamp(18px,2.2vw,30px)',
                }}>

                {/* category buttons */}
                <nav aria-label="Menu categories" className="w-full flex flex-col items-center pt-[clamp(14px,1.6vw,22px)]">
                  {MENU_CATEGORIES.map((c, i) => {
                    const active = activeCategory === c;
                    return (
                      <div key={c} className="flex flex-col items-center w-full">
                        {i > 0 && (
                          <span aria-hidden="true" className="text-[var(--pink)] opacity-75 my-[clamp(9px,1vw,14px)]" style={{ fontSize: 10 }}>✦</span>
                        )}
                        <motion.button
                          type="button"
                          aria-pressed={active}
                          onClick={() => setActiveCategory(c)}
                          whileTap={{ scale: 0.95 }}
                          className="relative w-full text-center font-bold uppercase tracking-[3px] rounded-[6px] px-2 py-[7px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
                          style={{
                            fontFamily: "'Libertinus Math', serif",
                            fontSize: 'clamp(14px,1.25vw,18px)',
                            color: active ? '#FFD98A' : 'rgba(242,225,194,0.78)',
                            textShadow: active ? '0 0 20px rgba(255,217,138,0.55)' : undefined,
                            transition: 'color 0.28s ease, text-shadow 0.28s ease',
                          }}
                        >
                          {active && (
                            <motion.span
                              layoutId="desk-cat-active"
                              className="absolute inset-0 rounded-[6px]"
                              style={{
                                background: 'linear-gradient(135deg, rgba(255,217,138,0.22) 0%, rgba(255,217,138,0.07) 100%)',
                                boxShadow: 'inset 0 0 0 1px rgba(255,217,138,0.36)',
                              }}
                              transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                            />
                          )}
                          <span className="relative inline-flex items-center justify-center gap-[6px]">
                            {active && <span aria-hidden="true" className="text-[8px] opacity-70">✦</span>}
                            {c}
                            {active && <span aria-hidden="true" className="text-[8px] opacity-70">✦</span>}
                          </span>
                        </motion.button>
                        {c === 'Whole Cakes' && (
                          <button
                            type="button"
                            onClick={() => { setCakeOrderStatus('idle'); setCakeOrderOpen(true); }}
                            className="mt-1 rounded-full px-3 py-1 text-[var(--gold-hi)] transition-colors hover:bg-[rgba(255,217,138,0.14)] hover:text-[var(--cream-hi)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
                            style={{ fontFamily: "'Cookie', cursive", fontSize: 'clamp(18px,1.5vw,22px)', lineHeight: 1 }}
                          >
                            Order Here!
                          </button>
                        )}
                      </div>
                    );
                  })}
                </nav>

                {/* cone icon + tagline */}
                <div className="flex flex-col items-center mt-[clamp(14px,1.6vw,22px)]">
                  <img
                    src="/images/icon-icecream-cone.png"
                    alt=""
                    aria-hidden="true"
                    style={{ width: 'clamp(46px,5vw,66px)', height: 'auto' }}
                  />
                  <div className="mt-[clamp(7px,0.8vw,11px)] text-center text-[var(--pink)]"
                    style={{ fontFamily: "'Cookie', cursive", fontSize: 'clamp(24px,2.2vw,32px)', lineHeight: 0.95 }}>
                    Made with
                    <br />
                    Love
                  </div>
                </div>

              </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* CENTER — interactive menu panel, content driven by selected category */}
          <section
            aria-label="Menu"
            className="relative flex flex-col rounded-t-none rounded-b-[10px] md:rounded-[10px] md:mx-[clamp(12px,2.5vw,32px)] overflow-hidden px-[clamp(18px,2.6vw,42px)] py-[clamp(22px,2.6vw,36px)]"
            style={{
              background: 'linear-gradient(180deg, #FBF4E6, #F7EDDA)',
              boxShadow: '0 14px 34px rgba(28,13,12,0.18), inset 0 0 0 1px rgba(94,23,53,0.25), inset 0 0 0 5px rgba(251,244,230,1), inset 0 0 0 6px rgba(94,23,53,0.15)',
            }}
          >
            {/* All 5 tabs render simultaneously in the same CSS grid cell.
                Height is always locked to the tallest tab (Flavors).
                Inactive tabs crossfade via opacity/filter — no mount/unmount, no height jump. */}
            <div className="flex-1 grid" style={{ gridTemplateColumns: '1fr', gridTemplateRows: 'auto' }}>
              {MENU_CATEGORIES.map((cat) => {
                const isActive = cat === activeCategory;
                return (
                  <motion.div
                    key={cat}
                    className="flex flex-col"
                    style={{
                      gridArea: '1 / 1',
                      height: isActive ? 'auto' : 0,
                      overflow: isActive ? 'visible' : 'hidden',
                      pointerEvents: isActive ? 'auto' : 'none',
                    } as React.CSSProperties}
                    initial={false}
                    animate={{
                      opacity: isActive ? 1 : 0,
                      filter: isActive ? 'blur(0px)' : 'blur(6px)',
                    }}
                    transition={{
                      opacity: { duration: isActive ? 0.42 : 0.14, ease: isActive ? [0.16, 1, 0.3, 1] : 'easeIn' },
                      filter: { duration: isActive ? 0.42 : 0.14 },
                    }}
                    aria-hidden={!isActive}
                  >
                    {/* ── header ── */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span aria-hidden="true" className="text-[10px] text-[var(--pink)]">✦</span>
                        <h3 className="uppercase font-bold tracking-[4px] text-[#3B1E2B]" style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(17px,1.9vw,26px)' }}>
                          {cat === 'Flavors' ? 'Ice Cream Flavors' : cat}
                        </h3>
                        <span aria-hidden="true" className="text-[10px] text-[var(--pink)]">✦</span>
                      </div>
                      {cat === 'Flavors' && (
                        <div className="text-[var(--marionberry)]" style={{ fontFamily: "'Cookie', cursive", fontSize: 'clamp(23px,2.1vw,31px)', lineHeight: 1, marginTop: '-2px' }}>
                          Handmade in Small Batches
                        </div>
                      )}
                    </div>

                    {/* ── FLAVORS ── */}
                    {cat === 'Flavors' && (
                      <>
                        <div className="mt-[clamp(18px,2.2vw,28px)] flex-1 flex flex-col md:flex-row gap-x-[clamp(20px,3vw,40px)] gap-y-0">
                          {[FLAVORS.slice(0, 6), FLAVORS.slice(6)].map((col, ci) => (
                            <div key={ci} className="flex-1 flex flex-col">
                              {col.map((f, i) => (
                                <div key={f.name} className="flex items-start gap-[10px] py-[clamp(10px,1.1vw,15px)]" style={{ borderTop: i > 0 ? '1px solid rgba(94,23,53,0.1)' : 'none' }}>
                                  <span aria-hidden="true" className="text-[var(--pink)] mt-[5px] shrink-0" style={{ fontSize: 8 }}>●</span>
                                  <div>
                                    <div className="uppercase font-bold tracking-[2px] text-[#3B1E2B]" style={{ fontFamily: "'Libertinus Math', serif", fontSize: 'clamp(11px,0.95vw,13px)' }}>{f.name}</div>
                                    <div className="mt-[3px] leading-snug text-[#6E5A54]" style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(10.5px,0.85vw,12px)' }}>{f.desc}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                        <div aria-hidden="true" className="mt-[clamp(16px,2vw,24px)] h-px w-full" style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(94,23,53,0.35) 0 4px, transparent 4px 9px)' }} />
                        <p className="mt-[clamp(10px,1.2vw,16px)] text-center text-[#6E5A54]" style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(10.5px,0.9vw,12.5px)' }}>
                          We rotate approximately 20 flavors — selection changes with the season.
                        </p>
                        <a href={UBEREATS_URL} target="_blank" rel="noopener noreferrer"
                          className="mt-[clamp(10px,1.2vw,16px)] self-center inline-flex items-center gap-1.5 rounded-full bg-[var(--berry-deep)] text-[var(--cream-hi)] font-bold uppercase tracking-[2px] transition-colors hover:bg-[var(--berry)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
                          style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(10px,0.85vw,12px)', padding: '8px 22px' }}>
                          See full menu on Uber Eats →
                        </a>
                      </>
                    )}

                    {/* ── CROFFLES & DESSERTS ── */}
                    {cat === 'Croffles & Desserts' && (
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="mt-[clamp(16px,2vw,24px)] flex flex-col">
                          <div className="mt-[clamp(14px,1.6vw,20px)] uppercase font-bold tracking-[2px] text-[#3B1E2B]" style={{ fontFamily: "'Libertinus Math', serif", fontSize: 'clamp(11px,0.95vw,13px)' }}>
                            Descriptions:
                          </div>
                          {[
                            { name: 'Fresh Banana', note: 'Fresh whipped cream, sliced bananas, and chocolate sauce.' },
                            { name: 'Strawberry', note: 'Fresh whipped cream, fresh strawberries, and chocolate syrup.' },
                            { name: 'Nutella', note: 'Nutella paired with fresh whipped cream.' },
                            { name: 'Oreo', note: 'Fresh whipped cream topped with Oreo cookies.' },
                            { name: 'Tiramisu', note: 'Fresh whipped cream and cocoa powder, creating a tiramisu-inspired flavor that pairs beautifully with the chewy, buttery croffle.' },
                            { name: 'Walnut Chocolate Chip Cookie', note: "Inspired by Levain Bakery's famous chunky cookies with a crisp exterior and soft, chewy center." },
                            { name: 'Butter Pecan Cookie', note: "Inspired by Levain Bakery's chunky cookies with a crisp exterior and soft, chewy center." },
                            { name: 'Traditional Chocolate Chip Cookie', note: 'A classic chocolate chip cookie with a crisp exterior and soft, chewy center.' },
                            { name: 'Seasonal Dessert', note: 'See our Instagram or website for seasonal offerings.' },
                          ].map((item, i) => (
                            <div key={item.name} className="flex items-start gap-[10px] py-[clamp(11px,1.3vw,17px)]" style={{ borderTop: i > 0 ? '1px solid rgba(94,23,53,0.1)' : 'none' }}>
                              <span aria-hidden="true" className="text-[var(--pink)] mt-[5px] shrink-0" style={{ fontSize: 9 }}>●</span>
                              <div>
                                <div className="uppercase font-bold tracking-[2px] text-[#3B1E2B]" style={{ fontFamily: "'Libertinus Math', serif", fontSize: 'clamp(13px,1.15vw,16px)' }}>{item.name}</div>
                                <div className="mt-[4px] leading-snug text-[#6E5A54] italic" style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(10.5px,0.85vw,12px)' }}>{item.note}</div>
                              </div>
                            </div>
                          ))}
                          <div className="mt-[clamp(20px,2.4vw,30px)] text-center">
                            <div className="text-[var(--marionberry)]" style={{ fontFamily: "'Cookie', cursive", fontSize: 'clamp(22px,2.2vw,30px)', lineHeight: 1.1 }}>Fresh-baked favorites</div>
                            <p className="mt-[7px] text-[#6E5A54] italic" style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(10.5px,0.9vw,12.5px)' }}>A few of the housemade sweets you may find at Miss Oz.</p>
                            <div className="mx-auto mt-[14px] grid max-w-[560px] grid-cols-3 gap-[10px] sm:gap-[18px]">
                              <div className="aspect-[3/4] overflow-hidden rounded-[12px]">
                                <img src="/images/cookie-walnut.jpeg" alt="Housemade cookies" className="h-full w-full rounded-[12px] object-cover" style={{ objectPosition: 'center 56%' }} />
                              </div>
                              <div className="aspect-[3/4] overflow-hidden rounded-[12px]">
                                <img src="/images/cookie-coffee.jpeg" alt="Housemade cookies with coffee" className="h-full w-full rounded-[12px] object-cover" style={{ objectPosition: 'center center' }} />
                              </div>
                              <div className="aspect-[3/4] overflow-hidden rounded-[12px]">
                                <img src="/images/cookie-stack.jpeg" alt="Stack of housemade cookies" className="h-full w-full rounded-[12px] object-cover" style={{ objectPosition: 'center 48%' }} />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div aria-hidden="true" className="mt-[clamp(16px,2vw,22px)] h-px w-full" style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(94,23,53,0.35) 0 4px, transparent 4px 9px)' }} />
                          <div className="mt-[clamp(14px,1.8vw,20px)] rounded-[8px] px-[clamp(14px,1.8vw,22px)] py-[clamp(13px,1.6vw,19px)] text-center" style={{ background: 'rgba(94,23,53,0.05)', border: '1px dashed rgba(94,23,53,0.2)' }}>
                            <div className="text-[var(--marionberry)]" style={{ fontFamily: "'Cookie', cursive", fontSize: 'clamp(20px,1.8vw,26px)', lineHeight: 1.1 }}>always housemade, never rushed</div>
                            <p className="mt-[8px] text-[#6E5A54] leading-relaxed" style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(10.5px,0.9vw,12.5px)' }}>See the full menu on Uber Eats.</p>
                            <a href={UBEREATS_URL} target="_blank" rel="noopener noreferrer"
                              className="mt-[clamp(10px,1.2vw,14px)] inline-flex items-center gap-1.5 rounded-full bg-[var(--berry-deep)] text-[var(--cream-hi)] font-bold uppercase tracking-[2px] transition-colors hover:bg-[var(--berry)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
                              style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(10px,0.85vw,12px)', padding: '8px 22px' }}>
                              Browse on Uber Eats →
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── SUNDAES ── */}
                    {cat === 'Sundaes' && (
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="mt-[clamp(18px,2.2vw,28px)] flex flex-col">
                          {MENU_ITEMS['Sundaes'].map((item, i) => (
                            <div key={item.name} className="flex items-start gap-[10px] py-[clamp(12px,1.4vw,19px)]" style={{ borderTop: i > 0 ? '1px solid rgba(94,23,53,0.1)' : 'none' }}>
                              <span aria-hidden="true" className="text-[var(--pink)] mt-[5px] shrink-0" style={{ fontSize: 9 }}>●</span>
                              <div>
                                <div className="uppercase font-bold tracking-[2px] text-[#3B1E2B]" style={{ fontFamily: "'Libertinus Math', serif", fontSize: 'clamp(13px,1.15vw,16px)' }}>{item.name}</div>
                                {item.note && <div className="mt-[4px] leading-snug text-[#6E5A54] italic" style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(10.5px,0.85vw,12px)' }}>{item.note}</div>}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div>
                          <div aria-hidden="true" className="mt-[clamp(16px,2vw,22px)] h-px w-full" style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(94,23,53,0.35) 0 4px, transparent 4px 9px)' }} />
                          <div className="mt-[clamp(14px,1.8vw,20px)] rounded-[8px] px-[clamp(14px,1.8vw,22px)] py-[clamp(13px,1.6vw,19px)] text-center" style={{ background: 'rgba(94,23,53,0.05)', border: '1px dashed rgba(94,23,53,0.2)' }}>
                            <div className="text-[var(--marionberry)]" style={{ fontFamily: "'Cookie', cursive", fontSize: 'clamp(20px,1.8vw,26px)', lineHeight: 1.1 }}>Make it your own</div>
                            <p className="mt-[8px] text-[#6E5A54] leading-relaxed" style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(10.5px,0.9vw,12.5px)' }}>
                              Add a second scoop, swap the base flavor, or upgrade with house-made hot fudge or berry compote. Ask your scooper — we love a custom order!
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── DRINKS ── */}
                    {cat === 'Drinks' && (
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="mt-[clamp(18px,2.2vw,28px)] flex flex-col">
                          {MENU_ITEMS['Drinks'].map((item, i) => (
                            <div key={item.name} className="flex items-start gap-[10px] py-[clamp(12px,1.4vw,19px)]" style={{ borderTop: i > 0 ? '1px solid rgba(94,23,53,0.1)' : 'none' }}>
                              <span aria-hidden="true" className="text-[var(--pink)] mt-[5px] shrink-0" style={{ fontSize: 9 }}>●</span>
                              <div>
                                <div className="uppercase font-bold tracking-[2px] text-[#3B1E2B]" style={{ fontFamily: "'Libertinus Math', serif", fontSize: 'clamp(13px,1.15vw,16px)' }}>{item.name}</div>
                                {item.note && <div className="mt-[4px] leading-snug text-[#6E5A54] italic" style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(10.5px,0.85vw,12px)' }}>{item.note}</div>}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div>
                          <div aria-hidden="true" className="mt-[clamp(16px,2vw,22px)] h-px w-full" style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(94,23,53,0.35) 0 4px, transparent 4px 9px)' }} />
                          <div className="mt-[clamp(14px,1.8vw,20px)] rounded-[8px] px-[clamp(14px,1.8vw,22px)] py-[clamp(13px,1.6vw,19px)] text-center" style={{ background: 'rgba(94,23,53,0.05)', border: '1px dashed rgba(94,23,53,0.2)' }}>
                            <div className="text-[var(--marionberry)]" style={{ fontFamily: "'Cookie', cursive", fontSize: 'clamp(20px,1.8vw,26px)', lineHeight: 1.1 }}>Seasonal Specials</div>
                            <p className="mt-[8px] text-[#6E5A54] leading-relaxed" style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(10.5px,0.9vw,12.5px)' }}>
                              Thai Iced Tea · Lychee Soda · House Lemonade — our seasonal drinks rotate, so ask your scooper what's fresh today.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── WHOLE CAKES ── */}
                    {cat === 'Whole Cakes' && (
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="mt-[clamp(18px,2.2vw,28px)] flex flex-col gap-[clamp(18px,2vw,26px)]">
                          <div className="grid grid-cols-2 gap-[10px]">
                            <img src="/images/whole-cheesecake-slice.jpeg" alt="Slice of Original Basque Cheesecake" className="h-[clamp(120px,14vw,190px)] w-full rounded-[10px] object-cover" />
                            <img src="/images/whole-basque-cheesecake.jpeg" alt="Whole Original Basque Cheesecake" className="h-[clamp(120px,14vw,190px)] w-full rounded-[10px] object-cover" />
                          </div>
                          <div className="relative overflow-hidden rounded-[12px] p-[clamp(17px,2.2vw,28px)] text-[#6E5A54] leading-relaxed" style={{ background: 'linear-gradient(145deg, rgba(255,248,229,0.96), rgba(245,220,199,0.72))', border: '2px solid rgba(94,23,53,0.55)', boxShadow: '0 10px 24px rgba(94,23,53,0.16)', fontFamily: 'var(--font-sans)', fontSize: 'clamp(10.5px,0.9vw,12.5px)' }}>
                            <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full" style={{ background: 'rgba(227,180,76,0.25)' }} />
                            <div className="relative text-[var(--berry-deep)]" style={{ fontFamily: "'Cookie', cursive", fontSize: 'clamp(25px,2.6vw,36px)', lineHeight: 1 }}>Original Basque Cheesecake</div>
                            <p className="relative mt-[12px] rounded-[7px] px-3 py-2.5 text-[#4D3538]" style={{ background: 'rgba(255,255,255,0.38)' }}><strong className="text-[var(--berry-deep)]">Crafted fresh for every order.</strong> To ensure the highest quality and texture, our Basque Cheesecakes are available by pre-order only.</p>
                            <div className="relative mt-[18px] font-bold text-[#3B1E2B]" style={{ fontSize: 'clamp(14px,1.1vw,17px)' }}>Pricing</div>
                            <div className="relative mt-[9px] grid gap-[7px] sm:grid-cols-3">
                              <div className="rounded-[8px] px-2 py-2.5 text-center" style={{ background: 'rgba(255,255,255,0.58)', border: '1px solid rgba(227,180,76,0.85)' }}><div className="font-semibold text-[#3B1E2B]">6-inch</div><strong className="text-[var(--berry-deep)]">$55</strong></div>
                              <div className="rounded-[8px] px-2 py-2.5 text-center" style={{ background: 'rgba(255,255,255,0.58)', border: '1px solid rgba(227,180,76,0.85)' }}><div className="font-semibold text-[#3B1E2B]">8-inch</div><strong className="text-[var(--berry-deep)]">$85</strong><div className="text-[10px]">(8 slices)</div></div>
                              <div className="rounded-[8px] px-2 py-2.5 text-center" style={{ background: 'rgba(255,255,255,0.58)', border: '1px solid rgba(227,180,76,0.85)' }}><div className="font-semibold text-[#3B1E2B]">10-inch</div><strong className="text-[var(--berry-deep)]">$85</strong><div className="text-[10px]">(12 slices)</div></div>
                            </div>
                            <p className="relative mt-[14px] rounded-[7px] px-3 py-2.5 text-[#4D3538]" style={{ background: 'rgba(94,23,53,0.06)' }}>The reason the 8&quot; and 10&quot; cakes are the same price is that they use the <strong className="text-[var(--berry-deep)]">same amount of ingredients.</strong> The 8-inch version is taller and yields 8 larger slices, while the 10-inch version is wider and yields 12 thinner slices.</p>
                          </div>
                          <div className="relative overflow-hidden rounded-[10px] p-[clamp(18px,2.2vw,28px)] text-[#5B4540] leading-relaxed" style={{ background: 'rgba(251,244,230,0.9)', border: '2px solid var(--berry-deep)', boxShadow: '0 5px 0 rgba(227,180,76,0.7), inset 0 0 0 5px rgba(242,225,194,0.55)', fontFamily: 'var(--font-sans)', fontSize: 'clamp(11px,0.95vw,13.5px)' }}>
                            <div className="relative text-[var(--berry-deep)]" style={{ fontFamily: "'Cookie', cursive", fontSize: 'clamp(18px,1.7vw,24px)', lineHeight: 1 }}>Made fresh weekly · by pre-order</div>
                            <div className="relative mt-[9px] font-bold text-[var(--berry-deep)]" style={{ fontFamily: "'DM Serif Display', serif", fontStyle: 'italic', fontSize: 'clamp(20px,2vw,28px)', lineHeight: 1.12 }}>Handcrafted in Limited Weekly Batches</div>
                            <p className="relative mt-[11px] text-[#4D3538]">Our whole Basque cheesecakes are made from scratch using 100% premium cream cheese and zero flour. Each cake is slow-baked, cooled at room temperature, and refrigerated overnight to develop its signature rich and creamy texture.</p>
                          </div>
                          <button type="button" onClick={() => { setCakeOrderStatus('idle'); setCakeOrderOpen(true); }} className="w-full rounded-full bg-[var(--berry-deep)] px-5 py-3 font-bold uppercase tracking-[1.5px] text-[var(--cream-hi)] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-hi)]" style={{ fontFamily: 'var(--font-sans)', fontSize: '12px' }}>
                            Order a Whole Cheesecake →
                          </button>
                        </div>
                        <div>
                          <div aria-hidden="true" className="mt-[clamp(16px,2vw,22px)] h-px w-full" style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(94,23,53,0.35) 0 4px, transparent 4px 9px)' }} />
                          <div className="mt-[clamp(14px,1.8vw,20px)] rounded-[8px] px-[clamp(14px,1.8vw,22px)] py-[clamp(13px,1.6vw,19px)] text-center" style={{ background: 'rgba(94,23,53,0.05)', border: '1px dashed rgba(94,23,53,0.2)' }}>
                            <div className="text-[var(--marionberry)]" style={{ fontFamily: "'Cookie', cursive", fontSize: 'clamp(20px,1.8vw,26px)', lineHeight: 1.1 }}>Basque Cheesecake Orders</div>
                            <p className="mt-[8px] text-[#6E5A54] leading-relaxed" style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(10.5px,0.9vw,12.5px)' }}>Made fresh to order in limited weekly batches.</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* RIGHT — plum "Come Slow Down" card with striped awning */}
          <div className="relative mx-auto w-full max-w-[340px] md:max-w-none hidden md:flex flex-col">
            {/* striped awning — cream + deep berry */}
            <div aria-hidden="true" className="relative z-10 -mb-[2px]">
              <div className="h-[14px] rounded-t-[10px]" style={{ background: 'repeating-linear-gradient(90deg, var(--cream-hi) 0 22px, var(--berry-deep) 22px 44px)', boxShadow: 'inset 0 -4px 8px rgba(28,13,12,0.2), 0 3px 8px rgba(0,0,0,0.18)' }} />
              <div className="h-[9px]" style={{ background: 'repeating-linear-gradient(90deg, var(--cream-hi) 0 22px, var(--berry-deep) 22px 44px)', WebkitMaskImage: 'radial-gradient(11px at 50% 0, #000 98%, transparent 100%)', maskImage: 'radial-gradient(11px at 50% 0, #000 98%, transparent 100%)', WebkitMaskSize: '22px 100%', maskSize: '22px 100%', WebkitMaskRepeat: 'repeat-x', maskRepeat: 'repeat-x', filter: 'drop-shadow(0 3px 4px rgba(0,0,0,0.18))' }} />
            </div>
            <div
              className="flex-1 flex flex-col items-center text-center rounded-b-[12px] px-[clamp(18px,1.8vw,26px)] py-[clamp(24px,2.6vw,36px)]"
              style={{
                background: 'radial-gradient(120% 90% at 30% 15%, rgba(255,255,255,0.06), transparent 60%), linear-gradient(165deg, #5E1735 0%, #471027 55%, #55142F 100%)',
                boxShadow: '0 14px 34px rgba(28,13,12,0.3), inset 0 0 0 1.5px rgba(242,225,194,0.3)',
              }}
            >
              <div className="flex-1 w-full flex flex-col items-center justify-center rounded-[6px] px-[clamp(14px,1.6vw,22px)] py-[clamp(22px,2.4vw,32px)]"
                style={{ boxShadow: 'inset 0 0 0 1.5px rgba(242,225,194,0.4)' }}>

                {/* title */}
                <div
                  className="text-center leading-[1.2] text-[#F2E1C2]"
                  style={{ fontFamily: "'DM Serif Display', serif", fontStyle: 'italic', fontSize: 'clamp(28px,2.6vw,38px)' }}
                >
                  ~ Come Slow
                  <br />Down ~
                  <br />With Us!
                </div>

                {/* heart */}
                <span aria-hidden="true" className="mt-[clamp(10px,1.1vw,16px)] text-[var(--pink)]" style={{ fontSize: 16 }}>♥</span>

                {/* block 1 */}
                <p className="mt-[clamp(10px,1.1vw,16px)] text-center leading-relaxed text-[#EFD9C9]"
                  style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(12px,0.95vw,14px)' }}>
                  Churned fresh every week using classic recipes and real ingredients — no shortcuts.
                </p>

                {/* diamond divider */}
                <div aria-hidden="true" className="my-[clamp(10px,1.1vw,16px)] flex items-center gap-2 w-[75%]">
                  <span className="flex-1 h-px" style={{ background: 'rgba(242,225,194,0.35)' }} />
                  <span className="text-[#F2E1C2] opacity-60" style={{ fontSize: 8 }}>✦</span>
                  <span className="flex-1 h-px" style={{ background: 'rgba(242,225,194,0.35)' }} />
                </div>

                {/* block 2 */}
                <p className="text-center leading-relaxed text-[#EFD9C9]"
                  style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(12px,0.95vw,14px)' }}>
                  Pickup or delivery available on Uber&nbsp;Eats &amp; Grubhub.
                </p>

                {/* diamond divider */}
                <div aria-hidden="true" className="my-[clamp(10px,1.1vw,16px)] flex items-center gap-2 w-[75%]">
                  <span className="flex-1 h-px" style={{ background: 'rgba(242,225,194,0.35)' }} />
                  <span className="text-[#F2E1C2] opacity-60" style={{ fontSize: 8 }}>✦</span>
                  <span className="flex-1 h-px" style={{ background: 'rgba(242,225,194,0.35)' }} />
                </div>

                {/* block 3 */}
                <p className="text-center leading-relaxed text-[#EFD9C9]"
                  style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(12px,0.95vw,14px)' }}>
                  We love our community and your suggestions!
                </p>

                {/* vintage admission-ticket CTA — side notches + perforated inner line */}
                <a
                  href={UBEREATS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-[clamp(16px,1.8vw,24px)] w-full block transition-transform duration-200 hover:-translate-y-[3px] hover:scale-[1.03] active:scale-[0.98]"
                  style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.3))' }}
                >
                  <span
                    className="block relative overflow-hidden ticket-shine motion-safe:animate-[ticketFloat_4s_ease-in-out_infinite]"
                    style={{
                      background: 'linear-gradient(180deg, #F7EDDD 0%, #F2E4CC 100%)',
                      borderRadius: '6px',
                      padding: '5px',
                      WebkitMaskImage:
                        'radial-gradient(circle 8px at 0 50%, transparent 96%, #000 100%), radial-gradient(circle 8px at 100% 50%, transparent 96%, #000 100%)',
                      maskImage:
                        'radial-gradient(circle 8px at 0 50%, transparent 96%, #000 100%), radial-gradient(circle 8px at 100% 50%, transparent 96%, #000 100%)',
                      WebkitMaskComposite: 'source-in',
                      maskComposite: 'intersect',
                    }}
                  >
                    <span
                      className="flex flex-col items-center justify-center"
                      style={{ border: '1.5px dashed rgba(59,16,32,0.55)', borderRadius: '4px', padding: '11px 22px 12px' }}
                    >
                      <span
                        className="uppercase whitespace-nowrap"
                        style={{ fontFamily: 'var(--font-sans)', fontSize: '7px', letterSpacing: '1px', fontWeight: 700, color: 'rgba(59,16,32,0.55)' }}
                      >
                        ✦ Admit One Sweet Tooth ✦
                      </span>
                      <span
                        className="flex items-center gap-2 whitespace-nowrap uppercase"
                        style={{
                          fontFamily: "'DM Serif Display', serif",
                          fontSize: 'clamp(11px,0.85vw,13px)',
                          letterSpacing: '1.5px',
                          color: '#3B1020',
                          lineHeight: 1.3,
                        }}
                      >
                        Place an Order
                        <span aria-hidden="true" className="transition-transform duration-150 group-hover:translate-x-1">→</span>
                      </span>
                    </span>
                  </span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* footer strip — "Sweet Memories Start Here." */}
        <div className="mt-[clamp(18px,2.2vw,28px)] flex items-center justify-center gap-4 text-center">
          <img src="/images/icon-icecream-cup.png" alt="" aria-hidden="true" className="shrink-0" style={{ width: 'clamp(34px,3vw,42px)', height: 'auto' }} />
          <div>
            <div className="uppercase font-bold tracking-[3px] text-[#3B1E2B]" style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(11px,1vw,14px)' }}>
              Sweet Memories Start Here.
            </div>
            <div className="mt-[3px] text-[#6E5A54]" style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(10px,0.85vw,12px)' }}>
              Thank you for supporting our family-run shop since 2007.
            </div>
          </div>
          <img src="/images/icon-icecream-cart.png" alt="" aria-hidden="true" className="shrink-0" style={{ width: 'clamp(34px,3vw,42px)', height: 'auto' }} />
        </div>

        {/* bottom ribbon */}
        <div
          className="mt-[clamp(14px,2vw,22px)] rounded-[5px] px-3 py-3 text-center border-2 ticket-notch relative"
          style={{ background: 'var(--brick)', borderColor: 'var(--gold-hi)', boxShadow: '0 6px 16px rgba(28,13,12,0.25)' }}
        >
          <div className="absolute inset-1 stitch-border border-[rgba(255,244,214,0.4)] pointer-events-none rounded-[2px]" aria-hidden="true" />
          <span className="text-[var(--cream-hi)] text-[11px] sm:text-[12.5px] tracking-[2px] uppercase font-bold relative z-10" style={{ fontFamily: 'var(--font-sans)', textShadow: '1px 1px 0 rgba(28,13,12,0.2)' }}>
            Locally Owned <span className="text-[var(--gold-hi)] mx-1">★</span> Small Business <span className="text-[var(--gold-hi)] mx-1">★</span> @missozicecream
          </span>
        </div>
      </div>
    </section>
    {cakeOrderOpen && createPortal(
      <AnimatePresence>
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="whole-cake-order-title"
          className="fixed inset-0 z-[2000] flex items-start justify-center overflow-y-auto p-[14px] sm:p-[28px]"
          style={{ background: 'rgba(28,13,12,0.72)', backdropFilter: 'blur(5px)' }}
          onMouseDown={(e) => { if (e.target === e.currentTarget) setCakeOrderOpen(false); }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative my-auto w-full max-w-[720px] rounded-[12px] p-[clamp(18px,3vw,34px)]"
            style={{ background: 'var(--cream-hi)', boxShadow: '0 20px 70px rgba(0,0,0,0.4)', border: '2px solid var(--gold)' }}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <button type="button" aria-label="Close whole cheesecake order form" onClick={() => setCakeOrderOpen(false)} className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-[22px] text-[var(--berry-deep)] hover:bg-[rgba(94,23,53,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--berry)]">×</button>
            <div className="pr-10">
              <div className="text-[var(--marionberry)]" style={{ fontFamily: "'Cookie', cursive", fontSize: 'clamp(25px,3vw,34px)', lineHeight: 1.1 }}>Whole Basque Cheesecake</div>
              <h2 id="whole-cake-order-title" className="mt-1 text-[#3B1E2B]" style={{ fontFamily: "'Libertinus Math', serif", fontSize: 'clamp(20px,2.4vw,28px)' }}>Place a Pre-Order</h2>
            </div>
            <div className="mt-5 grid gap-5 text-[#6E5A54] leading-relaxed" style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(12px,1vw,14px)' }}>
              <div className="rounded-[9px] p-[clamp(14px,2vw,22px)]" style={{ background: 'rgba(94,23,53,0.05)', border: '1px dashed rgba(94,23,53,0.25)' }}>
                <div className="text-[var(--marionberry)]" style={{ fontFamily: "'Cookie', cursive", fontSize: 'clamp(22px,2.4vw,29px)', lineHeight: 1.1 }}>How to Order</div>
                <ol className="mt-3 list-decimal space-y-2 pl-5">
                  <li>Choose your cake size and quantity.</li>
                  <li>Enter your contact details and any order notes.</li>
                  <li>Submit your request and we’ll follow up to confirm it.</li>
                </ol>
              </div>
              <div className="rounded-[9px] p-[clamp(14px,2vw,22px)]" style={{ background: 'rgba(94,23,53,0.05)', border: '1px dashed rgba(94,23,53,0.25)' }}>
                <div className="font-bold text-[#3B1E2B]">Weekly Schedule</div>
                <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-3">
                  <div><strong>Orders open:</strong> Monday 11:00 AM–Friday 8:00 PM</div>
                  <div><strong>Production:</strong> The following Monday</div>
                  <div><strong>Cooling &amp; aging:</strong> Monday–Tuesday</div>
                  <div><strong>Pickup:</strong> Following Wednesday by noon</div>
                </div>
                <p className="mt-3"><strong>Important:</strong> Your pickup is the following Wednesday, not the Wednesday of the same week.</p>
              </div>
              <form onSubmit={handleCakeOrderSubmit} className="rounded-[9px] p-[clamp(14px,2vw,22px)]" style={{ background: 'rgba(227,180,76,0.12)', border: '1px solid rgba(94,23,53,0.18)' }}>
                <div className="font-bold text-[#3B1E2B]" style={{ fontFamily: "'Libertinus Math', serif", fontSize: 'clamp(18px,2vw,23px)' }}>Your Order Details</div>
                <div className="mt-4 grid gap-3 text-[#3B1E2B]" style={{ fontFamily: 'var(--font-sans)', fontSize: '12px' }}>
                  <label>Cake size
                    <select name="cakeSize" required className="mt-1 w-full rounded-[6px] px-3 py-2.5" style={{ background: 'rgba(251,244,230,0.9)', border: '1px solid rgba(94,23,53,0.22)' }}>
                      <option value="">Choose a size</option><option>6-inch</option><option>8-inch</option><option>10-inch</option>
                    </select>
                  </label>
                  <label>Quantity<input name="quantity" type="number" min="1" defaultValue="1" required className="mt-1 w-full rounded-[6px] px-3 py-2.5" style={{ background: 'rgba(251,244,230,0.9)', border: '1px solid rgba(94,23,53,0.22)' }} /></label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label>Customer name<input name="name" required className="mt-1 w-full rounded-[6px] px-3 py-2.5" style={{ background: 'rgba(251,244,230,0.9)', border: '1px solid rgba(94,23,53,0.22)' }} /></label>
                    <label>Phone number<input name="phone" type="tel" required className="mt-1 w-full rounded-[6px] px-3 py-2.5" style={{ background: 'rgba(251,244,230,0.9)', border: '1px solid rgba(94,23,53,0.22)' }} /></label>
                  </div>
                  <label>Email address<input name="email" type="email" required className="mt-1 w-full rounded-[6px] px-3 py-2.5" style={{ background: 'rgba(251,244,230,0.9)', border: '1px solid rgba(94,23,53,0.22)' }} /></label>
                  <label>Pickup date<input name="pickupDate" value={`${followingWednesday} by noon`} readOnly className="mt-1 w-full rounded-[6px] px-3 py-2.5" style={{ background: 'rgba(251,244,230,0.6)', border: '1px solid rgba(94,23,53,0.22)' }} /></label>
                  <label>Order notes<textarea name="notes" rows={3} className="mt-1 w-full resize-y rounded-[6px] px-3 py-2.5" style={{ background: 'rgba(251,244,230,0.9)', border: '1px solid rgba(94,23,53,0.22)' }} /></label>
                </div>
                <div className="mt-4 rounded-[7px] px-3 py-3 text-[#5B4540]" style={{ background: 'rgba(251,244,230,0.62)', border: '1px dashed rgba(94,23,53,0.24)', fontFamily: 'var(--font-sans)', fontSize: '12px' }}>
                  <div className="font-bold text-[#3B1E2B]">Payment</div>
                  <p className="mt-1">Payment in full will be required when placing your order because each cake is prepared specifically for you.</p>
                  <p className="mt-1 font-bold text-[var(--berry-deep)]">Your order is confirmed only after payment has been completed.</p>
                  <div className="mt-2 rounded-[5px] px-3 py-2 text-center italic opacity-70" style={{ border: '1px solid rgba(94,23,53,0.18)' }}>Payment checkout placeholder</div>
                </div>
                <button type="submit" disabled={cakeOrderStatus === 'sending'} className="mt-4 w-full rounded-full bg-[var(--berry-deep)] px-5 py-3 font-bold uppercase tracking-[1.5px] text-[var(--cream-hi)] transition-transform hover:-translate-y-0.5 disabled:opacity-60" style={{ fontFamily: 'var(--font-sans)', fontSize: '12px' }}>
                  {cakeOrderStatus === 'sending' ? 'Sending…' : 'Submit Pre-Order'}
                </button>
                {cakeOrderStatus === 'sent' && <p className="mt-3 text-center text-[#3B1E2B]">Thank you — your pre-order request has been sent.</p>}
                {cakeOrderStatus === 'error' && <p className="mt-3 text-center text-[var(--berry-deep)]">We couldn’t send your request. Please try again.</p>}
              </form>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>,
      document.body
    )}
    </>
  );
}
