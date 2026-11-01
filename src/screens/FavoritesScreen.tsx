import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '../components/EmptyState';
import { FavoriteListItem } from '../components/FavoriteListItem';
import { useFavoriteQuestions } from '../hooks/useFavoriteQuestions';
import { strings } from '../i18n/strings';
import { useFavoritesStore } from '../store/favorites';
import { getCategoryVisual, tokens } from '../theme';

const goBack = () => {
  if (router.canGoBack()) router.back();
  else router.replace('/');
};

export function FavoritesScreen() {
  const entries = useFavoriteQuestions();
  const remove = useFavoritesStore((state) => state.remove);

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
        <Text accessibilityRole="header" className="font-display text-xl text-primary">
          {strings.favorites.title}
        </Text>
      </View>

      {entries.length === 0 ? (
        <EmptyState title={strings.favorites.emptyTitle} message={strings.favorites.emptyMessage} />
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(entry) => entry.question.id}
          contentContainerClassName="gap-3 p-4 pb-10"
          renderItem={({ item }) => (
            <FavoriteListItem
              question={item.question}
              category={item.category}
              visual={getCategoryVisual(item.category)}
              onRemove={() => remove(item.question.id)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}
