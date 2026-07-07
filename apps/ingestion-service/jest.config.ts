import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "node",

    verbose: true,

    roots: [
        "<rootDir>/src",
        "<rootDir>/tests",
    ],

    setupFiles: [
        "<rootDir>/tests/setup.ts",
    ],

    testMatch: [
        "**/*.test.ts",
        "**/*.spec.ts",
    ],

    moduleFileExtensions: [
        "ts",
        "js",
        "json",
    ],

    transform: {
        "^.+\\.tsx?$": [
            "ts-jest",
            {
                tsconfig: "tsconfig.test.json",
            },
        ],
    },

    clearMocks: true,

    collectCoverage: true,

    coverageDirectory: "coverage",

    coveragePathIgnorePatterns: [
        "/node_modules/",
        "/dist/",
    ],
};

export default config;