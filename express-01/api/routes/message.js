import { Router } from "express";
import messageController from "../controllers/messageController";

const router = Router();

router.get("/", messageController.listarMessages);
router.get("/:messageId", messageController.buscarMessagePorId);
router.post("/", messageController.criarMessage);
router.put("/:messageId", messageController.atualizarMessage);
router.delete("/:messageId", messageController.deletarMessage);

export default router;