import { Router } from "express";
import { gatewayController } from "../controllers/gateway.controller.js";

const router = Router();
router.all("/{*splat}", gatewayController);
//router.all("*", gatewayController);

export default router;