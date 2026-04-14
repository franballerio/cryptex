import amqp from 'amqplib'
import colors from 'colors'

import { rabbit } from '../../config.js'

class RabbitMqCLient {
  constructor() {
    this.conn = null
    this.channel = null
    this.promiseConn = null
    this.reconnTimeout = 5000
    this.consumers = [] // tiene a quienes estan consumiendo las colas activas
    // nos sirve para restaurarlos si se cae el servicio
  }

  async connect() {
    if (this.conn && this.channel) return
    if (this.promiseConn) {
      await this.promiseConn
      return
    }

    this.promiseConn = (async () => { // definimos una funcion ()
      try {
        this.conn = await amqp.connect(rabbit.RABBIT_URL)
        this.channel = await this.conn.createChannel()
        console.log(
          colors.bold.green('3/6 '),
          `RabbitMQ publisher conectado!`
        )

        // establecemos el comportamiento ante el error en el servicio
        this.conn.on('error', (e) => {
          if (e.message !== 'Connection closing') {
            console.error('[RABBIT] Error en conexion: ', e.message)
          }
        })

        this.conn.on('close', () => {
          console.error('[RABBIT] Conexion cerrada. Intentando reconectar...')
          this.handleDisconn()
        })

        await this.restoreConsumers()
      } catch (e) {
        console.error('[RABBIT] Error en conexion', e.message)
        this.promiseConn = null
        throw e
      }
    })() // la ejecutamos inmediatamente
    await this.promiseConn
  }

  handleDisconn() {
    // limpiamos la conexion muerta
    this.conn = null;
    this.channel = null;
    this.connectionPromise = null;

    setTimeout(() => {
      this.connect().catch(() => {
        console.log('[RABBIT] Reconnect attempt failed. Will try again...');
      });
    }, this.handleDisconn);
  }

  async enqueue(queue, msg) {
    if (!this.channel) await this.connect()
    try {
      await this.channel.assertQueue(queue, { durable: true })
      this.channel.sendToQueue(queue, Buffer.from(msg), { persistent: true })
    } catch (e) {
      console.error('[RABBIT] Queuing msg failed ', e.message)
    }
  }

  async dequeue(queue, callback) {
    if (!this.channel) await this.connect()

    this.consumers.push({ queue: queue, callback: callback })

    try {
      this.setupConsumer(queue, callback)
    } catch (error) {
      console.error(`[RABBIT] Error setting up consumer for ${queue}:`, e.message);
    }
  }

  async setupConsumer(queue, callback) {
    await this.channel.assertQueue(queue, { durable: true });

    // Tell RabbitMQ: "Only give me 100 unacknowledged messages at a time"
    await this.channel.prefetch(100);
    this.channel.consume(queue, (msg) => {
      callback(msg, this.channel);
    });
  }

  async restoreConsumers() {
    if (this.consumers.length === 0) return
    console.warn(`[RABBIT] Restableciendo ${this.consumers.length} consumers...`)
    for (const consumer of this.consumers) {
      this.setupConsumer(consumer.queue, consumer.callback)
    }
  }

  async close() {
    try {
      if (this.channel) await this.channel.close()
      if (this.conn) await this.conn.close()
    } catch (e) {
      console.error('[RABBIT] Error cerrando la conexion:', e.message)
    }
  }
}

export default new RabbitMqCLient();