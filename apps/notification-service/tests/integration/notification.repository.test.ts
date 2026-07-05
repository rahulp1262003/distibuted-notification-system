import { Prisma } from "@prisma/client";

import { prisma } from "../../src/lib/prisma";
import { NotificationRepository } from "../../src/repositories/notification.repository";

describe("NotificationRepository", () => {

    const repository = new NotificationRepository();

    /**
     * Clean the Notification table before every test.
     */
    beforeEach(async () => {
        await prisma.notification.deleteMany();
    });

    /**
     * Close the Prisma connection after all tests.
     */
    afterAll(async () => {
        await prisma.$disconnect();
    });

    /**
     * Verifies that a notification
     * is successfully persisted.
     */
    it("should create a notification", async () => {

        const data = {
            userId: "user-123",
            eventType: "ORDER_CREATED",
            payload: {
                orderId: "123",
            } satisfies Prisma.InputJsonValue,
        };

        const notification =
            await repository.create(data);

        expect(notification.id).toBeDefined();

        expect(notification.userId)
            .toBe(data.userId);

        expect(notification.eventType)
            .toBe(data.eventType);

        expect(notification.payload)
            .toEqual(data.payload);
    });

    /**
    * Verifies that multiple notifications
    * are persisted independently.
    */
    it("should create multiple notifications", async () => {

        const first = await repository.create({
            userId: "user-1",
            eventType: "ORDER_CREATED",
            payload: {
                orderId: "101",
            } satisfies Prisma.InputJsonValue,
        });

        const second = await repository.create({
            userId: "user-2",
            eventType: "PAYMENT_SUCCESS",
            payload: {
                paymentId: "202",
            } satisfies Prisma.InputJsonValue,
        });

        expect(first.id).not.toBe(second.id);

        const notifications =
            await prisma.notification.findMany({
                orderBy: {
                    createdAt: "asc",
                },
            });

        expect(notifications).toHaveLength(2);

        expect(notifications[0].userId)
            .toBe("user-1");

        expect(notifications[1].userId)
            .toBe("user-2");
    });
});