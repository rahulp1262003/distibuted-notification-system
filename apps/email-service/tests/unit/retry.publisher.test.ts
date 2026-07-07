import { publishRetryEvent } from "../../src/events/retry.publisher";
import { redis } from "../../src/lib/redis";

describe("Retry Publisher", () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should publish retry event", async () => {

        await publishRetryEvent({
            notificationId: "notification-123",
            userId: "user-123",
            eventType: "ORDER_CREATED",
            channel: "EMAIL",
            retryCount: 1,
        });

        expect(redis.xadd).toHaveBeenCalledTimes(1);

        expect(redis.xadd).toHaveBeenCalledWith(
            "retry-stream",
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
            "1"
        );
    });

});