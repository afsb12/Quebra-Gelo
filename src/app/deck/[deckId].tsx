import { Redirect, useLocalSearchParams } from 'expo-router';

import { isDeckId } from '../../data/content';
import { DeckScreen } from '../../screens/DeckScreen';

export default function DeckRoute() {
  const { deckId } = useLocalSearchParams<{ deckId: string }>();
  if (typeof deckId !== 'string' || !isDeckId(deckId)) return <Redirect href="/" />;
  return <DeckScreen deckId={deckId} />;
}
