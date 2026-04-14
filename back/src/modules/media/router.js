import { Router } from "express";
import multer from "multer"

import { verificarToken } from "../auth/JWT.js";
import { FileController } from "./controller.js";
import { FileRepository } from "./repository.js";
import { FileService } from "./service.js";


const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10mb max size
})

const router = Router();
const repository = new FileRepository()
const service = new FileService(repository)
const controller = new FileController(service)

router.post("/upload", verificarToken, upload.array('chatFiles', 5), controller.upload)

export default router