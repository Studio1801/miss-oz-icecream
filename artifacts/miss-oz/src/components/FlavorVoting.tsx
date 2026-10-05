import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useReducedMotion } from 'framer-motion';

const CARDS = [
  { name: 'Licorice', note: 'dark, bold, beautifully old-school', bg: '#E9E3E5', icon: '/images/icon-licorice.svg', img: '/images/licorice-vote.jpeg' },
  { name: 'Vietnam Coffee', note: 'deep roast with a creamy condensed finish', bg: '#EAD8BE', icon: '/images/icon-vietnam-coffee.svg', img: '/images/vietnam-coffee-vote.jpeg' },
  { name: 'Honey Lavender', note: 'wildflower honey with a soft floral bloom', bg: '#E6DDF4', icon: '/images/icon-honey-lavender.svg', img: '/images/honey-lavender-vote.jpeg' },
];
const VOTE_KEY = 'missoz-flavor-vote-v3';

const macklin = { fontFamily: 'var(--font-groovy)', fontWeight: 400, fontStyle: 'italic' as const };

function CountUp({ to, reduce, suffix = '' }: { to: number; reduce: boolean; suffix?: string }) {
  const [val, setVal] = useState(reduce ? to : 0);
  useEffect(() => {
    if (reduce) { setVal(to); return; }
    const ctrl = animate(0, to, { duration: 0.9, ease: 'easeOut', onUpdate: v => setVal(Math.round(v)) });
    return () => ctrl.stop();
  }, [to, reduce]);
  return <>{val}{suffix}</>;
}

async function fetchResults() {
  const res = await fetch('/api/results');
  if (!res.ok) throw new Error();
  const data = (await res.json()) as { votes: Record<string, number> };
  return CARDS.map(card => {
    const count = data.votes?.[card.name];
    if (!Number.isSafeInteger(count) || count < 0) throw new Error('Invalid vote totals');
    return count;
  });
}

async function postVote(flavor: string) {
  const res = await fetch('/api/vote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ flavor }) });
  if (!res.ok) throw new Error('Vote not recorded');
}

export default function FlavorVoting() {
  const reduce = !!useReducedMotion();
  const [votes, setVotes] = useState<number[] | null>(null);
  const [voteError, setVoteError] = useState('');
  const [pending, setPending] = useState(false);
  const [choice, setChoice] = useState<number | null>(null);
  const [burst, setBurst] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const burstTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const total = votes?.reduce((a, b) => a + b, 0) ?? 0;
  const leader = total > 0 ? votes!.indexOf(Math.max(...votes!)) : -1;
  const revealed = choice !== null;

  useEffect(() => () => { if (burstTimer.current) clearTimeout(burstTimer.current); }, []);
  useEffect(() => {
    try {
      const { choice: c } = JSON.parse(localStorage.getItem(VOTE_KEY) ?? '{}') as { choice?: unknown };
      if (typeof c === 'number' && c >= 0 && c <= 2) setChoice(c);
    } catch { /* ignore */ }
  }, []);
  useEffect(() => {
    fetchResults().then(setVotes).catch(() => setVoteError('Vote totals are unavailable right now.'));
  }, []);

  async function handleVote(i: number) {
    if (revealed || pending || !votes) return;
    setPending(true);
    setVoteError('');
    try {
      await postVote(CARDS[i].name);
      setChoice(i);
      try { localStorage.setItem(VOTE_KEY, JSON.stringify({ choice: i })); } catch { /* ignore */ }
      setBurst(i);
      if (!reduce) {
        if (burstTimer.current) clearTimeout(burstTimer.current);
        burstTimer.current = setTimeout(() => setBurst(null), 900);
      }
      try {
        setVotes(await fetchResults());
      } catch {
        setVotes(null);
        setVoteError('Your vote was recorded, but totals are unavailable right now.');
      }
    } catch {
      setVoteError('We could not record your vote. Please try again.');
    } finally {
      setPending(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 32 }} whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
      className="flex flex-col justify-center gap-[4px]"
      id="vote"
      style={{ scrollMarginTop: '32px' }}
    >
      {/* Display headline */}
      <div className="mb-[18px]">
        <div className="inline-flex items-center gap-[10px] mb-[14px] self-start px-[12px] py-[5px] rounded-full"
          style={{ background: 'rgba(232,177,190,0.24)', border: '1px solid rgba(115,32,62,0.18)' }}>
          <span className="text-[9px] tracking-[4px] uppercase font-bold"
            style={{ color: 'var(--berry-deep)', fontFamily: 'var(--font-sans)' }}>
            Community Vote
          </span>
        </div>

        <div className="text-[clamp(56px,6.5vw,88px)] leading-[0.88] mb-[14px]"
          style={{ fontFamily: 'var(--font-groovy)', fontStyle: 'italic', color: 'var(--berry)', letterSpacing: '-0.02em' }}>
          Vote Now!!
        </div>

        <p className="text-[15px] italic leading-relaxed"
          style={{ color: 'rgba(28,13,12,0.65)' }}>
          {revealed
            ? 'Tallied. We churn the winner next month. ♥'
            : 'Every couple of months, the neighborhood picks what we churn next. One vote each.'}
        </p>
      </div>

      {/* ── Accordion ── */}
      <div className="rounded-[16px] overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.72)',
          border: '1px solid rgba(115,32,62,0.16)',
          boxShadow: '0 10px 28px rgba(57,22,34,0.08)',
        }}>
        {CARDS.map((card, i) => {
          const pct = total && votes ? Math.round((votes[i] / total) * 100) : 0;
          const isChoice = choice === i;
          const isLeader = revealed && i === leader;
          const isOpen = expanded === i;
          const isLast = i === CARDS.length - 1;

          return (
            <div key={i}>
              {/* ── Collapsed row ── */}
              <button
                onClick={() => setExpanded(isOpen ? null : i)}
                className="w-full flex items-center gap-[12px] px-[16px] py-[13px] text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--berry)]"
                style={{ background: isOpen ? 'rgba(232,177,190,0.18)' : 'transparent', cursor: 'pointer' }}
                aria-expanded={isOpen}
              >
                {/* Thumbnail in warm bg */}
                <div className="shrink-0 w-[40px] h-[40px] rounded-[8px] flex items-center justify-center overflow-hidden"
                  style={{ background: card.bg }}>
                  <img loading="lazy" src={card.icon} alt="" aria-hidden="true" width={34} height={34}
                    className="w-[34px] h-[34px] object-contain"
                    style={{ filter: 'drop-shadow(0 1px 3px rgba(28,13,12,0.25))' }} />
                </div>

                {/* Name + note */}
                <div className="flex-1 min-w-0">
                  <div className="text-[16.5px] leading-tight truncate"
                    style={{ ...macklin, color: 'var(--berry-deep)' }}>
                    {card.name}
                    {isLeader && (
                      <span className="ml-[8px] text-[8.5px] tracking-[1px] uppercase font-bold px-[6px] py-[2px] rounded-full"
                        style={{ background: 'var(--pink)', color: 'var(--berry-deep)', verticalAlign: 'middle', fontFamily: 'var(--font-sans)' }}>
                        ★ leading
                      </span>
                    )}
                  </div>
                  <div className="text-[12px] truncate mt-[2px]"
                    style={{ fontFamily: 'var(--font-script-alt)', color: 'var(--berry)' }}>
                    {card.note}
                  </div>
                </div>

                {/* Toggle icon */}
                <motion.div
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="shrink-0 w-[24px] h-[24px] rounded-full flex items-center justify-center text-[15px] font-light leading-none select-none"
                  style={{
                    color: isOpen ? 'var(--cream-hi)' : 'var(--berry)',
                    background: isOpen ? 'var(--berry)' : 'rgba(115,32,62,0.06)',
                    border: '1.5px solid rgba(115,32,62,0.25)',
                  }}
                  aria-hidden="true"
                >+</motion.div>
              </button>

              {/* ── Expanded card — cream panel pops on dark bg ── */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="expanded"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="px-[12px] pb-[12px]">
                      <div className="relative rounded-[12px] overflow-hidden"
                        style={{
                          background: 'var(--cream-hi)',
                          boxShadow: isLeader
                            ? '0 12px 30px rgba(57,22,34,0.16), 0 0 0 2px var(--pink)'
                            : '0 8px 24px rgba(57,22,34,0.12)',
                        }}>
                        <div className="flex items-center gap-[14px] p-[14px]">
                          {/* Larger image */}
                          <div className="shrink-0 w-[132px] h-[132px] rounded-[10px] flex items-center justify-center overflow-hidden"
                            style={{ background: card.bg }}>
                            <img loading="lazy" src={card.img} alt={`A serving of ${card.name} ice cream`} width={132} height={132}
                              className="w-full h-full object-cover"
                              style={{ filter: 'drop-shadow(0 3px 7px rgba(28,13,12,0.28))' }} />
                          </div>

                          {/* Details + CTA */}
                          <div className="flex-1 min-w-0">
                            <div className="text-[19px] leading-tight mb-[3px]"
                              style={{ ...macklin, color: 'var(--cocoa)' }}>
                              {card.name}
                            </div>
                            <div className="text-[13px] mb-[12px]"
                              style={{ fontFamily: 'var(--font-script-alt)', color: 'var(--berry)' }}>
                              {card.note}
                            </div>

                            {/* Burst particles */}
                            {burst === i && !reduce && (
                              <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 z-30">
                                {Array.from({ length: 10 }).map((_, s) => {
                                  const ang = (s / 10) * Math.PI * 2;
                                  return (
                                    <motion.span key={s} className="absolute text-[13px]"
                                      initial={{ opacity: 1, x: 0, y: 0, scale: 0.4 }}
                                      animate={{ opacity: 0, x: Math.cos(ang) * 68, y: Math.sin(ang) * 68, scale: 1 }}
                                      transition={{ duration: 0.85, ease: 'easeOut' }}
                                      style={{ color: s % 2 ? 'var(--pink)' : 'var(--berry)' }}>
                                      {s % 3 === 0 ? '♥' : '✦'}
                                    </motion.span>
                                  );
                                })}
                              </div>
                            )}

                            {!revealed ? (
                              <button onClick={() => handleVote(i)} disabled={!votes || pending}
                                className="relative vote-btn clickable font-sans border-none py-[8px] px-[20px] rounded-full text-[12.5px] font-semibold tracking-[0.4px] mech-btn transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--berry)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ background: 'var(--cocoa)', color: 'var(--cream-hi)', fontFamily: 'var(--font-sans)' }}>
                                {pending ? 'Recording vote…' : 'Vote for this ♥'}
                                {burst === i && !reduce && [...Array(8)].map((_, j) => {
                                  const angle = (j * 45 + Math.random() * 20 - 10) * (Math.PI / 180);
                                  const dist = 34 + Math.random() * 16;
                                  const colors = ['var(--berry)', 'var(--pink)', 'var(--cream-hi)'];
                                  return (
                                    <span key={j} className="sprinkle"
                                      style={{ '--tx': Math.cos(angle) * dist + 'px', '--ty': Math.sin(angle) * dist + 'px', '--r': Math.random() * 360 + 'deg', backgroundColor: colors[j % colors.length] } as React.CSSProperties} />
                                  );
                                })}
                              </button>
                            ) : (
                              <div className="flex items-center gap-[10px]">
                                <div className="text-[26px] leading-none shrink-0"
                                  style={{ ...macklin, color: 'var(--cocoa)' }}>
                                  <CountUp to={pct} reduce={reduce} suffix="%" />
                                </div>
                                <div className="flex-1">
                                  <div className="h-[6px] rounded-full overflow-hidden"
                                    style={{ background: 'rgba(28,13,12,0.1)' }}>
                                    <motion.div className="h-full rounded-full"
                                      style={{ background: isLeader ? 'var(--berry)' : 'var(--pink)' }}
                                      initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                                      transition={reduce ? { duration: 0 } : { duration: 0.9, ease: 'easeOut', delay: 0.1 }} />
                                  </div>
                                  <div className="text-[10.5px] mt-[4px]"
                                    style={{ color: 'var(--cocoa)', opacity: 0.55, fontFamily: 'var(--font-sans)' }}>
                                    {votes ? <><CountUp to={votes[i]} reduce={reduce} /> votes</> : 'Totals unavailable'}
                                    {isChoice && <span className="ml-1 font-bold" style={{ color: 'var(--berry-deep)', opacity: 1 }}>· your pick ♥</span>}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!isLast && (
                <div className="mx-[16px] h-px" style={{ background: 'rgba(115,32,62,0.12)' }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Vote total */}
      <div className="mt-[14px] text-[10.5px] tracking-[3px] uppercase font-semibold"
        style={{ color: 'rgba(115,32,62,0.6)', fontFamily: 'var(--font-sans)' }}>
        {voteError || (votes ? (total === 0 ? 'No votes yet. Be the first.' : `${total.toLocaleString()} neighbors have voted`) : 'Loading vote totals…')}
      </div>
    </motion.div>
  );
}