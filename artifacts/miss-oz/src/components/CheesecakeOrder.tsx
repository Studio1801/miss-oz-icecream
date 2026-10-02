import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';

type OrderStatus = 'idle' | 'sending' | 'sent' | 'error';

function getFollowingWednesday() {
  const date = new Date();
  const daysUntilWednesday = (3 - date.getDay() + 7) % 7 || 7;
  date.setDate(date.getDate() + daysUntilWednesday);
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

export default function CheesecakeOrder({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [status, setStatus] = useState<OrderStatus>('idle');
  const followingWednesday = getFollowingWednesday();

  useEffect(() => {
    if (!open) return;
    setStatus('idle');
    const closeOnEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open, onClose]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    const form = e.currentTarget;
    const values = new FormData(form);
    const message = [
      'Whole Basque Cheesecake pre-order',
      `Cake size: ${values.get('cakeSize')}`,
      `Quantity: ${values.get('quantity')}`,
      `Pickup date: ${values.get('pickupDate')}`,
      `Order notes: ${values.get('notes') || 'None'}`,
    ].join('\n');
    const base = import.meta.env.BASE_URL.replace(/\/$/, '');
    try {
      const response = await fetch(`${base}/api/inquire`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.get('name'),
          email: values.get('email'),
          phone: values.get('phone'),
          type: 'general',
          message,
        }),
      });
      if (!response.ok) throw new Error('Order request failed');
      form.reset();
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  if (!open) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="whole-cake-order-title"
        className="fixed inset-0 z-[2000] flex items-start justify-center overflow-y-auto p-[14px] sm:p-[28px]"
        style={{ background: 'rgba(28,13,12,0.72)', backdropFilter: 'blur(5px)' }}
        onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative my-auto w-full max-w-[720px] rounded-[12px] p-[clamp(18px,3vw,34px)]"
          style={{ background: 'var(--cream-hi)', boxShadow: '0 20px 70px rgba(0,0,0,0.4)', border: '2px solid var(--gold)' }}
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <button type="button" aria-label="Close whole cheesecake order form" onClick={onClose} className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-[22px] text-[var(--berry-deep)] hover:bg-[rgba(94,23,53,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--berry)]">×</button>
          <div className="pr-10">
            <div className="text-[var(--marionberry)]" style={{ fontFamily: 'var(--font-script)', fontSize: 'clamp(25px,3vw,34px)', lineHeight: 1.1 }}>Whole Basque Cheesecake</div>
            <h2 id="whole-cake-order-title" className="mt-1 text-[#3B1E2B]" style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(20px,2.4vw,28px)' }}>Place a Pre-Order</h2>
          </div>
          <div className="mt-5 grid gap-5 text-[#6E5A54] leading-relaxed" style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(12px,1vw,14px)' }}>
            <div className="rounded-[9px] p-[clamp(14px,2vw,22px)]" style={{ background: 'rgba(94,23,53,0.05)', border: '1px dashed rgba(94,23,53,0.25)' }}>
              <div className="text-[var(--marionberry)]" style={{ fontFamily: 'var(--font-script)', fontSize: 'clamp(22px,2.4vw,29px)', lineHeight: 1.1 }}>How to Order</div>
              <ol className="mt-3 list-decimal space-y-2 pl-5">
                <li>Choose your cake size and quantity.</li>
                <li>Enter your contact details and any order notes.</li>
                <li>Submit your request and we’ll follow up to confirm it.</li>
              </ol>
            </div>
            <div className="rounded-[9px] p-[clamp(14px,2vw,22px)]" style={{ background: 'rgba(94,23,53,0.05)', border: '1px dashed rgba(94,23,53,0.25)' }}>
              <div className="font-bold text-[#3B1E2B]">Weekly Schedule</div>
              <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-3">
                <div><strong>Orders open:</strong> Monday 11:00 AM–Friday 8:00 PM</div>
                <div><strong>Production:</strong> The following Monday</div>
                <div><strong>Cooling &amp; aging:</strong> Monday–Tuesday</div>
                <div><strong>Pickup:</strong> Following Wednesday by noon</div>
              </div>
              <p className="mt-3"><strong>Important:</strong> Your pickup is the following Wednesday, not the Wednesday of the same week.</p>
            </div>
            <form onSubmit={handleSubmit} className="rounded-[9px] p-[clamp(14px,2vw,22px)]" style={{ background: 'rgba(227,180,76,0.12)', border: '1px solid rgba(94,23,53,0.18)' }}>
              <div className="font-bold text-[#3B1E2B]" style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(18px,2vw,23px)' }}>Your Order Details</div>
              <div className="mt-4 grid gap-3 text-[#3B1E2B]" style={{ fontFamily: 'var(--font-sans)', fontSize: '12px' }}>
                <label>Cake size
                  <select name="cakeSize" required className="mt-1 w-full rounded-[6px] px-3 py-2.5" style={{ background: 'rgba(251,244,230,0.9)', border: '1px solid rgba(94,23,53,0.22)' }}>
                    <option value="">Choose a size</option><option>6-inch</option><option>8-inch</option><option>10-inch</option>
                  </select>
                </label>
                <label>Quantity<input name="quantity" type="number" min="1" defaultValue="1" required className="mt-1 w-full rounded-[6px] px-3 py-2.5" style={{ background: 'rgba(251,244,230,0.9)', border: '1px solid rgba(94,23,53,0.22)' }} /></label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label>Customer name<input name="name" required className="mt-1 w-full rounded-[6px] px-3 py-2.5" style={{ background: 'rgba(251,244,230,0.9)', border: '1px solid rgba(94,23,53,0.22)' }} /></label>
                  <label>Phone number<input name="phone" type="tel" required className="mt-1 w-full rounded-[6px] px-3 py-2.5" style={{ background: 'rgba(251,244,230,0.9)', border: '1px solid rgba(94,23,53,0.22)' }} /></label>
                </div>
                <label>Email address<input name="email" type="email" required className="mt-1 w-full rounded-[6px] px-3 py-2.5" style={{ background: 'rgba(251,244,230,0.9)', border: '1px solid rgba(94,23,53,0.22)' }} /></label>
                <label>Pickup date<input name="pickupDate" value={`${followingWednesday} by noon`} readOnly className="mt-1 w-full rounded-[6px] px-3 py-2.5" style={{ background: 'rgba(251,244,230,0.6)', border: '1px solid rgba(94,23,53,0.22)' }} /></label>
                <label>Order notes<textarea name="notes" rows={3} className="mt-1 w-full resize-y rounded-[6px] px-3 py-2.5" style={{ background: 'rgba(251,244,230,0.9)', border: '1px solid rgba(94,23,53,0.22)' }} /></label>
              </div>
              <div className="mt-4 rounded-[7px] px-3 py-3 text-[#5B4540]" style={{ background: 'rgba(251,244,230,0.62)', border: '1px dashed rgba(94,23,53,0.24)', fontFamily: 'var(--font-sans)', fontSize: '12px' }}>
                <div className="font-bold text-[#3B1E2B]">Payment</div>
                <p className="mt-1">Payment in full will be required when placing your order because each cake is prepared specifically for you.</p>
                <p className="mt-1 font-bold text-[var(--berry-deep)]">Your order is confirmed only after payment has been completed.</p>
              </div>
              <button type="submit" disabled={status === 'sending'} className="mt-4 w-full rounded-full bg-[var(--berry-deep)] px-5 py-3 font-bold uppercase tracking-[1.5px] text-[var(--cream-hi)] transition-transform hover:-translate-y-0.5 disabled:opacity-60" style={{ fontFamily: 'var(--font-sans)', fontSize: '12px' }}>
                {status === 'sending' ? 'Sending…' : 'Submit Pre-Order'}
              </button>
              {status === 'sent' && <p className="mt-3 text-center text-[#3B1E2B]">Thank you. Your pre-order request has been sent.</p>}
              {status === 'error' && <p className="mt-3 text-center text-[var(--berry-deep)]">We couldn’t send your request. Please try again.</p>}
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}