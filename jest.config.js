/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: 'node',
  testTimeout: 15000,
  collectCoverage: false,
  transform: {
    '^.+.tsx?$': ['ts-jest', {}],
  },
};
