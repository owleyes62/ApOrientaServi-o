import { Router } from "express";
import sessionController from "../controllers/sessionController";

const router = Router();

router.get("/", sessionController.getSession);
router.post("/", sessionController.loginSession);
router.delete("/", sessionController.logoutSession);
router.post("/refresh", sessionController.refreshSession);

export default router;