import type { Config } from '@jest/types';


const jestConfig: Config.InitialOptions = {
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
    '!<rootDir>/src/index.ts'
  ],
  testMatch: [
    '<rootDir>/src/**/*.test.ts'
  ],
  testEnvironment: 'node',
  coverageDirectory: '<rootDir>/reports/coverage'
};


export default jestConfig;
