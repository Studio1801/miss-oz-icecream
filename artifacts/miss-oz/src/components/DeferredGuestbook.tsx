import { lazy, Suspense } from 'react';
import { useNearViewport } from './useNearViewport';

const Guestbook = lazy(() => import('./Guestbook'));

function GuestbookPlaceholder() {
  return (
    <div
      aria-hidden="true"
      className="parlour-paper relative bg-[var(--cream)] px-[6vw] py-[80px] md:py-[120px] overflow-hidden"
      style={{ minHeight: 'inherit' }}
    />
  );
}

export default function DeferredGuestbook() {
  const { ref, shouldLoad } = useNearViewport<HTMLDivElement>();

  return (
    <div id="guestbook" ref={ref} className="deferred-guestbook-reserve" aria-busy={!shouldLoad}>
      {shouldLoad ? (
        <Suspense fallback={<GuestbookPlaceholder />}>
          <Guestbook id={undefined} />
        </Suspense>
      ) : (
        <GuestbookPlaceholder />
      )}
    </div>
  );
}
