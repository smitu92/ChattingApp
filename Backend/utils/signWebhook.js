// utils/signWebhook.js
import crypto from "crypto";

export function signWebhookPayload({ secret, body, timestamp }) {
  const payload = `${timestamp}.${JSON.stringify(body)}`;
  const hmac = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return hmac;
}