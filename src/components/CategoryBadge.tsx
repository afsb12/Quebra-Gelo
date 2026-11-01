import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo, type ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { Category } from '../data/types';
import { tokens, type CategoryVisual } from '../theme';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export interface CategoryBadgeProps {
  category: Category;
  visual: CategoryVisual;
}

/** Small pill telling where a mixed-deck question came from: the category icon + name in its color. */
export const CategoryBadge = memo(function CategoryBadge({ category, visual }: CategoryBadgeProps) {
  return (
    <View
      testID="category-badge"
      accessible
      accessibilityLabel={category.title}
      style={[styles.pill, { backgroundColor: visual.color }]}
    >
      <MaterialCommunityIcons name={visual.icon as IconName} size={14} color={visual.onColor} />
      <Text
        testID="category-badge-title"
        style={[styles.title, { color: visual.onColor, fontFamily: tokens.fonts.body }]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.8}
        maxFontSizeMultiplier={1.3}
      >
        {category.title}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    flexShrink: 1,
  },
  title: {
    fontSize: 12,
    flexShrink: 1,
  },
});
