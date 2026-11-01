module.exports = function (api) {
  const isTest = api.env('test');
  api.cache.using(() => process.env.NODE_ENV);
  // babel-preset-expo adds the react-native-worklets plugin automatically (Reanimated 4).
  // NativeWind's JSX transform is skipped under Jest: className styling is not needed in unit
  // tests and its injected imports break jest.mock() factories.
  if (isTest) return { presets: ['babel-preset-expo'] };
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
  };
};
