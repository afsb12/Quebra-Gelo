import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, Text } from 'react-native';

import { strings } from '../i18n/strings';
import { tokens } from '../theme';

export interface FavoriteButtonProps {
  active: boolean;
  disabled: boolean;
  onPress: () => void;
}

/** Fixed star button rendered below the card, outside the gesture area; disabled while face down. */
export function FavoriteButton({ active, disabled, onPress }: FavoriteButtonProps) {
  const label = active ? strings.favoriteButton.remove : strings.favoriteButton.add;
  return (
    <Pressable
      testID="favorite-button"
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled, selected: active }}
      disabled={disabled}
      onPress={onPress}
      hitSlop={8}
      className={`h-14 flex-row items-center justify-center gap-2 rounded-full px-6 ${
        disabled ? 'bg-surface opacity-40' : active ? 'bg-cream' : 'bg-surface'
      }`}
    >
      <MaterialCommunityIcons
        name={active ? 'star' : 'star-outline'}
        size={24}
        color={active ? tokens.colors.questionInk : tokens.colors.textPrimary}
      />
      <Text className={`font-body text-base ${active ? 'text-ink' : 'text-primary'}`}>{label}</Text>
    </Pressable>
  );
}
