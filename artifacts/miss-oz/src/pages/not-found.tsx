export default function NotFound() {
  return (
    <section
      aria-labelledby="not-found-title"
      className="mx-auto flex min-h-[50vh] max-w-3xl flex-col items-center justify-center gap-5 px-6 py-16 text-center"
    >
      <p
        className="text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--marionberry)]"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        404
      </p>
      <h1
        id="not-found-title"
        className="text-[var(--berry-deep)]"
        style={{ fontFamily: 'var(--font-script)', fontSize: 'clamp(32px,5vw,48px)', lineHeight: 1.1 }}
      >
        Page not found
      </h1>
      <p
        className="max-w-lg text-[#6E5A54]"
        style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(14px,1.3vw,16px)' }}
      >
        We couldn&apos;t find that page. Try heading home or browsing the menu.
      </p>
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <a
          href="/"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--berry-deep)] px-6 py-3 text-[var(--cream-hi)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
          style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 700 }}
        >
          Back to Home
        </a>
        <a
          href="/#menu"
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--berry-deep)] px-6 py-3 text-[var(--berry-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
          style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 700 }}
        >
          Browse the Menu
        </a>
      </div>
    </section>
  );
}
