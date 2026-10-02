import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import MenuProductList from './MenuProductList';
import MenuPhotoGrid from './MenuPhotoGrid';
import MenuCategoryNavigation from './MenuCategoryNavigation';
import CheesecakeOrder from './CheesecakeOrder';
import { FlavorPhotos } from './MenuPhotos';
import { CROFFLES, DESSERTS, DRINKS, FLAVORS, MENU_CATEGORIES, SUNDAES } from './menuCatalog';

const UBEREATS_URL = 'https://www.ubereats.com/store/miss-oz-ice-cream-cafe-aka-cool-moon-ice-creams/YEfj7ZgZS2m7Wm2og7PphQ';

const sundaePhotos = [
  {
    src: 'images/wholesale/image0.jpeg',
    alt: 'Midnight Fudge Sundae with whipped cream, sprinkles, and a cherry',
    caption: 'Midnight Fudge Sundae',
    objectPosition: 'center top',
  },
  {
    src: 'images/wholesale/image11.jpeg',
    alt: 'Rose City Banana Split',
    caption: 'Rose City Banana Split',
  },
];

const dessertPhotos = [
  {
    src: 'images/cookie-walnut.jpeg',
    alt: 'Walnut chocolate chip cookies',
    caption: 'Walnut Chocolate Chip Cookie',
    objectPosition: 'center 56%',
  },
  {
    src: 'images/cookie-coffee.jpeg',
    alt: 'Two housemade cookies served with coffee',
    caption: 'Butter Pecan Cookie',
  },
  {
    src: 'images/cookie-stack.jpeg',
    alt: 'A stack of housemade cookies on a plate',
    caption: 'Traditional Chocolate Chip Cookie',
    objectPosition: 'center 48%',
  },
];

const cakePhotos = [
  {
    src: 'images/whole-cheesecake-slice.jpeg',
    alt: 'A slice of Original Basque Cheesecake',
    caption: 'Basque Cheesecake Slice',
  },
  {
    src: 'images/whole-basque-cheesecake.jpeg',
    alt: 'A whole Original Basque Cheesecake',
    caption: 'Whole Basque Cheesecake',
  },
];

const awningStyle = {
  background: 'repeating-linear-gradient(90deg, var(--cream-hi) 0 22px, var(--berry-deep) 22px 44px)',
  boxShadow: 'inset 0 -4px 8px rgba(28,13,12,0.2), 0 3px 8px rgba(0,0,0,0.18)',
};
const scallopStyle = {
  background: 'repeating-linear-gradient(90deg, var(--cream-hi) 0 22px, var(--berry-deep) 22px 44px)',
  WebkitMaskImage: 'radial-gradient(11px at 50% 0, #000 98%, transparent 100%)',
  maskImage: 'radial-gradient(11px at 50% 0, #000 98%, transparent 100%)',
  WebkitMaskSize: '22px 100%',
  maskSize: '22px 100%',
  WebkitMaskRepeat: 'repeat-x',
  maskRepeat: 'repeat-x',
  filter: 'drop-shadow(0 3px 4px rgba(0,0,0,0.18))',
};
const dividerStyle = {
  backgroundImage: 'repeating-linear-gradient(90deg, rgba(94,23,53,0.35) 0 4px, transparent 4px 9px)',
};

function Awning() {
  return (
    <div aria-hidden="true" className="relative z-10 -mb-[2px]">
      <div className="h-[14px] rounded-t-[10px]" style={awningStyle} />
      <div className="h-[9px]" style={scallopStyle as React.CSSProperties} />
    </div>
  );
}

function MenuDivider({ className = '' }: { className?: string }) {
  return <div aria-hidden="true" className={`h-px w-full ${className}`} style={dividerStyle} />;
}

function MenuPanelHeading({ category }: { category: string }) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2">
        <span aria-hidden="true" className="text-[10px] text-[var(--pink)]">✦</span>
        <h3
          className="uppercase font-bold tracking-[4px] text-[#3B1E2B]"
          style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(17px,1.9vw,26px)' }}
        >
          {category === 'Flavors' ? 'Ice Cream Flavors' : category}
        </h3>
        <span aria-hidden="true" className="text-[10px] text-[var(--pink)]">✦</span>
      </div>
      {category === 'Flavors' && (
        <div
          className="text-[var(--marionberry)]"
          style={{ fontFamily: 'var(--font-script)', fontSize: 'clamp(23px,2.1vw,31px)', lineHeight: 1, marginTop: '-2px' }}
        >
          Handmade in Small Batches
        </div>
      )}
    </div>
  );
}

function FlavorPanel() {
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

function CroffleDessertsPanel() {
  return (
    <div className="flex-1 flex flex-col justify-between">
      <div className="mt-[clamp(16px,2vw,24px)]">
        <div className="grid grid-cols-1 gap-x-[clamp(24px,3vw,40px)] gap-y-6 md:grid-cols-2">
          <section className="min-w-0">
            <h4 className="mb-3 text-left text-[12px] font-bold tracking-[0.16em] text-[var(--marionberry)]">Croffle menu</h4>
            <MenuProductList items={CROFFLES} descriptionSize="large" />
          </section>
          <section className="min-w-0">
            <h4 className="mb-3 text-left text-[12px] font-bold tracking-[0.16em] text-[var(--marionberry)]">Other desserts</h4>
            <MenuProductList items={DESSERTS} descriptionSize="large" />
          </section>
        </div>
        <div className="mt-[clamp(20px,2.4vw,30px)] text-center">
          <div
            className="text-[var(--marionberry)]"
            style={{ fontFamily: 'var(--font-script)', fontSize: 'clamp(22px,2.2vw,30px)', lineHeight: 1.1 }}
          >
            Fresh-baked favorites
          </div>
          <p
            className="mt-[7px] text-[#6E5A54] italic"
            style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(10.5px,0.9vw,12.5px)' }}
          >
            A few of the housemade sweets you may find at Miss Oz.
          </p>
          <div className="mt-[14px]">
            <MenuPhotoGrid photos={dessertPhotos} />
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
          <p className="mt-[8px] text-[#6E5A54] leading-relaxed" style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(10.5px,0.9vw,12.5px)' }}>
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
              focus-visible:ring-[var(--gold)]
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

function SundaesPanel() {
  return (
    <div className="flex-1 flex flex-col justify-between">
      <div className="mt-[clamp(18px,2.2vw,28px)] flex flex-col">
        <MenuProductList items={SUNDAES} descriptionSize="large" />
        <div className="mt-[clamp(18px,2vw,24px)]">
          <MenuPhotoGrid photos={sundaePhotos} />
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

function DrinksPanel() {
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

function WholeCakesPanel({ onOrder }: { onOrder: () => void }) {
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
        <MenuPhotoGrid photos={cakePhotos} />
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

function WelcomeCard() {
  return (
    <div className="relative mx-auto w-full max-w-[340px] md:max-w-none hidden md:sticky md:top-[110px] md:self-start md:flex flex-col">
      <Awning />
      <div
        className="flex-1 flex flex-col items-center text-center rounded-b-[12px] px-[clamp(18px,1.8vw,26px)] py-[clamp(24px,2.6vw,36px)]"
        style={{
          background: 'radial-gradient(120% 90% at 30% 15%, rgba(255,255,255,0.06), transparent 60%), linear-gradient(165deg, #5E1735 0%, #471027 55%, #55142F 100%)',
          boxShadow: '0 14px 34px rgba(28,13,12,0.3), inset 0 0 0 1.5px rgba(242,225,194,0.3)',
        }}
      >
        <div
          className="flex-1 w-full flex flex-col items-center justify-center rounded-[6px] px-[clamp(14px,1.6vw,22px)] py-[clamp(22px,2.4vw,32px)]"
          style={{ boxShadow: 'inset 0 0 0 1.5px rgba(242,225,194,0.4)' }}
        >
          <div
            className="text-center leading-[1.2] text-[#F2E1C2]"
            style={{ fontFamily: "'DM Serif Display', serif", fontStyle: 'italic', fontSize: 'clamp(28px,2.6vw,38px)' }}
          >
            ~ Come Slow
            <br />
            Down ~
            <br />
            With Us!
          </div>
          <span aria-hidden="true" className="mt-[clamp(10px,1.1vw,16px)] text-[var(--pink)]" style={{ fontSize: 16 }}>♥</span>
          <p
            className="mt-[clamp(10px,1.1vw,16px)] text-center leading-relaxed text-[#EFD9C9]"
            style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(12px,0.95vw,14px)' }}
          >
            Churned fresh every week using classic recipes and real ingredients. No shortcuts.
          </p>
          <CardDivider />
          <p
            className="text-center leading-relaxed text-[#EFD9C9]"
            style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(12px,0.95vw,14px)' }}
          >
            Pickup or delivery available on Uber&nbsp;Eats &amp; Grubhub.
          </p>
          <CardDivider />
          <p
            className="text-center leading-relaxed text-[#EFD9C9]"
            style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(12px,0.95vw,14px)' }}
          >
            We love our community and your suggestions!
          </p>
          <a
            href={UBEREATS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-[clamp(16px,1.8vw,24px)] w-full block transition-transform duration-200 hover:-translate-y-[3px] hover:scale-[1.03] active:scale-[0.98]"
            style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.3))' }}
          >
            <span
              className="block relative overflow-hidden ticket-shine motion-safe:animate-[ticketFloat_4s_ease-in-out_infinite]"
              style={{
                background: 'linear-gradient(180deg, #F7EDDD 0%, #F2E4CC 100%)',
                borderRadius: '6px',
                padding: '5px',
                WebkitMaskImage: 'radial-gradient(circle 8px at 0 50%, transparent 96%, #000 100%), radial-gradient(circle 8px at 100% 50%, transparent 96%, #000 100%)',
                maskImage: 'radial-gradient(circle 8px at 0 50%, transparent 96%, #000 100%), radial-gradient(circle 8px at 100% 50%, transparent 96%, #000 100%)',
                WebkitMaskComposite: 'source-in',
                maskComposite: 'intersect',
              }}
            >
              <span
                className="flex flex-col items-center justify-center"
                style={{ border: '1.5px dashed rgba(59,16,32,0.55)', borderRadius: '4px', padding: '11px 22px 12px' }}
              >
                <span
                  className="uppercase whitespace-nowrap"
                  style={{ fontFamily: 'var(--font-sans)', fontSize: '7px', letterSpacing: '1px', fontWeight: 700, color: 'rgba(59,16,32,0.55)' }}
                >
                  ✦ Admit One Sweet Tooth ✦
                </span>
                <span
                  className="flex items-center gap-2 whitespace-nowrap uppercase"
                  style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(11px,0.85vw,13px)', letterSpacing: '1.5px', color: '#3B1020', lineHeight: 1.3 }}
                >
                  Place an Order
                  <span aria-hidden="true" className="transition-transform duration-150 group-hover:translate-x-1">→</span>
                </span>
              </span>
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}

function CardDivider() {
  return (
    <div aria-hidden="true" className="my-[clamp(10px,1.1vw,16px)] flex items-center gap-2 w-[75%]">
      <span className="flex-1 h-px" style={{ background: 'rgba(242,225,194,0.35)' }} />
      <span className="text-[#F2E1C2] opacity-60" style={{ fontSize: 8 }}>✦</span>
      <span className="flex-1 h-px" style={{ background: 'rgba(242,225,194,0.35)' }} />
    </div>
  );
}

export default function MenuSection() {
  const [activeCategory, setActiveCategory] = useState<string>(() =>
    window.location.hash === '#cakes' ? 'Whole Cakes' : 'Flavors',
  );
  const scrollMenuAfterSelection = useRef(false);
  const [cakeOrderOpen, setCakeOrderOpen] = useState(false);
  const closeCakeOrder = useCallback(() => setCakeOrderOpen(false), []);
  const selectCategory = (category: string) => {
    const categoryChanged = category !== activeCategory;
    scrollMenuAfterSelection.current = categoryChanged;
    setActiveCategory(category);
    if (category === 'Whole Cakes') {
      history.replaceState(null, '', `${window.location.pathname}${window.location.search}#cakes`);
    } else if (window.location.hash === '#cakes') {
      history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    }
  };

  useLayoutEffect(() => {
    if (!scrollMenuAfterSelection.current) return;
    scrollMenuAfterSelection.current = false;

    const menu = document.getElementById('menu');
    if (!menu) return;

    const marginTop = Number.parseFloat(window.getComputedStyle(menu).scrollMarginTop) || 0;
    const top = Math.max(0, window.scrollY + menu.getBoundingClientRect().top - marginTop);
    window.scrollTo({ top, behavior: 'smooth' });
  }, [activeCategory]);

  useEffect(() => {
    const activateCakes = () => {
      if (window.location.hash !== '#cakes') return;
      setActiveCategory('Whole Cakes');
      requestAnimationFrame(() =>
        document.getElementById('cakes')?.scrollIntoView({ behavior: 'smooth' }),
      );
    };
    window.addEventListener('hashchange', activateCakes);
    return () => window.removeEventListener('hashchange', activateCakes);
  }, []);

  return (
    <>
      <section
        id="menu"
        className="relative z-20 mx-auto max-w-none px-0 mt-[clamp(18px,2.4vw,30px)]"
        style={{ scrollMarginTop: '94px', overflowAnchor: 'none' }}
      >
        <h2 className="sr-only">Menu</h2>
        <div className="flex items-center justify-center gap-3 mb-[clamp(14px,1.8vw,22px)]">
          <span className="w-10 h-px bg-[var(--gold)] opacity-60" aria-hidden="true" />
          <span
            className="text-[var(--berry-deep)] text-[12px] tracking-[4px] uppercase font-bold"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Step Inside
          </span>
          <span className="w-10 h-px bg-[var(--gold)] opacity-60" aria-hidden="true" />
        </div>

        <div className="md:hidden">
          <Awning />
          <MenuCategoryNavigation
            variant="mobile"
            activeCategory={activeCategory}
            onSelect={selectCategory}
          />
        </div>

        <div
          className="
            grid grid-cols-1
            md:grid-cols-[minmax(170px,220px)_minmax(380px,1fr)_minmax(170px,220px)]
            lg:grid-cols-[minmax(210px,270px)_minmax(420px,1fr)_minmax(210px,270px)]
            gap-[clamp(14px,1.8vw,22px)] items-stretch md:px-[clamp(20px,3vw,48px)]
          "
        >
          <aside
            aria-label="Menu categories"
            className="relative mx-auto w-full max-w-[320px] md:max-w-none hidden md:sticky md:top-[110px] md:self-start md:flex flex-col"
          >
            <Awning />
            <div
              className="flex-1 flex flex-col items-center rounded-b-[12px] px-3 py-[clamp(14px,1.6vw,20px)]"
              style={{
                background: 'var(--berry-deep)',
                boxShadow: '0 14px 34px rgba(28,13,12,0.3), inset 0 0 0 1.5px rgba(242,225,194,0.3)',
              }}
            >
              <div
                className="flex-1 w-full flex flex-col"
                style={{
                  background: 'rgba(242,225,194,0.55)',
                  clipPath: 'polygon(22px 0, calc(100% - 22px) 0, 100% 22px, 100% calc(100% - 22px), calc(100% - 22px) 100%, 22px 100%, 0 calc(100% - 22px), 0 22px)',
                  padding: '1px',
                }}
              >
                <div
                  className="flex-1 flex flex-col"
                  style={{
                    background: 'var(--berry)',
                    clipPath: 'polygon(21px 0, calc(100% - 21px) 0, 100% 21px, 100% calc(100% - 21px), calc(100% - 21px) 100%, 21px 100%, 0 calc(100% - 21px), 0 21px)',
                    padding: '3px',
                  }}
                >
                  <div
                    className="flex-1 flex flex-col"
                    style={{
                      background: 'rgba(242,225,194,0.8)',
                      clipPath: 'polygon(18px 0, calc(100% - 18px) 0, 100% 18px, 100% calc(100% - 18px), calc(100% - 18px) 100%, 18px 100%, 0 calc(100% - 18px), 0 18px)',
                      padding: '1px',
                    }}
                  >
                    <div
                      className="flex-1 w-full flex flex-col items-center justify-center px-4 py-[clamp(18px,2vw,28px)]"
                      style={{
                        background: 'var(--berry-deep)',
                        clipPath: 'polygon(17px 0, calc(100% - 17px) 0, 100% 17px, 100% calc(100% - 17px), calc(100% - 17px) 100%, 17px 100%, 0 calc(100% - 17px), 0 17px)',
                        gap: 'clamp(18px,2.2vw,30px)',
                      }}
                    >
                      <MenuCategoryNavigation
                        variant="desktop"
                        activeCategory={activeCategory}
                        onSelect={selectCategory}
                        onOrderWholeCake={() => setCakeOrderOpen(true)}
                      />
                      <div className="flex flex-col items-center mt-[clamp(14px,1.6vw,22px)]">
                        <img
                          src="/images/icon-icecream-cone.png"
                          alt=""
                          aria-hidden="true"
                          style={{ width: 'clamp(46px,5vw,66px)', height: 'auto' }}
                        />
                        <div
                          className="mt-[clamp(7px,0.8vw,11px)] text-center text-[var(--pink)]"
                          style={{ fontFamily: 'var(--font-script)', fontSize: 'clamp(24px,2.2vw,32px)', lineHeight: 0.95 }}
                        >
                          Made with
                          <br />
                          Love
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <section
            aria-label="Menu"
            className="relative flex flex-col self-start h-auto min-h-0 rounded-t-none rounded-b-[10px] md:rounded-[10px] md:mx-[clamp(12px,2.5vw,32px)] overflow-hidden px-[clamp(18px,2.6vw,42px)] py-[clamp(22px,2.6vw,36px)]"
            style={{
              background: 'linear-gradient(180deg, #FBF4E6, #F7EDDA)',
              boxShadow: '0 14px 34px rgba(28,13,12,0.18), inset 0 0 0 1px rgba(94,23,53,0.25), inset 0 0 0 5px rgba(251,244,230,1), inset 0 0 0 6px rgba(94,23,53,0.15)',
            }}
          >
            <div
              className="grid"
              style={{ gridTemplateColumns: '1fr', gridTemplateRows: 'auto' }}
            >
              {MENU_CATEGORIES.map((category) => {
                const isActive = category === activeCategory;
                return (
                  <motion.div
                    key={category}
                    className="flex flex-col"
                    style={{
                      gridArea: '1 / 1',
                      height: isActive ? 'auto' : 0,
                      overflow: isActive ? 'visible' : 'hidden',
                      pointerEvents: isActive ? 'auto' : 'none',
                    } as React.CSSProperties}
                    initial={false}
                    animate={{
                      opacity: isActive ? 1 : 0,
                      filter: isActive ? 'blur(0px)' : 'blur(6px)',
                    }}
                    transition={{
                      opacity: {
                        duration: isActive ? 0.42 : 0.14,
                        ease: isActive ? [0.16, 1, 0.3, 1] : 'easeIn',
                      },
                      filter: { duration: isActive ? 0.42 : 0.14 },
                    }}
                    aria-hidden={!isActive}
                  >
                    <MenuPanelHeading category={category} />
                    {category === 'Flavors' && <FlavorPanel />}
                    {category === 'Croffles & Desserts' && <CroffleDessertsPanel />}
                    {category === 'Sundaes' && <SundaesPanel />}
                    {category === 'Drinks' && <DrinksPanel />}
                    {category === 'Whole Cakes' && (
                      <WholeCakesPanel onOrder={() => setCakeOrderOpen(true)} />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </section>

          <WelcomeCard />
        </div>

        <div className="mt-[clamp(18px,2.2vw,28px)] flex items-center justify-center gap-4 text-center">
          <img
            src="/images/icon-icecream-cup.png"
            alt=""
            aria-hidden="true"
            className="shrink-0"
            style={{ width: 'clamp(34px,3vw,42px)', height: 'auto' }}
          />
          <div>
            <div
              className="uppercase font-bold tracking-[3px] text-[#3B1E2B]"
              style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(11px,1vw,14px)' }}
            >
              Sweet Memories Start Here.
            </div>
            <div
              className="mt-[3px] text-[#6E5A54]"
              style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(10px,0.85vw,12px)' }}
            >
              Thank you for supporting our family-run shop since 2007.
            </div>
          </div>
          <img
            src="/images/icon-icecream-cart.png"
            alt=""
            aria-hidden="true"
            className="shrink-0"
            style={{ width: 'clamp(34px,3vw,42px)', height: 'auto' }}
          />
        </div>
        <div
          className="mt-[clamp(14px,2vw,22px)] rounded-[8px] border px-4 py-3 text-center"
          style={{
            background: 'linear-gradient(90deg, rgba(244,169,199,0.25), var(--cream-hi), rgba(244,169,199,0.25))',
            borderColor: 'rgba(94,23,53,0.28)',
            boxShadow: '0 4px 12px rgba(94,23,53,0.08)',
          }}
        >
          <span
            className="text-[var(--berry-deep)] text-[11px] sm:text-[12.5px] tracking-[2px] uppercase font-bold"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Locally Owned <span className="text-[var(--pink)] mx-1">·</span>
            Small Business <span className="text-[var(--pink)] mx-1">·</span>
            @missozicecream
          </span>
        </div>
      </section>
      <CheesecakeOrder open={cakeOrderOpen} onClose={closeCakeOrder} />
    </>
  );
}