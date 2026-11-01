module.exports = {
  preset: 'jest-expo',
  setupFiles: ['./jest.setup.ts'],
  // Reanimated 4 / Worklets: resolve web (non-native) implementations under Jest.
  resolver: 'react-native-reanimated/jest/resolver',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['/node_modules/', '/specs/', '/.specify/'],
};
