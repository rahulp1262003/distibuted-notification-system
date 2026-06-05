import { Router } from "express";
import { NotificationController } from "../controllers/notification.controller";

const router = Router();
const controller = new NotificationController();

router.post("/", controller.create.bind(controller));

export default router;