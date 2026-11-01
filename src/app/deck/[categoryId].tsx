import { Redirect, useLocalSearchParams } from 'expo-router';

import { isCategoryId } from '../../data/content';
import { DeckScreen } from '../../screens/DeckScreen';

export default function DeckRoute() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  if (typeof categoryId !== 'string' || !isCategoryId(categoryId)) return <Redirect href="/" />;
  return <DeckScreen categoryId={categoryId} />;
}
