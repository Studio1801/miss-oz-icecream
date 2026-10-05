import { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion, animate, AnimatePresence } from 'framer-motion';
import { Bunting } from './Decor';

const macklin = { fontFamily: 'var(--font-groovy)', fontWeight: 400, fontStyle: 'italic' as const };

const CARDS = [
  { name: 'Ube Honeycomb',        note: 'purple, golden, a little dramatic', bg: 'var(--cream-hi)', img: '/images/flavor-ube.webp' },
  { name: 'Rose & Pistachio',     note: 'the summer rose, all grown up',      bg: '#F6D9E4',         img: '/images/flavor-rose.webp' },
  { name: 'Brown Butter Croffle', note: 'the croffle, but frozen',            bg: '#F0E2C4',         img: '/images/flavor-croffle.webp' },
];

/* Animated number that counts up on mount (or jumps instantly under reduced motion) */
function CountUp({ to, reduce, suffix = '' }: { to: number; reduce: boolean; suffix?: string }) {
  const [val, setVal] = useState(reduce ? to : 0);
  useEffect(() => {
    if (reduce) { setVal(to); return; }
    const controls = animate(0, to, {
      duration: 0.9,
      ease: 'easeOut',
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => controls.stop();
  }, [to, reduce]);
  return <>{val}{suffix}</>;
}

const VOTE_KEY = 'missoz-flavor-vote-v2'; // v2 = API-backed; v1 was localStorage-only

async function fetchResults(): Promise<Record<string, number>> {
  const res = await fetch('/api/results');
  if (!res.ok) throw new Error('fetch failed');
  const data = await res.json() as { votes: Record<string, number> };
  return data.votes;
}

async function postVote(flavor: string): Promise<void> {
  const res = await fetch('/api/vote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ flavor }),
  });
  if (!res.ok) throw new Error('vote failed');
}

/** Seed counts used before the API responds (or if it fails) */
const SEED_VOTES = [84, 121, 63];

export default function VoteFlavor() {
  const reduce = !!useReducedMotion();
  const [votes, setVotes] = useState<number[]>(SEED_VOTES);
  const [choice, setChoice] = useState<number | null>(null);
  const [burst, setBurst] = useState<number | null>(null);
  const burstTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const total = votes.reduce((a, b) => a + b, 0);
  const leader = votes.indexOf(Math.max(...votes));
  const revealed = choice !== null;

  useEffect(() => () => { if (burstTimer.current) clearTimeout(burstTimer.current); }, []);

  // Restore previous vote from localStorage (one vote per browser)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(VOTE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as { choice?: unknown };
      if (typeof saved.choice === 'number' && saved.choice >= 0 && saved.choice <= 2) {
        setChoice(saved.choice);
      }
    } catch {
      // ignore corrupt storage
    }
  }, []);

  // Load live counts from the API
  useEffect(() => {
    fetchResults()
      .then((apiVotes) => {
        const counts = CARDS.map((c) => apiVotes[c.name] ?? 0);
        // Only replace if the API has at least some votes recorded
        if (counts.some((v) => v > 0)) {
          setVotes(counts);
        }
      })
      .catch(() => {
        // API unavailable — keep seed counts, voting still works locally
      });
  }, []);

  async function handleVote(i: number) {
    if (revealed) return;

    // Optimistic update
    const next = votes.map((v, idx) => (idx === i ? v + 1 : v));
    setVotes(next);
    setChoice(i);
    try {
      localStorage.setItem(VOTE_KEY, JSON.stringify({ choice: i }));
    } catch {
      // storage unavailable — vote counts for this visit anyway
    }
    setBurst(i);
    if (!reduce) {
      if (burstTimer.current) clearTimeout(burstTimer.current);
      burstTimer.current = setTimeout(() => setBurst(null), 900);
    }

    // Persist to API (best effort)
    postVote(CARDS[i].name).catch(() => {/* silent — optimistic update already shown */});
  }

  return (
    <section className="parlour-paper relative text-center py-[80px] md:py-[130px] px-[6vw] bg-[var(--cream)] overflow-hidden">
      <Bunting className="absolute top-0 left-0 right-0" />
      <motion.span
        initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
        className="block text-[12px] tracking-[5px] uppercase font-bold text-[var(--cocoa)] opacity-60 mb-3"
      >
        Community
      </motion.span>
      <motion.span
        initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}
        className="block font-script text-[var(--berry-deep)] text-[clamp(30px,3.5vw,42px)] mb-2"
      >
        you decide
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }}
        className="text-[clamp(42px,6vw,80px)] leading-[0.98] mb-5 text-[var(--cocoa)]"
        style={macklin}
      >
        Vote for the Next Flavor
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}
        className="italic text-[18px] text-[#1d0e0d] opacity-80"
      >
        {revealed
          ? 'Tallied! We churn the winner next month. Thanks for the vote.'
          : 'Every couple of months, the neighborhood picks what we churn next. One vote each.'}
      </motion.p>

      <div className="flex gap-[22px] flex-wrap justify-center items-stretch max-w-[1160px] mx-auto mt-[46px]">
        {CARDS.map((card, i) => {
          const pct = total ? Math.round((votes[i] / total) * 100) : 0;
          const isChoice = choice === i;
          const isLeader = revealed && i === leader;
          return (
            <motion.div
              key={i}
              data-flavor={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              animate={isChoice && !reduce ? { scale: [1, 1.05, 1] } : {}}
              className="bulbframe relative rounded-[16px] p-[15px] w-full md:w-[290px] flex"
              style={{
                background: 'var(--teal-deep)',
                boxShadow: isLeader
                  ? '0 12px 34px rgba(140,42,84,0.34), 0 0 0 2px var(--gold-hi)'
                  : '0 6px 20px rgba(28,13,12,0.28)',
                transition: 'box-shadow 0.5s ease',
              }}
            >
              {/* Leader ribbon */}
              <AnimatePresence>
                {isLeader && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, rotate: -6 }}
                    animate={{ opacity: 1, y: 0, rotate: -6 }}
                    transition={{ delay: 0.35, type: 'spring', stiffness: 260, damping: 16 }}
                    className="absolute -top-[14px] -right-[10px] z-20 px-[14px] py-[6px] rounded-full text-[11px] tracking-[1.5px] uppercase font-bold text-[var(--cream-hi)]"
                    style={{ background: 'var(--berry-deep)', border: '1.5px solid var(--gold-hi)', boxShadow: '0 4px 12px rgba(28,13,12,0.25)' }}
                  >
                    ★ Now leading
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Inner ballot panel (light face inside the bulb frame) */}
              <div
                className="relative z-[1] flex flex-col text-center w-full rounded-[10px] px-[22px] pt-[22px] pb-[24px] overflow-hidden"
                style={{ background: card.bg, boxShadow: 'inset 0 0 0 1px rgba(28,13,12,0.06)' }}
              >
                <div className="absolute top-2 bottom-2 left-[6px] w-[14px] punch-holes opacity-60" aria-hidden="true" />
                <div className="absolute top-2 bottom-2 right-[6px] w-[14px] punch-holes opacity-60" aria-hidden="true" />

                <img loading="lazy" decoding="async"
                  src={card.img}
                  alt={`Illustration of ${card.name} ice cream`}
                  width={296}
                  height={296}
                  className="mx-auto w-[clamp(118px,58%,148px)] h-auto object-contain mb-[6px]"
                  style={{ filter: 'drop-shadow(0 4px 6px rgba(28,13,12,0.3))' }}
                />

                <h3 className="font-normal text-[23px] mt-[6px] mb-[4px] text-[var(--cocoa)] relative z-10" style={macklin}>{card.name}</h3>
                <div className="font-script-alt text-[20px] text-[var(--berry)] mb-[18px] relative z-10">{card.note}</div>

              {/* Sparkle burst on vote */}
              {burst === i && !reduce && (
                <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 z-30">
                  {Array.from({ length: 10 }).map((_, s) => {
                    const ang = (s / 10) * Math.PI * 2;
                    return (
                      <motion.span
                        key={s}
                        className="absolute text-[15px]"
                        initial={{ opacity: 1, x: 0, y: 0, scale: 0.5 }}
                        animate={{ opacity: 0, x: Math.cos(ang) * 90, y: Math.sin(ang) * 90, scale: 1.15 }}
                        transition={{ duration: 0.85, ease: 'easeOut' }}
                        style={{ color: s % 2 ? 'var(--gold-hi)' : 'var(--berry)' }}
                      >
                        {s % 3 === 0 ? '♥' : '✦'}
                      </motion.span>
                    );
                  })}
                </div>
              )}

              {/* Button (before vote) or result (after) */}
              <div className="mt-auto relative z-10 min-h-[64px] flex items-center justify-center">
                {!revealed ? (
                  <button
                    onClick={() => handleVote(i)}
                    className="relative vote-btn clickable font-sans bg-[var(--cocoa)] text-[var(--cream)] border-none py-[12px] px-[30px] rounded-full text-[15px] font-semibold tracking-[0.5px] mech-btn hover:bg-[var(--berry)] hover:-translate-y-0.5 transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--berry)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                  >
                    Vote for this
                    {burst === i && !reduce && [...Array(12)].map((_, j) => {
                      const angle = (j * 30 + Math.random() * 20 - 10) * (Math.PI / 180);
                      const dist = 50 + Math.random() * 30;
                      const tx = Math.cos(angle) * dist + 'px';
                      const ty = Math.sin(angle) * dist + 'px';
                      const r = Math.random() * 360 + 'deg';
                      const colors = ['var(--berry)', 'var(--gold-hi)', 'var(--cream-hi)'];
                      const bg = colors[j % colors.length];
                      return (
                        <span
                          key={j}
                          className="sprinkle"
                          style={{
                            '--tx': tx,
                            '--ty': ty,
                            '--r': r,
                            backgroundColor: bg,
                          } as React.CSSProperties}
                        />
                      );
                    })}
                  </button>
                ) : (
                  <div>
                    <div
                      aria-hidden={!isChoice}
                      className="text-[13px] font-bold tracking-[1px] uppercase mb-[12px]"
                      style={{ color: isChoice ? 'var(--berry-deep)' : 'transparent' }}
                    >
                      {isChoice ? '♥ Your pick' : '\u00A0'}
                    </div>
                    <div className="flex items-baseline justify-center gap-[8px] mb-[10px]">
                      <span className="text-[34px] leading-none text-[var(--cocoa)]" style={macklin}>
                        <CountUp to={pct} reduce={reduce} suffix="%" />
                      </span>
                    </div>
                    <div className="h-[9px] bg-[rgba(28,13,12,0.12)] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: isLeader ? 'var(--gold)' : 'var(--berry)' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={reduce ? { duration: 0 } : { duration: 0.9, ease: 'easeOut', delay: 0.15 }}
                      />
                    </div>
                    <div className="text-[13px] mt-[8px] text-[var(--cocoa)] opacity-70">
                      <CountUp to={votes[i]} reduce={reduce} /> votes
                    </div>
                  </div>
                )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Running total */}
      <motion.div
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.3 }}
        className="mt-[34px] text-[14px] tracking-[2px] uppercase font-semibold text-[var(--cocoa)] opacity-55"
      >
        {total.toLocaleString()} neighbors have voted
      </motion.div>
    </section>
  );
}
