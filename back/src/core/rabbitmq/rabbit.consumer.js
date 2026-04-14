import rabbitmq from "./rabbit.client.js";
import { ChatService } from '../../modules/chat/service.chat.js';

export const startConsumer = async () => {
  console.log('[RABBIT] Listener ready')
  rabbitmq.dequeue('chat_persistence_queue', async (msg, channel) => {
    if (!msg) return
    let payload
    try {
      payload = JSON.parse(msg.content.toString())
    } catch (parseError) {
      console.error('[RABBIT] Poison Message detected (Invalid JSON). Dropping message.');
      // nack(msg, allUpTo, requeue). requeue es falso para no volver a intentar meterlo
      channel.nack(msg, false, false);
      return;
    }

    try {
      console.log("[RABBIT] Received '%s'", payload);
      // guardamos el msg en la db
      await ChatService.persistMessage(payload)
      // le avisamos a la cola que ya la revisamos
      channel.ack(msg)
    } catch (dbError) {
      console.log('[RABBIT] Db error, encolando nuevamente:', dbError.message)
      // avisamos a la cola que se lo vuelva a meter
      channel.nack(msg, false, true)
    }
  })
}

startConsumer()