import {
    MAX_RETRY_COUNT,
    getNextRetryCount,
    canRetry,
} from "../../src/utils/retry";

describe("Retry Utils", () => {

    it("should increment retry count", () => {

        expect(getNextRetryCount(0)).toBe(1);
        expect(getNextRetryCount(1)).toBe(2);
        expect(getNextRetryCount(2)).toBe(3);

    });

    it("should allow retry below max retries", () => {

        expect(canRetry(0)).toBe(true);
        expect(canRetry(1)).toBe(true);
        expect(canRetry(2)).toBe(true);

    });

    it("should reject retry at max retries", () => {

        expect(canRetry(MAX_RETRY_COUNT)).toBe(false);

    });

});