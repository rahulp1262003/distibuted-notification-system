import request from "supertest";

/**
 * Mock Redis client.
 */
jest.mock("../../src/lib/redis", () => ({
    redis: {
        xadd: jest.fn(),
        on: jest.fn(),
    },
}));

import app from "../../src/app";
import { NotificationService } from "../../src/services/notification.service";

/**
 * Mock NotificationService.
 */
jest.mock("../../src/services/notification.service");

describe("NotificationController", () => {

    /**
     * Clears all mocks after every test.
     */
    afterEach(() => {
        jest.clearAllMocks();
    });

    /**
     * Verifies that the controller returns
     * HTTP 201 when a notification is created successfully.
     */
    it("should return 201 when notification is created", async () => {

        (
            NotificationService.prototype.createNotification as jest.Mock
        ).mockResolvedValue({
            id: "notification-123",
        });

        const response = await request(app)
            .post("/notifications")
            .send({
                userId: "user-123",
                eventType: "ORDER_CREATED",
                payload: {
                    orderId: "123",
                },
            });

        expect(response.status).toBe(201);

        expect(response.body).toEqual({
            success: true,
            notificationId: "notification-123",
        });

        expect(
            NotificationService.prototype.createNotification
        ).toHaveBeenCalledTimes(1);
    });

    /**
    * Verifies that the controller returns
    * HTTP 500 when the service throws an error.
    */
    it("should return 500 when service throws an error", async () => {

        (
            NotificationService.prototype.createNotification as jest.Mock
        ).mockRejectedValue(new Error("Internal Server Error"));

        const response = await request(app)
            .post("/notifications")
            .send({
                userId: "user-123",
                eventType: "ORDER_CREATED",
                payload: {
                    orderId: "123",
                },
            });

        expect(response.status).toBe(500);
    });

    /**
     * Verifies that the controller returns
     * HTTP 400 for an invalid request payload.
     */
    it("should return 400 for invalid request payload", async () => {

        const response = await request(app)
            .post("/notifications")
            .send({
                userId: "",
                eventType: "",
            });

        expect(response.status).toBe(400);

        expect(
            NotificationService.prototype.createNotification
        ).not.toHaveBeenCalled();
    });

});