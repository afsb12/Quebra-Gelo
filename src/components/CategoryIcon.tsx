import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo, type ComponentProps } from 'react';
import Svg, { G, Path } from 'react-native-svg';

import { CUSTOM_ICON_STROKE, CUSTOM_ICONS, isCustomIcon } from '../theme';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export interface CategoryIconProps {
  /** MaterialCommunityIcons glyph name or a `CUSTOM_ICONS` key. */
  name: string;
  /** Side, in pt. */
  size: number;
  color: string;
}

/** Horizontal flip around the center of the 24-unit box. */
const MIRROR = 'translate(24 0) scale(-1 1)';

/**
 * A category's icon: the app's own stroke drawing for a custom icon (e.g. Happy Hour's beer toast,
 * 014), otherwise the MaterialCommunityIcons glyph. Decorative: hidden from screen readers.
 */
export const CategoryIcon = memo(function CategoryIcon({ name, size, color }: CategoryIconProps) {
  if (!isCustomIcon(name)) {
    return <MaterialCommunityIcons name={name as IconName} size={size} color={color} />;
  }
  const { paths, mirrored } = CUSTOM_ICONS[name];
  const stroke = {
    fill: 'none',
    stroke: color,
    strokeWidth: CUSTOM_ICON_STROKE,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  } as const;

  return (
    <Svg
      testID={`icon-${name}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {paths.map((d) => (
        <Path key={d} d={d} {...stroke} />
      ))}
      <G transform={mirrored.transform}>
        <Path d={mirrored.path} {...stroke} />
      </G>
      <G transform={MIRROR}>
        <G transform={mirrored.transform}>
          <Path d={mirrored.path} {...stroke} />
        </G>
      </G>
    </Svg>
  );
});
