import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { strings } from '../i18n/strings';

/** Placeholder until US3 (001/T054). */
export function FavoritesScreen() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-app">
      <Text className="font-body text-primary">{strings.favorites.title}</Text>
    </SafeAreaView>
  );
}
