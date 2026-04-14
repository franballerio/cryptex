export class SocketIOController {
  constructor(service) {
    this.service = service
  }
  /**
   * Crea una sala de chat entre dos usuarios con un chat_id consistente
   * @param {Object} payload - Objeto con socket, io, producer, consumer
   * @returns {string} El chat_id creado
   */
  async joinRoom({ socket, io, producer, consumer }) {
    try {
      const chat_id = await this.service.setupChatRoom({ producer, consumer });
      socket.join(chat_id);
      console.log(`${socket.user_name} joined room ${chat_id}`);
      return chat_id;
    } catch (error) {
      console.error('[SOCKET] Error joining room:', error);
      socket.emit('error', { message: 'Failed to join room' });
    }
  }

  /**
   * Envía un mensaje por socket
   * @param {Object} payload - Objeto con socket, io, content, group_id, chat_id, sender_id, sender_name, created_at
   */
  async sendMessage({ socket, io, content, files_urls, chat_id, sender_id, sender_name, receiver_id, created_at }) {
    // TODO: receive only args socket and payload, persist msg and send payload (delete new vriable payload)
    try {
      // console.log('Received message:', { content, chat_id, sender_id, sender_name, receiver_id });
      const payload = await this.service.processMessage({
        content, files_urls, chat_id, sender_id, sender_name, receiver_id, created_at
      });

      socket.to(chat_id).emit('chat_message', payload);
    } catch (error) {
      console.error('[SOCKET] Error handling message:', error.message);
      socket.emit('error', { message: 'Failed to send message' });
    }
  }
}
