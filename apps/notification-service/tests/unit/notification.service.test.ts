import { NotificationRepository } from "../../src/repositories/notification.repository";
import { NotificationService } from "../../src/services/notification.service";
import { publishNotificationCreatedEvent } from "../../src/events/publisher";

/**
 * Mock the publisher module.
 *
 * This prevents Redis connections from being created
 * during unit tests.
 */
jest.mock("../../src/events/publisher", () => ({
    publishNotificationCreatedEvent: jest.fn(),
}));

describe("NotificationService", () => {

    /**
     * Clears all mock history after every test.
     */
    afterEach(() => {
        jest.clearAllMocks();
    });

    /**
     * Verifies that the service:
     * - Creates a notification using the repository.
     * - Publishes a notification created event.
     * - Returns the created notification.
     */
    it("should create notification and publish event", async () => {

        /**
         * Mock NotificationRepository.
         */
        const repository = {
            create: jest.fn(),
        } as unknown as NotificationRepository;

        /**
         * Simulate a successful database insert.
         */
        repository.create = jest.fn().mockResolvedValue({
            id: "notification-123",
            userId: "user-123",
            eventType: "ORDER_CREATED",
            payload: {
                orderId: "123",
            },
        });

        /**
         * Mock successful event publishing.
         */
        (publishNotificationCreatedEvent as jest.Mock)
            .mockResolvedValue(undefined);

        /**
         * Create service using mocked repository.
         */
        const service =
            new NotificationService(repository);

        /**
         * Execute business logic.
         */
        const result =
            await service.createNotification({
                userId: "user-123",
                eventType: "ORDER_CREATED",
                payload: {
                    orderId: "123",
                },
            });

        /**
         * Verify returned notification.
         */
        expect(result.id).toBe("notification-123");

        /**
         * Verify repository interaction.
         */
        expect(repository.create)
            .toHaveBeenCalledTimes(1);

        expect(repository.create)
            .toHaveBeenCalledWith({
                userId: "user-123",
                eventType: "ORDER_CREATED",
                payload: {
                    orderId: "123",
                },
            });

        /**
         * Verify event publishing.
         */
        expect(publishNotificationCreatedEvent)
            .toHaveBeenCalledTimes(1);

        expect(publishNotificationCreatedEvent)
            .toHaveBeenCalledWith({
                notificationId: "notification-123",
                userId: "user-123",
                eventType: "ORDER_CREATED",
            });

    });

    /**
 * Verifies that the service throws an error
 * when the repository fails to create a notification.
 */
    it("should throw when repository create fails", async () => {

        const repository = {
            create: jest.fn(),
        } as unknown as NotificationRepository;

        repository.create = jest
            .fn()
            .mockRejectedValue(new Error("Database Error"));

        (publishNotificationCreatedEvent as jest.Mock)
            .mockResolvedValue(undefined);

        const service =
            new NotificationService(repository);

        await expect(
            service.createNotification({
                userId: "user-123",
                eventType: "ORDER_CREATED",
                payload: {
                    orderId: "123",
                },
            })
        ).rejects.toThrow("Database Error");
    });


    /**
     * Verifies that no event is published
     * if notification creation fails.
     */
    it("should not publish event when repository create fails", async () => {

        const repository = {
            create: jest.fn(),
        } as unknown as NotificationRepository;

        repository.create = jest
            .fn()
            .mockRejectedValue(new Error("Database Error"));

        (publishNotificationCreatedEvent as jest.Mock)
            .mockResolvedValue(undefined);

        const service =
            new NotificationService(repository);

        await expect(
            service.createNotification({
                userId: "user-123",
                eventType: "ORDER_CREATED",
                payload: {
                    orderId: "123",
                },
            })
        ).rejects.toThrow();

        expect(publishNotificationCreatedEvent)
            .not.toHaveBeenCalled();
    });

    /**
    * Verifies that the service propagates
    * publisher errors after successfully
    * creating a notification.
    */
    it("should throw when event publishing fails", async () => {

        const repository = {
            create: jest.fn(),
        } as unknown as NotificationRepository;

        repository.create = jest.fn().mockResolvedValue({
            id: "notification-123",
            userId: "user-123",
            eventType: "ORDER_CREATED",
            payload: {
                orderId: "123",
            },
        });

        (publishNotificationCreatedEvent as jest.Mock)
            .mockRejectedValue(new Error("Redis Error"));

        const service =
            new NotificationService(repository);

        await expect(
            service.createNotification({
                userId: "user-123",
                eventType: "ORDER_CREATED",
                payload: {
                    orderId: "123",
                },
            })
        ).rejects.toThrow("Redis Error");

        expect(repository.create)
            .toHaveBeenCalledTimes(1);

        expect(publishNotificationCreatedEvent)
            .toHaveBeenCalledTimes(1);
    });

});