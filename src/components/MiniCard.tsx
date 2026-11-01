import { Pressable, Text, View } from 'react-native';

import type { Category, CategoryId } from '../data/types';
import type { CategoryVisual } from '../theme';
import { CardBack } from './CardBack';

export interface MiniCardProps {
  category: Category;
  visual: CategoryVisual;
  width: number;
  onPress: (id: CategoryId) => void;
}

/** Home grid item: a miniature of the category's card back with name and description below. */
export function MiniCard({ category, visual, width, onPress }: MiniCardProps) {
  return (
    <Pressable
      testID={`mini-card-${category.id}`}
      accessibilityRole="button"
      accessibilityLabel={`${category.title}. ${category.description}`}
      onPress={() => onPress(category.id)}
      className="gap-2 active:opacity-80"
      style={{ width }}
    >
      <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <CardBack category={category} visual={visual} width={width} variant="mini" />
      </View>
      <Text className="font-display text-base text-primary" numberOfLines={2}>
        {category.title}
      </Text>
      <Text className="font-body text-sm text-secondary" numberOfLines={3}>
        {category.description}
      </Text>
    </Pressable>
  );
}
