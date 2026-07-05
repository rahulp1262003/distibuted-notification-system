import { Router } from "express";

import { NotificationController } from "../controllers/notification.controller";
import { validate } from "../middlewares/validate.middleware";
import { createNotificationSchema } from "../validators/notification.validator";

const router = Router();
const controller = new NotificationController();

/**
 * Creates a new notification.
 *
 * Request body is validated before reaching the controller.
 */
router.post(
    "/",
    validate(createNotificationSchema),
    controller.create.bind(controller)
);

export default router;