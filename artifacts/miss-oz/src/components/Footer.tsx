import { useState } from 'react';
import { Bunting } from './Decor';
import PawMark from './PawMark';
import { useMobileForm, MOBILE_FORM_SUCCESS, MOBILE_FORM_FAILURE } from '../hooks/useMobileForm';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const validation = useMobileForm();

  const handleSubscribe = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validation.mobile) {
      if (email.trim()) setSubmitted(true);
      return;
    }
    if (status === 'sending' || status === 'success' || !validation.validate(event.currentTarget)) return;
    setStatus('sending');
    try {
      const base = import.meta.env.BASE_URL.replace(/\/$/, '');
      const response = await fetch(`${base}/api/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true || result.note) throw new Error('Subscription not confirmed');
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <footer id="contact" className="miss-oz-footer bg-[var(--cocoa)] text-[var(--cream)] pt-[120px] pb-[64px] px-[var(--edge)] md:px-[6vw] max-[639px]:pt-[58px] max-[639px]:pb-[32px] relative mt-[80px] max-[767px]:mt-0">
      <div className="clip-scallop-top absolute top-[-1px] left-0 right-0 h-[46px]" aria-hidden="true" />
      <Bunting className="footer-bunting absolute top-[54px] left-0 right-0" />

      {/* Tagline + Oz riding shotgun, side by side so they never overlap */}
      <div className="footer-intro flex flex-col sm:flex-row items-center sm:items-start justify-between gap-x-[40px] gap-y-[36px] max-[639px]:flex-row max-[639px]:items-start max-[639px]:gap-x-4 max-[639px]:gap-y-0">
        <div className="footer-intro-copy max-[639px]:min-w-0 max-[639px]:flex-1">
          {/* Big editorial tagline */}
          <div
            className="footer-tagline leading-[1.02] mb-[10px]"
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
            className="footer-subtitle text-[var(--pink)] mb-[60px] max-[639px]:mb-0 inline-block"
            style={{ fontFamily: 'var(--font-script)', fontSize: 30 }}
          >
            Miss Oz &amp; the whole parlor.
          </span>
        </div>

        <figure
          className="footer-polaroid relative w-[clamp(160px,16vw,210px)] max-[639px]:w-[88px] rotate-[-3deg] bg-[var(--cream-hi)] p-[8px] pb-[10px] max-[639px]:p-1 max-[639px]:pb-[6px] rounded-[3px] mx-auto max-[639px]:mx-0 max-[639px]:self-start mb-[40px] max-[639px]:mb-0 sm:mx-0 sm:mb-0 shrink-0"
          style={{ boxShadow: '0 12px 32px rgba(0,0,0,0.4)' }}
        >
          <span aria-hidden="true" className="absolute -top-[11px] left-1/2 -translate-x-1/2 w-[64px] h-[20px] rotate-[3deg]" style={{ background: 'rgba(214,193,150,0.75)', boxShadow: '0 1px 3px rgba(28,13,12,0.2)' }} />
          <img loading="lazy" decoding="async" src="/images/oz-goggles.webp" alt="Oz the dog wearing driving goggles in the front seat of a car" width={388} height={486} className="w-full aspect-[4/5] object-cover rounded-[2px] sepia-[10%] saturate-[0.94]" />
          <figcaption className="font-script-alt text-[16px] text-[var(--berry-deep)] text-center mt-[6px] leading-tight">off to find the next flavor</figcaption>
        </figure>
      </div>

      {/* Four-column info + mailing list */}
      <div className="footer-details flex justify-between flex-wrap gap-[34px] border-t border-[rgba(242,225,194,0.3)] pt-[34px] text-[16px] max-[639px]:grid max-[639px]:grid-cols-2 max-[639px]:gap-x-4 max-[639px]:gap-y-6 max-[639px]:pt-6">
        {/* Address */}
        <div id="visit" className="max-[639px]:col-span-2" style={{ scrollMarginTop: '100px' }}>
          <h2 className="footer-label text-[var(--gold-hi)] tracking-[3px] font-semibold uppercase text-[13px] mb-[12px]">Address</h2>
          <p className="leading-[1.8] text-[#EFE2CE]"><a className="footer-text-link" href="https://www.google.com/maps/dir/?api=1&destination=1105+NW+Johnson+St%2C+Portland%2C+OR+97209" target="_blank" rel="noopener noreferrer">1105 NW Johnson St.<br />Portland, OR 97209</a></p>
          <p className="footer-dog-line mt-[10px] flex max-w-[230px] items-center gap-[7px] text-[13px] leading-snug text-[#EFE2CE]">
            <PawMark size={18} className="shrink-0 text-[var(--gold-hi)]" />
            <span>Well-behaved pups welcome inside!</span>
          </p>
        </div>

        {/* Contact */}
        <div className="max-[639px]:min-w-0">
          <h2 className="footer-label text-[var(--gold-hi)] tracking-[3px] font-semibold uppercase text-[13px] mb-[12px]">Contact</h2>
          <p className="leading-[1.8] max-[639px]:break-words text-[#EFE2CE]">
            <a className="footer-text-link" href="tel:+15032242021">Tel: (503) 224-2021</a><br /><a className="footer-text-link" href="https://www.instagram.com/missozicecreamcafe/" target="_blank" rel="noopener noreferrer">@missozicecreamcafe</a>
          </p>
        </div>

        {/* Hours */}
        <div className="max-[639px]:min-w-0">
          <h2 className="footer-label text-[var(--gold-hi)] tracking-[3px] font-semibold uppercase text-[13px] mb-[12px]">Hours</h2>
          <p className="leading-[1.8] text-[#EFE2CE]">OPEN DAILY<br />11AM–10PM</p>
        </div>

        {/* Mailing List */}
        <div className="footer-mailing-list min-w-[260px] flex-1 max-w-[340px] max-[639px]:col-span-2 max-[639px]:min-w-0 max-[639px]:max-w-none scissor-cut p-[20px] max-[639px]:p-3 mt-[-20px] max-[639px]:mt-0 rounded-[10px]">
          <h2 className="footer-label text-[var(--gold-hi)] tracking-[3px] font-semibold uppercase text-[13px] mb-[12px]">Mailing List</h2>
          {submitted ? (
            <p className="text-[#EFE2CE] text-[15px] mt-2 font-script-alt text-[22px]">Thanks for subscribing!</p>
          ) : (
            <form onSubmit={handleSubscribe} noValidate onInput={(event) => { validation.clear(event); if (status === 'success') setStatus('idle'); }} className="mobile-form footer-mailing-fields flex flex-col gap-3 max-[639px]:flex-row max-[639px]:gap-2">
              <label className="sr-only footer-email-label" htmlFor="footer-email">Your email</label>
              <input
                {...validation.field('footer-email')}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                autoComplete="email"
                inputMode="email"
                aria-label="Your email"
                className="w-full py-[12px] px-[14px] max-[639px]:h-12 max-[639px]:py-0 bg-[rgba(255,255,255,0.03)] border-2 border-[var(--berry)] text-[var(--cream)] placeholder-[rgba(242,225,194,0.5)] text-[15px] focus:outline-none focus:border-[var(--gold-hi)] transition-colors rounded-sm"
                style={{ fontFamily: 'var(--font-sans)' }}
              />
              {validation.error('footer-email')}
              <button
                type="submit"
                aria-busy={status === 'sending'}
                aria-disabled={validation.mobile && (status === 'sending' || status === 'success') || undefined}
                className="interaction-primary clickable w-full py-[12px] px-[14px] max-[639px]:h-12 max-[639px]:py-0 bg-[var(--berry)] text-[var(--cream-hi)] text-[14px] tracking-[2px] uppercase font-semibold mech-btn hover:bg-[var(--berry-deep)] transition-colors rounded-sm"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                <span aria-hidden={status === 'sending' || undefined} role={status === 'success' ? 'status' : undefined} className={status === 'sending' ? 'opacity-0' : ''}>{validation.mobile && status === 'success' ? `✓ ${MOBILE_FORM_SUCCESS}` : 'Subscribe'}</span>
                {status === 'sending' && <span role="status" aria-label="Sending" className="interaction-spinner absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />}
              </button>
              {validation.mobile && status === 'error' && <p role="alert" className="mobile-field-error">{MOBILE_FORM_FAILURE}</p>}
            </form>
          )}

          {/* Social icons */}
          <div className="footer-socials flex gap-[14px] mt-[24px] max-[639px]:mt-4">
            {/* Facebook */}
            <a href="#" aria-label="Facebook" className="w-[36px] h-[36px] max-[639px]:w-11 max-[639px]:h-11 shrink-0 rounded-full border border-[rgba(242,225,194,0.4)] flex items-center justify-center text-[#EFE2CE] hover:border-[var(--gold-hi)] hover:text-[var(--gold-hi)] transition-colors">
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            {/* Twitter / X */}
            <a href="#" aria-label="Twitter" className="w-[36px] h-[36px] max-[639px]:w-11 max-[639px]:h-11 shrink-0 rounded-full border border-[rgba(242,225,194,0.4)] flex items-center justify-center text-[#EFE2CE] hover:border-[var(--gold-hi)] hover:text-[var(--gold-hi)] transition-colors">
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
            </a>
            {/* Instagram */}
            <a href="https://www.instagram.com/missozicecreamcafe/" target="_blank" rel="noopener noreferrer" aria-label="Instagram: @missozicecreamcafe" className="w-[36px] h-[36px] max-[639px]:w-11 max-[639px]:h-11 shrink-0 rounded-full border border-[rgba(242,225,194,0.4)] flex items-center justify-center text-[#EFE2CE] hover:border-[var(--gold-hi)] hover:text-[var(--gold-hi)] transition-colors">
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
