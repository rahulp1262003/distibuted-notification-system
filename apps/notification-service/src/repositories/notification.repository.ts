import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

export class NotificationRepository {
  async create(data: {
    userId: string;
    eventType: string;
    payload: Prisma.InputJsonValue;
  }) {
    return prisma.notification.create({
      data,
    });
  }
}