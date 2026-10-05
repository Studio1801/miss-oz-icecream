import { useState } from 'react';
import { Bunting } from './Decor';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = () => {
    if (email.trim()) setSubmitted(true);
  };

  return (
    <footer id="contact" className="bg-[var(--cocoa)] text-[var(--cream)] pt-[120px] pb-[64px] px-[6vw] relative mt-[80px]">
      <div className="clip-scallop-top absolute top-[-1px] left-0 right-0 h-[46px]" aria-hidden="true" />
      <Bunting className="absolute top-[54px] left-0 right-0" />

      {/* Tagline + Oz riding shotgun, side by side so they never overlap */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-x-[40px] gap-y-[36px]">
        <div className="min-w-0">
          {/* Big editorial tagline */}
          <div
            className="leading-[1.02] mb-[10px]"
            style={{
              fontFamily: 'var(--font-groovy)',
              fontWeight: 400,
              fontStyle: 'italic',
              fontSize: 'clamp(40px, 6.2vw, 92px)',
            }}
          >
            Sweet Memories<br />
            <em className="not-italic text-[var(--gold-hi)]">Begin Here.</em>
          </div>

          <span
            className="text-[var(--pink)] mb-[60px] inline-block"
            style={{ fontFamily: 'var(--font-script)', fontSize: 30 }}
          >
            Miss Oz &amp; the whole parlor.
          </span>
        </div>

        <figure
          className="relative w-[clamp(160px,16vw,210px)] rotate-[-3deg] bg-[var(--cream-hi)] p-[8px] pb-[10px] rounded-[3px] mx-auto sm:mx-0 mb-[40px] sm:mb-0 shrink-0"
          style={{ boxShadow: '0 12px 32px rgba(0,0,0,0.4)' }}
        >
          <span aria-hidden="true" className="absolute -top-[11px] left-1/2 -translate-x-1/2 w-[64px] h-[20px] rotate-[3deg]" style={{ background: 'rgba(214,193,150,0.75)', boxShadow: '0 1px 3px rgba(28,13,12,0.2)' }} />
          <img loading="lazy" decoding="async" src="/images/oz-goggles.webp" alt="Oz the dog wearing driving goggles in the front seat of a car" width={388} height={486} className="w-full aspect-[4/5] object-cover rounded-[2px] sepia-[10%] saturate-[0.94]" />
          <figcaption className="font-script-alt text-[16px] text-[var(--berry-deep)] text-center mt-[6px] leading-tight">off to find the next flavor</figcaption>
        </figure>
      </div>

      {/* Four-column info + mailing list */}
      <div className="flex justify-between flex-wrap gap-[34px] border-t border-[rgba(242,225,194,0.3)] pt-[34px] text-[16px]">
        {/* Address */}
        <div id="visit" style={{ scrollMarginTop: '100px' }}>
          <h2 className="text-[var(--gold-hi)] tracking-[3px] font-semibold uppercase text-[13px] mb-[12px]">Address</h2>
          <p className="leading-[1.8] text-[#EFE2CE]">1105 NW Johnson St.<br />Portland, OR 97209</p>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-[var(--gold-hi)] tracking-[3px] font-semibold uppercase text-[13px] mb-[12px]">Contact</h2>
          <p className="leading-[1.8] text-[#EFE2CE]">
            Tel: (503) 224-2021<br />@missozicecreamcafe
          </p>
        </div>

        {/* Hours */}
        <div>
          <h2 className="text-[var(--gold-hi)] tracking-[3px] font-semibold uppercase text-[13px] mb-[12px]">Hours</h2>
          <p className="leading-[1.8] text-[#EFE2CE]">OPEN DAILY<br />11AM–10PM</p>
        </div>

        {/* Mailing List */}
        <div className="min-w-[260px] flex-1 max-w-[340px] scissor-cut p-[20px] mt-[-20px] rounded-[10px]">
          <h2 className="text-[var(--gold-hi)] tracking-[3px] font-semibold uppercase text-[13px] mb-[12px]">Mailing List</h2>
          {submitted ? (
            <p className="text-[#EFE2CE] text-[15px] mt-2 font-script-alt text-[22px]">Thanks for subscribing!</p>
          ) : (
            <>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email here*"
                className="w-full py-[12px] px-[14px] bg-[rgba(255,255,255,0.03)] border-2 border-[var(--berry)] text-[var(--cream)] placeholder-[rgba(242,225,194,0.5)] text-[15px] mb-[12px] focus:outline-none focus:border-[var(--gold-hi)] transition-colors rounded-sm"
                style={{ fontFamily: 'var(--font-sans)' }}
                onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
              />
              <button
                onClick={handleSubscribe}
                className="clickable w-full py-[12px] px-[14px] bg-[var(--berry)] text-[var(--cream-hi)] text-[14px] tracking-[2px] uppercase font-semibold mech-btn hover:bg-[var(--berry-deep)] transition-colors rounded-sm"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Subscribe
              </button>
            </>
          )}

          {/* Social icons */}
          <div className="flex gap-[14px] mt-[24px]">
            {/* Facebook */}
            <a href="#" aria-label="Facebook" className="w-[36px] h-[36px] rounded-full border border-[rgba(242,225,194,0.4)] flex items-center justify-center text-[#EFE2CE] hover:border-[var(--gold-hi)] hover:text-[var(--gold-hi)] hover:scale-110 transition-all">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            {/* Twitter / X */}
            <a href="#" aria-label="Twitter" className="w-[36px] h-[36px] rounded-full border border-[rgba(242,225,194,0.4)] flex items-center justify-center text-[#EFE2CE] hover:border-[var(--gold-hi)] hover:text-[var(--gold-hi)] hover:scale-110 transition-all">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
            </a>
            {/* Instagram */}
            <a href="#" aria-label="Instagram" className="w-[36px] h-[36px] rounded-full border border-[rgba(242,225,194,0.4)] flex items-center justify-center text-[#EFE2CE] hover:border-[var(--gold-hi)] hover:text-[var(--gold-hi)] hover:scale-110 transition-all">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
