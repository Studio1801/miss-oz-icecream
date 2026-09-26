import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type InquiryType = 'wholesale' | 'event' | 'general';

interface Props {
  type: InquiryType;
  /** Label for the trigger button */
  submitLabel?: string;
  /** Tailwind/CSS classes for the trigger button */
  buttonClassName?: string;
  /** When true, renders form fields with light text/borders for dark backgrounds */
  darkBg?: boolean;
}

type Status = 'idle' | 'sending' | 'success' | 'error';

const BUSINESS_TYPES = ['Coffee Shop', 'Restaurant', 'Grocery', 'Bakery', 'Catering', 'Hotel', 'Other'];
const WHOLESALE_PRODUCTS = [
  'Ice Cream (1.5 Gallon)',
  'Ice Cream (2.5 Gallon)',
  'Basque Cheesecake',
  'Cookies',
  'Other',
];

export default function InquireForm({
  type,
  submitLabel = 'Send inquiry',
  buttonClassName = '',
  darkBg = false,
}: Props) {
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [productsOfInterest, setProductsOfInterest] = useState<string[]>([]);
  const [estimatedOrderVolume, setEstimatedOrderVolume] = useState('');
  const [additionalInformation, setAdditionalInformation] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [numberOfServings, setNumberOfServings] = useState('');
  const [desiredOrderQuantities, setDesiredOrderQuantities] = useState('');
  const [additionalEventDetails, setAdditionalEventDetails] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [open, setOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const wholesaleComplete =
      type !== 'wholesale' ||
      (businessName.trim() &&
        name.trim() &&
        email.trim() &&
        phone.trim() &&
        businessType &&
        productsOfInterest.length > 0 &&
        estimatedOrderVolume.trim());
    const eventComplete =
      type !== 'event' ||
      (eventDate.trim() &&
        eventTime.trim() &&
        numberOfServings.trim() &&
        desiredOrderQuantities.trim());
    if (!name.trim() || !email.trim() || (!message.trim() && type !== 'wholesale' && type !== 'event') || !wholesaleComplete || !eventComplete) return;
    setStatus('sending');
    try {
      // Use BASE_URL so the path is correct in both Replit dev and Vercel deploy
      const base = import.meta.env.BASE_URL?.replace(/\/$/, '') ?? '';
      const wholesaleMessage = [
        `Business Name: ${businessName.trim()}`,
        `Contact Person: ${name.trim()}`,
        `Email Address: ${email.trim()}`,
        `Phone Number: ${phone.trim()}`,
        `Business Type: ${businessType}`,
        `Products of Interest: ${productsOfInterest.join(', ')}`,
        `Estimated Order Volume: ${estimatedOrderVolume.trim()}`,
        `Additional Information: ${additionalInformation.trim() || 'None provided'}`,
      ].join('\n');
      const eventMessage = [
        `Event Date: ${eventDate.trim()}`,
        `Event Time: ${eventTime.trim()}`,
        `Number of Servings: ${numberOfServings.trim()}`,
        `Desired Order Quantities: ${desiredOrderQuantities.trim()}`,
        `Additional Event Details: ${additionalEventDetails.trim() || 'None provided'}`,
      ].join('\n');
      const res = await fetch(`${base}/api/inquire`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone: phone || undefined,
          type,
          message: type === 'wholesale' ? wholesaleMessage : type === 'event' ? eventMessage : message,
          businessName: type === 'wholesale' ? businessName : undefined,
          contactPerson: type === 'wholesale' ? name : undefined,
          businessType: type === 'wholesale' ? businessType : undefined,
          productsOfInterest: type === 'wholesale' ? productsOfInterest : undefined,
          estimatedOrderVolume: type === 'wholesale' ? estimatedOrderVolume : undefined,
          additionalInformation: type === 'wholesale' ? additionalInformation : undefined,
          eventDate: type === 'event' ? eventDate : undefined,
          eventTime: type === 'event' ? eventTime : undefined,
          numberOfServings: type === 'event' ? numberOfServings : undefined,
          desiredOrderQuantities: type === 'event' ? desiredOrderQuantities : undefined,
          additionalEventDetails: type === 'event' ? additionalEventDetails : undefined,
        }),
      });
      if (!res.ok) throw new Error('server error');
      setStatus('success');
      setName(''); setBusinessName(''); setEmail(''); setPhone(''); setMessage('');
      setBusinessType(''); setProductsOfInterest([]); setEstimatedOrderVolume(''); setAdditionalInformation('');
      setEventDate(''); setEventTime(''); setNumberOfServings(''); setDesiredOrderQuantities(''); setAdditionalEventDetails('');
    } catch {
      setStatus('error');
    }
  }

  function reset() {
    setStatus('idle');
    setOpen(false);
  }

  // Light-on-dark vs dark-on-light field styles
  const inputClass = darkBg
    ? 'w-full bg-transparent border-b-2 border-[rgba(243,234,214,0.35)] pb-[5px] text-[17px] text-[#f3ead6] placeholder:text-[rgba(243,234,214,0.4)] placeholder:italic focus:outline-none focus:border-[var(--gold-hi)] transition-colors px-1 py-1 rounded-sm'
    : 'w-full bg-transparent border-b-2 border-[rgba(28,13,12,0.25)] pb-[5px] text-[17px] text-[var(--cocoa)] placeholder:text-[rgba(28,13,12,0.35)] placeholder:italic focus:outline-none focus:border-[var(--berry)] transition-colors px-1 py-1 rounded-sm';

  const labelClass = darkBg
    ? 'block text-[11px] tracking-[3px] uppercase font-bold text-[#f3ead6] opacity-70 mb-1'
    : 'block text-[11px] tracking-[3px] uppercase font-bold text-[var(--cocoa)] opacity-60 mb-1';

  const textareaClass = darkBg
    ? 'w-full bg-transparent border border-[rgba(243,234,214,0.28)] rounded-[6px] px-3 py-2 text-[16px] leading-[1.6] text-[#f3ead6] placeholder:text-[rgba(243,234,214,0.4)] placeholder:italic focus:outline-none focus:border-[var(--gold-hi)] transition-colors resize-none'
    : 'w-full bg-transparent border border-[rgba(28,13,12,0.2)] rounded-[6px] px-3 py-2 text-[16px] leading-[1.6] text-[var(--cocoa)] placeholder:text-[rgba(28,13,12,0.35)] placeholder:italic focus:outline-none focus:border-[var(--berry)] transition-colors resize-none';

  const cancelClass = darkBg
    ? 'text-[12px] tracking-[2px] uppercase underline text-[#f3ead6] opacity-50 hover:opacity-90 transition-opacity'
    : 'text-[12px] tracking-[2px] uppercase underline opacity-50 hover:opacity-90 transition-opacity';

  return (
    <div className="mt-6">
      <AnimatePresence mode="wait">
        {!open ? (
          <motion.button
            key="trigger"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            type="button"
            onClick={() => setOpen(true)}
            className={buttonClassName}
          >
            {submitLabel}
            <span aria-hidden="true"> →</span>
          </motion.button>
        ) : status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div
              className="text-[22px] mb-2"
              aria-live="polite"
              style={{
                fontFamily: 'var(--font-script)',
                color: darkBg ? '#f3ead6' : 'var(--berry)',
              }}
            >
              {type === 'wholesale'
                ? 'Thank you for your interest in becoming a wholesale partner with Miss Oz Ice Cream Cafe!'
                : 'Message received ♥'}
            </div>
            {type === 'wholesale' ? (
              <div
                className="text-[14px] leading-relaxed mb-4"
                style={{
                  fontFamily: 'var(--font-sans)',
                  color: darkBg ? 'rgba(243,234,214,0.7)' : 'rgba(28,13,12,0.6)',
                }}
              >
                <p>We've received your inquiry and will review it carefully.</p>
                <p className="mt-2">We'll contact you within 1–2 business days to discuss pricing, product availability, and the next steps.</p>
              </div>
            ) : (
              <p
                className="text-[14px] italic mb-4"
                style={{
                  fontFamily: 'var(--font-sans)',
                  color: darkBg ? 'rgba(243,234,214,0.7)' : 'rgba(28,13,12,0.6)',
                }}
              >
                We'll be in touch soon.
              </p>
            )}
            <button
              type="button"
              onClick={reset}
              className={cancelClass}
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Close
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            onSubmit={handleSubmit}
            className="max-w-[460px] mx-auto text-left"
          >
            {type === 'wholesale' && (
              <div className="mb-5">
                <label className={labelClass}>Business Name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  maxLength={120}
                  required
                  placeholder="Your business name"
                  className={inputClass}
                />
              </div>
            )}
            <div className="mb-5">
              <label className={labelClass}>{type === 'wholesale' ? 'Contact Person' : 'Your name'}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={80}
                required
                placeholder={type === 'wholesale' ? 'Your name' : 'Name or business name'}
                className={inputClass}
              />
            </div>
            <div className="mb-5">
              <label className={labelClass}>{type === 'wholesale' ? 'Email Address' : 'Email'}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={120}
                required
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>
            <div className="mb-5">
              <label className={labelClass}>
                {type === 'wholesale' ? 'Phone Number' : <>Phone <span className="normal-case font-normal" style={{ opacity: 0.6 }}>(optional)</span></>}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={30}
                required={type === 'wholesale'}
                placeholder="503-555-0100"
                className={inputClass}
              />
            </div>
            {type === 'wholesale' ? (
              <>
                <div className="mb-5">
                  <label className={labelClass}>Business Type</label>
                  <select value={businessType} onChange={(e) => setBusinessType(e.target.value)} required className={inputClass}>
                    <option value="">Choose a business type</option>
                    {BUSINESS_TYPES.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </div>
                <fieldset className="mb-5">
                  <legend className={labelClass}>Products of Interest</legend>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {WHOLESALE_PRODUCTS.map((product) => (
                      <label key={product} className="flex items-center gap-2 text-[15px]" style={{ color: darkBg ? '#f3ead6' : 'var(--cocoa)', fontFamily: 'var(--font-sans)' }}>
                        <input
                          type="checkbox"
                          checked={productsOfInterest.includes(product)}
                          onChange={(e) => setProductsOfInterest((current) => e.target.checked ? [...current, product] : current.filter((item) => item !== product))}
                          className="h-4 w-4 accent-[var(--gold-hi)]"
                        />
                        {product}
                      </label>
                    ))}
                  </div>
                </fieldset>
                <div className="mb-5">
                  <label className={labelClass}>Estimated Order Volume</label>
                  <input
                    type="text"
                    value={estimatedOrderVolume}
                    onChange={(e) => setEstimatedOrderVolume(e.target.value)}
                    maxLength={160}
                    required
                    placeholder="How much product do you expect to order?"
                    className={inputClass}
                  />
                </div>
                <div className="mb-6">
                  <label className={labelClass}>Additional Information</label>
                  <textarea
                    value={additionalInformation}
                    onChange={(e) => setAdditionalInformation(e.target.value)}
                    maxLength={1200}
                    rows={4}
                    placeholder="Tell us anything else we should know."
                    className={textareaClass}
                  />
                </div>
              </>
            ) : type === 'event' ? (
              <>
                <div className="mb-5 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="event-date" className={labelClass}>Event Date</label>
                    <input id="event-date" type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="event-time" className={labelClass}>Event Time</label>
                    <input id="event-time" type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} required className={inputClass} />
                  </div>
                </div>
                <div className="mb-5">
                  <label htmlFor="event-servings" className={labelClass}>Number of Servings</label>
                  <input id="event-servings" type="number" min="1" value={numberOfServings} onChange={(e) => setNumberOfServings(e.target.value)} required placeholder="How many guests will you serve?" className={inputClass} />
                </div>
                <div className="mb-5">
                  <label htmlFor="event-quantities" className={labelClass}>Desired Order Quantities</label>
                  <textarea id="event-quantities" value={desiredOrderQuantities} onChange={(e) => setDesiredOrderQuantities(e.target.value)} maxLength={600} rows={3} required placeholder="For example: 50 single scoops, 30 double scoops" className={textareaClass} />
                </div>
                <div className="mb-6">
                  <label htmlFor="event-details" className={labelClass}>Additional Event Details</label>
                  <textarea id="event-details" value={additionalEventDetails} onChange={(e) => setAdditionalEventDetails(e.target.value)} maxLength={1200} rows={4} placeholder="Tell us anything else about your event." className={textareaClass} />
                </div>
              </>
            ) : (
              <div className="mb-6">
                <label className={labelClass}>Tell us more</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={1200}
                  rows={4}
                  required
                  placeholder="How can we help?"
                  className={textareaClass}
                />
              </div>
            )}

            {status === 'error' && (
              <p className="text-[13px] text-red-400 mb-4 italic" role="alert">
                Something went wrong. Please try again or email us directly.
              </p>
            )}

            <div className="flex items-center gap-4 flex-wrap">
              <button
                type="submit"
                disabled={
                  status === 'sending' ||
                  !name.trim() ||
                  !email.trim() ||
                  (type === 'wholesale'
                    ? !businessName.trim() || !phone.trim() || !businessType || productsOfInterest.length === 0 || !estimatedOrderVolume.trim()
                    : type === 'event'
                    ? !eventDate.trim() || !eventTime.trim() || !numberOfServings.trim() || !desiredOrderQuantities.trim()
                    : !message.trim())
                }
                className="bg-[var(--cocoa)] text-[var(--cream)] py-[11px] px-[26px] rounded-full text-[14px] font-semibold tracking-[0.5px] mech-btn hover:bg-[var(--berry)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--gold)]"
              >
                {status === 'sending' ? 'Sending…' : 'Send message'}
              </button>
              <button
                type="button"
                onClick={reset}
                className={cancelClass}
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
