/** @type {import('ts-jest').JestConfigWithTsJest} */

module.exports = {
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
};