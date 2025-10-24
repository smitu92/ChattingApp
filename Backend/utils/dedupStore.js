// // dedupStore.js
// // Simple in-memory dedup with TTL and background sweep.
// // Later you can swap this with Redis/Mongo easily.

// const TTL_MS_DEFAULT = 7 * 24 * 60 * 60 * 1000; // 7 days
// const TTL_MS = Number(process.env.WEBHOOK_DEDUP_TTL_MS || TTL_MS_DEFAULT);

// const store = new Map(); // eventId -> { expiresAt: number }

// /** Check if eventId was processed and not expired */
// export async function isProcessed(eventId) {
//   const rec = store.get(eventId);
//   if (!rec) return false;
//   if (rec.expiresAt <= Date.now()) {
//     store.delete(eventId);
//     return false;
//   }
//   return true;
// }

// /** Mark eventId as processed with TTL */
// export async function markProcessed(eventId, ttlMs = TTL_MS) {
//   store.set(eventId, { expiresAt: Date.now() + ttlMs });
// }

// /** Optional: clear (useful for tests) */
// export async function _clearDedup() {
//   store.clear();
// }

// // Background GC (hourly, or less than TTL if TTL is smaller)
// setInterval(() => {
//   const now = Date.now();
//   for (const [k, v] of store) {
//     if (v.expiresAt <= now) store.delete(k);
//   }
// }, Math.min(TTL_MS, 60 * 60 * 1000)).unref();


// utils/dedupStore.js
import WebhookEvent from "../models/webhook_events.js";

/**
 * Check if webhook with given ID has already been processed.
 */
export async function isProcessed(eventId) {
  const exists = await WebhookEvent.findById(eventId).lean();
  return !!exists;
}

/**
 * Mark webhook as processed. Only insert if not already.
 */
export async function markProcessed(eventId) {
  try {
    await WebhookEvent.create({ _id: eventId });
    return true;
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key error, already exists
      return false;
    }
    throw err;
  }
}
