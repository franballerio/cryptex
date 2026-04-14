import { Router } from "express";

import { verificarToken } from "../auth/JWT.js";
// import { chatValidationMiddleware } from "./middleware/validationMiddleware.js";
import { ChatController } from "./chat.controller.js";
import { ChatService } from "./chat.service.js";
import { ChatRepository } from "./chat.repository.js";
import { UsersService } from "../users/users.service.js";
import { UsersRepository } from "../users/users.repository.js";

const router = Router();
const repository = new ChatRepository()
const service = new ChatService(repository)
const controller = new ChatController(service, new UsersService(new UsersRepository))

router.post("/getChatHistory", verificarToken, controller.getChatHistory)
router.post("/getOnlineUsers", verificarToken, controller.getOnlineUsers)

export default router