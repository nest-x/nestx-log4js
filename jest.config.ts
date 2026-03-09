import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    '<rootDir>/packages/*/src/*.ts',
    '!<rootDir>/packages/*/src/__tests__/**/*.ts',
    '!<rootDir>/packages/*/src/index.ts',
  ],
  testMatch: ['<rootDir>/packages/*/src/**/*.test.ts'],
  testEnvironment: 'node',
  coverageDirectory: '<rootDir>/reports/coverage',
};

export default config;
