// import rabbitmq from "../rabbitmq/rabbit.client.js";

export class SocketIOService {
  constructor(chatService) {
    this.chatService = chatService
  }
  /**
   * Generates a consistent chat_id and ensures the chat room exists in the database
   */
  async setupChatRoom({ producer, consumer }) {
    // Crea un chat_id consistente con los ids de usuario para que no importe cuál sea el usuario
    const chat_id = [producer, consumer].sort().join('');
    return chat_id;
  }

  /**
   * Processes and persists a chat message
   */
  async processMessage(data) {
    const payload = {
      content: data.content,
      files_urls: data.files_url,
      chat_id: data.chat_id,
      sender_id: data.sender_id,
      sender_name: data.sender_name,
      receiver_id: data.receiver_id,
      created_at: data.created_at
    };

    await this.chatService.persistMessage(payload);
    if (files_urls) {
      
    }
    // rabbitmq.enqueue('chat_persistence_queue', JSON.stringify(payload));

    return payload;
  }
}
