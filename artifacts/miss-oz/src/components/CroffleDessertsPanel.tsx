import MenuPhotoGrid from './MenuPhotoGrid';
import MenuProductList from './MenuProductList';
import { CROFFLE_PHOTOS, DESSERTS, DESSERT_PHOTOS, CROFFLES, UBEREATS_URL } from './menuCatalog';
import { syncCategory, useSheetMenu } from '../lib/sheetSync';
import { MenuDivider } from './MenuPanelShared';

export default function CroffleDessertsPanel() {
  const sheetMenu = useSheetMenu();
  const toItem = (row: { name: string; description: string }) => ({ name: String(row.name), note: String(row.description ?? '') });
  const croffles = syncCategory(CROFFLES, sheetMenu, 'Croffles', toItem);
  const desserts = syncCategory(DESSERTS, sheetMenu, 'Cookies & desserts', toItem);
  return (
    <div className="flex-1 flex flex-col justify-between">
      <div className="mt-[clamp(16px,2vw,24px)]">
        <div className="grid grid-cols-1 gap-x-[clamp(24px,3vw,40px)] gap-y-6 max-[430px]:gap-y-5 md:grid-cols-2">
          <section className="min-w-0">
            <h4 className="menu-subsection-label mb-3 max-[430px]:mb-[7px] text-left text-[12px] font-bold tracking-[0.16em] text-[var(--marionberry)]">Croffle menu</h4>
            <MenuProductList items={croffles} descriptionSize="large" />
          </section>
          <section className="min-w-0">
            <h4 className="menu-subsection-label mb-3 max-[430px]:mb-[7px] text-left text-[12px] font-bold tracking-[0.16em] text-[var(--marionberry)]">Other desserts</h4>
            <MenuProductList items={desserts} descriptionSize="large" />
          </section>
        </div>
        <div className="mt-[clamp(18px,2.2vw,28px)]">
          <MenuPhotoGrid photos={CROFFLE_PHOTOS} showCaptions={false} />
        </div>
        <div className="mt-[clamp(20px,2.4vw,30px)] text-center">
          <div
            className="text-[var(--marionberry)]"
            style={{ fontFamily: 'var(--font-script)', fontSize: 'clamp(22px,2.2vw,30px)', lineHeight: 1.1 }}
          >
            Fresh-baked favorites
          </div>
          <p
              className="menu-closing-copy mt-[7px] text-[#6E5A54] italic mobile-body-14"
            style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(10.5px,0.9vw,12.5px)' }}
          >
            A few of the housemade sweets you may find at Miss Oz.
          </p>
          <div className="mt-[14px]">
            <MenuPhotoGrid photos={DESSERT_PHOTOS} />
          </div>
        </div>
      </div>
      <div>
        <MenuDivider className="mt-[clamp(16px,2vw,22px)]" />
        <div
          className="mt-[clamp(14px,1.8vw,20px)] rounded-[8px] px-[clamp(14px,1.8vw,22px)] py-[clamp(13px,1.6vw,19px)] text-center"
          style={{ background: 'rgba(94,23,53,0.05)', border: '1px dashed rgba(94,23,53,0.2)' }}
        >
          <div
            className="text-[var(--marionberry)]"
            style={{ fontFamily: 'var(--font-script)', fontSize: 'clamp(20px,1.8vw,26px)', lineHeight: 1.1 }}
          >
            always housemade, never rushed
          </div>
          <p className="menu-closing-copy mt-[8px] text-[#6E5A54] leading-relaxed mobile-body-14" style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(10.5px,0.9vw,12.5px)' }}>
            See the full menu on Uber Eats.
          </p>
          <a
            href={UBEREATS_URL}
            target="_blank"
            rel="noopener noreferrer"
              className="
              mt-[clamp(10px,1.2vw,14px)] inline-flex items-center gap-1.5 rounded-full
              bg-[var(--berry-deep)] text-[var(--cream-hi)] font-bold uppercase tracking-[2px]
              transition-colors hover:bg-[var(--berry)] focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-[var(--gold)] mobile-minimum-12 min-h-[44px]
            "
            style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(10px,0.85vw,12px)', padding: '8px 22px' }}
          >
            Browse on Uber Eats →
          </a>
        </div>
      </div>
    </div>
  );
}
