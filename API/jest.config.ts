import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  preset: "ts-jest",
  testRegex: "\\.spec\\.(ts|js)$",
  testEnvironment: "node",
  forceExit: true,
  clearMocks: true,
  detectOpenHandles: true,
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/test/",
    "/dist"
  ],
  modulePathIgnorePatterns: [
    "/node_modules/",
    "/dist"
  ],
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/jest.setup.ts"],
  coverageReporters: [
    "html",
    "lcov"
  ]
};

export default config;