import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MENU_CATEGORIES } from './menuCatalog';

export function useMenuCategory() {
  return useState<string>('Flavors');
}

type Props = {
  activeCategory: string;
  onSelect: (category: string) => void;
  variant: 'mobile' | 'desktop';
  onOrderWholeCake?: () => void;
};

/** Shared category controls for the responsive homepage menu. */
export default function MenuCategoryNavigation({ activeCategory, onSelect, variant, onOrderWholeCake }: Props) {
  const mobileTabsRef = useRef<HTMLDivElement>(null);
  const mobileTabViewportRef = useRef<HTMLDivElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);
  const [isStuck, setIsStuck] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (variant !== 'mobile') return;
    const row = mobileTabsRef.current;
    if (!row || row.scrollWidth <= row.clientWidth) return;
    const activeTab = row.querySelector<HTMLButtonElement>('button[aria-selected="true"]');
    if (!activeTab) return;
    const rowRect = row.getBoundingClientRect();
    const tabRect = activeTab.getBoundingClientRect();
    const targetLeft = row.scrollLeft + tabRect.left - rowRect.left - (row.clientWidth - tabRect.width) / 2;
    row.scrollTo({ left: Math.max(0, targetLeft), behavior: reduceMotion ? 'instant' : 'smooth' });
  }, [activeCategory, variant, reduceMotion]);

  useEffect(() => {
    if (variant !== 'mobile') {
      setIsStuck(false);
      return;
    }

    const nav = mobileNavRef.current;
    const row = mobileTabsRef.current;
    const viewport = mobileTabViewportRef.current;
    if (!nav || !row || !viewport) return;

    const updateOverflow = () => {
      const maxScroll = Math.max(0, row.scrollWidth - row.clientWidth);
      viewport.dataset.overflowLeft = String(row.scrollLeft > 1);
      viewport.dataset.overflowRight = String(maxScroll - row.scrollLeft > 1);
    };

    const updateStickyState = () => {
      const stickyTop = Number.parseFloat(window.getComputedStyle(nav).top) || 0;
      const navRect = nav.getBoundingClientRect();
      const sectionBottom = nav.closest('#menu')?.getBoundingClientRect().bottom ?? Number.POSITIVE_INFINITY;
      const stuck = navRect.top <= stickyTop + 1 && navRect.bottom < sectionBottom - 1;
      setIsStuck((current) => current === stuck ? current : stuck);
    };

    let frame = 0;
    const scheduleStickyUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        updateStickyState();
      });
    };

    const resizeObserver = new ResizeObserver(updateOverflow);
    resizeObserver.observe(row);
    row.querySelectorAll('button').forEach((tab) => resizeObserver.observe(tab));
    row.addEventListener('scroll', updateOverflow, { passive: true });
    window.addEventListener('scroll', scheduleStickyUpdate, { passive: true });
    window.addEventListener('resize', updateOverflow);
    window.addEventListener('resize', scheduleStickyUpdate);
    updateOverflow();
    scheduleStickyUpdate();

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      row.removeEventListener('scroll', updateOverflow);
      window.removeEventListener('scroll', scheduleStickyUpdate);
      window.removeEventListener('resize', updateOverflow);
      window.removeEventListener('resize', scheduleStickyUpdate);
    };
  }, [activeCategory, variant]);

  if (variant === 'mobile') {
    return (
      <nav
        ref={mobileNavRef}
        data-stuck={isStuck ? 'true' : 'false'}
        aria-label="Menu categories"
        className="menu-category-mobile relative px-4 py-[10px]"
        style={{ background: 'var(--berry-deep)' }}
      >
        <div ref={mobileTabViewportRef} className="menu-tabs-viewport relative min-w-0 flex-1">
          <div
            ref={mobileTabsRef}
            data-hscroll
            role="tablist"
            aria-label="Menu categories"
            className="menu-tabs-scroll grid grid-cols-2 min-[360px]:grid-cols-3 gap-[7px] max-[767px]:flex max-[767px]:w-full max-[767px]:snap-x max-[767px]:snap-mandatory max-[767px]:items-center max-[767px]:gap-2 max-[767px]:overflow-x-auto max-[767px]:overscroll-x-contain max-[767px]:scroll-smooth max-[767px]:pr-8"
            onKeyDown={(event) => {
              const index = MENU_CATEGORIES.indexOf(activeCategory as typeof MENU_CATEGORIES[number]);
              let next = index;
              if (event.key === 'ArrowRight') next = (index + 1) % MENU_CATEGORIES.length;
              else if (event.key === 'ArrowLeft') next = (index + MENU_CATEGORIES.length - 1) % MENU_CATEGORIES.length;
              else if (event.key === 'Home') next = 0;
              else if (event.key === 'End') next = MENU_CATEGORIES.length - 1;
              else return;
              event.preventDefault();
              onSelect(MENU_CATEGORIES[next]);
              mobileTabsRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus({ preventScroll: true });
            }}
          >
            {MENU_CATEGORIES.map((category, index) => {
              const active = activeCategory === category;
              return (
                <motion.button
                  key={category}
                  type="button"
                  role="tab"
                  id={`menu-tab-${index}`}
                  aria-controls={`menu-panel-${index}`}
                  aria-selected={active}
                  tabIndex={active ? 0 : -1}
                  aria-pressed={active}
                  onClick={() => onSelect(category)}
                  className="relative min-h-[44px] font-bold uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] max-[767px]:shrink-0 max-[767px]:snap-center max-[767px]:whitespace-nowrap max-[767px]:px-3"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '15px',
                    letterSpacing: '0.5px',
                    lineHeight: 1.25,
                    padding: '8px 6px',
                    borderRadius: '999px',
                    color: active ? 'var(--berry-deep)' : 'var(--cream-hi)',
                    border: '1.5px solid transparent',
                    transition: 'color 220ms cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                >
                  {active && <span className="absolute inset-0 rounded-full" style={{ background: 'var(--pink)' }} />}
                  <span className="relative">{category}</span>
                </motion.button>
              );
            })}
          </div>
          <span aria-hidden="true" className="menu-tab-fade menu-tab-fade-left" />
          <span aria-hidden="true" className="menu-tab-fade menu-tab-fade-right" />
        </div>
        {activeCategory === 'Whole Cakes' && onOrderWholeCake && (
          <button
            type="button"
            onClick={onOrderWholeCake}
            className="mobile-wholecake-order interaction-primary flex min-h-11 shrink-0 items-center justify-center rounded-full px-4 text-[var(--gold-hi)] transition-colors hover:bg-[rgba(255,217,138,0.14)] hover:text-[var(--cream-hi)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
            style={{ fontFamily: 'var(--font-script)', fontSize: '20px', lineHeight: 1.1 }}
          >
            Order Here!
          </button>
        )}
      </nav>
    );
  }

  return (
    <nav aria-label="Menu categories" className="w-full flex flex-col items-center pt-[clamp(14px,1.6vw,22px)]">
      {MENU_CATEGORIES.map((category, index) => {
        const active = activeCategory === category;
        return (
          <div key={category} className="flex flex-col items-center w-full">
            {index > 0 && <span aria-hidden="true" className="text-[var(--pink)] opacity-75 my-[clamp(9px,1vw,14px)]" style={{ fontSize: 10 }}>✦</span>}
            <motion.button
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(category)}
              whileTap={{ scale: 0.985 }}
              className="relative w-full text-center font-bold uppercase tracking-[3px] rounded-[6px] px-2 py-[7px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(12px,1.1vw,15px)',
                color: active ? 'var(--pink)' : 'var(--cream-hi)',
                transition: 'color 220ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              {active && <motion.span layoutId="desk-cat-active" className="absolute inset-0 rounded-[6px]" style={{ background: 'rgba(234,184,206,0.14)', boxShadow: 'inset 0 0 0 1px rgba(234,184,206,0.34)' }} transition={{ type: 'spring', stiffness: 420, damping: 36 }} />}
              <span className="relative inline-flex items-center justify-center gap-[6px]">
                {active && <span aria-hidden="true" className="text-[8px] opacity-70">✦</span>}
                {category}
                {active && <span aria-hidden="true" className="text-[8px] opacity-70">✦</span>}
              </span>
            </motion.button>
            {category === 'Whole Cakes' && onOrderWholeCake && (
              <button
                type="button"
                onClick={onOrderWholeCake}
                className="interaction-primary mt-1 rounded-full px-3 py-1 text-[var(--gold-hi)] transition-colors hover:bg-[rgba(255,217,138,0.14)] hover:text-[var(--cream-hi)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
                style={{ fontFamily: 'var(--font-script)', fontSize: 'clamp(18px,1.5vw,22px)', lineHeight: 1 }}
              >
                Order Here!
              </button>
            )}
          </div>
        );
      })}
    </nav>
  );
}