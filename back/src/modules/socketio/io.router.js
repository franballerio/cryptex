import { Server } from "socket.io"
// import { rateLimit } from 'express-rate-limit';
import colors from "colors";

import { getUserFromToken } from '../auth/JWT.js'
import { ChatService } from "../chat/chat.service.js"
import { ChatRepository } from "../chat/chat.repository.js";
import { SocketIOController } from "./io.controller.js"
import { SocketIOService } from "./io.service.js";

// import redis from '../redis/redis.client.js'
// import { authorizationMiddleware } from "./middleware/authorizationMiddleware.io.js";
// import { validationMiddleware } from "./middleware/validationMiddleware.io.js";

// setup for DI
const chatService = new ChatService(new ChatRepository())
const controller = new SocketIOController(new SocketIOService(chatService))


const PORT = process.env.APP_PORT;

export const startIoServer = async (http_server) => {
	const io = new Server(http_server, {
		connectionStateRecovery: {},
		cors: { origin: '*' }  // Debe ser un objeto — pasar '*' directamente rompe la validación de origen de la actualización de WebSocket
	});

	console.log(
		colors.bold.green('1/2 '),
		`Socket.io server en socket://localhost:${PORT}`
	)

	io.use((socket, next) => {
		// el cliente envia el token y lo validamos =)	
		const token = socket.handshake.auth.token

		try {
			const user_data = getUserFromToken(token)
			if (!user_data._id || !user_data.usuario || !user_data.rol) return next(
				new Error(`[SOCKET] Error de autenticacion id: ${user_id}, name: ${user_name}, rol: ${user_role}`)
			)

			socket.user_id = user_data._id
			socket.user_name = user_data.usuario
			socket.user_role = user_data.rol
			next()
		} catch (e) {
			console.log('[SOCKET] token no valido ', e.message)
			next(new Error('Auth error: Invalid token'))
		}
	})


	io.on('connection', async (socket) => {
		console.log(`Client: ${socket.user_name} has connected!`)

		// middlewares
		// socket.use(rateLimit({
		// 	windowMs: 10000, // 10 seconds
		// 	max: 10 // 10 messages per window
		// }))
		// socket.use(validationMiddleware.bind(socket));
		// socket.use(authorizationMiddleware.bind(socket));

		// Agrego al usuario que acaba de conectarse a la lista de usuarios online (redis)
		// await redis.setOnline(socket.user_id)
		socket.broadcast.emit('user_online', { user_id: socket.user_id })

		socket.on('heartbeat', () => {
			// redis.setOnline(socket.user_id)
		})

		socket.on('disconnect', async () => {
			console.log(`Client: ${socket.user_name} has disconnected!`);
			// Verifica si el usuario no tiene más de una pestaña abierta
			const matchingSockets = await io.in(socket.user_id).fetchSockets()
			// Elimina al usuario de la lista de online (redis) 
			if (matchingSockets.length === 0) {
				// await redis.setOffline(socket.user_id)
				socket.broadcast.emit('user_offline', { user_id: socket.user_id })
			}
			return
		})

		socket.on('join_room', (payload) => {
			const { producer, consumer } = payload
			// producer y consumer siempre son los id de usuarios
			controller.joinRoom({ socket: socket, io: io, producer: producer, consumer: consumer })
		})

		socket.on('chat_message', async (payload) => {
			const { content, files_urls, chat_id, sender_id, sender_name, receiver_id, created_at } = payload
			await controller.sendMessage({
				socket: socket,
				io: io,
				content: content,
				files_urls: files_urls,
				chat_id: chat_id,
				sender_name: sender_name,
				sender_id: sender_id,
				receiver_id: receiver_id,
				created_at: created_at
			})
		})
	})
}
