// AppServer/routers/testing.routers.js
import express from 'express'
import { TestingController } from '../controllers/testingController.js'

const router = express.Router()

// List test users
router.get('/users', (req, res) => TestingController.listTestUsers(req, res))

// Get app stats
router.get('/stats', (req, res) => TestingController.getAppStats(req, res))

// Delete test user
router.delete('/user/:userId', (req, res) => TestingController.deleteTestUser(req, res))

export default router
