import { policies } from "./policies/policies.io.js";

export async function authorizationMiddleware(packet, next) {
  const [event, ...args] = packet;
  const socket = this;

  if (!socket || !socket.user_id) {
    const err = new Error("No autorizado, no socket auth");
    const callback = args[args.length - 1];
    if (typeof callback === 'function') {
      callback({ status: "error", message: err.message });
    }
    return next(err);
  }

  const eventPolicies = {
    'join_room': policies.joinRoom,
    'join_group_room': policies.joinGroupRoom,
    'chat_message': policies.chatMessage,
    'broadcast_message': policies.broadcastMessage,
    'group_created': policies.groupCreated,
    'member_added_to_group': policies.memberAddedToGroup,
    'user_left_group': policies.userLeftGroup,
    'group_deleted': policies.groupDeleted,
  };

  // If the event has a policy, check authorization
  if (eventPolicies[event]) {
    try {
      const authorized = await eventPolicies[event](socket, ...args);

      if (!authorized) {
        console.warn(`[SOCKET POLICY] ${socket.user_name} no autorizado: ${event}`);
        const err = new Error("No autorizado");
        const callback = args[args.length - 1];
        if (typeof callback === 'function') {
          callback({ status: "error", message: err.message });
        }
        return next(err);
      }
    } catch (e) {
      console.error(`[SOCKET POLICY] Error en politica ${event}:`, e);
      const err = new Error("No autorizado");
      const callback = args[args.length - 1];
      if (typeof callback === 'function') {
        callback({ status: "error", message: err.message });
      }
      return next(err);
    }
  }
  console.warn(`[SOCKET POLICY] ${socket.user_name} autorizado: ${event}`);
  next();
};