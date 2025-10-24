// routes/webhook.js
import express from "express";
import { verifyWebhook } from "../../../utils/verifyWebhook.js";
import { mongochatUser } from "../../../DB/schema/chatUser.js";

const router = express.Router();

router.post("/user-created", async (req, res) => {
  try {
    const signature = req.headers["x-webhook-signature"];
    const timestamp = req.headers["x-webhook-timestamp"];
    const webhookId = req.headers["x-webhook-id"];

    if (!signature || !timestamp) {
      return res.status(400).json({ error: "Missing headers" });
    }
    console.log("hellow i am user-created ?");
    console.log(req.body);
    // Security: check timestamp freshness (e.g., 5 min)
    const now = Date.now();
    if (Math.abs(now - parseInt(timestamp)) > 5 * 60 * 1000) {
      return res.status(408).json({ error: "Request too old" });
    }

    const isValid = verifyWebhook({
      secret: process.env.WEBHOOK_SECRET,
      body: req.body,
      timestamp,
      signature,
    });

    if (!isValid) {
      return res.status(401).json({ error: "Invalid signature" });
    }

    // ✅ Validated — proceed with user creation
    const { authUserId, username, avatar ,_id} = req.body;
    const existing = await mongochatUser.findOne({_id });

    if (existing) {
      return res.status(200).json({ message: "User already exists" });
    }

    await mongochatUser.create({ 
        username,
        _id
    });
    res.status(201).json({ message: "User created in chat DB" });
  } catch (err) {
    console.error("Webhook error:", err.message);
    res.status(500).json({ error: "Internal error" });
  }
});

export default router;
