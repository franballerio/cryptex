export class ChatService {
  constructor(repository) {
    this.repository = repository
  }

  async createChat({ chat_id, producer, consumer }) {
    try {
      const existentChat = await this.repository.getChat(chat_id);
      if (existentChat.length !== 0) return chat_id

      await this.repository.insertParticipants(chat_id, producer, consumer);
      return chat_id
    } catch (error) {
      console.error('[Service] Error creating chat:', error.message);
      throw error;
    }
  }

  async persistMessage({ content, chat_id, sender_id, sender_name, receiver_id, created_at }) {
    try {
      await this.repository.insertMessage({
        content,
        chat_id,
        sender_id,
        sender_name,
        receiver_id,
        created_at
      });

      return {
        content,
        chat_id,
        sender_id,
        sender_name,
        receiver_id,
        created_at
      };
    } catch (e) {
      console.error('[Service] Error persisting group message:', e.message);
      throw e;
    }
  }

  async findChat({ chat_id }) {
    try {
      return await this.repository.getChat(chat_id);
    } catch (e) {
      console.error('[Service] Error fetching chat:', e.message);
      throw e;
    }
  }

  async checkUserInChat({ user_id, chat_id }) {
    try {
      return await this.repository.findUserInChat(user_id, chat_id);
    } catch (e) {
      console.error('[Service] Error checking user in chat:', e.message);
      throw e;
    }
  }

  async getChatHistory({ chat_id, producer, consumer }) {
    try {
      const chat = await this.createChat({ chat_id: chat_id, producer: producer, consumer: consumer })
      return await this.repository.getChatMessages(chat_id);
    } catch (e) {
      console.error('[Chat Service] Error fetching chat history:', e.message);
      throw e;
    }
  }
}
