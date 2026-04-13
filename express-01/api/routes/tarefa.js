import { Router } from "express";
import tarefaController from "../controllers/tarefaController";

const router = Router();

router.get("/", tarefaController.listarTarefas);
router.get("/:objectId", tarefaController.buscarTarefaPorId);
router.post("/", tarefaController.criarTarefa);
router.put("/:objectId", tarefaController.atualizarTarefa);
router.delete("/:objectId", tarefaController.deletarTarefa);

export default router;
