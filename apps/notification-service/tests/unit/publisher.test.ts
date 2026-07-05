import { publishNotificationCreatedEvent } from "../../src/events/publisher";
import { redis } from "../../src/lib/redis";

/**
 * Mock Redis client.
 */
jest.mock("../../src/lib/redis", () => ({
    redis: {
        xadd: jest.fn(),
    },
}));

describe("publishNotificationCreatedEvent", () => {

    /**
     * Clears all mocks after every test.
     */
    afterEach(() => {
        jest.clearAllMocks();
    });

    /**
     * Verifies that a notification event
     * is published to the Redis stream.
     */
    it("should publish notification created event", async () => {

        (redis.xadd as jest.Mock)
            .mockResolvedValue("1-0");

        await publishNotificationCreatedEvent({
            notificationId: "notification-123",
            userId: "user-123",
            eventType: "ORDER_CREATED",
        });

        expect(redis.xadd)
            .toHaveBeenCalledTimes(1);

        expect(redis.xadd)
            .toHaveBeenCalledWith(
                "notification-stream",
                "*",
                "event",
                "notification.created",
                "notificationId",
                "notification-123",
                "userId",
                "user-123",
                "eventType",
                "ORDER_CREATED"
            );
    });

});