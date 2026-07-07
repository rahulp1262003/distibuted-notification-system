import dotenv from "dotenv";

dotenv.config({
    path: ".env.test",
    quiet: true,
});

process.env.NODE_ENV = "test";

jest.mock("../src/lib/redis", () => ({
    redis: {
        xadd: jest.fn().mockResolvedValue("1-0"),
        xack: jest.fn().mockResolvedValue(1),
        quit: jest.fn(),
    },
}));