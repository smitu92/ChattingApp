// controllers/authController.js
import axios from "axios";
import { signWebhookPayload } from "../utils/signWebhook.js";

export const registerUser = async (req, res) => {
  try {
    const { email, username, password, avatar } = req.body;
    const newUser = new User({ email, username, password, avatar });
    await newUser.save();

    // Prepare webhook payload
    const webhookPayload = {
      authUserId: newUser._id.toString(),
      username,
      avatar,
    };

    const timestamp = Date.now().toString();
    const signature = signWebhookPayload({
      secret: process.env.WEBHOOK_SECRET,
      body: webhookPayload,
      timestamp,
    });

    await axios.post("http://chat-server.com/webhook/user-created", webhookPayload, {
      headers: {
        "x-webhook-signature": signature,
        "x-webhook-timestamp": timestamp,
        "x-webhook-id": newUser._id.toString(), // optional: for dedup
      },
    });

    res.status(201).json({ message: "User registered & webhook sent" });
  } catch (err) {
    console.error("Registration error:", err.message);
    res.status(500).json({ error: "Registration failed" });
  }
};
