import { ZodError } from 'zod';
import { eventSchemas } from './schemas/schemas.io.js';

export async function validationMiddleware(packet, next) {
  const [event, ...args] = packet;
  const socket = this;

  const payload = args[0];

  const schema = eventSchemas[event];

  if (schema) {
    try {
      const validated = schema.parse(payload);
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
        console.warn(`[SOCKET VALIDATION] ${event} validation failed: ${errors}`);

        const callback = args[args.length - 1];
        if (typeof callback === 'function') {
          callback({ status: 'error', message: `Validation failed: ${errors}` });
        }
        return next(new Error(`Validation failed: ${errors}`));
      }

      console.error(`[SOCKET VALIDATION] Unexpected error validating ${event}:`, error);
      return next(error);
    }
  }

  next();
}
