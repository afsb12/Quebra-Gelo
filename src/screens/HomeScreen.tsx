import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandSymbol } from '../components/BrandSymbol';
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
 * Home: brand row, the "Sobre o que vamos conversar?" header, the "Tudo Misturado" hero card (with
 * its category filter chip, 006/015) above the categories as mini card backs in a 3-column grid
 * (015; ≤ 2 taps to the first card), with the first-launch tutorial on top (005).
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
  const filterLabel = strings.mixFilter.chip(mixCategories.length, categories.length);

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
        <View className="flex-row items-center justify-between pb-4 pt-4">
          <View className="flex-row items-center gap-2">
            <BrandSymbol size={28} />
            <Text className="font-display text-xl text-primary">{strings.home.title}</Text>
          </View>
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
        <Text testID="home-question" accessibilityRole="header" className="pb-5 font-display text-3xl text-primary">
          {strings.home.question}
        </Text>

        <View style={{ marginBottom: tokens.layout.gridGap + 8 }}>
          <MixedHeroCard
            width={contentWidth}
            onPress={() => openDeck(MIXED_DECK_ID)}
            onOpenFilter={openFilter}
            filterLabel={filterLabel}
          />
        </View>

        <Text className="pb-3 font-body text-xs uppercase tracking-widest text-secondary">{strings.home.decksLabel}</Text>
        <View testID="home-grid" className="flex-row flex-wrap" style={{ gap: tokens.layout.homeGridGap }}>
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
