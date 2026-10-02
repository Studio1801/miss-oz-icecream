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
      className={`pointer-events-none absolute top-[8px] w-[clamp(130px,13vw,180px)] rounded-[3px] bg-[var(--cream-hi)] p-[8px] pb-[10px] lg:w-[clamp(180px,14.6vw,210px)] ${className}`}
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
    <section
      id="events"
      className="parlour-paper relative overflow-hidden bg-[var(--pink)] px-[6vw] py-[26px] md:py-[38px] lg:flex lg:min-h-[calc(100svh-110px)] lg:items-center"
    >
      <Bunting className="absolute top-0 left-0 right-0" />
      <Starburst size={150} color="var(--berry)" className="pointer-events-none absolute -bottom-8 -left-8 opacity-[0.10] hidden md:block" />
      <Starburst size={120} color="var(--berry)" className="pointer-events-none absolute top-[86px] right-[4vw] opacity-[0.10] hidden md:block" />
      <div className="relative z-10 mx-auto grid w-full max-w-[1240px] grid-cols-1 items-start gap-x-[clamp(28px,4vw,58px)] gap-y-6 lg:grid-cols-2 lg:items-stretch lg:gap-x-16">
        <div className="contents lg:col-start-1 lg:row-start-1 lg:flex lg:min-w-0 lg:flex-col">
          <div className="order-1 text-left lg:order-none">
            <div
              className="ticket-notch ticket-shine relative mb-[14px] inline-block -rotate-[3deg] overflow-hidden rounded-[6px] p-[5px] motion-safe:animate-[ticketFloat_4s_ease-in-out_infinite]"
              style={{
                background: 'linear-gradient(180deg, #F7EDDD 0%, #F2E4CC 100%)',
                boxShadow: '0 4px 10px rgba(28,13,12,0.16)',
                WebkitMaskImage: 'radial-gradient(circle 8px at 0 50%, transparent 96%, #000 100%), radial-gradient(circle 8px at 100% 50%, transparent 96%, #000 100%)',
                maskImage: 'radial-gradient(circle 8px at 0 50%, transparent 96%, #000 100%), radial-gradient(circle 8px at 100% 50%, transparent 96%, #000 100%)',
                WebkitMaskComposite: 'source-in',
                maskComposite: 'intersect',
              }}
            >
              <span
                className="block whitespace-nowrap rounded-[4px] border border-dashed px-[18px] py-[7px] font-script text-[22px] leading-none text-[var(--berry-deep)]"
                style={{ borderColor: 'rgba(59,16,32,0.45)' }}
              >
                coming soon
              </span>
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }}
              className="mb-[10px] text-[clamp(46px,5.6vw,76px)] leading-[0.98] text-[var(--cocoa)]"
              style={macklin}
            >
              Event Catering
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-[4px] text-[18px] font-semibold text-[var(--cocoa)] md:text-[20px]"
            >
              Private parties and weddings
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.23 }}
              className="mt-[12px] max-w-[600px] text-[20px] leading-relaxed text-[var(--cocoa)] md:text-[22px]"
            >
              Event Catering will launch in Summer 2027.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-[10px] max-w-[600px] text-[18px] italic leading-relaxed text-[var(--cocoa)] opacity-75 md:text-[20px]"
            >
              We're preparing a new way to bring Miss Oz treats to your celebrations. In the meantime, tell us about your event so we can start planning.
            </motion.p>
          </div>

          <div className="relative order-3 mx-auto mt-1 h-[220px] w-full max-w-[430px] lg:order-none lg:mx-0 lg:mt-auto lg:h-[clamp(232px,18.2vw,262px)] lg:max-w-none">
            <EventPolaroid photo={EVENT_POLAROIDS[0]} className="left-[6%] z-10 -rotate-[6deg] lg:left-[12px]" />
            <EventPolaroid photo={EVENT_POLAROIDS[1]} className="left-[40%] z-20 rotate-[5deg] md:left-[34%] lg:left-[35%]" />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.25 }}
          className="relative order-2 w-full max-w-[560px] justify-self-center rounded-[10px] px-[20px] pb-[20px] pt-[32px] sm:px-[28px] sm:pb-[24px] sm:pt-[36px] lg:order-none lg:col-start-2 lg:row-start-1 lg:max-w-none lg:justify-self-stretch"
          style={{
            backgroundColor: 'var(--cream-hi)',
            backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 31px, rgba(28,13,12,0.07) 32px, transparent 33px)',
            boxShadow: '0 18px 42px rgba(28,13,12,0.16), inset 0 0 0 1px rgba(28,13,12,0.08)',
          }}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-[10px] left-1/2 h-[20px] w-[76px] -translate-x-1/2 rotate-[-3deg]"
            style={{ background: 'rgba(214,193,150,0.75)', boxShadow: '0 1px 3px rgba(28,13,12,0.15)' }}
          />
          <h3
            className="mb-[10px] text-[clamp(26px,2.4vw,32px)] leading-tight text-[var(--berry-deep)]"
            style={{ fontFamily: 'var(--font-script)', fontStyle: 'italic', fontWeight: 400 }}
          >
            Tell us about your event
          </h3>
          <InquireForm
            type="event"
            inline
            sentenceCaseLabels
            submitButtonLabel="Send my event details"
          />
        </motion.div>
      </div>
    </section>
  );
}
