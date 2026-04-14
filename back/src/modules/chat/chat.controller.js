// import redis from "../redis/redis.client.js"
export class ChatController {
  constructor(service, userService) {
    this.service = service
    this.users = userService
  }

  getChatHistory = async (req, res) => {
    const { chat_id, producer, consumer } = req.body
    try {
      const checkProducer = await this.users.getUser(producer)
      const checkConsumer = await this.users.getUser(consumer)
      if (!checkConsumer || !checkProducer) return res.status(401).json({ success: false, message: 'User does not exist' })
      const chat_history = await this.service.getChatHistory({ chat_id: chat_id, producer: producer, consumer: consumer })
      return res.status(200).json({ success: true, data: chat_history })
    } catch (error) {
      return res.status(400).json({ succes: false, message: error.message })
    }
  }

  getOnlineUsers = async (req, res) => {
    const { user_id } = req.body
    try {
      // const onlineUsers = await redis.getOnlineUsers({ user_id: user_id })
      return res.status(200).json({ success: true, data: onlineUsers })
    } catch (error) {
      return res.status(400).json({ succes: false, message: error.message })
    }
  }
}