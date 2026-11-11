import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Pressable, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChangeMoodButton } from '../components/ChangeMoodButton';
import { DeckComplete } from '../components/DeckComplete';
import { DeckActionBar } from '../components/DeckActionBar';
import { DeckProgress } from '../components/DeckProgress';
import { DeckStack } from '../components/DeckStack';
import { HintLine } from '../components/HintLine';
import { SwipeCard, type CardFace, type SwipeCardHandle, type SwipeDirection } from '../components/SwipeCard';
import { getNextCategories } from '../data/content';
import { FAVORITES_DECK_ID, MIXED_DECK_ID, type CategoryId, type DeckId } from '../data/types';
import { useDeck } from '../hooks/useDeck';
import { useHaptics } from '../hooks/useHaptics';
import { strings } from '../i18n/strings';
import { useFavoritesStore } from '../store/favorites';
import { DECK_RESERVED_HEIGHT, MIXED_VISUAL, getCardGeometry, getCategoryVisual, progressColor, tokens } from '../theme';

export interface DeckScreenProps {
  deckId: DeckId;
}

/** How long the "Clima trocado" toast stays on screen (011 FR-007). */
const TOAST_MS = 2000;

/** The short swipe hint shows on the first cards of a game only (016). */
const HINT_CARDS = 3;

const openSuggestion = (deckId: CategoryId) => router.replace({ pathname: '/deck/[deckId]', params: { deckId } });

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
    canGoBack,
    goBack,
    reshuffle,
    canChangeMood,
    changeMood,
  } = useDeck(deckId);
  const mixed = deckId === MIXED_DECK_ID;
  // Favorites deck (017): neutral backs + origin badge like the mix, but no "Mudar o clima".
  const neutralBacks = mixed || deckId === FAVORITES_DECK_ID;
  const haptics = useHaptics();
  const window = useWindowDimensions();
  const geometry = getCardGeometry(window, DECK_RESERVED_HEIGHT, window.fontScale);
  const [face, setFace] = useState<CardFace>('down');
  const cardRef = useRef<SwipeCardHandle>(null);
  // Cards shown in this screen so far (016): the swipe hint only shows on the first ones.
  const [shownCount, setShownCount] = useState(1);
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

  // Left = next card (face down); right = previous card, back face up to re-read it (009).
  const handleDiscard = useCallback(
    (direction: SwipeDirection) => {
      setShownCount((n) => n + 1);
      if (direction === 'right') {
        setFace('up');
        goBack();
      } else {
        setFace('down');
        discard();
      }
    },
    [discard, goBack],
  );

  // Each press bumps the nonce, restarting the 2 s timer: toasts never stack.
  const [toastNonce, setToastNonce] = useState(0);
  useEffect(() => {
    if (toastNonce === 0) return undefined;
    const timer = setTimeout(() => setToastNonce(0), TOAST_MS);
    return () => clearTimeout(timer);
  }, [toastNonce]);

  // "Mudar o clima" (011): only on a face-up card; the new card comes face down and the toast
  // never names its category (004).
  const moodEnabled = face === 'up' && canChangeMood;
  const handleChangeMood = useCallback(() => {
    if (!moodEnabled) return;
    setFace('down');
    changeMood();
    haptics.changeMood();
    setToastNonce((n) => n + 1);
    AccessibilityInfo.announceForAccessibility(strings.deck.moodChanged);
  }, [changeMood, haptics, moodEnabled]);

  const completeVisual = deckCategory
    ? getCategoryVisual(deckCategory)
    : deckId === FAVORITES_DECK_ID
      ? { ...MIXED_VISUAL, icon: 'star' }
      : MIXED_VISUAL;
  // Mixed deck: neutral colors, so neither the bar nor the stack hints at the next card (004).
  const barColor = deckCategory ? progressColor(getCategoryVisual(deckCategory).color) : tokens.colors.iceBlue;
  const stackColor = deckCategory ? getCategoryVisual(deckCategory).color : tokens.colors.surface;
  // End screen (018): category decks suggest the next two decks; the mix and favorites do not.
  const suggestions = deckCategory
    ? getNextCategories(deckCategory.id).map((c) => ({ ...getCategoryVisual(c), id: c.id, title: c.title }))
    : [];
  const stackCount = Math.min(2, Math.max(0, position.total - position.index)) as 0 | 1 | 2;

  return (
    <SafeAreaView className="flex-1 bg-app">
      <View className="gap-2 px-4 pb-1 pt-2">
        <View className="flex-row items-center gap-3">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={strings.deck.backHint}
            onPress={goHome}
            hitSlop={12}
            className="h-11 w-11 items-center justify-center rounded-full bg-surface"
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color={tokens.colors.textPrimary} />
          </Pressable>
          {/* In the mixed deck the header stays "Tudo Misturado": it never hints at the next card. */}
          <Text accessibilityRole="header" className="flex-1 font-display text-xl text-primary" numberOfLines={1}>
            {title}
          </Text>
          {current ? (
            <Text
              testID="deck-counter"
              accessibilityLabel={strings.deck.position(position.index, position.total)}
              className="font-question text-base text-secondary"
            >
              {strings.deck.counter(position.index, position.total)}
            </Text>
          ) : null}
        </View>
        {current ? <DeckProgress index={position.index} total={position.total} color={barColor} /> : null}
      </View>

      <View className="flex-1 items-center justify-center">
        {!ready ? null : current && currentCategory ? (
          <View style={{ width: geometry.width, height: geometry.height }}>
            <DeckStack width={geometry.width} height={geometry.height} count={stackCount} color={stackColor} />
            <SwipeCard
              ref={cardRef}
              key={current.id}
              mode={neutralBacks ? 'mixed' : 'category'}
              question={current}
              category={currentCategory}
              visual={getCategoryVisual(currentCategory)}
              isFavorite={isFavorite}
              canGoBack={canGoBack}
              initialFace={face}
              width={geometry.width}
              height={geometry.height}
              screenWidth={window.width}
              fontScale={window.fontScale}
              onFlip={handleFlip}
              onSwipeConfirmed={haptics.discard}
              onDiscard={handleDiscard}
              onToggleFavorite={handleToggleFavorite}
            />
          </View>
        ) : (
          <DeckComplete
            deckTitle={title}
            visual={completeVisual}
            suggestions={suggestions}
            onReshuffle={reshuffle}
            onChooseAnother={() => router.replace('/')}
            onSuggest={openSuggestion}
          />
        )}
      </View>

      {current ? (
        <View className="gap-1 pb-3 pt-2">
          {/* Outside the gesture area: pressing these never flips the card. */}
          <DeckActionBar
            canGoBack={canGoBack}
            favoriteActive={isFavorite}
            favoriteDisabled={face === 'down'}
            onPrevious={() => cardRef.current?.swipe('right')}
            onToggleFavorite={handleToggleFavorite}
            onNext={() => cardRef.current?.swipe('left')}
          />
          <View className="flex-row items-center px-4">
            <View className="w-11" />
            <View className="flex-1">
              <HintLine
                hint={shownCount <= HINT_CARDS ? strings.deck.swipeHint : ''}
                toast={toastNonce > 0 ? strings.deck.moodChanged : undefined}
              />
            </View>
            <View className="w-11 items-end">
              {mixed ? <ChangeMoodButton disabled={!moodEnabled} onPress={handleChangeMood} /> : null}
            </View>
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}
