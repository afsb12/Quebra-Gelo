import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';
import { Pressable, Text, View } from 'react-native';

import type { Category, Question } from '../data/types';
import { strings } from '../i18n/strings';
import { tokens, type CategoryVisual } from '../theme';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export interface FavoriteListItemProps {
  question: Question;
  category: Category;
  visual: CategoryVisual;
  onRemove: () => void;
}

/** A saved question with its category identity (color accent, icon, name) and a remove action. */
export function FavoriteListItem({ question, category, visual, onRemove }: FavoriteListItemProps) {
  return (
    <View
      testID={`favorite-item-${question.id}`}
      className="flex-row overflow-hidden rounded-2xl bg-cream"
      style={{ borderRadius: 16 }}
    >
      <View testID="favorite-accent" className="w-2" style={{ backgroundColor: visual.color }} />
      <View className="flex-1 gap-2 p-4">
        <View className="flex-row items-center gap-2">
          <MaterialCommunityIcons name={visual.icon as IconName} size={18} color={visual.ink} />
          <Text testID="favorite-category" className="font-body text-xs uppercase tracking-widest" style={{ color: visual.ink }}>
            {category.title}
          </Text>
        </View>
        <Text className="font-question text-lg text-ink">{question.text}</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={strings.favorites.removeLabel(question.text)}
        onPress={onRemove}
        hitSlop={8}
        className="items-center justify-center px-4"
      >
        <MaterialCommunityIcons name="star" size={24} color={tokens.colors.questionInk} />
      </Pressable>
    </View>
  );
}
