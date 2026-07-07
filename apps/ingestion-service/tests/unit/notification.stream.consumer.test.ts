import { pollOnce } from "../../src/consumers/notification.stream.consumer";
import * as stream from "../../src/lib/stream";
import * as consumer from "../../src/consumers/notification.consumer";

describe("Notification Stream Consumer", () => {

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should process one notification message", async () => {

        jest.spyOn(stream, "readStream").mockResolvedValue([
            [
                "notification-stream",
                [
                    [
                        "1-0",
                        [
                            "event",
                            "notification.created",
                            "notificationId",
                            "notification-123",
                            "userId",
                            "user-123",
                            "eventType",
                            "ORDER_CREATED",
                        ],
                    ],
                ],
            ],
        ] as any);

        const consumerSpy = jest
            .spyOn(consumer, "processNotificationEvent")
            .mockResolvedValue();

        const ackSpy = jest
            .spyOn(stream, "ackMessage")
            .mockResolvedValue(1);

        await pollOnce();

        expect(consumerSpy).toHaveBeenCalledTimes(1);

        expect(ackSpy).toHaveBeenCalledTimes(1);

    });

    /**
     * Verifies that nothing happens
     * when the stream has no messages.
     */
    it("should do nothing when no notification message is available", async () => {

        jest.spyOn(stream, "readStream")
            .mockResolvedValue([] as any);

        const consumerSpy = jest
            .spyOn(consumer, "processNotificationEvent")
            .mockResolvedValue();

        await pollOnce();

        expect(consumerSpy).not.toHaveBeenCalled();

    });

    /**
    * Verifies that a processed notification
    * message is acknowledged.
    */
    it("should acknowledge a processed notification message", async () => {

        jest.spyOn(stream, "readStream").mockResolvedValue([
            [
                "notification-stream",
                [
                    [
                        "1-0",
                        [
                            "event",
                            "notification.created",
                            "notificationId",
                            "notification-123",
                            "userId",
                            "user-123",
                            "eventType",
                            "ORDER_CREATED",
                        ],
                    ],
                ],
            ],
        ] as any);

        const ackSpy = jest
            .spyOn(stream, "ackMessage")
            .mockResolvedValue(1);

        await pollOnce();

        expect(ackSpy).toHaveBeenCalledTimes(1);

        expect(ackSpy).toHaveBeenCalledWith(
            "notification-stream",
            "notification-group",
            "1-0"
        );

    });

    /**
 * Verifies that a failed notification
 * is not acknowledged.
 */
    it("should not acknowledge when processing fails", async () => {

        jest.spyOn(stream, "readStream").mockResolvedValue([
            [
                "notification-stream",
                [
                    [
                        "1-0",
                        [
                            "event",
                            "notification.created",
                            "notificationId",
                            "notification-123",
                            "userId",
                            "user-123",
                            "eventType",
                            "ORDER_CREATED",
                        ],
                    ],
                ],
            ],
        ] as any);

        jest.spyOn(consumer, "processNotificationEvent")
            .mockRejectedValue(
                new Error("Processing Failed")
            );

        const ackSpy = jest
            .spyOn(stream, "ackMessage")
            .mockResolvedValue(1);

        await expect(
            pollOnce()
        ).rejects.toThrow("Processing Failed");

        expect(ackSpy).not.toHaveBeenCalled();

    });
});