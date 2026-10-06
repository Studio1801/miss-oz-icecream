import { FlavorPhotos } from './MenuPhotos';
import { FLAVORS, UBEREATS_URL } from './menuCatalog';
import { MenuDivider } from './MenuPanelShared';

export default function FlavorPanel() {
  return (
    <>
      <div className="mt-[clamp(18px,2.2vw,28px)] flex-1 flex flex-col md:flex-row gap-x-[clamp(20px,3vw,40px)] gap-y-0">
        {[FLAVORS.slice(0, 6), FLAVORS.slice(6)].map((column, columnIndex) => (
          <div key={columnIndex} className="flex-1 flex flex-col">
            {column.map((flavor, index) => (
              <div
                key={flavor.name}
                className="flex items-start gap-[10px] py-[clamp(10px,1.1vw,15px)]"
                style={{ borderTop: index > 0 ? '1px solid rgba(94,23,53,0.1)' : 'none' }}
              >
                <span aria-hidden="true" className="text-[var(--pink)] mt-[5px] shrink-0" style={{ fontSize: 8 }}>●</span>
                <div>
                  <div
                    className="uppercase font-bold tracking-[0.08em] text-[var(--berry-deep)]"
                    style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(12px,1.05vw,14px)' }}
                  >
                    {flavor.name}
                  </div>
                  <div
                    className="mt-1 leading-relaxed text-[#604C4F]"
                    style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(11.5px,0.95vw,13px)' }}
                  >
                    {flavor.note}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <MenuDivider className="mt-[clamp(16px,2vw,24px)]" />
      <p
        className="mt-[clamp(10px,1.2vw,16px)] text-center text-[#6E5A54]"
        style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(10.5px,0.9vw,12.5px)' }}
      >
        We rotate approximately 20 flavors. Selection changes with the season.
      </p>
      <a
        href={UBEREATS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="
          mt-[clamp(10px,1.2vw,16px)] self-center inline-flex items-center gap-1.5 rounded-full
          bg-[var(--berry-deep)] text-[var(--cream-hi)] font-bold uppercase tracking-[2px]
          transition-colors hover:bg-[var(--berry)] focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-[var(--gold)]
        "
        style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(10px,0.85vw,12px)', padding: '8px 22px' }}
      >
        See full menu on Uber Eats →
      </a>
      <FlavorPhotos />
    </>
  );
}
