import { publishFanOutEvents } from "../../src/events/fanout.publisher";
import { redis } from "../../src/lib/redis";

describe("Fan-out Publisher", () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    /**
     * Verifies that the notification
     * is published to all channels.
     */
    it("should publish to email, sms and push streams", async () => {

        await publishFanOutEvents({
            notificationId: "notification-123",
            userId: "user-123",
            eventType: "ORDER_CREATED",
        });

        expect(redis.xadd).toHaveBeenCalledTimes(3);

    });

});