import { useId, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMobileForm, MOBILE_FORM_SUCCESS, MOBILE_FORM_FAILURE, sentenceCase } from '../hooks/useMobileForm';

export type InquiryType = 'wholesale' | 'event' | 'general';

interface Props {
  type: InquiryType;
  /** Label for the trigger button */
  submitLabel?: string;
  /** Tailwind/CSS classes for the trigger button */
  buttonClassName?: string;
  /** Render the form inline instead of behind a trigger button */
  inline?: boolean;
  /** Render field labels in sentence case */
  sentenceCaseLabels?: boolean;
  /** Label for the form's submit button */
  submitButtonLabel?: string;
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
  inline = false,
  sentenceCaseLabels = false,
  submitButtonLabel = 'Send message',
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
  const [validationMessage, setValidationMessage] = useState('');
  const validation = useMobileForm();
  const formId = useId();
  const fieldId = (name: string) => `inquiry-${formId}-${name}`;
  const field = (name: string) => validation.field(fieldId(name));
  const error = (name: string) => validation.error(fieldId(name));
  const isMobileViewport = validation.mobile;
  const [status, setStatus] = useState<Status>('idle');
  const [open, setOpen] = useState(inline);
  const [showSuccessCheck, setShowSuccessCheck] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'sending' || (isMobileViewport && status === 'success')) return;
    if (!validation.validate(e.currentTarget)) return;
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
    if (!name.trim() || !email.trim() || (!message.trim() && type !== 'wholesale' && type !== 'event') || !wholesaleComplete || !eventComplete) {
      if (type === 'event' && inline) setValidationMessage('Please complete the required event fields before sending.');
      return;
    }
    setValidationMessage('');
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
      if (isMobileViewport) {
        const result = await res.json();
        if (result.ok !== true || result.note) throw new Error('Sending was not confirmed');
      }
      setStatus('success');
      setShowSuccessCheck(true);
      window.setTimeout(() => setShowSuccessCheck(false), 2000);
      setName(''); setBusinessName(''); setEmail(''); setPhone(''); setMessage('');
      setBusinessType(''); setProductsOfInterest([]); setEstimatedOrderVolume(''); setAdditionalInformation('');
      setEventDate(''); setEventTime(''); setNumberOfServings(''); setDesiredOrderQuantities(''); setAdditionalEventDetails('');
    } catch {
      setStatus('error');
    }
  }

  function reset() {
    setStatus('idle');
    setShowSuccessCheck(false);
    setOpen(inline);
  }

  // Light-on-dark vs dark-on-light field styles
  const mobileEventInputClass = type === 'event' && inline
    ? 'max-[639px]:h-12 max-[639px]:box-border max-[639px]:text-base'
    : '';
  const inputClass = darkBg
    ? `w-full bg-transparent border-b-2 border-[rgba(243,234,214,0.35)] pb-[5px] text-[17px] text-[#f3ead6] placeholder:text-[rgba(243,234,214,0.4)] placeholder:italic focus:outline-none focus:border-[var(--gold-hi)] transition-colors px-1 py-1 rounded-sm ${mobileEventInputClass}`
    : `w-full bg-transparent border-b-2 border-[rgba(28,13,12,0.25)] pb-[5px] text-[17px] text-[var(--cocoa)] placeholder:text-[rgba(28,13,12,0.35)] placeholder:italic focus:outline-none focus:border-[var(--berry)] transition-colors px-1 py-1 rounded-sm ${mobileEventInputClass}`;

  const labelCaseClass = sentenceCaseLabels ? 'tracking-[1px] normal-case' : 'tracking-[3px] uppercase';
  const labelSizeClass = type === 'event' && inline ? 'text-[12px] max-[639px]:text-[14px]' : 'text-[11px] max-[639px]:text-[12px]';
  const labelClass = darkBg
    ? `block ${labelSizeClass} ${labelCaseClass} font-bold text-[#f3ead6] opacity-70 mb-1`
    : `block ${labelSizeClass} ${labelCaseClass} font-bold text-[var(--cocoa)] opacity-60 mb-1`;

  const labelText = (text: string) =>
    sentenceCaseLabels ? `${text.charAt(0).toUpperCase()}${text.slice(1).toLowerCase()}` : text;
  const fieldSpacing = inline
    ? type === 'event' ? 'mb-3 lg:mb-2' : 'mb-3'
    : 'mb-5';
  const finalFieldSpacing = inline
    ? type === 'event' ? 'mb-4 lg:mb-3' : 'mb-4'
    : 'mb-6';
  const dateTimeGap = inline
    ? type === 'event' ? 'gap-3 lg:gap-2' : 'gap-3'
    : 'gap-5';

  const textareaClass = darkBg
    ? 'w-full bg-transparent border border-[rgba(243,234,214,0.28)] rounded-[6px] px-3 py-2 text-[16px] leading-[1.6] text-[#f3ead6] placeholder:text-[rgba(243,234,214,0.4)] placeholder:italic focus:outline-none focus:border-[var(--gold-hi)] transition-colors resize-none'
    : 'w-full bg-transparent border border-[rgba(28,13,12,0.2)] rounded-[6px] px-3 py-2 text-[16px] leading-[1.6] text-[var(--cocoa)] placeholder:text-[rgba(28,13,12,0.35)] placeholder:italic focus:outline-none focus:border-[var(--berry)] transition-colors resize-none';

  const cancelClass = darkBg
    ? 'text-[12px] tracking-[2px] uppercase underline text-[#f3ead6] opacity-50 hover:opacity-90 transition-opacity'
    : 'text-[12px] tracking-[2px] uppercase underline opacity-50 hover:opacity-90 transition-opacity';

  return (
    <div className={inline ? 'w-full' : 'mt-6'}>
      <AnimatePresence mode="wait">
        {!open && !inline ? (
          <motion.button
            key="trigger"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            type="button"
            onClick={() => setOpen(true)}
            className={`interaction-primary ${buttonClassName}`}
          >
            {submitLabel}
            <span aria-hidden="true"> →</span>
          </motion.button>
        ) : status === 'success' && !isMobileViewport ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <AnimatePresence>
              {showSuccessCheck && (
                <motion.span
                  aria-hidden="true"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="mb-2 block text-[28px] text-[var(--berry)]"
                >✓</motion.span>
              )}
            </AnimatePresence>
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
            noValidate={isMobileViewport}
            onInput={(event) => {
              validation.clear(event);
              if (isMobileViewport && status === 'success') setStatus('idle');
            }}
            data-dark={darkBg}
            className={`mobile-form mx-auto max-w-[460px] text-left ${type === 'event' && inline ? 'lg:max-w-none' : ''}`}
          >
            {type === 'wholesale' && (
              <div className="mb-5">
                <label htmlFor={fieldId('business-name')} className={labelClass}>Business Name</label>
                <input
                  {...field('business-name')}
                  autoComplete="organization"
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  maxLength={120}
                  required
                  placeholder="Your business name"
                  className={inputClass}
                />
                {error('business-name')}
              </div>
            )}
            <div className={fieldSpacing}>
              <label htmlFor={fieldId('name')} className={labelClass}>{labelText(type === 'wholesale' ? 'Contact Person' : 'Your name')}</label>
              <input
                {...field('name')}
                autoComplete="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={80}
                required
                placeholder={type === 'wholesale' ? 'Your name' : 'Name or business name'}
                className={inputClass}
              />
              {error('name')}
            </div>
              <div className={type === 'event' && inline ? `${fieldSpacing} grid gap-y-3 lg:grid-cols-2 lg:gap-x-5 lg:gap-y-2` : ''}>
              <div className={type === 'event' && inline ? '' : fieldSpacing}>
                <label htmlFor={fieldId('email')} className={labelClass}>{labelText(type === 'wholesale' ? 'Email Address' : 'Email')}</label>
                <input
                  {...field('email')}
                  autoComplete="email"
                  inputMode="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={120}
                  required
                  placeholder="you@example.com"
                  className={inputClass}
                />
                {error('email')}
              </div>
              <div className={type === 'event' && inline ? '' : fieldSpacing}>
                <label htmlFor={fieldId('phone')} className={labelClass}>
                  {type === 'wholesale' ? labelText('Phone Number') : <>{labelText('Phone')} <span className="normal-case font-normal" style={{ opacity: 0.6 }}>(optional)</span></>}
                </label>
                <input
                  {...field('phone')}
                  autoComplete="tel"
                  inputMode="tel"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={30}
                  required={type === 'wholesale'}
                  placeholder="503-555-0100"
                  className={inputClass}
                />
                {error('phone')}
              </div>
            </div>
            {type === 'wholesale' ? (
              <>
                <div className={fieldSpacing}>
                  <label htmlFor={fieldId('business-type')} className={labelClass}>{labelText('Business Type')}</label>
                  <select {...field('business-type')} value={businessType} onChange={(e) => setBusinessType(e.target.value)} required className={inputClass}>
                    <option value="">Choose a business type</option>
                    {BUSINESS_TYPES.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                  {error('business-type')}
                </div>
                <fieldset className={fieldSpacing}>
                  <legend className={labelClass}>{labelText('Products of Interest')}</legend>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {WHOLESALE_PRODUCTS.map((product, index) => (
                      <div key={product}>
                      <label htmlFor={fieldId(`product-${index}`)} className="flex items-center gap-2 text-[15px]" style={{ color: darkBg ? '#f3ead6' : 'var(--cocoa)', fontFamily: 'var(--font-sans)' }}>
                        <input
                          {...field(`product-${index}`)}
                          type="checkbox"
                          required={index === 0 && productsOfInterest.length === 0}
                          checked={productsOfInterest.includes(product)}
                          onChange={(e) => setProductsOfInterest((current) => e.target.checked ? [...current, product] : current.filter((item) => item !== product))}
                          className="h-4 w-4 accent-[var(--gold-hi)]"
                        />
                        {product}
                      </label>
                      {error(`product-${index}`)}
                      </div>
                    ))}
                  </div>
                </fieldset>
                <div className={fieldSpacing}>
                  <label htmlFor={fieldId('volume')} className={labelClass}>{labelText('Estimated Order Volume')}</label>
                  <input
                    {...field('volume')}
                    type="text"
                    value={estimatedOrderVolume}
                    onChange={(e) => setEstimatedOrderVolume(e.target.value)}
                    maxLength={160}
                    required
                    placeholder="How much product do you expect to order?"
                    className={inputClass}
                  />
                  {error('volume')}
                </div>
                <div className={finalFieldSpacing}>
                  <label htmlFor={fieldId('information')} className={labelClass}>{labelText('Additional Information')}</label>
                  <textarea
                    {...field('information')}
                    value={additionalInformation}
                    onChange={(e) => setAdditionalInformation(e.target.value)}
                    maxLength={1200}
                    rows={4}
                    placeholder="Tell us anything else we should know."
                    className={textareaClass}
                  />
                  {error('information')}
                </div>
              </>
            ) : type === 'event' ? (
              <>
                <div className={`${fieldSpacing} grid ${dateTimeGap} sm:grid-cols-2 ${inline ? 'lg:grid-cols-3' : ''}`}>
                  <div>
                    <label htmlFor={fieldId('date')} className={labelClass}>{labelText('Event Date')}</label>
                    <input {...field('date')} type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required className={inputClass} />
                    {error('date')}
                  </div>
                  <div>
                    <label htmlFor={fieldId('time')} className={labelClass}>{labelText('Event Time')}</label>
                    <input {...field('time')} type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} required className={inputClass} />
                    {error('time')}
                  </div>
                  <div className={inline ? 'sm:col-span-2 lg:col-span-1' : 'sm:col-span-2'}>
                    <label htmlFor={fieldId('servings')} className={labelClass}>{labelText('Number of Servings')}</label>
                    <input {...field('servings')} type="number" inputMode="numeric" min="1" value={numberOfServings} onChange={(e) => setNumberOfServings(e.target.value)} required placeholder="Guest count" className={inputClass} />
                    {error('servings')}
                  </div>
                </div>
                <div className={fieldSpacing}>
                  <label htmlFor={fieldId('quantities')} className={labelClass}>{labelText('Desired Order Quantities')}</label>
                  <textarea {...field('quantities')} value={desiredOrderQuantities} onChange={(e) => setDesiredOrderQuantities(e.target.value)} maxLength={600} rows={inline ? 2 : 3} required placeholder="For example: 50 single scoops, 30 double scoops" className={textareaClass} />
                  {error('quantities')}
                </div>
                <div className={finalFieldSpacing}>
                  <label htmlFor={fieldId('details')} className={labelClass}>{labelText('Additional Event Details')}</label>
                  <textarea {...field('details')} value={additionalEventDetails} onChange={(e) => setAdditionalEventDetails(e.target.value)} maxLength={1200} rows={inline ? 2 : 4} placeholder="Tell us anything else about your event." className={textareaClass} />
                  {error('details')}
                </div>
              </>
            ) : (
              <div className={finalFieldSpacing}>
                <label htmlFor={fieldId('message')} className={labelClass}>{labelText('Tell us more')}</label>
                <textarea
                  {...field('message')}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={1200}
                  rows={4}
                  required
                  placeholder="How can we help?"
                  className={textareaClass}
                />
                {error('message')}
              </div>
            )}

            {validationMessage && (
              <p className="text-[13px] text-red-700 mb-4 italic" role="alert">
                {validationMessage}
              </p>
            )}
            {status === 'error' && (
              <p className="text-[13px] text-red-400 mb-4 italic" role="alert">
                {isMobileViewport ? MOBILE_FORM_FAILURE : 'Something went wrong. Please try again or email us directly.'}
              </p>
            )}

            <div className="flex items-center gap-4 flex-wrap">
              <button
                type="submit"
                aria-disabled={isMobileViewport && (status === 'sending' || status === 'success') || undefined}
                aria-busy={status === 'sending'}
                disabled={!isMobileViewport && (
                  status === 'sending' || (
                    !name.trim() ||
                    !email.trim() ||
                    (type === 'wholesale'
                      ? !businessName.trim() || !phone.trim() || !businessType || productsOfInterest.length === 0 || !estimatedOrderVolume.trim()
                      : type === 'event'
                      ? !eventDate.trim() || !eventTime.trim() || !numberOfServings.trim() || !desiredOrderQuantities.trim()
                      : !message.trim())
                  )
                )}
                className={`interaction-primary relative bg-[var(--cocoa)] text-[var(--cream)] py-[11px] px-[26px] rounded-full text-[14px] font-semibold tracking-[0.5px] mech-btn hover:bg-[var(--berry)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--gold)] ${type === 'event' && inline ? 'max-[639px]:w-full max-[639px]:h-[52px] max-[639px]:py-0 max-[639px]:bg-[var(--berry)] max-[639px]:text-[var(--cream-hi)]' : ''}`}
              >
                <span aria-hidden={status === 'sending' || undefined} role={isMobileViewport && status === 'success' ? 'status' : undefined} className={`transition-opacity duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] ${status === 'sending' ? 'opacity-0' : 'opacity-100'}`}>{isMobileViewport && status === 'success' ? `✓ ${MOBILE_FORM_SUCCESS}` : isMobileViewport ? sentenceCase(submitButtonLabel) : submitButtonLabel}</span>
                {status === 'sending' && <span role="status" aria-label="Sending" className="interaction-spinner absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />}
              </button>
              {!inline && (
                <button
                  type="button"
                  onClick={reset}
                  className={cancelClass}
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  Cancel
                </button>
              )}
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
