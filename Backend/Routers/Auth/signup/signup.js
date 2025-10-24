// server.js (Chat)
import express from "express";
import { jsonWithRaw } from "../../../middleware/raw.js";
import { verifyWebhook } from "./verify.js";

const router=express.Router();

router.post("/webhooks/user", jsonWithRaw, async (req, res) => {
  try {
    verifyWebhook(req, process.env.WEBHOOK_SECRET);

    const eventId = req.header("X-Webhook-ID");
    const already = await isProcessed(eventId); // check dedup store
    if (already) return res.sendStatus(200);

    // Respond fast to avoid retries
    res.sendStatus(202);

    // Async provision (don’t block response)
    provisionUser(req.body.data)
      .then(() => sendAck(req.body.callback_url, eventId, "success"))
      .catch(() => sendAck(req.body.callback_url, eventId, "failed"));

    await markProcessed(eventId);
  } catch (e) {
    // 4xx for bad sig; 5xx for transient errors (will trigger retries)
    if (e.message.includes("bad") || e.message.includes("stale")) {
      return res.status(400).send("invalid signature");
    }
    return res.status(500).send("retry later");
  }
});

export default router;