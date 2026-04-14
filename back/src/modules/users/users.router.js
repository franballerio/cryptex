import { Router } from "express";

import { verificarToken } from "../auth/JWT.js";
import { UsersController } from "./users.controller.js";
import { UsersService } from "./users.service.js";
import { UsersRepository } from "./users.repository.js";

const router = Router();
const repository = new UsersRepository();
const service = new UsersService(repository);
const controller = new UsersController(service);

router.post("/getUsersWithRol", verificarToken, controller.getUsersWithRol);
router.post("/getUsers", verificarToken, controller.getUsers);

export default router;
