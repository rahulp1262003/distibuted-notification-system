import { pollOnce } from "../../src/consumers/email.stream.consumer";
import * as stream from "../../src/lib/stream";
import * as consumer from "../../src/consumers/email.consumer";
import { FakeEmailProvider } from "../../src/providers/fake-email.provider";
import * as retryPublisher from "../../src/events/retry.publisher";
import * as dlqPublisher from "../../src/events/dlq.publisher";
import * as retryUtils from "../../src/utils/retry";

describe("Email Stream Consumer", () => {

    afterEach(() => {
        jest.restoreAllMocks();
    });

    /**
     * Verifies that one stream event
     * is delegated to the business consumer.
     */
    it("should process one stream message", async () => {

        jest.spyOn(stream, "readStream").mockResolvedValue([
            [
                "email-stream",
                [
                    [
                        "1-0",
                        [
                            "event",
                            "notification.email.send",
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
            .spyOn(consumer, "processEmailEvent")
            .mockResolvedValue();

        await pollOnce();

        expect(consumerSpy).toHaveBeenCalledTimes(1);

        expect(consumerSpy).toHaveBeenCalledWith(
            expect.any(FakeEmailProvider),
            {
                notificationId: "notification-123",
                userId: "user-123",
                eventType: "ORDER_CREATED",
            }
        );

    });

    /**
    * Verifies that no processing happens
    * when the stream has no messages.
    */
    it("should do nothing when no stream message is available", async () => {

        jest.spyOn(stream, "readStream")
            .mockResolvedValue([] as any);

        const consumerSpy = jest
            .spyOn(consumer, "processEmailEvent")
            .mockResolvedValue();

        await pollOnce();

        expect(consumerSpy).not.toHaveBeenCalled();

    });

    /**
    * Verifies that a processed message
    * is acknowledged.
    */
    it("should acknowledge a processed message", async () => {

        jest.spyOn(stream, "readStream").mockResolvedValue([
            [
                "email-stream",
                [
                    [
                        "1-0",
                        [
                            "event",
                            "notification.email.send",
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
            "email-stream",
            "email-group",
            "1-0"
        );

    });

    /**
     * Verifies that a failed message
     * is not acknowledged.
     */
    it("should not acknowledge when processing fails", async () => {

        jest.spyOn(stream, "readStream").mockResolvedValue([
            [
                "email-stream",
                [
                    [
                        "1-0",
                        [
                            "event",
                            "notification.email.send",
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

        jest.spyOn(consumer, "processEmailEvent")
            .mockRejectedValue(
                new Error("Email Failed")
            );

        const ackSpy = jest
            .spyOn(stream, "ackMessage")
            .mockResolvedValue(1);

        await expect(
            pollOnce()
        ).rejects.toThrow("Email Failed");

        expect(ackSpy).not.toHaveBeenCalled();

    });

    /**
     * Verifies that a retry event is published
     * when email processing fails.
     */
    it("should publish retry event when processing fails", async () => {

        jest.spyOn(stream, "readStream").mockResolvedValue([
            [
                "email-stream",
                [
                    [
                        "1-0",
                        [
                            "event",
                            "notification.email.send",
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

        jest.spyOn(consumer, "processEmailEvent")
            .mockRejectedValue(new Error("Email Failed"));

        const retrySpy = jest
            .spyOn(retryPublisher, "publishRetryEvent")
            .mockResolvedValue();

        await expect(
            pollOnce()
        ).rejects.toThrow("Email Failed");

        expect(retrySpy).toHaveBeenCalledTimes(1);

        expect(retrySpy).toHaveBeenCalledWith({
            notificationId: "notification-123",
            userId: "user-123",
            eventType: "ORDER_CREATED",
            channel: "EMAIL",
            retryCount: 1,
        });

    });

    /**
     * Verifies that a message is sent to the DLQ
     * when retries are exhausted.
     */
    it("should publish to DLQ when retry limit is reached", async () => {

        jest.spyOn(stream, "readStream").mockResolvedValue([
            [
                "email-stream",
                [
                    [
                        "1-0",
                        [
                            "event",
                            "notification.email.send",
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

        jest.spyOn(consumer, "processEmailEvent")
            .mockRejectedValue(new Error("Email Failed"));

        jest.spyOn(retryUtils, "canRetry")
            .mockReturnValue(false);

        const retrySpy = jest
            .spyOn(retryPublisher, "publishRetryEvent")
            .mockResolvedValue();

        const dlqSpy = jest
            .spyOn(dlqPublisher, "publishDLQEvent")
            .mockResolvedValue();

        await expect(
            pollOnce()
        ).rejects.toThrow("Email Failed");

        expect(retrySpy).not.toHaveBeenCalled();

        expect(dlqSpy).toHaveBeenCalledTimes(1);

        expect(dlqSpy).toHaveBeenCalledWith({
            notificationId: "notification-123",
            userId: "user-123",
            eventType: "ORDER_CREATED",
            channel: "EMAIL",
            retryCount: 1,
        });

    });

});