// AppServer/routers/webhook.routers.js
import express from 'express'
import { jsonWithRaw } from '../middleware/raw.js'
import { WebhookController } from '../controllers/webhookController.js'

const router = express.Router()

// Receive webhook from Auth Server
router.post('/receive', jsonWithRaw, (req, res) =>
  WebhookController.receiveWebhook(req, res)
)

export default router
