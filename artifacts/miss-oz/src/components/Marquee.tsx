export default function Marquee() {
  // Scrolling brand ribbon — Portland roots, handmade, est. 2007.
  const segment = (
    <>
      <span className="font-script text-[var(--berry)] font-normal text-[28px] md:text-[38px] whitespace-nowrap">
        Portland's Own
      </span>
      <span className="font-display font-normal uppercase text-[22px] md:text-[30px] text-[var(--cocoa)] tracking-[3px] whitespace-nowrap">
        Ice Cream Cafe
      </span>
      <span className="font-display font-normal uppercase text-[18px] md:text-[24px] text-[var(--cocoa)] tracking-[4px] whitespace-nowrap">
        Est. 2007
      </span>
    </>
  );

  return (
    <div aria-hidden="true" className="relative z-10 border-y border-[rgba(113,37,65,0.18)] bg-[var(--cream-hi)]">
      <div className="overflow-hidden py-5 md:py-6">
        <div className="flex justify-center px-4 pb-4 md:pb-5">
          <div
            className="inline-flex items-center gap-[10px] md:gap-3 rounded-full border border-[rgba(113,37,65,0.22)] bg-[rgba(244,169,199,0.16)] px-4 md:px-6 py-2 text-center font-display font-bold uppercase text-[var(--berry-deep)] tracking-[2px] md:tracking-[3px] text-[16px] md:text-[30px] whitespace-nowrap"
          >
            Small Batch, Big Heart
          </div>
        </div>
        <div className="mq-track flex gap-10 w-max items-center animate-[mq_22s_linear_infinite]">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex gap-10 items-center">
              {segment}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
