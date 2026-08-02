import {Prisma} from "@prisma/client";

export interface CreateNotificationDto {
    userId: string;
    eventType: string;
    payload: Prisma.InputJsonValue;
}