import express from "express";
import subscribeRouter from "./routes/subscribe.js";

// Serverless adapter, the same pattern as guestbookHandler: Vercel runs this
// on its own, without starting the standalone API server. Until this existed,
// the website's /api/subscribe requests had nowhere to go on the live site, so no
// email was ever sent.
const handler = express();
handler.use(express.json());
handler.use("/api", subscribeRouter);

export default handler;
