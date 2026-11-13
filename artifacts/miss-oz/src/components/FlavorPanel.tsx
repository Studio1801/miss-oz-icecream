import { FLAVOR_PHOTOS, type FlavorPhoto } from './MenuPhotos';
import { resolveBadge, FLAVORS, SCALLOP_PATH, UBEREATS_URL } from './menuCatalog';
import { MenuDivider } from './MenuPanelShared';
import { syncCategory, useSheetMenu } from '../lib/sheetSync';
import { cropStyle } from '../lib/crop';
import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';

type FlavorCard = {
  name: string;
  note: string;
  photo?: FlavorPhoto;
  badgeKey?: string;
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
  // The flavour whose photo is open in the close-up, if any.
  const [zoomed, setZoomed] = useState<FlavorCard | null>(null);
  const photoAlt = (photo: FlavorPhoto) => photo.alt ?? (photo.name === 'Thai Iced Tea'
    ? 'A pale golden scoop of ice cream in a silver dessert dish'
    : `A scoop of ${photo.name} ice cream in a dessert dish`);
  return (
    <>
      {/* The scalloped seal edge, defined once and shared by every seal. */}
      <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
        <defs>
          <clipPath id="seal-scallop" clipPathUnits="objectBoundingBox">
            <path transform="scale(0.01)" d={SCALLOP_PATH} />
          </clipPath>
        </defs>
      </svg>
      <div className="flavor-grid mt-[clamp(18px,2.2vw,28px)] grid w-full grid-cols-2 gap-[clamp(10px,1.25vw,16px)] max-[430px]:gap-3 xl:grid-cols-3">
        {cards.map((flavor) => {
          return (
            <article
              key={flavor.name}
              className="flavor-card relative min-w-0 overflow-visible rounded-[10px]"
              style={{
                background: 'var(--cream-hi)',
                boxShadow: '0 9px 22px rgba(28,13,12,0.12)',
              }}
            >
            {flavor.photo ? (
              <div className="flavor-card-photo aspect-[4/5] w-full overflow-hidden rounded-t-[10px]">
                {/* Millie asked for a larger close-up when a photo is tapped. */}
                <button
                  type="button"
                  className="flavor-photo-button"
                  aria-label={`See a larger photo of ${flavor.name}`}
                  onClick={() => setZoomed(flavor)}
                >
                <img
                  src={`${import.meta.env.BASE_URL}${flavor.photo.src}`}
                  alt={photoAlt(flavor.photo)}
                  width={450}
                  height={600}
                  loading="lazy"
                  decoding="async"
                  className="block h-full w-full object-cover"
                  style={cropStyle((flavor as { crop?: string }).crop) ?? {
                    objectPosition: flavor.name === 'Mexican Vanilla'
                      ? '50% 75%'
                      : flavor.photo.objectPosition ?? '50% 62%',
                    transform: flavor.name === 'Fresh Banana'
                      ? 'translateX(-3%) scaleX(1.06)'
                      : flavor.name === 'Mexican Vanilla' ? 'translateY(-5%) scale(1.32)' : undefined,
                  }}
                />
                </button>
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
            {(() => {
              const badge = resolveBadge(flavor.name, flavor.badgeKey);
              if (!badge) return null;
              return (
                <div className="flavor-seal" aria-hidden="true">
                  <div
                    className="flavor-seal-burst"
                    style={{
                      background: 'radial-gradient(circle at 38% 32%, #d47f98 0%, var(--berry-deep) 100%)',
                      clipPath: 'url(#seal-scallop)',
                    }}
                  >
                    {/* The bunting pennant frame. Hidden unless the pennant
                        shape is switched on, since the round seal draws its
                        own edge with a clip path instead. */}
                    <svg className="flavor-seal-pennant" viewBox="0 0 132 96" aria-hidden="true" focusable="false">
                      <defs>
                        <linearGradient id="pennant-fill" x1="0.1" y1="0" x2="0.8" y2="1">
                          <stop offset="0" stopColor="#c06a86" />
                          <stop offset="0.55" stopColor="#8C2A54" />
                          <stop offset="1" stopColor="#4E1129" />
                        </linearGradient>
                      </defs>
                      {/* The cord it hangs from, sagging behind the flag, the
                          same cord the shop's bunting hangs on. It runs past
                          the flag on both sides so the flag reads as one of a
                          string rather than a sticker with a line on top. */}
                      <path className="pennant-cord" d="M3 5 Q66 12 129 5" />
                      <circle className="pennant-bead" cx="3" cy="5" r="2.6" />
                      <circle className="pennant-bead" cx="129" cy="5" r="2.6" />
                      {/* A true inverted triangle. Wide and shallow so the top
                          edge is long enough to carry the words, and the heart
                          sits lower down where the taper leaves no room for
                          type anyway. */}
                      <path d="M5 8 L127 8 L66 90 Z" fill="url(#pennant-fill)" />
                      <path className="pennant-rule" d="M16 15 L116 15 L66 82 Z" />
                    </svg>
                    <div className="flavor-seal-inner">
                      <span className="flavor-seal-crest">
                        <i className="flavor-seal-spark">✦</i>
                        <i className="flavor-seal-heart">♥</i>
                        <i className="flavor-seal-spark">✦</i>
                      </span>
                      <span
                        className="flavor-seal-top"
                        style={{ fontSize: `calc(var(--seal-top) * ${badge.top.length <= 4 ? 1 : badge.top.length <= 5 ? 0.86 : 0.70})` }}
                      >
                        {/* Millie asked for a smaller S in OZ'S, so the
                            possessive is set a size down. Any other label
                            renders whole. */}
                        {/'s$/i.test(badge.top) ? (
                          <>
                            {badge.top.slice(0, -2)}
                            <span className="flavor-seal-possessive">{badge.top.slice(-2)}</span>
                          </>
                        ) : badge.top}
                      </span>
                      <span
                        className="flavor-seal-bottom"
                        style={{ fontSize: `calc(var(--seal-bottom) * ${badge.bottom.length <= 8 ? 1 : 0.82})` }}
                      >
                        {badge.bottom}
                      </span>
                      <svg className="flavor-seal-swoosh" viewBox="0 0 48 8" aria-hidden="true">
                        <circle cx="2.4" cy="4.6" r="1.1" />
                        <path d="M7 6.2 Q24 1.4 41 6.2" fill="none" strokeWidth="1.5" strokeLinecap="round" />
                        <circle cx="45.6" cy="4.6" r="1.1" />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })()}
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
      <Dialog.Root open={zoomed !== null} onOpenChange={(open) => { if (!open) setZoomed(null); }}>
        <Dialog.Portal>
          <Dialog.Overlay className="flavor-zoom-overlay" />
          <Dialog.Content className="flavor-zoom-content" aria-describedby={undefined}>
            {zoomed?.photo && (
              <>
                <img
                  src={`${import.meta.env.BASE_URL}${zoomed.photo.src}`}
                  alt={photoAlt(zoomed.photo)}
                  decoding="async"
                />
                <div className="flavor-zoom-caption">
                  <Dialog.Title
                    className="leading-tight text-[var(--berry-deep)] text-[22px]"
                    style={{ fontFamily: 'var(--font-groovy)', fontStyle: 'italic' }}
                  >
                    {zoomed.name}
                  </Dialog.Title>
                  <p className="mt-1 text-[14px] leading-[1.45] text-[#604C4F]" style={{ fontFamily: 'var(--font-sans)' }}>
                    {zoomed.note}
                  </p>
                </div>
              </>
            )}
            <Dialog.Close className="flavor-zoom-close" aria-label="Close">×</Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
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
