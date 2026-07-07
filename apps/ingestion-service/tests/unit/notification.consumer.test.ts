import { processNotificationEvent } from "../../src/consumers/notification.consumer";
import * as fanoutPublisher from "../../src/events/fanout.publisher";

describe("Notification Consumer", () => {

    afterEach(() => {
        jest.restoreAllMocks();
    });

    /**
     * Verifies that a notification event
     * is forwarded to the fan-out publisher.
     */
    it("should publish fan-out events", async () => {

        const fanoutSpy = jest
            .spyOn(fanoutPublisher, "publishFanOutEvents")
            .mockResolvedValue();

        const event = {
            notificationId: "notification-123",
            userId: "user-123",
            eventType: "ORDER_CREATED",
        };

        await processNotificationEvent(event);

        expect(fanoutSpy).toHaveBeenCalledTimes(1);

        expect(fanoutSpy).toHaveBeenCalledWith(event);

    });

});