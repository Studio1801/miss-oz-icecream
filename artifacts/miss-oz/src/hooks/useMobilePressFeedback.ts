import { useEffect } from 'react';
import { useIsMobile } from './use-mobile';

const TAPPABLE = 'button, a[href], [role="button"], [role="link"], [data-press-card]';

/** Pointer feedback works during a held touch, even without native :active. */
export function useMobilePressFeedback() {
  const mobile = useIsMobile();

  useEffect(() => {
    if (!mobile) return;
    let pressed: HTMLElement | null = null;
    let pointerId: number | null = null;
    let startX = 0;
    let startY = 0;

    const clear = () => {
      pressed?.removeAttribute('data-pressed');
      pressed = null;
      pointerId = null;
    };
    const mark = (target: EventTarget | null) => {
      clear();
      const control = target instanceof Element ? target.closest<HTMLElement>(TAPPABLE) : null;
      if (!control || control.matches(':disabled, [aria-disabled="true"]')) return;
      pressed = control;
      control.setAttribute('data-pressed', 'true');
    };
    const down = (event: PointerEvent) => {
      if (!event.isPrimary || event.button !== 0) return;
      mark(event.target);
      pointerId = event.pointerId;
      startX = event.clientX;
      startY = event.clientY;
    };
    const move = (event: PointerEvent) => {
      if (event.pointerId === pointerId && Math.hypot(event.clientX - startX, event.clientY - startY) > 10) clear();
    };
    const release = (event: PointerEvent) => {
      if (event.pointerId === pointerId) clear();
    };
    const keyDown = (event: KeyboardEvent) => {
      if (!event.repeat && (event.key === 'Enter' || event.key === ' ')) mark(event.target);
    };
    const keyUp = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') clear();
    };

    document.addEventListener('pointerdown', down, { capture: true, passive: true });
    document.addEventListener('pointermove', move, { capture: true, passive: true });
    document.addEventListener('pointerup', release, true);
    document.addEventListener('pointercancel', release, true);
    document.addEventListener('keydown', keyDown, true);
    document.addEventListener('keyup', keyUp, true);
    document.addEventListener('visibilitychange', clear);
    window.addEventListener('blur', clear);
    return () => {
      clear();
      document.removeEventListener('pointerdown', down, true);
      document.removeEventListener('pointermove', move, true);
      document.removeEventListener('pointerup', release, true);
      document.removeEventListener('pointercancel', release, true);
      document.removeEventListener('keydown', keyDown, true);
      document.removeEventListener('keyup', keyUp, true);
      document.removeEventListener('visibilitychange', clear);
      window.removeEventListener('blur', clear);
    };
  }, [mobile]);
}
