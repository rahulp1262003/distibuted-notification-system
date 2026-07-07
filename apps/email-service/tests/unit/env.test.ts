import { env } from "../../src/config/env";

describe("Environment Config", () => {

    /**
     * Sets required environment variables
     * before each test.
     */
    beforeEach(() => {
        process.env.REDIS_HOST = "localhost";
        process.env.REDIS_PORT = "6379";
    });

    /**
     * Verifies that environment variables
     * are loaded successfully.
     */
    it("should load environment variables", () => {

        expect(env.REDIS_HOST).toBe("localhost");
        expect(env.REDIS_PORT).toBe(6379);

    });

});