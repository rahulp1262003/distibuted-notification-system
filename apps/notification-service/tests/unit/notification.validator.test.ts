import { createNotificationSchema } from "../../src/validators/notification.validator";

describe("createNotificationSchema", () => {

    it("should validate a valid notification payload", () => {
        const input = {
            userId: "user-123",
            eventType: "ORDER_CREATED",
            payload: {
                orderId: "123",
            },
        };

        const result =
            createNotificationSchema.safeParse(input);

        expect(result.success).toBe(true);
    });

    it("should reject when userId is missing", () => {
        const input = {
            eventType: "ORDER_CREATED",
            payload: {
                orderId: "123",
            },
        };

        const result =
            createNotificationSchema.safeParse(input);

        expect(result.success).toBe(false);

        if (!result.success) {
            expect(
                result.error.flatten().fieldErrors.userId
            ).toBeDefined();
        }
    });

    it("should reject when userId is empty", () => {
        const input = {
            userId: "",
            eventType: "ORDER_CREATED",
            payload: {
                orderId: "123",
            },
        };

        const result =
            createNotificationSchema.safeParse(input);

        expect(result.success).toBe(false);

        if (!result.success) {
            expect(
                result.error.flatten().fieldErrors.userId
            ).toBeDefined();
        }
    });

    it("should reject when eventType is missing", () => {
        const input = {
            userId: "user-123",
            payload: {
                orderId: "123",
            },
        };

        const result =
            createNotificationSchema.safeParse(input);

        expect(result.success).toBe(false);

        if (!result.success) {
            expect(
                result.error.flatten().fieldErrors.eventType
            ).toBeDefined();
        }
    });

    it("should reject when eventType is empty", () => {
        const input = {
            userId: "user-123",
            eventType: "",
            payload: {
                orderId: "123",
            },
        };

        const result =
            createNotificationSchema.safeParse(input);

        expect(result.success).toBe(false);

        if (!result.success) {
            expect(
                result.error.flatten().fieldErrors.eventType
            ).toBeDefined();
        }
    });

    it("should reject when payload is missing", () => {
        const input = {
            userId: "user-123",
            eventType: "ORDER_CREATED",
        };

        const result =
            createNotificationSchema.safeParse(input);

        expect(result.success).toBe(false);

        if (!result.success) {
            expect(
                result.error.flatten().fieldErrors.payload
            ).toBeDefined();
        }
    });

    it("should reject when payload is not an object", () => {
        const input = {
            userId: "user-123",
            eventType: "ORDER_CREATED",
            payload: "invalid",
        };

        const result =
            createNotificationSchema.safeParse(input);

        expect(result.success).toBe(false);

        if (!result.success) {
            expect(
                result.error.flatten().fieldErrors.payload
            ).toBeDefined();
        }
    });

});