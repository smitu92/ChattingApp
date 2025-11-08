// AppServer/controllers/webhookController.js
import crypto from 'crypto'
import { mongochatUser } from '../DB/schema/chatUser.js'
import { isProcessed, markProcessed } from '../utils/dedupStore.js' // ✅ Correct

export class WebhookController {
  /**
   * Receive webhook from Auth Server
   * POST /api/webhooks/receive
   */
  static async receiveWebhook(req, res) {
    try {
      const signature = req.headers['x-webhook-signature']
      const timestamp = req.headers['x-webhook-timestamp']
      const webhookId = req.headers['x-webhook-id']
      const body = req.rawBody // From rawBodyParser middleware

      // 1. Validate headers
      if (!signature || !timestamp || !webhookId) {
        console.warn('❌ [Webhook] Missing required headers')
        return res.status(400).json({
          ok: false,
          message: 'Missing webhook headers',
        })
      }

      // 2. Check for duplicate
      const alreadyProcessed = await isProcessed(webhookId)
      if (alreadyProcessed) {
        console.log(`⚠️ [Webhook] Duplicate webhook ${webhookId}, ignoring`)
        return res.json({
          ok: true,
          message: 'Webhook already processed',
          webhookId,
        })
      }

      // 3. Verify signature
      const payload = `${timestamp}.${body}`
      const expectedSignature = crypto
        .createHmac('sha256', process.env.WEBHOOK_SECRET)
        .update(payload)
        .digest('hex')

      const receivedSignature = signature.replace(/^sha256=/, '')

      if (receivedSignature !== expectedSignature) {
        console.error(`❌ [Webhook] Invalid signature for ${webhookId}`)
        return res.status(401).json({
          ok: false,
          message: 'Invalid signature',
        })
      }

      // 4. Parse and process webhook
      const data = JSON.parse(body)
      console.log(`✅ [Webhook] Received: ${data.event}`)

      if (data.event === 'user.verified') {
        const userData = data.data

        // Check if user already exists
        const existingUser = await mongochatUser.findById(userData.id)

        if (existingUser) {
          console.log(`⚠️ [Webhook] User ${userData.username} already exists, updating...`)
          
          // Update existing user
          await mongochatUser.findByIdAndUpdate(userData.id, {
            username: userData.username,
            email: userData.email,
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            avatar: userData.avatar || null,
            bio: userData.bio || '',
            isTestUser: userData.isTestUser || false,
            updatedAt: new Date(),
          })
        } else {
          // Create new user
          await mongochatUser.create({
            _id: userData.id,
            username: userData.username,
            email: userData.email,
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            avatar: userData.avatar || null,
            bio: userData.bio || '',
            isTestUser: userData.isTestUser || false,
            contacts: [],
          })

          console.log(`✅ [Webhook] User ${userData.username} created in chat app`)
        }

        // Mark as processed
        await markProcessed(webhookId)
      }

      res.json({
        ok: true,
        message: 'Webhook processed',
        webhookId,
      })
    } catch (error) {
      console.error(`❌ [Webhook] Error:`, error)
      res.status(500).json({
        ok: false,
        message: 'Webhook processing failed',
        error: error.message,
      })
    }
  }
}

export default WebhookController
