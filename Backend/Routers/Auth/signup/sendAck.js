// sendAck.js (Chat → Auth)
import fetch from "node-fetch";
import { signWebhook } from "../auth/utils/sign.js"; // same algo

export async function sendAck(callbackUrl, eventId, status) {
  const body = JSON.stringify({
    for_event_id: eventId,
    status,
    finished_at: new Date().toISOString(),
    details: {}
  });
  const ts = Date.now().toString();
  const sig = signWebhook({ rawBody: body, timestamp: ts, secret: process.env.WEBHOOK_SECRET });

  await fetch(callbackUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Callback-For": "user.created",
      "X-Webhook-ID": eventId,
      "X-Webhook-Timestamp": ts,
      "X-Webhook-Signature": sig
    },
    body
  });
}
