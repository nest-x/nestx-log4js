import type { Config } from '@jest/types';

const rootJestConfig: Config.InitialOptions = {
  moduleFileExtensions: [
    'ts',
    'js',
    'json'
  ],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  },
  collectCoverageFrom: [
    '<rootDir>/src/*.ts',
    '!<rootDir>/src/__tests__/**/*.ts',
    '!<rootDir>/src/shared/**/*.ts',
    '!<rootDir>/src/index.ts',
    '<rootDir>/packages/*/src/*.ts',
    '!<rootDir>/packages/*/src/__tests__/**/*.ts',
    '!<rootDir>/packages/*/src/shared/**/*.ts',
    '!<rootDir>/packages/*/src/index.ts'
  ],
  testMatch: [
    '<rootDir>/src/**/*.test.ts',
    '<rootDir>/packages/*/src/**/*.test.ts'
  ],
  testEnvironment: 'node',
  coverageDirectory: '<rootDir>/reports/coverage'
};

export default rootJestConfig;
