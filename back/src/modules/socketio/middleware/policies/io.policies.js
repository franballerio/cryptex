import { ChatService } from '../../../chat/service.chat.js';

export const policies = {
    /**
     * A policy to authorize joining a 1-on-1 chat room.
     * It allows access only if the connected user is one of the two participants in the chat.
     * @param {import('socket.io').Socket} socket - The socket instance of the user.
     * @param {object} payload - The data received with the event.
     * @param {string} payload.producer - The ID of the user who initiated the chat.
     * @param {string} payload.consumer - The ID of the other user in the chat.
     * @returns {boolean} - True if authorized, false otherwise.
     */
    joinRoom: (socket, payload) => {
        const { producer, consumer } = payload;
        // The user can only join a room if they are either the producer or the consumer of the chat.
        return socket.user_id === producer || socket.user_id === consumer;
    },

    joinGroupRoom: async (socket, payload) => {
        // user has to be in the group
        const { group_id, user_id } = payload
        if (socket.user_id !== user_id) return false

        try {
            // members = [ {user_id: id}, ... ] 
            const members = await ChatService.getChatParticipants({ chat_id: group_id })
            return members.some(u => u.user_id === user_id)
        } catch (e) {
            console.log(e.message)
        }
    },

    chatMessage: async (socket, payload) => {
        const { chat_id, group_id, sender_id } = payload
        if (socket.user_id !== sender_id) return false

        const id = chat_id ? chat_id : group_id
        const chat = await ChatService.fetchChat({ chat_id: id })
        if (!chat) return false

        const userInChat = await ChatService.checkUserInChat({ chat_id: id, user_id: sender_id })
        if (!userInChat) return false

        const users = await ChatService.getChatParticipants({ id: id })
        console.log(users)
        const sender_role = await ChatService.getUserRole({ user_id: sender_id })
        users.forEach(user => {
            const role = ChatService.getUserRole({ user_id: user })
            if (sender_role > role) return false
        });

        return true
    },

    broadcastMessage: async (socket, payload) => {
        const { sender_id } = payload
        const sender_role = await ChatService.getUserRole({ user_id: sender_id })

        return sender_id === socket.user_id && socket.user_role_id === sender_role && sender_role === 1
    },

    groupCreated: (socket, payload) => {
        const { created_by, members } = payload;
        // User must be the creator or one of the members added
        return socket.user_id === created_by || members.includes(socket.user_id);
    },

    memberAddedToGroup: async (socket, payload) => {
        const { group_id } = payload;
        try {
            const members = await ChatService.getChatParticipants({ chat_id: group_id });
            return members.some(u => u.user_id === socket.user_id);
        } catch (e) {
            console.error(e.message);
            return false;
        }
    },

    userLeftGroup: (socket, payload) => {
        const { user_id } = payload;
        // The user can leave themselves, or an admin can remove them
        return socket.user_id === user_id || socket.user_role_id === 1;
    },

    groupDeleted: async (socket, payload) => {
        const { group_id } = payload;
        // Check if user is admin
        if (socket.user_role_id === 1) return true;

        try {
            // Alternatively, check if user is the creator of the group
            const chat = await ChatService.fetchChat({ chat_id: group_id });
            if (!chat) return false;
            return chat.created_by === socket.user_id;
        } catch (e) {
            console.error(e.message);
            return false;
        }
    }
};
