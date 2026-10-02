import NewFlavor from './NewFlavor';
import FlavorVoting from './FlavorVoting';

export default function FlavorStation() {
  return (
    <section
      id="new-flavor"
      className="relative overflow-hidden"
      style={{ background: 'var(--cream-hi)' }}
    >
      {/* Subtle top edge glow */}
      <div className="absolute inset-x-0 top-0 h-[1px]"
        style={{ background: 'linear-gradient(to right, transparent, rgba(115,32,62,0.18), transparent)' }}
        aria-hidden="true" />

      <div className="max-w-[1260px] mx-auto px-[6vw] py-[80px] md:py-[104px]">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-10 md:gap-[64px] items-stretch">
          <NewFlavor />
          <FlavorVoting />
        </div>
      </div>
    </section>
  );
}