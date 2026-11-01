/* eslint-disable @typescript-eslint/no-require-imports */
import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

// Render react-native-svg primitives as plain host components in tests.
jest.mock('react-native-svg', () => {
  const React = require('react');
  const make = (name: string) => {
    const Component = (props: Record<string, unknown>) => React.createElement(name, props, props.children);
    Component.displayName = name;
    return Component;
  };
  const names = ['Svg', 'Rect', 'Circle', 'Path', 'G', 'Line', 'Polygon', 'Polyline', 'Defs', 'RadialGradient', 'LinearGradient', 'Stop', 'ClipPath', 'Pattern'];
  const mod: Record<string, unknown> = { __esModule: true };
  for (const n of names) mod[n] = make(n);
  mod.default = mod.Svg;
  return mod;
});

// Icon fonts are loaded asynchronously by expo-font; render icons as plain Text in tests.
jest.mock('@expo/vector-icons/MaterialCommunityIcons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  const Icon = ({ name, ...rest }: { name: string }) => React.createElement(Text, { ...rest, testID: `icon-${name}` }, name);
  return { __esModule: true, default: Icon };
});

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
}));
