import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import type { CategoryId } from '../data/types';
import { strings } from '../i18n/strings';
import { tokens } from '../theme';
import { CategoryIcon } from './CategoryIcon';

/** Colors and icon of the end screen; a `CategoryVisual` satisfies it, the mixed deck passes `MIXED_VISUAL`. */
export interface DeckCompleteVisual {
  color: string;
  onColor: string;
  icon: string;
}

/** A next-deck suggestion (018). */
export interface DeckCompleteSuggestion extends DeckCompleteVisual {
  id: CategoryId;
  title: string;
}

export interface DeckCompleteProps {
  /** Category name, "Tudo Misturado" or "Favoritas". */
  deckTitle: string;
  visual: DeckCompleteVisual;
  /** Category decks only: decks to play next; omitted/empty hides the section (018). */
  suggestions?: DeckCompleteSuggestion[];
  onReshuffle: () => void;
  /** "Ver todos os baralhos": back to Home. */
  onChooseAnother: () => void;
  onSuggest?: (id: CategoryId) => void;
}

const FAN_W = 96;
const FAN_H = 134;
/** Back cards of the fan: rotation and horizontal shift (canvas "Fim do baralho — proposta"). */
const FAN_SIDES = [
  { rotate: '-18deg', x: -48 },
  { rotate: '18deg', x: 48 },
] as const;

function FanCard({ color, children, testID }: { color: string; children?: ReactNode; testID?: string }) {
  return (
    <View className="rounded-xl bg-cream p-1" style={{ width: FAN_W, height: FAN_H }}>
      <View testID={testID} className="flex-1 items-center justify-center rounded-lg" style={{ backgroundColor: color }}>
        {children}
      </View>
    </View>
  );
}

/**
 * "Fim do Baralho" (018): a decorative fan of face-down cards, the message, "Embaralhar de novo",
 * up to two next-deck suggestions and a link back to every deck. Never restarts automatically.
 */
export function DeckComplete({ deckTitle, visual, suggestions = [], onReshuffle, onChooseAnother, onSuggest }: DeckCompleteProps) {
  return (
    <ScrollView testID="deck-complete" className="w-full" contentContainerClassName="items-center gap-6 px-6 py-6">
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={{ width: FAN_W * 2.3, height: FAN_H + 36 }}
        className="items-center"
      >
        {FAN_SIDES.map((side) => (
          <View
            key={side.rotate}
            className="absolute"
            style={{ top: 12, opacity: 0.8, transform: [{ translateX: side.x }, { rotate: side.rotate }] }}
          >
            <FanCard color={visual.color} />
          </View>
        ))}
        <View className="absolute" style={{ top: 0 }}>
          <FanCard color={visual.color} testID="deck-complete-face">
            <CategoryIcon name={visual.icon} size={40} color={visual.onColor} />
          </FanCard>
        </View>
      </View>

      <View className="items-center gap-2">
        <Text accessibilityRole="header" className="text-center font-display text-3xl text-primary">
          {strings.deckComplete.title}
        </Text>
        <Text className="text-center font-body text-base text-secondary">{strings.deckComplete.message(deckTitle)}</Text>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={onReshuffle}
        className="h-14 w-full flex-row items-center justify-center gap-2 rounded-full bg-cream active:opacity-80"
      >
        <MaterialCommunityIcons name="shuffle-variant" size={20} color={tokens.colors.questionInk} />
        <Text className="font-question text-base text-ink">{strings.deckComplete.reshuffle}</Text>
      </Pressable>

      {suggestions.length > 0 ? (
        <View testID="deck-suggestions" className="w-full gap-3">
          <Text className="font-body text-xs uppercase tracking-widest text-secondary">{strings.deckComplete.suggestions}</Text>
          <View className="flex-row gap-3">
            {suggestions.map((s) => (
              <Pressable
                key={s.id}
                testID={`deck-suggestion-${s.id}`}
                accessibilityRole="button"
                accessibilityLabel={strings.deckComplete.suggestionLabel(s.title)}
                onPress={() => onSuggest?.(s.id)}
                className="h-[72px] flex-1 flex-row items-center gap-3 rounded-2xl bg-surface px-3 active:opacity-80"
              >
                <View className="rounded-md bg-cream p-0.5" style={{ width: 36, height: 50 }}>
                  <View className="flex-1 items-center justify-center rounded" style={{ backgroundColor: s.color }}>
                    <CategoryIcon name={s.icon} size={18} color={s.onColor} />
                  </View>
                </View>
                <Text className="flex-1 font-question text-sm text-primary" numberOfLines={2}>
                  {s.title}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}

      <Pressable accessibilityRole="button" onPress={onChooseAnother} hitSlop={8} className="h-12 items-center justify-center px-4">
        <Text className="font-body text-base text-ice">{strings.deckComplete.chooseAnother}</Text>
      </Pressable>
    </ScrollView>
  );
}
