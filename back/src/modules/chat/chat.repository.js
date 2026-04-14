import { pool } from '../../core/database/db.conn.js';

export class ChatRepository {

  /*                SELECT               */

  async getChat(chat_id) {
    try {
      const { rows } = await pool.query('SELECT _id FROM chats WHERE _id = $1', [chat_id]);
      // if (!rows.success) throw (new Error('[DB] Error fetching chat'))
      return rows;
    } catch (e) {
      console.error('[DB] Error fetching chat:', e);
      throw e;
    }
  }

  async getUserInChat(user_id, chat_id) {
    try {
      const { rows } = await pool.query(
        'SELECT chat_id FROM chat_participants WHERE chat_id = $1 AND user_id = $2',
        [chat_id, user_id]
      );
      return rows[0];
    } catch (e) {
      console.error('[DB] Error checking user in chat:', e);
      throw e;
    }
  }

  async getChatMessages(chat_id) {
    try {
      const query = `
        SELECT 
          sender_id, 
          text as content, 
          created_at
        FROM 
          messages
        WHERE 
          chat_id = $1
        ORDER BY
          created_at ASC
      `;
      const { rows } = await pool.query(query, [chat_id]);
      return rows;
    } catch (e) {
      console.error('[DB] Error fetching chat history:', e);
      throw e;
    }
  }

  /*                INSERT               */

  async insertParticipants(chat_id, producer, consumer) {
    const connection = await pool.connect();
    try {
      await connection.query('BEGIN');
      await connection.query('INSERT INTO chats (_id) VALUES ($1)', [chat_id]);
      await connection.query(
        'INSERT INTO chat_participants (chat_id, user_id) VALUES ($1, $2), ($3, $4)',
        [chat_id, producer, chat_id, consumer]
      );
      await connection.query('COMMIT');
    } catch (error) {
      await connection.query('ROLLBACK');
      console.error('[DB] Error creating chat:', error.message);
      throw error;
    } finally {
      connection.release();
    }
  }

  async insertMessage({ content, chat_id, sender_id, sender_name, receiver_id, created_at }) {
    try {
      const query = `
        INSERT INTO 
          messages 
        (chat_id, sender_id, sender_username, receiver_id, text, created_at)
        VALUES 
          ($1,$2,$3,$4,$5,$6)
      `;
      await pool.query(query, [chat_id, sender_id, sender_name, receiver_id, content, created_at]);
    } catch (e) {
      console.error('[DB] Error adding message:', e);
      throw e;
    }
  }
}
