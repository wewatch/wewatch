import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  moduleFileExtensions: ["js", "json", "ts"],
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  collectCoverageFrom: ["src/**/*.(t|j)s"],
  coveragePathIgnorePatterns: [".*\\.spec\\.ts$", "main.ts"],
  coverageDirectory: "coverage",
  testEnvironment: "node",
  moduleDirectories: ["node_modules", "src"],
  setupFilesAfterEnv: ["./src/__tests__/setupTests.ts"],
  moduleNameMapper: {
    "@wewatch/(.+)": "<rootDir>../$1/src",
  },
};

export default config;
