import { Router, type IRouter } from "express";
import { Resend } from "resend";
import { logger } from "../lib/logger";
import { resolveContactEmail } from "../lib/contactEmail";
import { buildEmail, type FieldRow } from "../lib/emailTemplates";

const router: IRouter = Router();

const TO_EMAIL = resolveContactEmail(process.env.CONTACT_EMAIL, "hello@missozicecream.com");
const WHOLESALE_TO_EMAIL = "bluecanvascorp@gmail.com";
const FROM_EMAIL = process.env.FROM_EMAIL ?? "Miss Oz Website <noreply@missozicecream.com>";

let resend: Resend | null = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
} else {
  logger.warn("RESEND_API_KEY not set — inquiry emails will be logged only");
}

type InquiryType = "wholesale" | "event" | "general";

const SUBJECT_MAP: Record<InquiryType, string> = {
  wholesale: "🥛 New Wholesale Inquiry — Miss Oz Website",
  event:     "🎉 New Parties & Weddings Inquiry — Miss Oz Website",
  general:   "New Inquiry — Miss Oz Website",
};

/* ── POST /api/inquire ────────────────────────────────────────────────────── */
router.post("/inquire", async (req, res) => {
  const {
    name,
    email,
    phone,
    type = "general",
    message,
    businessName,
    contactPerson,
    businessType,
    productsOfInterest,
    estimatedOrderVolume,
    additionalInformation,
    eventDate,
    eventTime,
    numberOfServings,
    desiredOrderQuantities,
    additionalEventDetails,
  } = req.body ?? {};

  if (typeof name !== "string" || !name.trim()) {
    res.status(400).json({ error: "Name is required" });
    return;
  }
  if (typeof email !== "string" || !email.includes("@")) {
    res.status(400).json({ error: "Valid email is required" });
    return;
  }
  if (typeof message !== "string" || !message.trim()) {
    res.status(400).json({ error: "Message is required" });
    return;
  }

  const inquiryType: InquiryType = ["wholesale", "event", "general"].includes(type)
    ? (type as InquiryType)
    : "general";
  const isWholesale = inquiryType === "wholesale";
  const productChoices = Array.isArray(productsOfInterest)
    ? productsOfInterest.filter((product): product is string => typeof product === "string" && Boolean(product.trim()))
    : [];

  if (isWholesale) {
    if (typeof businessName !== "string" || !businessName.trim()) {
      res.status(400).json({ error: "Business name is required" });
      return;
    }
    if (typeof contactPerson !== "string" || !contactPerson.trim()) {
      res.status(400).json({ error: "Contact person is required" });
      return;
    }
    if (typeof phone !== "string" || !phone.trim()) {
      res.status(400).json({ error: "Phone number is required" });
      return;
    }
    if (typeof businessType !== "string" || !businessType.trim()) {
      res.status(400).json({ error: "Business type is required" });
      return;
    }
    if (productChoices.length === 0) {
      res.status(400).json({ error: "At least one product of interest is required" });
      return;
    }
    if (typeof estimatedOrderVolume !== "string" || !estimatedOrderVolume.trim()) {
      res.status(400).json({ error: "Estimated order volume is required" });
      return;
    }
  }
  if (inquiryType === "event") {
    if (typeof eventDate !== "string" || !eventDate.trim()) {
      res.status(400).json({ error: "Event date is required" });
      return;
    }
    if (typeof eventTime !== "string" || !eventTime.trim()) {
      res.status(400).json({ error: "Event time is required" });
      return;
    }
    if (typeof numberOfServings !== "string" || !numberOfServings.trim()) {
      res.status(400).json({ error: "Number of servings is required" });
      return;
    }
    if (typeof desiredOrderQuantities !== "string" || !desiredOrderQuantities.trim()) {
      res.status(400).json({ error: "Desired order quantities are required" });
      return;
    }
  }

  const payload = {
    name: name.trim().slice(0, 80),
    email: email.trim().slice(0, 120),
    phone: typeof phone === "string" ? phone.trim().slice(0, 30) : undefined,
    type: inquiryType,
    message: message.trim().slice(0, 1200),
    businessName: typeof businessName === "string" ? businessName.trim().slice(0, 120) : undefined,
    contactPerson: typeof contactPerson === "string" ? contactPerson.trim().slice(0, 80) : undefined,
    businessType: typeof businessType === "string" ? businessType.trim().slice(0, 60) : undefined,
    productsOfInterest: productChoices.slice(0, 5).map((product) => product.trim().slice(0, 80)),
    estimatedOrderVolume: typeof estimatedOrderVolume === "string" ? estimatedOrderVolume.trim().slice(0, 160) : undefined,
    additionalInformation: typeof additionalInformation === "string" ? additionalInformation.trim().slice(0, 1200) : undefined,
    eventDate: typeof eventDate === "string" ? eventDate.trim().slice(0, 40) : undefined,
    eventTime: typeof eventTime === "string" ? eventTime.trim().slice(0, 40) : undefined,
    numberOfServings: typeof numberOfServings === "string" ? numberOfServings.trim().slice(0, 40) : undefined,
    desiredOrderQuantities: typeof desiredOrderQuantities === "string" ? desiredOrderQuantities.trim().slice(0, 600) : undefined,
    additionalEventDetails: typeof additionalEventDetails === "string" ? additionalEventDetails.trim().slice(0, 1200) : undefined,
  };

  logger.info({ inquiry: { ...payload, email: "[redacted]" } }, "Inquiry received");

  if (!resend) {
    // No API key — log and acknowledge (useful in local dev without Resend)
    res.json({ ok: true, note: "Email not sent (RESEND_API_KEY not configured)" });
    return;
  }

  const rows: FieldRow[] = isWholesale
    ? [
        { label: "Business Name", value: payload.businessName ?? "" },
        { label: "Contact Person", value: payload.contactPerson ?? payload.name },
        { label: "Email Address", value: payload.email, isEmail: true },
        { label: "Phone Number", value: payload.phone ?? "" },
        { label: "Business Type", value: payload.businessType ?? "" },
        { label: "Products of Interest", value: payload.productsOfInterest.join(", "), multiline: true },
        { label: "Estimated Order Volume", value: payload.estimatedOrderVolume ?? "" },
        { label: "Additional Information", value: payload.additionalInformation || "None provided", multiline: true },
      ]
    : inquiryType === "event"
    ? [
        { label: "Name", value: payload.name },
        { label: "Email", value: payload.email, isEmail: true },
        ...(payload.phone ? [{ label: "Phone", value: payload.phone }] : []),
        { label: "Event Date", value: payload.eventDate ?? "" },
        { label: "Event Time", value: payload.eventTime ?? "" },
        { label: "Number of Servings", value: payload.numberOfServings ?? "" },
        { label: "Desired Order Quantities", value: payload.desiredOrderQuantities ?? "", multiline: true },
        { label: "Additional Event Details", value: payload.additionalEventDetails || "None provided", multiline: true },
      ]
    : [
        { label: "Name", value: payload.name },
        { label: "Email", value: payload.email, isEmail: true },
        ...(payload.phone ? [{ label: "Phone", value: payload.phone }] : []),
        { label: "Message", value: payload.message, multiline: true },
      ];

  try {
    const notification = await resend.emails.send({
      from: FROM_EMAIL,
      to: [isWholesale ? WHOLESALE_TO_EMAIL : TO_EMAIL],
      replyTo: payload.email,
      subject: SUBJECT_MAP[inquiryType],
      html: buildEmail({ purpose: inquiryType, rows }),
    });

    if (notification.error) {
      logger.error({ resendError: notification.error }, "Resend rejected the email");
      res.status(502).json({ error: "Email service rejected the message" });
      return;
    }

    let confirmationId: string | undefined;
    if (isWholesale) {
      const confirmation = await resend.emails.send({
        from: FROM_EMAIL,
        to: [payload.email],
        subject: "Thank you for your wholesale inquiry — Miss Oz Ice Cream Cafe",
        html: buildEmail({
          purpose: "wholesaleConfirmation",
          replyHint: false,
          rows: [
            {
              label: "Message",
              value:
                "Thank you for your interest in becoming a wholesale partner with Miss Oz Ice Cream Cafe!\n\nWe've received your inquiry and will review it carefully. We'll contact you within 1–2 business days to discuss pricing, product availability, and the next steps.",
              multiline: true,
            },
          ],
        }),
      });

      if (confirmation.error) {
        logger.error({ resendError: confirmation.error }, "Resend rejected the customer confirmation");
        res.status(502).json({ error: "Customer confirmation email could not be sent" });
        return;
      }
      confirmationId = confirmation.data?.id;
    }

    logger.info({ emailId: notification.data?.id, confirmationId }, "Inquiry emails sent");
    res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, "Failed to send inquiry email");
    res.status(500).json({ error: "Could not send inquiry" });
  }
});

export default router;
