import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = {};
  }

  emitSocketEvent(direction, event, payload) {
    this.emit('socket_event', {
      direction,
      event,
      payload,
      timestamp: new Date().toISOString()
    });
  }

  connect(token) {
    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
      withCredentials: true
    });

    this.socket.on('connect', () => {
      console.log('[SOCKET] Conectado');
      this.emit('socket_connected');
      this.emitSocketEvent('in', 'socket_connected');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[SOCKET] Desconectado:', reason);
      this.emit('socket_disconnected', reason);
      this.emitSocketEvent('in', 'socket_disconnected', { reason });
    });

    this.socket.on('connect_error', (error) => {
      console.error('[SOCKET] Error de conexion:', error.message);
      this.emit('socket_error', error.message);
      this.emitSocketEvent('in', 'socket_error', { message: error.message });
    });

    this.socket.on('chat_message', (payload) => {
      this.emit('chat_message', payload);
      this.emitSocketEvent('in', 'chat_message', payload);
    });

    this.socket.on('user_online', (payload) => {
      this.emit('user_online', payload);
      this.emitSocketEvent('in', 'user_online', payload);
    });

    this.socket.on('user_offline', (payload) => {
      this.emit('user_offline', payload);
      this.emitSocketEvent('in', 'user_offline', payload);
    });

    this.socket.onAny((event, payload) => {
      if (event === 'chat_message' || event === 'user_online' || event === 'user_offline') {
        return;
      }
      this.emitSocketEvent('in', event, payload);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinRoom(currentUserId, targetUserId) {
    if (!this.socket) return;
    const payload = { producer: currentUserId, consumer: targetUserId };
    this.socket.emit('join_room', payload);
    this.emitSocketEvent('out', 'join_room', payload);
  }

  sendMessage(content, chat_id, sender_id, senderName, receiver_id, attachments = []) {
    if (!this.socket) return;
    const payload = {
      content,
      chat_id: chat_id,
      sender_id: sender_id,
      sender_name: senderName,
      receiver_id: receiver_id,
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    if (attachments && attachments.length > 0) {
      payload.attachments = attachments;
    }

    this.socket.emit('chat_message', payload);
    this.emitSocketEvent('out', 'chat_message', payload);
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event, callback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  emit(event, data) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(cb => cb(data));
  }
}

export const socketService = new SocketService();
