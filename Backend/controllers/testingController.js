// AppServer/controllers/testingController.js
import { mongochatUser } from '../DB/schema/chatUser.js'

export class TestingController {
  /**
   * List all test users
   * GET /api/test/users
   */
  static async listTestUsers(req, res) {
    try {
      const isLocalhost = req.ip === '127.0.0.1' || req.ip === '::1'
      const hasAdminKey = req.headers['x-admin-key'] === process.env.ADMIN_KEY

      if (!isLocalhost && !hasAdminKey) {
        return res.status(403).json({
          ok: false,
          message: 'Forbidden',
        })
      }

      const testUsers = await mongochatUser.find({ isTestUser: true }).lean()

      const users = testUsers.map((user) => ({
        userId: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        bio: user.bio,
        chatsCount: 0, // TODO: Calculate from chats
        isOnline: false, // TODO: Get from socket tracking
        lastSeen: user.updatedAt,
      }))

      res.json({
        ok: true,
        users,
        totalTestUsers: users.length,
      })
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: error.message,
      })
    }
  }

  /**
   * Get app server stats
   * GET /api/test/stats
   */
  static async getAppStats(req, res) {
    try {
      const isLocalhost = req.ip === '127.0.0.1' || req.ip === '::1'
      const hasAdminKey = req.headers['x-admin-key'] === process.env.ADMIN_KEY

      if (!isLocalhost && !hasAdminKey) {
        return res.status(403).json({
          ok: false,
          message: 'Forbidden',
        })
      }

      const totalTestUsers = await mongochatUser.countDocuments({ isTestUser: true })
      const totalUsers = await mongochatUser.countDocuments()

      res.json({
        ok: true,
        totalTestUsers,
        totalUsers,
        realUsers: totalUsers - totalTestUsers,
        onlineNow: 0, // TODO: Get from socket tracking
        offlineNow: totalTestUsers,
        averageChatsPerUser: 0, // TODO: Calculate
        totalTestMessages: 0, // TODO: Calculate
      })
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: error.message,
      })
    }
  }

  /**
   * Delete test user
   * DELETE /api/test/user/:userId
   */
  static async deleteTestUser(req, res) {
    try {
      const isLocalhost = req.ip === '127.0.0.1' || req.ip === '::1'
      const hasAdminKey = req.headers['x-admin-key'] === process.env.ADMIN_KEY

      if (!isLocalhost && !hasAdminKey) {
        return res.status(403).json({
          ok: false,
          message: 'Forbidden',
        })
      }

      const { userId } = req.params

      const user = await mongochatUser.findById(userId)

      if (!user) {
        return res.status(404).json({
          ok: false,
          message: 'User not found',
        })
      }

      if (!user.isTestUser) {
        return res.status(400).json({
          ok: false,
          message: 'Cannot delete non-test user',
        })
      }

      await mongochatUser.deleteOne({ _id: userId })

      res.json({
        ok: true,
        message: 'Test user deleted',
        deletedUserId: userId,
      })
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: error.message,
      })
    }
  }
}

export default TestingController
