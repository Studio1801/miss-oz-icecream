import Guestbook from '../components/Guestbook';
import InquireForm from '../components/InquireForm';

export default function Contact() {
  return (
    <>
      <section
        aria-labelledby="contact-inquiry-title"
        className="bg-[var(--cream-hi)] px-[var(--edge)] py-[52px] md:px-[6vw] md:py-[88px]"
      >
        <div className="mx-auto max-w-[760px]">
          <h1
            id="contact-inquiry-title"
            className="text-center text-[clamp(34px,5vw,56px)] leading-tight text-[var(--berry-deep)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Contact
          </h1>
          <div className="mt-7 rounded-[16px] border border-[rgba(115,32,62,0.16)] bg-white/70 p-[clamp(20px,4vw,40px)] shadow-[0_14px_34px_rgba(57,22,34,0.08)]">
            <InquireForm type="general" inline sentenceCaseLabels />
          </div>
        </div>
      </section>
      <Guestbook />
    </>
  );
}