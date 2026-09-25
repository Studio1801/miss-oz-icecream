import { useState } from 'react';
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
  if (variant === 'mobile') {
    return (
      <nav aria-label="Menu categories" className="px-3 py-[10px]" style={{ background: 'var(--berry-deep)' }}>
        <div className="grid grid-cols-2 min-[360px]:grid-cols-3 gap-[7px]">
          {MENU_CATEGORIES.map((category) => {
            const active = activeCategory === category;
            return (
              <motion.button
                key={category}
                type="button"
                aria-pressed={active}
                onClick={() => onSelect(category)}
                whileTap={{ scale: 0.93 }}
                className="relative min-h-[42px] font-bold uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(10px,2.8vw,11px)',
                  letterSpacing: '0.5px',
                  lineHeight: 1.25,
                  padding: '8px 6px',
                  borderRadius: '999px',
                  color: active ? 'var(--berry-deep)' : 'var(--cream-hi)',
                  border: '1.5px solid transparent',
                  transition: 'color 0.25s ease',
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
              whileTap={{ scale: 0.95 }}
              className="relative w-full text-center font-bold uppercase tracking-[3px] rounded-[6px] px-2 py-[7px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(12px,1.1vw,15px)',
                color: active ? 'var(--pink)' : 'var(--cream-hi)',
                transition: 'color 0.28s ease',
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
                className="mt-1 rounded-full px-3 py-1 text-[var(--gold-hi)] transition-colors hover:bg-[rgba(255,217,138,0.14)] hover:text-[var(--cream-hi)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
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