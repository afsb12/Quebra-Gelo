import { View } from 'react-native';

import { strings } from '../i18n/strings';

export interface DeckProgressProps {
  /** 1-based position of the current card. */
  index: number;
  total: number;
  /** Fill color (already contrast-checked against the background, see `progressColor`). */
  color: string;
}

const TRACK = '#2C2738';

/** Thin progress bar under the deck header (016): how far into the deck the current card is. */
export function DeckProgress({ index, total, color }: DeckProgressProps) {
  const ratio = total > 0 ? Math.min(Math.max(index / total, 0), 1) : 0;
  return (
    <View
      testID="deck-progress"
      accessibilityRole="progressbar"
      accessibilityLabel={strings.deck.progressLabel}
      accessibilityValue={{ min: 0, max: total, now: index }}
      className="h-1 w-full overflow-hidden rounded-full"
      style={{ backgroundColor: TRACK }}
    >
      <View testID="deck-progress-fill" className="h-full rounded-full" style={{ width: `${ratio * 100}%`, backgroundColor: color }} />
    </View>
  );
}
