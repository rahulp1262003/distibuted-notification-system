import { publishDLQEvent } from "../../src/events/dlq.publisher";
import { redis } from "../../src/lib/redis";

describe("DLQ Publisher", () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should publish a message to the DLQ", async () => {

        await publishDLQEvent({
            notificationId: "notification-123",
            userId: "user-123",
            eventType: "ORDER_CREATED",
            channel: "EMAIL",
            retryCount: 3,
        });

        expect(redis.xadd).toHaveBeenCalledTimes(1);

        expect(redis.xadd).toHaveBeenCalledWith(
            "email-dlq",
            "*",
            "notificationId",
            "notification-123",
            "userId",
            "user-123",
            "eventType",
            "ORDER_CREATED",
            "channel",
            "EMAIL",
            "retryCount",
            "3"
        );

    });

});