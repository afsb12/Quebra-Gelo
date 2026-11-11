import { Pressable, View } from 'react-native';

import type { Category, CategoryId } from '../data/types';
import type { CategoryVisual } from '../theme';
import { CardBack } from './CardBack';

export interface MiniCardProps {
  category: Category;
  visual: CategoryVisual;
  width: number;
  onPress: (id: CategoryId) => void;
}

/**
 * Home grid tile (015): just the category's mini card back, whose face already prints the name.
 * The description is not shown but stays in the accessibility label.
 */
export function MiniCard({ category, visual, width, onPress }: MiniCardProps) {
  return (
    <Pressable
      testID={`mini-card-${category.id}`}
      accessibilityRole="button"
      accessibilityLabel={`${category.title}. ${category.description}`}
      onPress={() => onPress(category.id)}
      className="active:opacity-80"
      style={{ width }}
    >
      <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <CardBack category={category} visual={visual} width={width} variant="mini" />
      </View>
    </Pressable>
  );
}
