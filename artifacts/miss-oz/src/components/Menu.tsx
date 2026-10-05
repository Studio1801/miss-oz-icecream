import { motion } from 'framer-motion';

const macklin = { fontFamily: 'var(--font-groovy)', fontWeight: 400, fontStyle: 'italic' };

const CARDS = [
  {
    no: 'I',
    title: 'Small-Batch Scoops',
    imageAlt: 'Small-batch ice cream scoops served in waffle cones',
    desc: 'Marionberry, Thai iced tea, kulfi, coffee crackle, summer rose & friends',
    image: 'https://homesweetcone.com/wp-content/uploads/2023/12/HSC_photo23-600x400.jpg',
  },
  {
    no: 'II',
    title: 'Croffles',
    imageAlt: 'Golden croffles, or croissant waffles, served with toppings',
    desc: 'Croissant waffles, Oreo pop, brunost, fresh cream, fudge drizzle',
    image: 'https://www.missinthekitchen.com/wp-content/uploads/2024/02/Croffles-Croissant-Waffles-Recipe-photo.jpg',
  },
  {
    no: 'III',
    title: 'Coffee & Drinks',
    imageAlt: 'A cup of coffee served at a cafe',
    desc: 'Espresso drinks, floats, and something warm for the rainy days',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80',
  },
  {
    no: 'IV',
    title: 'Cookies & Cakes',
    imageAlt: 'A slice of Basque cheesecake with a browned top',
    desc: 'Basque cheesecake, fresh cookies, and seasonal bakes',
    image: 'https://dishnthekitchen.com/wp-content/uploads/2022/03/vertbasquecheesecakesliceright.jpg',
  }
];

export default function Menu() {
  return (
    <>
      <section className="text-center py-[80px] md:py-[130px] px-[6vw] bg-[var(--cream-hi)]">
        <motion.span
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="block text-[12px] tracking-[5px] uppercase font-bold text-[var(--cocoa)] opacity-60 mb-3"
        >
          Made on-site daily
        </motion.span>
        <motion.span
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}
          className="block font-script text-[var(--berry-deep)] text-[clamp(30px,3.5vw,42px)] mb-2"
        >
          from the case
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }}
          className="text-[clamp(42px,6vw,80px)] leading-[0.98] mb-5 text-[var(--cocoa)]"
          style={macklin}
        >
          The Menu
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}
          className="italic max-w-[520px] mx-auto text-[19px] text-[#1d0e0d] opacity-80"
        >
          Every flavor made in-house. Ask for a sample, we insist.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[28px] max-w-[1060px] mx-auto mt-[52px]">
          {CARDS.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <div
                className="relative bg-[var(--cream)] rounded-[10px] overflow-hidden text-left group h-full transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_34px_rgba(28,13,12,0.18)]"
                style={{ boxShadow: '0 6px 22px rgba(28,13,12,0.10)' }}
              >
                {/* aged-paper double-rule frame */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-[10px] z-20 rounded-[6px]"
                  style={{ border: '1px solid var(--gold)', boxShadow: 'inset 0 0 0 3px var(--cream), inset 0 0 0 4px rgba(199,154,59,0.45)' }}
                />
                
                {/* 3D Flip Card Container */}
                <div className="relative h-[210px] perspective-1000">
                  <div className="relative w-full h-full menu-card-img-inner">
                    {/* Front: Image */}
                    <div className="absolute inset-0 card-front">
                      <img loading="lazy" decoding="async"
                        src={card.image}
                        alt={card.imageAlt}
                        width={600}
                        height={400}
                        className="w-full h-full object-cover"
                        style={{ filter: 'sepia(0.22) saturate(1.05) contrast(0.98)' }}
                       
                      />
                      {/* vintage warm wash + vignette */}
                      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(120% 90% at 50% 20%, transparent 55%, rgba(94,23,53,0.28) 100%)', mixBlendMode: 'multiply' }} />
                      {/* roman-numeral chapter medallion */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute top-[18px] left-[18px] z-10 grid place-items-center w-[44px] h-[44px] rounded-full text-[var(--cream-hi)]"
                        style={{ background: 'var(--berry-deep)', border: '2px solid var(--gold-hi)', boxShadow: '0 3px 8px rgba(28,13,12,0.3)' }}
                      >
                        <span className="font-display text-[16px] leading-none tracking-[0.5px]">{card.no}</span>
                      </div>
                    </div>
                    {/* Back: Reveal Text */}
                    <div className="absolute inset-0 card-back bg-[var(--teal-deep)] flex items-center justify-center p-6 text-center" style={{ boxShadow: 'inset 0 0 0 2px var(--gold)' }}>
                      <div className="absolute inset-[6px] border border-dashed border-[var(--gold-hi)] opacity-40 rounded-[4px]" aria-hidden="true" />
                      <p className="font-sans italic text-[var(--cream-hi)] text-[16px] leading-[1.6] relative z-10">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="relative z-10 px-7 pt-6 pb-8">
                  <h3 className="font-normal text-[24px] mb-1 text-[var(--cocoa)]" style={macklin}>{card.title}</h3>
                  {/* little ornamental rule */}
                  <div aria-hidden="true" className="flex items-center gap-2 my-3 text-[var(--gold)]">
                    <span className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, var(--gold))' }} />
                    <span className="text-[11px] leading-none">✦</span>
                    <span className="h-px flex-1" style={{ background: 'linear-gradient(90deg, var(--gold), transparent)' }} />
                  </div>
                  <div className="text-[15px] italic text-[#5a3e35] leading-relaxed">{card.desc}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Simple divider line instead of cartoony awning */}
      <div className="h-px bg-[rgba(28,13,12,0.08)]" aria-hidden="true" />
    </>
  );
}
