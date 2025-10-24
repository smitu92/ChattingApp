import mongoose from "mongoose";

const WebhookEventSchema=new mongoose.Schema({
    _id: {
      type: String, // store X-Webhook-ID as _id
      required: true,
    },
    receivedAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 60 * 24 * 7, // TTL: 7 days (auto delete)
    },
  },
  { versionKey: false })

// // models/WebhookAudit.js
// const webhookAuditSchema = new mongoose.Schema({
//   event: { type: String }, // optional
//   headers: { type: Object },
//   body: { type: Object },
//   createdAt: { type: Date, default: Date.now },
// });
export default mongoose.model("WebhookEvent", WebhookEventSchema);