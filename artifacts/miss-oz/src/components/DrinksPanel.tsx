import MenuProductList from './MenuProductList';
import { DRINKS } from './menuCatalog';

export default function DrinksPanel() {
  return (
    <div className="flex flex-col">
      <div className="mt-[clamp(18px,2.2vw,28px)] flex flex-col text-center">
        <MenuProductList items={DRINKS} align="center" />
        <div
          className="mt-[clamp(14px,1.8vw,20px)] rounded-[8px] px-[clamp(14px,1.8vw,22px)] py-[clamp(13px,1.6vw,19px)] text-center"
          style={{ background: 'rgba(94,23,53,0.05)', border: '1px dashed rgba(94,23,53,0.2)' }}
        >
          <div className="text-[var(--marionberry)]" style={{ fontFamily: 'var(--font-script)', fontSize: 'clamp(20px,1.8vw,26px)', lineHeight: 1.1 }}>
            Seasonal Specials
          </div>
          <p className="mt-[8px] text-[#6E5A54] leading-relaxed" style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(10.5px,0.9vw,12.5px)' }}>
            Thai Iced Tea, Lychee Soda, and House Lemonade. Our seasonal drinks rotate, so ask your scooper what's fresh today.
          </p>
        </div>
      </div>
    </div>
  );
}
