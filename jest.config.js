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
    moduleNameMapper: {
        '^@/types$': '<rootDir>/src/types/index.ts',
        '^@/(.*)$': '<rootDir>/src/$1',
        '^\\$$': '<rootDir>/src/store'
    },
    modulePathIgnorePatterns: [
        '<rootDir>/dist/'
    ],
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            { tsconfig: './tsconfig.test.json' },
        ],
    },
    verbose: true,
};