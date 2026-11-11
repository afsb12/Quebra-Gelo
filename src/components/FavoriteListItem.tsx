import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, Text, View } from 'react-native';

import type { Category, Question } from '../data/types';
import { strings } from '../i18n/strings';
import { tokens, type CategoryVisual } from '../theme';
import { CategoryIcon } from './CategoryIcon';

export interface FavoriteListItemProps {
  question: Question;
  category: Category;
  visual: CategoryVisual;
  onRemove: () => void;
}

/**
 * A saved question as a small cream card (017): a header with the category icon and name in its
 * front-face color plus the remove star, then the question.
 */
export function FavoriteListItem({ question, category, visual, onRemove }: FavoriteListItemProps) {
  return (
    <View testID={`favorite-item-${question.id}`} className="gap-2 rounded-2xl bg-cream pb-4 pl-4 pr-2 pt-2">
      <View className="flex-row items-center gap-2">
        <CategoryIcon name={visual.icon} size={18} color={visual.ink} />
        <Text
          testID="favorite-category"
          className="flex-1 font-body text-xs uppercase tracking-widest"
          style={{ color: visual.ink }}
          numberOfLines={1}
        >
          {category.title}
        </Text>
        <Pressable
          testID="favorite-remove"
          accessibilityRole="button"
          accessibilityLabel={strings.favorites.removeLabel(question.text)}
          onPress={onRemove}
          className="h-11 w-11 items-center justify-center"
        >
          <MaterialCommunityIcons name="star" size={22} color={tokens.colors.questionInk} />
        </Pressable>
      </View>
      <Text className="pr-2 font-question text-lg text-ink">{question.text}</Text>
    </View>
  );
}
