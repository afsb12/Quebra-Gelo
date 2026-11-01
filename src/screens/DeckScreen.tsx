import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DeckComplete } from '../components/DeckComplete';
import { SwipeCard, type CardFace } from '../components/SwipeCard';
import type { CategoryId } from '../data/types';
import { useDeck } from '../hooks/useDeck';
import { useHaptics } from '../hooks/useHaptics';
import { strings } from '../i18n/strings';
import { DECK_RESERVED_HEIGHT, getCardGeometry, getCategoryVisual, tokens } from '../theme';

export interface DeckScreenProps {
  categoryId: CategoryId;
}

const goHome = () => {
  if (router.canGoBack()) router.back();
  else router.replace('/');
};

export function DeckScreen({ categoryId }: DeckScreenProps) {
  const { category, current, position, ready, discard, reshuffle } = useDeck(categoryId);
  const haptics = useHaptics();
  const window = useWindowDimensions();
  const visual = getCategoryVisual(category);
  const geometry = getCardGeometry(window, DECK_RESERVED_HEIGHT, window.fontScale);
  const [, setFace] = useState<CardFace>('down');

  const handleFlip = useCallback(
    (next: CardFace) => {
      setFace(next);
      haptics.flip();
    },
    [haptics],
  );

  const handleDiscard = useCallback(() => {
    setFace('down');
    discard();
  }, [discard]);

  return (
    <SafeAreaView className="flex-1 bg-app">
      <View className="flex-row items-center gap-3 px-4 py-2">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={strings.deck.backHint}
          onPress={goHome}
          hitSlop={12}
          className="h-11 w-11 items-center justify-center rounded-full bg-surface"
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={tokens.colors.textPrimary} />
        </Pressable>
        <View className="flex-1">
          <Text accessibilityRole="header" className="font-display text-xl text-primary" numberOfLines={1}>
            {category.title}
          </Text>
          {current ? (
            <Text className="font-body text-sm text-secondary">{strings.deck.position(position.index, position.total)}</Text>
          ) : null}
        </View>
      </View>

      <View className="flex-1 items-center justify-center">
        {!ready ? null : current ? (
          <SwipeCard
            key={current.id}
            question={current}
            category={category}
            visual={visual}
            isFavorite={false}
            width={geometry.width}
            height={geometry.height}
            screenWidth={window.width}
            fontScale={window.fontScale}
            onFlip={handleFlip}
            onSwipeConfirmed={haptics.discard}
            onDiscard={handleDiscard}
            onToggleFavorite={() => undefined}
          />
        ) : (
          <DeckComplete category={category} visual={visual} onReshuffle={reshuffle} onChooseAnother={() => router.replace('/')} />
        )}
      </View>

      {current ? (
        <Text className="pb-6 text-center font-body text-sm text-secondary">{strings.deck.tapHint}</Text>
      ) : null}
    </SafeAreaView>
  );
}
