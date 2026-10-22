/**
 * OrderChooser — inline platform picker for delivery orders.
 * Uses a React portal so the dropdown escapes any overflow:hidden parents.
 */
import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { DELIVERY_PLATFORMS } from '../lib/delivery';

interface Props {
  variant?: 'dark' | 'cream' | 'light';
  label?: string;
  className?: string;
}

interface DropdownPos {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
  openUp: boolean;
}

const PLATFORM_COLORS: Record<string, { bg: string; text: string }> = {
  grubhub:  { bg: '#F63440', text: '#fff' },
  ubereats: { bg: '#06C167', text: '#fff' },
};

export default function OrderChooser({ variant = 'dark', label = 'Order Online', className = '' }: Props) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<DropdownPos | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Calculate portal position from the button's bounding rect
  const calcPos = useCallback(() => {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    const viewport = window.visualViewport;
    const viewportLeft = viewport?.offsetLeft ?? 0;
    const viewportTop = viewport?.offsetTop ?? 0;
    const viewportWidth = viewport?.width ?? document.documentElement.clientWidth;
    const viewportHeight = viewport?.height ?? window.innerHeight;
    // Keep the picker inside both the visible viewport and the decorative frame.
    const gutter = Math.min(38, Math.max(24, viewportWidth * 0.02 + 11));
    const width = Math.min(240, Math.max(0, viewportWidth - gutter * 2));
    const maxHeight = Math.max(0, viewportHeight - gutter * 2);
    const dropH = Math.min(dropdownRef.current?.offsetHeight ?? 220, maxHeight);
    const minLeft = viewportLeft + gutter;
    const minTop = viewportTop + gutter;
    const maxTop = viewportTop + viewportHeight - gutter - dropH;
    const spaceBelow = viewportTop + viewportHeight - gutter - r.bottom - 8;
    const spaceAbove = r.top - minTop - 8;
    const openUp = spaceBelow < dropH && spaceAbove > spaceBelow;
    setPos({
      top: Math.max(minTop, Math.min(openUp ? r.top - dropH - 8 : r.bottom + 8, maxTop)),
      left: Math.max(minLeft, Math.min(r.right - width, viewportLeft + viewportWidth - gutter - width)),
      width,
      maxHeight,
      openUp,
    });
  }, []);

  useLayoutEffect(() => {
    if (!open || !dropdownRef.current) return;
    calcPos();
    const observer = new ResizeObserver(calcPos);
    observer.observe(dropdownRef.current);
    return () => observer.disconnect();
  }, [open, calcPos]);

  const toggle = () => {
    if (!open) {
      calcPos();
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  // Close on outside click, scroll, resize, or Escape
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    const onMouse = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!btnRef.current?.contains(target) && !dropdownRef.current?.contains(target)) close();
    };
    const onScroll = (event: Event) => {
      if (event.target instanceof Node && dropdownRef.current?.contains(event.target)) return;
      close();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onMouse);
    window.addEventListener('scroll', onScroll, { passive: true, capture: true });
    window.addEventListener('resize', close, { passive: true });
    window.visualViewport?.addEventListener('resize', close);
    window.visualViewport?.addEventListener('scroll', close);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onMouse);
      window.removeEventListener('scroll', onScroll, { capture: true } as EventListenerOptions);
      window.removeEventListener('resize', close);
      window.visualViewport?.removeEventListener('resize', close);
      window.visualViewport?.removeEventListener('scroll', close);
    };
  }, [open]);

  const triggerBase =
    'inline-flex items-center gap-2 rounded-full font-semibold tracking-[1px] uppercase transition-all duration-200 mech-btn focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2';

  const triggerStyles: Record<string, string> = {
    dark:  'py-4 px-10 text-[17px] bg-[var(--cocoa)] text-[var(--cream)] border-2 border-transparent hover:bg-[var(--berry)] focus-visible:ring-[var(--cream)] focus-visible:ring-offset-transparent',
    cream: 'py-[12px] px-7 text-[13px] bg-[var(--cream-hi)] text-[var(--berry-deep)] hover:bg-[var(--gold-hi)] focus-visible:ring-[var(--gold-hi)] focus-visible:ring-offset-transparent',
    light: 'py-[11px] px-[26px] text-[14px] bg-[var(--cocoa)] text-[var(--cream)] hover:bg-[var(--berry)] focus-visible:ring-[var(--gold)] focus-visible:ring-offset-transparent',
  };

  const dropdown = pos && (
    <motion.div
      ref={dropdownRef}
      role="listbox"
      aria-label="Choose a delivery platform"
      initial={{ opacity: 0, y: pos.openUp ? 6 : -6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: pos.openUp ? 6 : -6, scale: 0.97 }}
      transition={{ duration: 0.16, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        top: pos.top,
        left: pos.left,
        width: pos.width,
        maxHeight: pos.maxHeight,
        zIndex: 99999,
        background: 'var(--cream-hi)',
        boxShadow: '0 10px 32px rgba(28,13,12,0.28), 0 0 0 1.5px rgba(28,13,12,0.12)',
        borderRadius: 14,
        overflow: 'hidden',
        overflowY: 'auto',
        overscrollBehavior: 'contain',
      }}
    >
      <div
        className="mobile-minimum-12"
        style={{
          padding: '10px 16px',
          textAlign: 'center',
          fontSize: 10,
          letterSpacing: 3,
          textTransform: 'uppercase',
          fontWeight: 700,
          fontFamily: 'var(--font-sans)',
          color: 'var(--cocoa)',
          opacity: 0.55,
          borderBottom: '1px solid rgba(28,13,12,0.1)',
        }}
      >
        Order on
      </div>

      {DELIVERY_PLATFORMS.map((p, i) => {
        const c = PLATFORM_COLORS[p.id] ?? { bg: 'var(--cocoa)', text: '#fff' };
        return (
          <a
            key={p.id}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            role="option"
            data-press-card
            onClick={() => setOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '15px 20px',
              fontSize: 15,
              fontWeight: 700,
              fontFamily: 'var(--font-sans)',
              color: c.bg,
              textDecoration: 'none',
              borderBottom: i < DELIVERY_PLATFORMS.length - 1 ? '1px solid rgba(28,13,12,0.08)' : 'none',
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => {
              if (!window.matchMedia('(hover: hover)').matches) return;
              (e.currentTarget as HTMLElement).style.background = c.bg;
              (e.currentTarget as HTMLElement).style.color = c.text;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = '';
              (e.currentTarget as HTMLElement).style.color = c.bg;
            }}
          >
            <span>{p.name}</span>
            <span className="mobile-minimum-12" style={{ fontSize: 13, opacity: 0.6 }}>→</span>
          </a>
        );
      })}

      <div
        className="mobile-minimum-12"
        style={{
          padding: '8px 16px',
          textAlign: 'center',
          fontSize: 10,
          fontStyle: 'italic',
          fontFamily: 'var(--font-sans)',
          color: 'var(--cocoa)',
          opacity: 0.4,
        }}
      >
        Opens in a new tab
      </div>
    </motion.div>
  );

  return (
    <div className={`inline-block ${className}`}>
      <button
        ref={btnRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={toggle}
        className={`${triggerBase} ${triggerStyles[variant]}`}
      >
        {label}
        <motion.span
          aria-hidden="true"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ fontSize: 11, lineHeight: 1 }}
        >
          ▾
        </motion.span>
      </button>

      {createPortal(
        <AnimatePresence>{open && dropdown}</AnimatePresence>,
        document.body
      )}
    </div>
  );
}
