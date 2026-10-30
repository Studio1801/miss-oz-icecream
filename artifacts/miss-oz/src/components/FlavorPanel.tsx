import { FLAVOR_PHOTOS, type FlavorPhoto } from './MenuPhotos';
import { FLAVORS, UBEREATS_URL } from './menuCatalog';
import { MenuDivider } from './MenuPanelShared';
import { syncCategory, useSheetMenu } from '../lib/sheetSync';

type FlavorCard = {
  name: string;
  note: string;
  photo?: FlavorPhoto;
};

const EXTRA_FLAVOR_TASTE_NOTES: Record<string, string> = {
  'Thai Iced Tea': 'Sweet black tea with a creamy, gently spiced finish.',
};

function canonicalPhotoName(name: string) {
  if (name === 'Cookie and Cream') return 'Cookies & Cream';
  if (name === 'Marionberry') return 'Oregon Marionberry';
  return name;
}

const FLAVOR_CARDS: FlavorCard[] = [
  ...FLAVORS.map((flavor) => {
    if (!flavor.note) throw new Error(`Missing taste description for ${flavor.name}`);
    return {
      ...flavor,
      note: flavor.note,
      photo: FLAVOR_PHOTOS.find((photo) => canonicalPhotoName(photo.name) === flavor.name),
    };
  }),
  ...FLAVOR_PHOTOS
    .filter((photo) => !FLAVORS.some((flavor) => canonicalPhotoName(photo.name) === flavor.name))
    .map((photo) => {
      const note = EXTRA_FLAVOR_TASTE_NOTES[photo.name];
      if (!note) throw new Error(`Missing taste description for photo-only flavor ${photo.name}`);
      return { name: photo.name, note, photo };
    }),
];

export default function FlavorPanel() {
  const sheetMenu = useSheetMenu();
  const cards = syncCategory(FLAVOR_CARDS, sheetMenu, 'Ice cream flavors', (row) => ({
    name: String(row.name),
    note: String(row.description ?? ''),
    photo: FLAVOR_PHOTOS.find((photo) => canonicalPhotoName(photo.name) === String(row.name)),
  }));
  return (
    <>
      <div className="flavor-grid mt-[clamp(18px,2.2vw,28px)] grid w-full grid-cols-2 gap-[clamp(10px,1.25vw,16px)] max-[430px]:gap-3 xl:grid-cols-3">
        {cards.map((flavor) => {
          return (
            <article
              key={flavor.name}
              className="flavor-card min-w-0 overflow-hidden rounded-[10px]"
              style={{
                background: 'var(--cream-hi)',
                boxShadow: '0 9px 22px rgba(28,13,12,0.12)',
              }}
            >
            {flavor.photo ? (
              <div className="flavor-card-photo aspect-[4/5] w-full overflow-hidden rounded-t-[10px]">
                <img
                  src={`${import.meta.env.BASE_URL}${flavor.photo.src}`}
                  alt={flavor.photo.alt ?? (flavor.photo.name === 'Thai Iced Tea'
                    ? 'A pale golden scoop of ice cream in a silver dessert dish'
                    : `A scoop of ${flavor.photo.name} ice cream in a dessert dish`)}
                  width={450}
                  height={600}
                  loading="lazy"
                  decoding="async"
                  className="block h-full w-full object-cover"
                  style={{
                    objectPosition: flavor.name === 'Mexican Vanilla'
                      ? '50% 75%'
                      : flavor.photo.objectPosition ?? '50% 62%',
                    transform: flavor.name === 'Fresh Banana'
                      ? 'translateX(-3%) scaleX(1.06)'
                      : flavor.name === 'Mexican Vanilla' ? 'translateY(-5%) scale(1.32)' : undefined,
                  }}
                />
              </div>
            ) : (
              <div
                className="flavor-card-photo flex aspect-[4/5] items-center justify-center px-3 text-center"
                style={{ background: 'linear-gradient(145deg, rgba(232,177,190,0.76), #FBF4E6)' }}
              >
                <h3
                  className="leading-[1.05] text-[var(--berry-deep)] text-[clamp(22px,2vw,30px)] max-[430px]:text-[20px]"
                  style={{ fontFamily: 'var(--font-groovy)', fontStyle: 'italic' }}
                >
                  {flavor.name}
                </h3>
              </div>
            )}
            <div className="flavor-card-copy px-[clamp(9px,1vw,14px)] py-[clamp(10px,1vw,14px)]">
              {flavor.photo && (
                <h3
                  className="leading-tight text-[var(--berry-deep)] text-[clamp(16px,1.25vw,19px)] max-[430px]:text-[14.5px]"
                  style={{ fontFamily: 'var(--font-groovy)', fontStyle: 'italic' }}
                >
                  {flavor.name}
                </h3>
              )}
              <p
                className={`text-[clamp(11.5px,0.9vw,13px)] max-[639px]:text-[14px] leading-relaxed max-[430px]:leading-[1.5] text-[#604C4F] ${flavor.photo ? 'mt-1' : ''}`}
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {flavor.note}
              </p>
            </div>
            </article>
          );
        })}
      </div>
      <MenuDivider className="mt-[clamp(16px,2vw,24px)]" />
      <p
        className="flavor-rotation-note menu-closing-copy mt-[clamp(10px,1.2vw,16px)] text-center text-[#6E5A54] mobile-body-14"
        style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(10.5px,0.9vw,12.5px)' }}
      >
        Around 20 flavors in the case at any time, with rotating seasonal flavors drawn from our collection of over 150 recipes.
      </p>
      <a
        href={UBEREATS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flavor-uber-eats
          mt-[clamp(10px,1.2vw,16px)] self-center inline-flex items-center gap-1.5 rounded-full
          bg-[var(--berry-deep)] text-[var(--cream-hi)] font-bold uppercase tracking-[2px]
          transition-colors hover:bg-[var(--berry)] focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-[var(--gold)] mobile-minimum-12 min-h-[44px]
        "
        style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(10px,0.85vw,12px)', padding: '8px 22px' }}
      >
        See full menu on Uber Eats →
      </a>
    </>
  );
}
