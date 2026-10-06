const dividerStyle = {
  backgroundImage: 'repeating-linear-gradient(90deg, rgba(94,23,53,0.35) 0 4px, transparent 4px 9px)',
};

export function MenuDivider({ className = '' }: { className?: string }) {
  return <div aria-hidden="true" className={`h-px w-full ${className}`} style={dividerStyle} />;
}

export function MenuPanelHeading({ category }: { category: string }) {
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
