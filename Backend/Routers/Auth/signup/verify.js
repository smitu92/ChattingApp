// verify.js
import crypto from "crypto";

export function verifyWebhook(req, secret) {
  const ts = req.header("X-Webhook-Timestamp");
  const sig = req.header("X-Webhook-Signature") || "";
  const expected = "sha256=" + crypto
    .createHmac("sha256", secret)
    .update(`${ts}.${req.rawBody}`)
    .digest("hex");

  const withinWindow = Math.abs(Date.now() - Number(ts)) <= 5 * 60 * 1000;
  const ok = crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));

  if (!withinWindow) throw new Error("stale timestamp");
  if (!ok) throw new Error("bad signature");
}
