import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Text, View } from 'react-native';

import { tokens } from '../theme';

export interface EmptyStateProps {
  title: string;
  message: string;
}

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <View testID="empty-state" className="flex-1 items-center justify-center gap-3 px-10">
      <MaterialCommunityIcons name="star-outline" size={48} color={tokens.colors.textSecondary} />
      <Text accessibilityRole="header" className="text-center font-display text-xl text-primary">
        {title}
      </Text>
      <Text className="text-center font-body text-base text-secondary">{message}</Text>
    </View>
  );
}
