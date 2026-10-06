import MenuPhotoGrid from './MenuPhotoGrid';
import { CAKE_PHOTOS } from './menuCatalog';
import { MenuDivider } from './MenuPanelShared';

export default function WholeCakesPanel({ onOrder }: { onOrder: () => void }) {
  return (
    <div id="cakes" className="flex-1 flex flex-col justify-between" style={{ scrollMarginTop: '100px' }}>
      <div className="mt-[clamp(18px,2.2vw,28px)] flex flex-col gap-[clamp(18px,2vw,26px)]">
        <div
          className="relative overflow-hidden rounded-[12px] p-[clamp(17px,2.2vw,28px)] text-[#6E5A54] leading-relaxed"
          style={{
            background: 'linear-gradient(145deg, rgba(255,248,229,0.96), rgba(245,220,199,0.72))',
            border: '2px solid rgba(94,23,53,0.55)',
            boxShadow: '0 10px 24px rgba(94,23,53,0.16)',
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(10.5px,0.9vw,12.5px)',
          }}
        >
          <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full" style={{ background: 'rgba(227,180,76,0.25)' }} />
          <div className="relative text-[var(--berry-deep)]" style={{ fontFamily: 'var(--font-script)', fontSize: 'clamp(25px,2.6vw,36px)', lineHeight: 1 }}>
            Original Basque Cheesecake
          </div>
          <p className="relative mt-[12px] rounded-[7px] px-3 py-2.5 text-[15px] text-[#4D3538]" style={{ background: 'rgba(255,255,255,0.38)' }}>
            <strong className="text-[var(--berry-deep)]">Crafted fresh for every order.</strong> To ensure the highest quality and texture, our Basque Cheesecakes are available by pre-order only.
          </p>
          <div className="relative mt-[18px] font-bold text-[#3B1E2B]" style={{ fontSize: 'clamp(14px,1.1vw,17px)' }}>
            Pricing
          </div>
          <div className="relative mt-[9px] grid gap-[7px] sm:grid-cols-3">
            <div className="rounded-[8px] px-2 py-2.5 text-center" style={{ background: 'rgba(255,255,255,0.58)', border: '1px solid rgba(227,180,76,0.85)' }}>
              <div className="font-semibold text-[#3B1E2B]">6-inch</div><strong className="text-[var(--berry-deep)]">$55</strong>
            </div>
            <div className="rounded-[8px] px-2 py-2.5 text-center" style={{ background: 'rgba(255,255,255,0.58)', border: '1px solid rgba(227,180,76,0.85)' }}>
              <div className="font-semibold text-[#3B1E2B]">8-inch</div><strong className="text-[var(--berry-deep)]">$85</strong><div className="text-[10px]">(8 slices)</div>
            </div>
            <div className="rounded-[8px] px-2 py-2.5 text-center" style={{ background: 'rgba(255,255,255,0.58)', border: '1px solid rgba(227,180,76,0.85)' }}>
              <div className="font-semibold text-[#3B1E2B]">10-inch</div><strong className="text-[var(--berry-deep)]">$85</strong><div className="text-[10px]">(12 slices)</div>
            </div>
          </div>
          <p className="relative mt-[14px] rounded-[7px] px-3 py-2.5 text-[15px] text-[#4D3538]" style={{ background: 'rgba(94,23,53,0.06)' }}>
            The reason the 8&quot; and 10&quot; cakes are the same price is that they use the{' '}
            <strong className="text-[var(--berry-deep)]">same amount of ingredients.</strong>{' '}
            The 8-inch version is taller and yields 8 larger slices, while the 10-inch version is
            wider and yields 12 thinner slices.
          </p>
        </div>
        <div
          className="relative overflow-hidden rounded-[10px] p-[clamp(18px,2.2vw,28px)] text-[#5B4540] leading-relaxed"
          style={{
            background: 'rgba(251,244,230,0.9)',
            border: '2px solid var(--berry-deep)',
            boxShadow: '0 5px 0 rgba(227,180,76,0.7), inset 0 0 0 5px rgba(242,225,194,0.55)',
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(11px,0.95vw,13.5px)',
          }}
        >
          <div className="relative text-[var(--berry-deep)]" style={{ fontFamily: 'var(--font-script)', fontSize: 'clamp(18px,1.7vw,24px)', lineHeight: 1 }}>
            Made fresh weekly · by pre-order
          </div>
          <div className="relative mt-[9px] font-bold text-[var(--berry-deep)]" style={{ fontFamily: "'DM Serif Display', serif", fontStyle: 'italic', fontSize: 'clamp(20px,2vw,28px)', lineHeight: 1.12 }}>
            Handcrafted in Limited Weekly Batches
          </div>
          <p className="relative mt-[11px] text-[15px] text-[#4D3538]">
            Our whole Basque cheesecakes are made from scratch using 100% premium cream cheese and
            zero flour. Each cake is slow-baked, cooled at room temperature, and refrigerated
            overnight to develop its signature rich and creamy texture.
          </p>
        </div>
        <MenuPhotoGrid photos={CAKE_PHOTOS} />
        <button
          type="button"
          onClick={onOrder}
          className="
            w-full rounded-full bg-[var(--berry-deep)] px-5 py-3 font-bold uppercase tracking-[1.5px]
            text-[var(--cream-hi)] transition-transform hover:-translate-y-0.5
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-hi)]
          "
          style={{ fontFamily: 'var(--font-sans)', fontSize: '12px' }}
        >
          Order a Whole Cheesecake →
        </button>
      </div>
      <div>
        <MenuDivider className="mt-[clamp(16px,2vw,22px)]" />
        <div
          className="mt-[clamp(14px,1.8vw,20px)] rounded-[8px] px-[clamp(14px,1.8vw,22px)] py-[clamp(13px,1.6vw,19px)] text-center"
          style={{ background: 'rgba(94,23,53,0.05)', border: '1px dashed rgba(94,23,53,0.2)' }}
        >
          <div className="text-[var(--marionberry)]" style={{ fontFamily: 'var(--font-script)', fontSize: 'clamp(20px,1.8vw,26px)', lineHeight: 1.1 }}>
            Basque Cheesecake Orders
          </div>
          <p className="mt-[8px] text-[#6E5A54] leading-relaxed" style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(10.5px,0.9vw,12.5px)' }}>
            Made fresh to order in limited weekly batches.
          </p>
        </div>
      </div>
    </div>
  );
}
