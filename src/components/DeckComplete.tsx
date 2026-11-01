import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';
import { Pressable, Text, View } from 'react-native';

import type { Category } from '../data/types';
import { strings } from '../i18n/strings';
import type { CategoryVisual } from '../theme';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export interface DeckCompleteProps {
  category: Category;
  visual: CategoryVisual;
  onReshuffle: () => void;
  onChooseAnother: () => void;
}

/** "Fim do Baralho": shown after the last card; never restarts automatically. */
export function DeckComplete({ category, visual, onReshuffle, onChooseAnother }: DeckCompleteProps) {
  return (
    <View
      testID="deck-complete"
      className="mx-6 items-center gap-4 rounded-3xl p-8"
      style={{ backgroundColor: visual.color }}
    >
      <MaterialCommunityIcons name={visual.icon as IconName} size={56} color={visual.onColor} />
      <Text accessibilityRole="header" className="text-center font-display text-3xl" style={{ color: visual.onColor }}>
        {strings.deckComplete.title}
      </Text>
      <Text className="text-center font-body text-base" style={{ color: visual.onColor }}>
        {strings.deckComplete.message(category.title)}
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={onReshuffle}
        className="mt-2 w-full items-center rounded-full py-4"
        style={{ backgroundColor: visual.onColor }}
      >
        <Text className="font-display text-base" style={{ color: visual.color }}>
          {strings.deckComplete.reshuffle}
        </Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        onPress={onChooseAnother}
        className="w-full items-center rounded-full border-2 py-4"
        style={{ borderColor: visual.onColor }}
      >
        <Text className="font-display text-base" style={{ color: visual.onColor }}>
          {strings.deckComplete.chooseAnother}
        </Text>
      </Pressable>
    </View>
  );
}
