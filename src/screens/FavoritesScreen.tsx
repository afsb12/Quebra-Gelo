import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '../components/EmptyState';
import { FavoriteListItem } from '../components/FavoriteListItem';
import { FilterChips, type FilterChip } from '../components/FilterChips';
import { getCategories } from '../data/content';
import { FAVORITES_DECK_ID } from '../data/types';
import { useFavoriteQuestions } from '../hooks/useFavoriteQuestions';
import { strings } from '../i18n/strings';
import { useFavoritesStore } from '../store/favorites';
import { useProgressStore } from '../store/progress';
import { BRAND_SYMBOL, getCategoryVisual, progressColor, tokens } from '../theme';

const ALL = 'all';

const goBack = () => {
  if (router.canGoBack()) router.back();
  else router.replace('/');
};

/**
 * Saved questions (017): count, single-select category chips, the list as small cream cards and a
 * "Jogar com as favoritas" button that deals every favorite as a fresh deck.
 */
export function FavoritesScreen() {
  const entries = useFavoriteQuestions();
  const remove = useFavoritesStore((state) => state.remove);
  const resetDeck = useProgressStore((state) => state.resetDeck);
  const [selected, setSelected] = useState<string>(ALL);

  // Chips for the categories that have favorites, in content order.
  const chips = useMemo<FilterChip[]>(() => {
    const present = new Set(entries.map((entry) => entry.category.id));
    return [
      { id: ALL, label: strings.favorites.all, dotColor: BRAND_SYMBOL.colors.accent },
      ...getCategories()
        .filter((category) => present.has(category.id))
        .map((category) => ({ id: category.id, label: category.title, dotColor: progressColor(category.color) })),
    ];
  }, [entries]);

  // A category left without favorites falls back to "Todas" (FR-005).
  const filter = chips.some((chip) => chip.id === selected) ? selected : ALL;
  const visible = filter === ALL ? entries : entries.filter((entry) => entry.category.id === filter);

  const play = () => {
    // Always a fresh deck with the favorites saved right now (FR-002).
    resetDeck(FAVORITES_DECK_ID);
    router.push({ pathname: '/deck/[deckId]', params: { deckId: FAVORITES_DECK_ID } });
  };

  return (
    <SafeAreaView className="flex-1 bg-app">
      <View className="flex-row items-center gap-3 px-4 py-2">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={strings.deck.backHint}
          onPress={goBack}
          hitSlop={12}
          className="h-11 w-11 items-center justify-center rounded-full bg-surface"
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={tokens.colors.textPrimary} />
        </Pressable>
        <Text accessibilityRole="header" className="flex-1 font-display text-2xl text-primary">
          {strings.favorites.title}
        </Text>
        {entries.length > 0 ? (
          <Text testID="favorites-count" className="font-body text-sm text-secondary">
            {strings.favorites.count(entries.length)}
          </Text>
        ) : null}
      </View>

      {entries.length === 0 ? (
        <EmptyState title={strings.favorites.emptyTitle} message={strings.favorites.emptyMessage} />
      ) : (
        <>
          <View>
            <FilterChips chips={chips} selected={filter} onSelect={setSelected} label={strings.favorites.filterLabel} />
          </View>
          <FlatList
            data={visible}
            keyExtractor={(entry) => entry.question.id}
            contentContainerClassName="gap-3 px-4 pb-28 pt-2"
            renderItem={({ item }) => (
              <FavoriteListItem
                question={item.question}
                category={item.category}
                visual={getCategoryVisual(item.category)}
                onRemove={() => remove(item.question.id)}
              />
            )}
          />
          <View className="absolute bottom-0 left-0 right-0 bg-app px-6 pb-6 pt-3">
            <Pressable
              testID="favorites-play"
              accessibilityRole="button"
              accessibilityLabel={strings.favorites.play}
              onPress={play}
              className="h-14 flex-row items-center justify-center gap-2 rounded-full active:opacity-80"
              style={{ backgroundColor: BRAND_SYMBOL.colors.accent }}
            >
              <MaterialCommunityIcons name="play" size={20} color={tokens.colors.onColorDark} />
              <Text className="font-question text-base" style={{ color: tokens.colors.onColorDark }}>
                {strings.favorites.play}
              </Text>
            </Pressable>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
