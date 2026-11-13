/**
 * POST /api/inquire: cake orders, wholesale, events and general messages.
 *
 * Every submission is also saved to the Google Sheet by the website before it
 * calls this, so this function's only job is email: a notification to Millie,
 * and for cake orders and wholesale applications a copy to the customer.
 * Mirrors artifacts/api-server/src/routes/inquire.ts (the local dev server).
 */
import { buildEmail, sendEmail, readBody, hasResend, TO_EMAIL, type FieldRow, type Req, type Res } from "./_lib/mail";

const WHOLESALE_TO_EMAIL = "behappy@missozicecream.com";

type InquiryType = "wholesale" | "event" | "general";

const SUBJECT_MAP: Record<InquiryType, string> = {
  wholesale: "🥛 New Wholesale Inquiry, Miss Oz Website",
  event: "🎉 New Parties & Weddings Inquiry, Miss Oz Website",
  general: "New Inquiry, Miss Oz Website",
};

const str = (v: unknown, max: number): string | undefined =>
  typeof v === "string" && v.trim() ? v.trim().slice(0, max) : undefined;

export default async function handler(req: Req, res: Res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const b = readBody(req);
  const type = (["wholesale", "event", "general"] as const).includes(b.type as InquiryType)
    ? (b.type as InquiryType)
    : "general";
  const isWholesale = type === "wholesale";
  // The whole-cake form posts as a general message, flagged so it gets its
  // own subject line and a confirmation to the customer.
  const isCakeOrder = type === "general" && b.orderType === "cake";

  const name = str(b.name, 80);
  const email = str(b.email, 120);
  const message = str(b.message, 1200);
  if (!name) return void res.status(400).json({ error: "Name is required" });
  if (!email || !email.includes("@")) return void res.status(400).json({ error: "Valid email is required" });
  if (!message) return void res.status(400).json({ error: "Message is required" });

  const phone = str(b.phone, 30);
  const products = Array.isArray(b.productsOfInterest)
    ? b.productsOfInterest.filter((p): p is string => typeof p === "string" && Boolean(p.trim())).slice(0, 5).map((p) => p.trim().slice(0, 80))
    : [];
  const p = {
    businessName: str(b.businessName, 120),
    contactPerson: str(b.contactPerson, 80),
    businessType: str(b.businessType, 60),
    estimatedOrderVolume: str(b.estimatedOrderVolume, 160),
    additionalInformation: str(b.additionalInformation, 1200),
    eventDate: str(b.eventDate, 40),
    eventTime: str(b.eventTime, 40),
    numberOfServings: str(b.numberOfServings, 40),
    desiredOrderQuantities: str(b.desiredOrderQuantities, 600),
    additionalEventDetails: str(b.additionalEventDetails, 1200),
  };

  if (isWholesale) {
    if (!p.businessName) return void res.status(400).json({ error: "Business name is required" });
    if (!p.contactPerson) return void res.status(400).json({ error: "Contact person is required" });
    if (!phone) return void res.status(400).json({ error: "Phone number is required" });
    if (!p.businessType) return void res.status(400).json({ error: "Business type is required" });
    if (products.length === 0) return void res.status(400).json({ error: "At least one product of interest is required" });
    if (!p.estimatedOrderVolume) return void res.status(400).json({ error: "Estimated order volume is required" });
  }
  if (type === "event") {
    if (!p.eventDate) return void res.status(400).json({ error: "Event date is required" });
    if (!p.eventTime) return void res.status(400).json({ error: "Event time is required" });
    if (!p.numberOfServings) return void res.status(400).json({ error: "Number of servings is required" });
    if (!p.desiredOrderQuantities) return void res.status(400).json({ error: "Desired order quantities are required" });
  }

  console.log(`Inquiry received: ${isCakeOrder ? "cake order" : type}`);

  if (!hasResend()) {
    res.json({ ok: true, note: "Email not sent (RESEND_API_KEY not configured)" });
    return;
  }

  const rows: FieldRow[] = isWholesale
    ? [
        { label: "Business Name", value: p.businessName ?? "" },
        { label: "Contact Person", value: p.contactPerson ?? name },
        { label: "Email Address", value: email, isEmail: true },
        { label: "Phone Number", value: phone ?? "" },
        { label: "Business Type", value: p.businessType ?? "" },
        { label: "Products of Interest", value: products.join(", "), multiline: true },
        { label: "Estimated Order Volume", value: p.estimatedOrderVolume ?? "" },
        { label: "Additional Information", value: p.additionalInformation ?? "None provided", multiline: true },
      ]
    : type === "event"
    ? [
        { label: "Name", value: name },
        { label: "Email", value: email, isEmail: true },
        ...(phone ? [{ label: "Phone", value: phone }] : []),
        { label: "Event Date", value: p.eventDate ?? "" },
        { label: "Event Time", value: p.eventTime ?? "" },
        { label: "Number of Servings", value: p.numberOfServings ?? "" },
        { label: "Desired Order Quantities", value: p.desiredOrderQuantities ?? "", multiline: true },
        { label: "Additional Event Details", value: p.additionalEventDetails ?? "None provided", multiline: true },
      ]
    : [
        { label: "Name", value: name },
        { label: "Email", value: email, isEmail: true },
        ...(phone ? [{ label: "Phone", value: phone }] : []),
        { label: isCakeOrder ? "Order" : "Message", value: message, multiline: true },
      ];

  const notification = await sendEmail({
    to: isWholesale ? WHOLESALE_TO_EMAIL : TO_EMAIL,
    replyTo: email,
    subject: isCakeOrder ? `🎂 New Cake Order from ${name}, Miss Oz Website` : SUBJECT_MAP[type],
    html: buildEmail({ purpose: isCakeOrder ? "order" : type, rows }),
  });
  if (notification.error) {
    console.error(`Notification email failed: ${notification.error}`);
    res.status(502).json({ error: "Email service rejected the message" });
    return;
  }

  // The customer's copy. Millie has her email by now, so a problem here is
  // logged but never reported as a failed order.
  if (isWholesale || isCakeOrder) {
    const confirmation = await sendEmail({
      to: email,
      replyTo: isWholesale ? WHOLESALE_TO_EMAIL : TO_EMAIL,
      subject: isWholesale
        ? "Thank you for your wholesale inquiry, Miss Oz Ice Cream Cafe"
        : "We got your cake order, Miss Oz Ice Cream Cafe",
      html: isWholesale
        ? buildEmail({
            purpose: "wholesaleConfirmation",
            replyHint: false,
            rows: [{
              label: "Message",
              value: "Thank you for your interest in becoming a wholesale partner with Miss Oz Ice Cream Cafe!\n\nWe've received your inquiry and will review it carefully. We'll contact you within 1 to 2 business days to discuss pricing, product availability, and the next steps.",
              multiline: true,
            }],
          })
        : buildEmail({
            purpose: "orderConfirmation",
            replyHint: false,
            rows: [
              {
                label: "Message",
                value: `Hi ${name}, thank you for your order!\n\nWe've received it and will be in touch to confirm the details and your pickup. If anything changes in the meantime, just reply to this email.`,
                multiline: true,
              },
              { label: "Your order", value: message, multiline: true },
            ],
          }),
    });
    if (confirmation.error) console.error(`Customer confirmation failed: ${confirmation.error}`);
  }

  console.log(`Inquiry emails sent (${notification.id})`);
  res.json({ ok: true });
}
