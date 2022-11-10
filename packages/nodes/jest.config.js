/** @type {import('ts-jest').JestConfigWithTsJest} */

module.exports = {
  // collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}'
  ],
  coveragePathIgnorePatterns: [
    'constants.ts',
    'index.ts',
    'types.ts'
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/dist/'
  ],
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
};