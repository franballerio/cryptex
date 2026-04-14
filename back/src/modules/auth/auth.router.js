import { Router } from "express";

import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import { AuthRepository } from "./auth.repository.js";

const router = Router();
const repository = new AuthRepository()
const service = new AuthService(repository)
const controller = new AuthController(service)

router.post("/login", controller.login);
router.get("/me", controller.me);
router.post("/token", controller.token);

export default router