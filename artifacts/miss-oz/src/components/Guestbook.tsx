import { useState, useEffect, useRef, useCallback } from 'react';
import { SHEET_URL } from '../lib/sheetSync';
import { motion } from 'framer-motion';
import { Starburst } from './Decor';
import PawMark from './PawMark';
import { useMobileForm, MOBILE_FORM_SUCCESS } from '../hooks/useMobileForm';

const macklin = { fontFamily: 'var(--font-groovy)', fontWeight: 400, fontStyle: 'italic' as const };

type Entry = { id: string; name: string; note: string; when: string };

const GUESTBOOK_URL = `${SHEET_URL}?action=guestbook`;

function sanitizeEntries(raw: unknown): Entry[] {
  if (!Array.isArray(raw)) throw new Error('Invalid guestbook response');
  const clean: Entry[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const rec = item as Record<string, unknown>;
    const name = typeof rec.name === 'string' ? rec.name.trim() : '';
    const note = typeof rec.note === 'string' ? rec.note.trim() : '';
    const when = typeof rec.when === 'string' ? rec.when.trim() : '';
    const id = typeof rec.id === 'string' && rec.id ? rec.id : `gb-${Math.random().toString(36).slice(2)}`;
    if (!name || !note) continue;
    clean.push({ id, name: name.slice(0, 40), note: note.slice(0, 180), when: when || 'No date.' });
  }
  return clean;
}

export default function Guestbook({ id = 'guestbook' }: { id?: string }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [justSigned, setJustSigned] = useState(false);
  const [submitResult, setSubmitResult] = useState<'idle' | 'success' | 'error'>('idle');
  const [showAllEntries, setShowAllEntries] = useState(false);
  const validation = useMobileForm();
  const liveRef = useRef<HTMLParagraphElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const unconfirmedEntry = useRef<{ id: string; name: string; note: string } | null>(null);

  // Fetch shared entries from the database on mount
  const loadGuestbook = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const response = await fetch(GUESTBOOK_URL);
      if (!response.ok) throw new Error('Could not load guestbook');
      const data = await response.json();
      setEntries(sanitizeEntries(data?.entries));
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadGuestbook();
  }, [loadGuestbook]);

  function retryApiAction() {
    if (loadError && submitResult !== 'error') {
      void loadGuestbook();
      return;
    }
    formRef.current?.requestSubmit();
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting || (validation.mobile && submitResult === 'success')) return;
    if (!validation.validate(e.currentTarget)) return;
    const cleanName = name.trim();
    const cleanNote = note.trim();
    if (!cleanName || !cleanNote || submitting) return;
    setSubmitting(true);
    setSubmitResult('idle');
    try {
      if (validation.mobile && unconfirmedEntry.current) {
        const pending = unconfirmedEntry.current;
        if (pending.name === cleanName && pending.note === cleanNote) {
          const confirmation = await fetch(GUESTBOOK_URL);
          if (!confirmation.ok) throw new Error('Could not confirm guestbook entry');
          const stored = sanitizeEntries((await confirmation.json())?.entries);
          setEntries(stored);
          if (stored.some((entry) => entry.id === pending.id)) {
            unconfirmedEntry.current = null;
            setLoadError(false);
            setName('');
            setNote('');
            setJustSigned(true);
            setSubmitResult('success');
            if (liveRef.current) liveRef.current.textContent = 'Thank you. Your note is in the book.';
            window.setTimeout(() => setJustSigned(false), 2000);
            return;
          }
        }
        unconfirmedEntry.current = null;
      }

      const entryId = `gb-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
      // Entries live in the Miss Oz Google Sheet. no-cors: the POST completes before this resolves.
      await fetch(SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'addSubmission',
          submission: { id: entryId, type: 'guestbook', name: cleanName, detail: cleanNote.slice(0, 140), note: cleanNote, source: 'website' },
        }),
      });
      const data = { entry: { id: entryId } };
      unconfirmedEntry.current = validation.mobile ? { id: entryId, name: cleanName, note: cleanNote } : null;
      const refreshed = await fetch(GUESTBOOK_URL);
      if (!refreshed.ok) throw new Error('Could not confirm guestbook entry');
      const stored = sanitizeEntries((await refreshed.json())?.entries);
      setEntries(stored);
      setLoadError(false);
      if (!stored.some((entry) => entry.id === data?.entry?.id)) {
        setSubmitResult('error');
        if (liveRef.current) liveRef.current.textContent = 'Your note was received, but we could not confirm it was saved. Please try again later.';
        return;
      }
      unconfirmedEntry.current = null;
      setName('');
      setNote('');
      setJustSigned(true);
      setSubmitResult('success');
      if (liveRef.current) liveRef.current.textContent = 'Thank you. Your note is in the book.';
      window.setTimeout(() => setJustSigned(false), 2000);
    } catch {
      setSubmitResult('error');
      if (liveRef.current) liveRef.current.textContent = 'We could not confirm your note was saved. Please try again later.';
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id={id} className="guestbook-section parlour-paper relative py-[56px] md:py-[120px] px-[var(--edge)] md:px-[6vw] bg-[var(--cream)] overflow-hidden">
      <Starburst size={160} color="var(--gold)" className="pointer-events-none absolute top-[50px] left-[3vw] opacity-[0.10] hidden md:block" />
      <Starburst size={130} color="var(--berry)" className="pointer-events-none absolute bottom-[60px] right-[4vw] opacity-[0.09] hidden md:block" />
      {/* diner-table vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(120% 90% at 50% 0%, transparent 55%, rgba(28,13,12,0.07) 100%)' }}
      />

      <div className="relative text-center max-w-[720px] mx-auto mb-[clamp(24px,3vw,40px)]">
        <motion.span
          initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.7 }}
          className="block text-[12px] tracking-[5px] uppercase font-bold text-[var(--cocoa)] opacity-60 mb-3"
        >
          Since 2007
        </motion.span>
        <motion.span
          initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.7, delay: 0.1 }}
          className="block font-script text-[var(--berry-deep)] text-[clamp(28px,3.4vw,40px)] mb-1"
        >
          put your name in the book
        </motion.span>
        <motion.h2
          initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.7, delay: 0.15 }}
          className="text-[clamp(40px,5.6vw,74px)] leading-[0.98] mb-4 text-[var(--cocoa)]"
          style={macklin}
        >
          The Parlor Guestbook
        </motion.h2>
        <motion.p
          initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.7, delay: 0.2 }}
          className="italic text-[17px] text-[#1d0e0d] opacity-80"
        >
          Every parlor worth its salt keeps a book by the door. Leave a memory, a favorite scoop, or just a hello.
        </motion.p>
      </div>

      {/* ===== Open guest ledger ===== */}
      <motion.div
        initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.6, delay: 0.1 }}
        className="guestbook-ledger relative mx-auto max-w-[1060px]"
      >
        {/* GUESTBOOK tab */}
        <div
          className="guestbook-ledger-tab relative z-20 mx-auto -mb-[9px] w-fit px-6 py-1.5 rounded-t-[8px] text-[12px] tracking-[4px] uppercase font-bold text-[var(--cream-hi)]"
          style={{ background: 'var(--cocoa)', boxShadow: 'inset 0 0 0 1.5px var(--gold)', fontFamily: 'var(--font-sans)' }}
        >
          Guestbook
        </div>

        {/* leather-look cover */}
        <div
          className="guestbook-cover-shell relative rounded-[12px] p-[10px] md:p-[14px]"
          style={{ background: 'linear-gradient(160deg, var(--berry-deep), #3a0e20)', boxShadow: '0 34px 80px rgba(0,0,0,0.5), inset 0 0 0 2px var(--gold), inset 0 0 0 4px var(--berry-deep)' }}
        >
          <div className="guestbook-pages relative grid md:grid-cols-2 md:min-h-[570px] rounded-[5px] overflow-hidden stitch-border-light">
            {/* spine crease */}
            <div
              aria-hidden="true"
              className="hidden md:block absolute inset-y-0 left-1/2 -translate-x-1/2 w-[8px] z-10"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(28,13,12,0.34) 42%, rgba(28,13,12,0.34) 58%, transparent)' }}
            />

            {/* LEFT PAGE — sign the book */}
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              noValidate={validation.mobile}
              onInput={(event) => { validation.clear(event); if (submitResult !== 'idle') setSubmitResult('idle'); }}
              className="mobile-form guestbook-form ledger-page ledger-page-l text-left pl-[58px] pr-[26px] md:pr-[38px] py-[38px] md:py-[48px] flex flex-col"
            >
              <div className="guestbook-mobile-heading hidden">
                <span style={macklin}>Guestbook</span>
                <p>Leave a note for Miss Oz.</p>
              </div>
              <div className="text-[var(--berry-deep)] leading-none mb-6" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,2.8vw,28px)' }}>
                Sign the book
              </div>

              <label htmlFor="gb-name" className="mobile-guestbook-label block text-[11px] max-[639px]:text-[12px] tracking-[3px] uppercase font-bold text-[var(--cocoa)] opacity-60 mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
                Your name
              </label>
              <input
                {...validation.field('gb-name')}
                type="text"
                autoComplete="name"
                required={validation.mobile}
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={40}
                placeholder="e.g. The Alvarez family"
                className="ledger-input w-full bg-transparent border-b-2 border-[rgba(28,13,12,0.28)] pb-[6px] mb-[28px] text-[22px] font-script text-[var(--berry-deep)] placeholder:text-[rgba(28,13,12,0.3)] placeholder:font-sans placeholder:italic placeholder:text-[16px] focus:outline-none focus:border-[var(--berry)] transition-colors rounded-sm px-1 py-1"
              />
              {validation.error('gb-name')}

              <label htmlFor="gb-note" className="mobile-guestbook-label block text-[11px] max-[639px]:text-[12px] tracking-[3px] uppercase font-bold text-[var(--cocoa)] opacity-60 mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
                Leave a note
              </label>
              <textarea
                {...validation.field('gb-note')}
                required={validation.mobile}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={180}
                rows={4}
                placeholder="A memory, a favorite flavor, a hello…"
                className="ledger-input w-full bg-transparent border-0 rounded-none px-2 py-1 text-[18px] leading-[34px] text-[#1d0e0d] placeholder:text-[rgba(28,13,12,0.35)] placeholder:italic resize-none focus:outline-none focus:bg-[rgba(255,255,255,0.4)] transition-colors mb-4 md:min-h-[180px]"
                style={{
                  backgroundImage: 'repeating-linear-gradient(transparent 0, transparent 32.5px, rgba(28,13,12,0.08) 32.5px, rgba(28,13,12,0.08) 34px)',
                  backgroundAttachment: 'local'
                }}
              />
              {validation.error('gb-note')}
              <div className="guestbook-submit-row flex items-center justify-between gap-4 mt-2 md:mt-7 flex-wrap">
                <span className="guestbook-character-count text-[13px] text-[var(--cocoa)] opacity-55 italic" style={{ fontFamily: 'var(--font-sans)' }}>{note.length}/180</span>
                <button
                  type="submit"
                  disabled={!validation.mobile && (!name.trim() || !note.trim() || submitting)}
                  aria-disabled={validation.mobile && (submitting || submitResult === 'success') || undefined}
                  aria-busy={submitting}
                  className="interaction-primary relative inline-flex items-center justify-center bg-[var(--cocoa)] text-[var(--cream)] py-[11px] px-[26px] rounded-full text-[14px] font-semibold tracking-[0.5px] mech-btn hover:bg-[var(--berry)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--gold)]"
                >
                  <span aria-hidden={submitting || undefined} role={validation.mobile && submitResult === 'success' ? 'status' : undefined} className={`transition-opacity duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] ${submitting || (!validation.mobile && justSigned) ? 'opacity-0' : 'opacity-100'}`}>{validation.mobile && submitResult === 'success' ? `✓ ${MOBILE_FORM_SUCCESS}` : 'Leave your mark'}</span>
                  {submitting && <span role="status" aria-label="Signing" className="interaction-spinner absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />}
                  {justSigned && !validation.mobile && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.22 }} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">✓</motion.span>}
                </button>
              </div>
              <p ref={liveRef} aria-live="polite" className="sr-only" />
              {validation.mobile && submitResult === 'error' && (
                <div className="guestbook-mobile-api-error" role="alert">
                  <p>Couldn't save that. Try once more in a minute.</p>
                  <button type="button" onClick={retryApiAction}>Retry</button>
                </div>
              )}

              <div className="guestbook-mobile-page-label hidden md:block mt-auto pt-6 text-center text-[12px] tracking-[2px] uppercase text-[var(--cocoa)] opacity-40" style={{ fontFamily: 'var(--font-sans)' }} aria-hidden="true">
                Page one.
              </div>
            </form>

            {/* RIGHT PAGE — the signatures */}
            <div className="guestbook-signatures-pane ledger-page ledger-page-r text-left pl-[58px] pr-[26px] md:pr-[38px] py-[38px] md:py-[48px] flex flex-col">
              <div className="guestbook-desktop-signature-heading flex items-baseline justify-between gap-3 mb-4">
                <div className="text-[var(--berry-deep)] leading-none" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,2.8vw,28px)' }}>
                  Signatures
                </div>
                <span className={`text-[11px] max-[639px]:text-[12px] tracking-[2px] uppercase font-bold text-[var(--cocoa)] opacity-45 whitespace-nowrap ${!loading && entries.length === 0 ? 'max-[639px]:hidden' : ''}`} style={{ fontFamily: 'var(--font-sans)' }}>
                  {loading ? '…' : `${entries.length} ${entries.length === 1 ? 'entry' : 'entries'}`}
                </span>
              </div>

              {!loading && (loadError || entries.length === 0) && (
                <p className={`${loadError ? 'api-availability-message' : 'guestbook-desktop-empty'} py-4 text-[14.5px] italic text-[var(--cocoa)]`} role="status">
                  <span className={loadError ? '' : 'max-[639px]:hidden'}>
                    {loadError ? 'Guestbook entries are unavailable right now.' : 'No entries yet. Be the first to sign the book.'}
                  </span>
                </p>
              )}
              {validation.mobile && !loading && loadError && (
                <button type="button" onClick={() => void loadGuestbook()}>Retry</button>
              )}
              <ul className="guestbook-desktop-list flex flex-col md:flex-1 md:justify-evenly" role="list">
                {entries.slice(0, 6).map((entry, i) => (
                  <motion.li
                    key={entry.id}
                    initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.4, delay: Math.min(i, 4) * 0.06 }}
                    className={`py-[12px] ${i > 0 ? 'border-t border-[rgba(28,13,12,0.12)]' : ''}`}
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="font-script-alt text-[20px] text-[var(--berry-deep)] leading-tight shrink-0">{entry.name}</span>
                      <span aria-hidden="true" className="flex-1 self-end mb-[5px] border-b border-dotted border-[rgba(28,13,12,0.28)]" />
                      <span className="text-[11px] max-[639px]:text-[12px] tracking-[1px] uppercase text-[var(--cocoa)] opacity-50 shrink-0 whitespace-nowrap" style={{ fontFamily: 'var(--font-sans)' }}>{entry.when}</span>
                    </div>
                    <p className="text-[14.5px] leading-[1.55] italic text-[#1d0e0d] opacity-85 mt-1" style={{ fontFamily: 'var(--font-sans)' }}>"{entry.note}"</p>
                  </motion.li>
                ))}
              </ul>
              <div className="guestbook-mobile-signatures hidden">
                <h3>Signatures</h3>
                {!loading && !loadError && entries.length === 0 && (
                  <div className="guestbook-mobile-empty hidden" role="status">
                    <PawMark size={28} className="text-[var(--berry)]" />
                    <span className="guestbook-mobile-empty-title">Nobody has signed yet.</span>
                    <span className="guestbook-mobile-empty-copy">Yours could be the first.</span>
                  </div>
                )}
                <ul role="list">
                  {entries.slice(0, showAllEntries ? entries.length : 5).map((entry, i) => (
                    <motion.li
                      key={`mobile-${entry.id}`}
                      initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.4, delay: Math.min(i, 4) * 0.06 }}
                      className={`guestbook-mobile-note guestbook-mobile-note-${i % 2 === 0 ? 'left' : 'right'}`}
                    >
                      <span className="guestbook-mobile-note-name font-script-alt">{entry.name}</span>
                      <p>{entry.note}</p>
                      <time>{entry.when}</time>
                    </motion.li>
                  ))}
                </ul>
                {entries.length > 5 && (
                  <button
                    type="button"
                    className="guestbook-mobile-show-more"
                    onClick={() => setShowAllEntries((current) => !current)}
                  >
                    {showAllEntries ? 'Show less' : 'Show more'}
                  </button>
                )}
              </div>

              <div className="guestbook-mobile-page-label hidden md:block mt-auto pt-6 text-center text-[12px] tracking-[2px] uppercase text-[var(--cocoa)] opacity-40" style={{ fontFamily: 'var(--font-sans)' }} aria-hidden="true">
                Page two.
              </div>
            </div>
          </div>
        </div>

        {/* Oz keeping an eye on the book — sits beside/below the ledger, never over text */}
        <motion.figure
          initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.7, delay: 0.15 }}
          className="guestbook-oz-photo relative z-30 w-[clamp(150px,15vw,190px)] rotate-[6deg] bg-[var(--cream-hi)] p-[8px] pb-[10px] rounded-[3px] mt-[40px] mx-auto lg:absolute lg:mt-0 lg:mx-0 lg:-bottom-[96px] lg:-right-[64px]"
          style={{ boxShadow: '0 10px 28px rgba(28,13,12,0.18)' }}
        >
          <span aria-hidden="true" className="absolute -top-[11px] left-1/2 -translate-x-1/2 w-[64px] h-[20px] rotate-[-4deg]" style={{ background: 'rgba(214,193,150,0.75)', boxShadow: '0 1px 3px rgba(28,13,12,0.15)' }} />
          <img loading="lazy" decoding="async" src="/images/oz-couch.webp" alt="Oz the dog resting with her chin down, watching the room" width={640} height={640} className="w-full aspect-square object-cover rounded-[2px] sepia-[10%] saturate-[0.94]" />
          <figcaption className="font-script-alt text-[16px] text-[var(--berry-deep)] text-center mt-[6px] leading-tight">she reads every entry</figcaption>
        </motion.figure>
      </motion.div>
    </section>
  );
}
