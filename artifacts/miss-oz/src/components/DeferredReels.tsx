import { lazy, Suspense } from 'react';
import { useNearViewport } from './useNearViewport';

const Reels = lazy(() => import('./Reels'));

function ReelsPlaceholder() {
  return (
    <div
      aria-hidden="true"
      className="parlour-paper relative bg-[var(--cream)] px-[6vw] py-[80px] md:py-[110px] overflow-hidden"
      style={{ minHeight: 'inherit' }}
    />
  );
}

export default function DeferredReels() {
  const { ref, shouldLoad } = useNearViewport<HTMLDivElement>();

  return (
    <div ref={ref} className="deferred-reels-reserve" aria-busy={!shouldLoad}>
      {shouldLoad ? (
        <Suspense fallback={<ReelsPlaceholder />}>
          <Reels />
        </Suspense>
      ) : (
        <ReelsPlaceholder />
      )}
    </div>
  );
}
