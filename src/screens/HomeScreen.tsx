import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MiniCard } from '../components/MiniCard';
import { getCategories } from '../data/content';
import type { CategoryId } from '../data/types';
import { strings } from '../i18n/strings';
import { getCardGeometry, getCategoryVisual, tokens } from '../theme';

const openDeck = (categoryId: CategoryId) => router.push({ pathname: '/deck/[categoryId]', params: { categoryId } });

/** Home: the 8 categories as mini card backs in a 2-column grid (≤ 2 taps to the first card). */
export function HomeScreen() {
  const window = useWindowDimensions();
  const { miniWidth } = getCardGeometry(window, 0);

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

        <View className="flex-row flex-wrap" style={{ gap: tokens.layout.gridGap }}>
          {getCategories().map((category) => (
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
    </SafeAreaView>
  );
}
