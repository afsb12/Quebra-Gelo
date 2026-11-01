import { router } from 'expo-router';
import { Pressable, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getCategories } from '../data/content';
import { strings } from '../i18n/strings';

/** Temporary minimal category list (001/T042); replaced by the mini card grid in US2. */
export function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-app">
      <ScrollView contentContainerClassName="p-6 gap-3">
        <Text className="font-display text-3xl text-primary">{strings.home.title}</Text>
        {getCategories().map((category) => (
          <Pressable
            key={category.id}
            accessibilityRole="button"
            onPress={() => router.push({ pathname: '/deck/[categoryId]', params: { categoryId: category.id } })}
            className="rounded-xl bg-surface p-4"
          >
            <Text className="font-body text-lg text-primary">{category.title}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
