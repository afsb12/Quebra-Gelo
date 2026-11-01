import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MiniCard } from '../components/MiniCard';
import { MixFilterSheet } from '../components/MixFilterSheet';
import { MixedHeroCard } from '../components/MixedHeroCard';
import { TutorialOverlay } from '../components/TutorialOverlay';
import { getCategories } from '../data/content';
import { isValidMixSelection } from '../data/mixFilter';
import { MIXED_DECK_ID, type CategoryId, type DeckId } from '../data/types';
import { strings } from '../i18n/strings';
import { useMixCategories, useMixFilterStore } from '../store/mixFilter';
import { useOnboardingStore, useShowTutorial } from '../store/onboarding';
import { getCardGeometry, getCategoryVisual, tokens } from '../theme';

const openDeck = (deckId: DeckId) => router.push({ pathname: '/deck/[deckId]', params: { deckId } });

/**
 * Home: the "Tudo Misturado" hero card (with its category filter, 006) above the 8 categories as
 * mini card backs in a 2-column grid (≤ 2 taps to the first card), with the first-launch tutorial
 * on top (005).
 */
export function HomeScreen() {
  const window = useWindowDimensions();
  const { miniWidth } = getCardGeometry(window, 0);
  const contentWidth = window.width - tokens.layout.screenPadding * 2;
  const showTutorial = useShowTutorial();
  const markTutorialSeen = useOnboardingStore((state) => state.markSeen);
  const mixCategories = useMixCategories();
  const saveMixFilter = useMixFilterStore((state) => state.save);
  const [filterOpen, setFilterOpen] = useState(false);
  const [draft, setDraft] = useState<CategoryId[]>([]);

  const categories = getCategories();
  const options = categories.map((category) => ({ category, visual: getCategoryVisual(category) }));
  const summary =
    mixCategories.length < categories.length ? strings.mixFilter.summary(mixCategories.length, categories.length) : undefined;

  const openFilter = () => {
    setDraft(mixCategories);
    setFilterOpen(true);
  };
  const toggleDraft = (id: CategoryId) =>
    setDraft((current) => (current.includes(id) ? current.filter((c) => c !== id) : [...current, id]));
  const saveFilter = () => {
    if (saveMixFilter(draft)) setFilterOpen(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-app">
      <ScrollView contentContainerClassName="px-6 pb-10">
        <View className="flex-row items-center justify-between pb-2 pt-4">
          <Text accessibilityRole="header" className="font-display text-4xl text-primary">
            {strings.home.title}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={strings.home.favorites}
            accessibilityHint={strings.home.openFavoritesHint}
            onPress={() => router.push('/favorites')}
            hitSlop={12}
            className="h-11 flex-row items-center gap-1 rounded-full bg-surface px-4"
          >
            <MaterialCommunityIcons name="star" size={18} color={tokens.colors.textPrimary} />
            <Text className="font-body text-sm text-primary">{strings.home.favorites}</Text>
          </Pressable>
        </View>
        <Text className="pb-6 font-body text-base text-secondary">{strings.home.subtitle}</Text>

        <View style={{ marginBottom: tokens.layout.gridGap }}>
          <MixedHeroCard
            width={contentWidth}
            onPress={() => openDeck(MIXED_DECK_ID)}
            onOpenFilter={openFilter}
            summary={summary}
          />
        </View>

        <View className="flex-row flex-wrap" style={{ gap: tokens.layout.gridGap }}>
          {categories.map((category) => (
            <MiniCard
              key={category.id}
              category={category}
              visual={getCategoryVisual(category)}
              width={miniWidth}
              onPress={openDeck}
            />
          ))}
        </View>
      </ScrollView>
      <MixFilterSheet
        visible={filterOpen}
        options={options}
        selected={draft}
        canSave={isValidMixSelection(draft)}
        onToggle={toggleDraft}
        onSave={saveFilter}
        onClose={() => setFilterOpen(false)}
      />
      <TutorialOverlay visible={showTutorial} onClose={markTutorialSeen} />
    </SafeAreaView>
  );
}
