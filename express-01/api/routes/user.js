import { Router } from "express";
import userController from "../controllers/userController";

const router = Router();

router.get("/", userController.listarUsers);
router.get("/:userId", userController.buscarUserPorId);
router.post("/", userController.criarUser);
router.put("/:userId", userController.atualizarUser);
router.delete("/:userId", userController.deletarUser);

export default router;