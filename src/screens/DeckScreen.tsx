import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { AccessibilityInfo, Pressable, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DeckComplete } from '../components/DeckComplete';
import { FavoriteButton } from '../components/FavoriteButton';
import { HintLine } from '../components/HintLine';
import { ReshuffleButton } from '../components/ReshuffleButton';
import { SwipeCard, type CardFace } from '../components/SwipeCard';
import { MIXED_DECK_ID, type DeckId } from '../data/types';
import { useDeck } from '../hooks/useDeck';
import { useHaptics } from '../hooks/useHaptics';
import { strings } from '../i18n/strings';
import { useFavoritesStore } from '../store/favorites';
import { DECK_RESERVED_HEIGHT, MIXED_VISUAL, getCardGeometry, getCategoryVisual, tokens } from '../theme';

export interface DeckScreenProps {
  deckId: DeckId;
}

/** How long the "Cartas embaralhadas" toast stays on screen (008 FR-011). */
const TOAST_MS = 2000;

const goHome = () => {
  if (router.canGoBack()) router.back();
  else router.replace('/');
};

export function DeckScreen({ deckId }: DeckScreenProps) {
  const {
    title,
    deckCategory,
    current,
    currentCategory,
    position,
    ready,
    discard,
    reshuffle,
    canReshuffleRemaining,
    reshuffleRemaining,
  } = useDeck(deckId);
  const mixed = deckId === MIXED_DECK_ID;
  const haptics = useHaptics();
  const window = useWindowDimensions();
  const geometry = getCardGeometry(window, DECK_RESERVED_HEIGHT, window.fontScale);
  const [face, setFace] = useState<CardFace>('down');
  const toggleFavorite = useFavoritesStore((state) => state.toggle);
  const isFavorite = useFavoritesStore((state) => (current ? state.favorites.some((f) => f.questionId === current.id) : false));

  const handleToggleFavorite = useCallback(() => {
    if (current) toggleFavorite(current.id);
  }, [current, toggleFavorite]);

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

  // Each press bumps the nonce, restarting the 2 s timer: toasts never stack.
  const [toastNonce, setToastNonce] = useState(0);
  useEffect(() => {
    if (toastNonce === 0) return undefined;
    const timer = setTimeout(() => setToastNonce(0), TOAST_MS);
    return () => clearTimeout(timer);
  }, [toastNonce]);

  const handleReshuffle = useCallback(() => {
    if (!canReshuffleRemaining) return;
    reshuffleRemaining();
    haptics.reshuffle();
    setToastNonce((n) => n + 1);
    AccessibilityInfo.announceForAccessibility(strings.deck.reshuffled);
  }, [canReshuffleRemaining, haptics, reshuffleRemaining]);

  const completeVisual = deckCategory ? getCategoryVisual(deckCategory) : MIXED_VISUAL;

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
          {/* In the mixed deck the header stays "Tudo Misturado": it never hints at the next card. */}
          <Text accessibilityRole="header" className="font-display text-xl text-primary" numberOfLines={1}>
            {title}
          </Text>
          {current ? (
            <Text className="font-body text-sm text-secondary">{strings.deck.position(position.index, position.total)}</Text>
          ) : null}
        </View>
      </View>

      <View className="flex-1 items-center justify-center">
        {!ready ? null : current && currentCategory ? (
          <SwipeCard
            key={current.id}
            mode={mixed ? 'mixed' : 'category'}
            question={current}
            category={currentCategory}
            visual={getCategoryVisual(currentCategory)}
            isFavorite={isFavorite}
            width={geometry.width}
            height={geometry.height}
            screenWidth={window.width}
            fontScale={window.fontScale}
            onFlip={handleFlip}
            onSwipeConfirmed={haptics.discard}
            onDiscard={handleDiscard}
            onToggleFavorite={handleToggleFavorite}
          />
        ) : (
          <DeckComplete deckTitle={title} visual={completeVisual} onReshuffle={reshuffle} onChooseAnother={() => router.replace('/')} />
        )}
      </View>

      {current ? (
        <View className="items-center gap-3 pb-6 pt-2">
          {/* Outside the gesture area: pressing these never flips or discards the card. */}
          <View className="w-full flex-row items-center px-3">
            <View className="flex-1" />
            <FavoriteButton active={isFavorite} disabled={face === 'down'} onPress={handleToggleFavorite} />
            <View className="min-w-11 flex-1 items-end">
              <ReshuffleButton disabled={!canReshuffleRemaining} onPress={handleReshuffle} />
            </View>
          </View>
          <HintLine hint={strings.deck.tapHint} toast={toastNonce > 0 ? strings.deck.reshuffled : undefined} />
        </View>
      ) : null}
    </SafeAreaView>
  );
}
