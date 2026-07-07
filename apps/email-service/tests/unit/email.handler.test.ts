import { processEmail } from "../../src/handlers/email.handler";
import { EmailProvider } from "../../src/providers/email.provider";
import * as statusPublisher from "../../src/events/status.publisher";

describe("Email Handler", () => {

    afterEach(() => {
        jest.restoreAllMocks();
    });

    /**
     * Verifies that an email notification
     * is sent successfully.
     */
    it("should send an email notification", async () => {
        /**
         * Mock email provider.
         */
        const provider: EmailProvider = {
            send: jest.fn().mockResolvedValue(undefined),
        };

        const publishSpy = jest
            .spyOn(statusPublisher, "publishStatusEvent")
            .mockResolvedValue();

        await processEmail(provider, {
            notificationId: "notification-123",
            userId: "user-123",
            eventType: "ORDER_CREATED",
        });

        expect(publishSpy).toHaveBeenCalledTimes(1);

        expect(publishSpy).toHaveBeenCalledWith({
            notificationId: "notification-123",
            channel: "EMAIL",
            status: "SENT",
        });

        expect(provider.send).toHaveBeenCalledTimes(1);

        expect(provider.send).toHaveBeenCalledWith({
            to: "user-123@example.com",
            subject: "Notification: ORDER_CREATED",
            body: "Notification Id: notification-123",
        });

    });

    /**
     * Verifies that provider errors
     * are propagated to the caller.
     */
    it("should throw when email provider fails", async () => {

        const provider: EmailProvider = {
            send: jest.fn().mockRejectedValue(
                new Error("Email Provider Failed")
            ),
        };

        const publishSpy = jest
            .spyOn(statusPublisher, "publishStatusEvent")
            .mockResolvedValue();

        await expect(
            processEmail(provider, {
                notificationId: "notification-123",
                userId: "user-123",
                eventType: "ORDER_CREATED",
            })
        ).rejects.toThrow("Email Provider Failed");

        
        expect(statusPublisher.publishStatusEvent)
        .not.toHaveBeenCalled();
        
        expect(publishSpy).not.toHaveBeenCalled();
    });

});