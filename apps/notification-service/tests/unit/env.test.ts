import { env } from "../../src/config/env";

describe("Environment Config", () => {
    it("should load environment variables", () => {
        expect(env.PORT).toBe(3001);

        expect(env.REDIS_HOST).toBe(
            "localhost"
        );

        expect(env.REDIS_PORT).toBe(
            6379
        );

        expect(env.DATABASE_URL).toContain(
            "notifications"
        );
    });
});