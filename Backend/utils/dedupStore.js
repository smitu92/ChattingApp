// AppServer/utils/dedupStore.js
import WebhookEvent from '../DB/schema/webhookEventSchema.js' // ✅ Fixed path

/**
 * Check if webhook with given ID has already been processed
 */
export async function isProcessed(eventId) {
  try {
    const exists = await WebhookEvent.findById(eventId).lean()
    return !!exists
  } catch (error) {
    console.error(`[Dedup] Error checking webhook ${eventId}:`, error.message)
    return false // Fail open - allow processing if DB error
  }
}

/**
 * Mark webhook as processed. Only insert if not already.
 */
export async function markProcessed(eventId) {
  try {
    await WebhookEvent.create({ _id: eventId })
    console.log(`✅ [Dedup] Marked webhook ${eventId} as processed`)
    return true
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key error - already exists
      console.log(`⚠️ [Dedup] Webhook ${eventId} already processed`)
      return false
    }
    console.error(`[Dedup] Error marking webhook ${eventId}:`, err.message)
    throw err
  }
}
