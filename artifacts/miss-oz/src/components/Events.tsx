import { motion } from 'framer-motion';
import { Bunting, Starburst } from './Decor';
import InquireForm from './InquireForm';

const macklin = { fontFamily: 'var(--font-groovy)', fontWeight: 400, fontStyle: 'italic' };

const EVENT_POLAROIDS = [
  {
    src: `${import.meta.env.BASE_URL}images/wholesale/image0.jpeg`,
    alt: 'Midnight Fudge Sundae with whipped cream, sprinkles, and a cherry',
    caption: 'Midnight Fudge Sundae',
  },
  {
    src: `${import.meta.env.BASE_URL}images/wholesale/image11.jpeg`,
    alt: 'Rose City Banana Split',
    caption: 'Rose City Banana Split',
  },
];

function EventPolaroid({ photo, className }: { photo: (typeof EVENT_POLAROIDS)[number]; className: string }) {
  return (
    <figure
      className={`pointer-events-none relative hidden w-[clamp(96px,10vw,132px)] self-center rounded-[3px] bg-[var(--cream-hi)] p-[8px] pb-[10px] lg:block ${className}`}
      style={{ boxShadow: '0 10px 28px rgba(28,13,12,0.18)' }}
    >
      <span
        aria-hidden="true"
        className="absolute -top-[11px] left-1/2 h-[20px] w-[64px] -translate-x-1/2 rotate-[-4deg]"
        style={{ background: 'rgba(214,193,150,0.75)', boxShadow: '0 1px 3px rgba(28,13,12,0.15)' }}
      />
      <img
        src={photo.src}
        alt={photo.alt}
        loading="eager"
        decoding="async"
        className="aspect-square w-full rounded-[2px] object-cover"
      />
      <figcaption className="mt-[6px] text-center font-script-alt text-[16px] leading-tight text-[var(--berry-deep)]">
        {photo.caption}
      </figcaption>
    </figure>
  );
}

export default function Events() {
  return (
    <section id="events" className="parlour-paper relative overflow-hidden text-center py-[54px] md:py-[86px] px-[6vw] bg-[var(--pink)]">
      <Bunting className="absolute top-0 left-0 right-0" />
      <Starburst size={150} color="var(--berry)" className="pointer-events-none absolute -bottom-8 -left-8 opacity-[0.10] hidden md:block" />
      <Starburst size={120} color="var(--berry)" className="pointer-events-none absolute top-[86px] right-[4vw] opacity-[0.10] hidden md:block" />
      <div className="mx-auto grid max-w-[1120px] grid-cols-1 items-center lg:grid-cols-[minmax(0,1fr)_minmax(0,640px)_minmax(0,1fr)]">
        <EventPolaroid photo={EVENT_POLAROIDS[0]} className="lg:col-start-1 lg:row-start-1 lg:justify-self-start lg:-rotate-[6deg]" />
        <div className="mx-auto w-full max-w-[760px] lg:col-start-2 lg:row-start-1">
          <motion.span
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}
            className="mb-2 block font-script text-[clamp(30px,3.5vw,42px)] text-[var(--berry-deep)]"
          >
            coming soon
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }}
            className="mb-5 text-[clamp(42px,6vw,80px)] leading-[0.98] text-[var(--cocoa)]"
            style={macklin}
          >
            Ice cream for your celebration
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-[28px] max-w-[720px] text-[20px] leading-relaxed text-[var(--cocoa)] md:text-[24px]"
          >
            Event Catering will launch in Summer 2027.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.23 }}
            className="mx-auto mt-[12px] max-w-[620px] text-[16px] font-semibold text-[var(--cocoa)] md:text-[18px]"
          >
            Private parties and weddings
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.25 }}
            className="mx-auto mt-[12px] max-w-[620px] text-[16px] italic leading-relaxed text-[var(--cocoa)] opacity-75 md:text-[18px]"
          >
            We’re preparing a new way to bring Miss Oz treats to your celebrations. In the meantime, tell us about your event so we can start planning.
          </motion.p>
        </div>
        <EventPolaroid photo={EVENT_POLAROIDS[1]} className="lg:col-start-3 lg:row-start-1 lg:justify-self-end lg:rotate-[5deg]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-[48px] text-center"
      >
        <InquireForm
          type="event"
          submitLabel="Tell us about your event"
          buttonClassName="inline-flex items-center gap-2 rounded-full px-7 py-[13px] text-[14px] font-bold tracking-[1px] !normal-case [&>span]:hidden text-[var(--cream-hi)] bg-[var(--cocoa)] transition-transform duration-200 mech-btn hover:bg-[var(--berry-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pink)]"
        />
      </motion.div>
    </section>
  );
}
