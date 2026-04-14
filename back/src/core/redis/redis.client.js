import { Redis } from 'ioredis'
import { redis } from '../../config.js'
import colors from "colors";

class RedisService {
  constructor() {
    this.client = new Redis({
      host: redis.REDIS_HOST,
      port: redis.REDIS_PORT,
      retryStrategy: (times) => Math.min(times * 50, 2000),
      maxRetriesPerRequest: 3
    })

    this.client.on('connect', () => {
      console.log(
        colors.bold.green('5/6 '),
        `Redis connected!`
      );
    });

    this.client.on('error', (err) => {
      console.error('❌ Redis connection error:', err);
    });
  }

  async setOnline(user_id) {
    try {
      const pipeline = this.client.pipeline()
      // usamos zadd (sorted set) para evitar conexiones zombie
      // son conexiones que se desconectan por problemas y no emiten el evento de desconexion
      pipeline.zadd('online-users', Date.now(), user_id)
      // y ademas agregamos un TTL (time to live) que espera un etoy conectado cada x tiempo
      pipeline.set(`user:${user_id}:status`, 'online', 'EX', 60)
      await pipeline.exec()
      return
    } catch (e) {
      console.error(`Failied to set user ${user_id} online`, e)
    }
  }

  async setOffline(user_id) {
    try {
      const pipeline = this.client.pipeline()
      pipeline.zrem('online-users', user_id)
      pipeline.set(`user:${user_id}:status`, 'offline')
      pipeline.set(`user:${user_id}:lastseen`, Date.now())
      await pipeline.exec()
      return
    } catch (e) {
      console.error(`Failied to set user ${user_id} offline`, e)
    }
  }

  async getOnlineUsers(user_id) {
    try {
      // cutoff es para ver los usuarios que no mandan su estoy vivo hace mas de 60 segundos
      const cutoff = Date.now() - (60 * 1000)
      const pipeline = this.client.pipeline()
      pipeline.zremrangebyscore('online-users', '-inf', cutoff);
      // usuarios online reales
      pipeline.zrange('online-users', 0, -1);
      const results = await pipeline.exec();

      // ioredis pipeline devuelve [error, result] pares por usuario.
      const users = results[1][1] || [];
      return users.filter(u => u !== user_id)
    } catch (e) {
      console.log('Failed to get online users:', e)
      return []
    }
  }

  async disconnect() {
    await this.client.quit();
    console.log('Redis connection closed');
  }

  
}

export default new RedisService()
