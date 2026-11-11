import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, Text, View } from 'react-native';

import { strings } from '../i18n/strings';
import { tokens } from '../theme';
import { FavoriteButton } from './FavoriteButton';

export interface DeckActionBarProps {
  /** False on the first card: "Anterior" is disabled. */
  canGoBack: boolean;
  favoriteActive: boolean;
  /** True while the card is face down. */
  favoriteDisabled: boolean;
  onPrevious: () => void;
  onToggleFavorite: () => void;
  onNext: () => void;
}

interface SideButtonProps {
  testID: string;
  icon: 'chevron-left' | 'chevron-right';
  label: string;
  accessibilityLabel: string;
  disabled?: boolean;
  onPress: () => void;
}

function SideButton({ testID, icon, label, accessibilityLabel, disabled = false, onPress }: SideButtonProps) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      className={`h-14 w-[76px] items-center justify-center gap-0.5 rounded-2xl bg-surface active:opacity-80 ${disabled ? 'opacity-40' : ''}`}
    >
      <MaterialCommunityIcons name={icon} size={22} color={tokens.colors.textPrimary} />
      <Text className="font-body text-xs text-primary">{label}</Text>
    </Pressable>
  );
}

/**
 * Buttons under the card (016): "Anterior" / "Favoritar" / "Próxima", an alternative to the swipe
 * gestures. They sit outside the gesture area, so pressing them never flips the card.
 */
export function DeckActionBar({
  canGoBack,
  favoriteActive,
  favoriteDisabled,
  onPrevious,
  onToggleFavorite,
  onNext,
}: DeckActionBarProps) {
  return (
    <View testID="deck-action-bar" className="w-full flex-row items-center gap-3 px-6">
      <SideButton
        testID="deck-previous-button"
        icon="chevron-left"
        label={strings.deck.previous}
        accessibilityLabel={strings.deck.previousLabel}
        disabled={!canGoBack}
        onPress={onPrevious}
      />
      <View className="flex-1 items-stretch">
        <FavoriteButton active={favoriteActive} disabled={favoriteDisabled} onPress={onToggleFavorite} />
      </View>
      <SideButton
        testID="deck-next-button"
        icon="chevron-right"
        label={strings.deck.next}
        accessibilityLabel={strings.deck.nextLabel}
        onPress={onNext}
      />
    </View>
  );
}
