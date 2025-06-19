module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testRegex: "\\.spec\\.(ts|js)$",
    roots: ['<rootDir>/src'],
    setupFilesAfterEnv: ['<rootDir>/src/__tests__/jest.setup.ts'],
    testTimeout: 10000,
};