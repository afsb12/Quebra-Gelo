module.exports = {
  preset: 'jest-expo',
  setupFiles: ['./jest.setup.ts'],
  // Reset mock call counts (e.g. haptics) between tests so "called once" assertions never leak (012).
  clearMocks: true,
  // Reanimated 4 / Worklets: resolve web (non-native) implementations under Jest.
  resolver: 'react-native-reanimated/jest/resolver',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // <rootDir>-anchored: worktrees live under .claude/ themselves, so a bare '/.claude/' skipped every test there (012).
  testPathIgnorePatterns: ['/node_modules/', '/specs/', '/.specify/', '<rootDir>/.claude/'],
};
