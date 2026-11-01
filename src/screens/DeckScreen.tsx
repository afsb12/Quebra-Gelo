import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { CategoryId } from '../data/types';

interface DeckScreenProps {
  categoryId: CategoryId;
}

/** Placeholder until US1 (001/T041). */
export function DeckScreen({ categoryId }: DeckScreenProps) {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-app">
      <Text className="font-body text-primary">{categoryId}</Text>
    </SafeAreaView>
  );
}
