import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
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

  useEffect(() => {
    if (variant !== 'mobile') return;
    const row = mobileTabsRef.current;
    if (!row || row.scrollWidth <= row.clientWidth) return;
    const activeTab = row?.querySelector<HTMLButtonElement>('button[aria-pressed="true"]');
    if (!activeTab) return;
    const rowRect = row.getBoundingClientRect();
    const tabRect = activeTab.getBoundingClientRect();
    const targetLeft = row.scrollLeft + tabRect.left - rowRect.left - (row.clientWidth - tabRect.width) / 2;
    row.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
  }, [activeCategory, variant]);

  if (variant === 'mobile') {
    return (
      <nav aria-label="Menu categories" className="menu-category-mobile relative px-4 py-[10px]" style={{ background: 'var(--berry-deep)' }}>
        <div ref={mobileTabsRef} data-hscroll className="menu-tabs-scroll grid grid-cols-2 min-[360px]:grid-cols-3 gap-[7px] max-[639px]:flex max-[639px]:w-full max-[639px]:snap-x max-[639px]:snap-mandatory max-[639px]:items-center max-[639px]:gap-2 max-[639px]:overflow-x-auto max-[639px]:overscroll-x-contain max-[639px]:scroll-smooth max-[639px]:pr-8">
          {MENU_CATEGORIES.map((category) => {
            const active = activeCategory === category;
            return (
              <motion.button
                key={category}
                type="button"
                aria-pressed={active}
                onClick={() => onSelect(category)}
                whileTap={{ scale: 0.985 }}
                className="relative min-h-[44px] font-bold uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] max-[639px]:shrink-0 max-[639px]:snap-center max-[639px]:whitespace-nowrap max-[639px]:px-3"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '12px',
                  letterSpacing: '0.5px',
                  lineHeight: 1.25,
                  padding: '8px 6px',
                  borderRadius: '999px',
                  color: active ? 'var(--berry-deep)' : 'var(--cream-hi)',
                  border: '1.5px solid transparent',
                  transition: 'color 220ms cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                {active && <motion.span layoutId="mobile-pill-active" className="absolute inset-0 rounded-full" style={{ background: 'var(--pink)' }} transition={{ type: 'spring', stiffness: 400, damping: 35 }} />}
                <span className="relative">{category}</span>
              </motion.button>
            );
          })}
        </div>
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