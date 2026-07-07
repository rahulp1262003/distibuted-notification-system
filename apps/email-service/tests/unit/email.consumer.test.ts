import { processEmailEvent } from "../../src/consumers/email.consumer";
import * as emailHandler from "../../src/handlers/email.handler";
import { EmailProvider } from "../../src/providers/email.provider";

describe("Email Consumer", () => {

    afterEach(() => {
        jest.restoreAllMocks();
    });

    /**
     * Verifies that the consumer delegates
     * processing to the email handler.
     */
    it("should process an email event", async () => {

        const provider: EmailProvider = {
            send: jest.fn(),
        };

        const handlerSpy = jest
            .spyOn(emailHandler, "processEmail")
            .mockResolvedValue();

        const event = {
            notificationId: "notification-123",
            userId: "user-123",
            eventType: "ORDER_CREATED",
        };

        await processEmailEvent(provider, event);

        expect(handlerSpy).toHaveBeenCalledTimes(1);

        expect(handlerSpy).toHaveBeenCalledWith(
            provider,
            event
        );

    });

});