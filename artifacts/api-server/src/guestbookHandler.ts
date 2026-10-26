import express from "express";
import guestbookRouter from "./routes/guestbook";

// Serverless adapter: reuse the existing guestbook route and storage, without
// starting the standalone API server or importing unrelated API routes.
const handler = express();
handler.use(express.json());
handler.use("/api", guestbookRouter);

export default handler;
