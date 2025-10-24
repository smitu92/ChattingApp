// utils/verifyWebhook.js
import crypto from "crypto";
import dotenv from 'dotenv';
dotenv.config();
export function verifyWebhook({ secret, body, timestamp, signature }) {
    console.log(secret);
    console.log("this is body:",body);
  const payload = `${timestamp}.${JSON.stringify(body)}`;
    const receivedSig = signature.replace(/^sha256=/, "");
    console.log(receivedSig);
  const expectedSig = crypto.createHmac("sha256",secret).update(payload).digest("hex");
  console.log(expectedSig);
  return crypto.timingSafeEqual(Buffer.from(receivedSig), Buffer.from(expectedSig));
}
