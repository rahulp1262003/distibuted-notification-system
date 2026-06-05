import { NextFunction, Request, Response } from "express";
import { NotificationService } from "../services/notification.service";

const notificationService = new NotificationService();

export class NotificationController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const notification =
        await notificationService.createNotification(req.body);

      res.status(201).json({
        success: true,
        notificationId: notification.id,
      });
    } catch (error) {
      next(error);
    }
  }
}