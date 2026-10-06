import MenuPhotoGrid from './MenuPhotoGrid';
import MenuProductList from './MenuProductList';
import { SUNDAES, SUNDAE_PHOTOS } from './menuCatalog';
import { MenuDivider } from './MenuPanelShared';

export default function SundaesPanel() {
  return (
    <div className="flex-1 flex flex-col justify-between">
      <div className="mt-[clamp(18px,2.2vw,28px)] flex flex-col">
        <MenuProductList items={SUNDAES} descriptionSize="large" />
        <div className="mt-[clamp(18px,2vw,24px)]">
          <MenuPhotoGrid photos={SUNDAE_PHOTOS} layout="sundaes" aspectRatio="portrait" />
        </div>
      </div>
      <div>
        <MenuDivider className="mt-[clamp(16px,2vw,22px)]" />
        <div
          className="mt-[clamp(14px,1.8vw,20px)] rounded-[8px] px-[clamp(14px,1.8vw,22px)] py-[clamp(13px,1.6vw,19px)] text-center"
          style={{ background: 'rgba(94,23,53,0.05)', border: '1px dashed rgba(94,23,53,0.2)' }}
        >
          <div className="text-[var(--marionberry)]" style={{ fontFamily: 'var(--font-script)', fontSize: 'clamp(20px,1.8vw,26px)', lineHeight: 1.1 }}>
            Make it your own
          </div>
          <p className="mt-[8px] text-[#6E5A54] leading-relaxed" style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(10.5px,0.9vw,12.5px)' }}>
            Add a second scoop, swap the base flavor, or upgrade with house-made hot fudge or berry compote. Ask your scooper. We love a custom order!
          </p>
        </div>
      </div>
    </div>
  );
}
