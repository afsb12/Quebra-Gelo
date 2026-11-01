import { Pressable, Text, View } from 'react-native';

import { strings } from '../i18n/strings';
import { BrandCardBack } from './BrandCardBack';
import { BrandSymbol } from './BrandSymbol';

export interface MixedHeroCardProps {
  /** Full content width of the Home screen. */
  width: number;
  onPress: () => void;
}

/** Height / width of the horizontal hero card. */
export const HERO_RATIO = 0.42;

/** Home entry of the "Tudo Misturado" deck: a wide brand card back above the category grid. */
export function MixedHeroCard({ width, onPress }: MixedHeroCardProps) {
  const height = Math.round(width * HERO_RATIO);
  return (
    <Pressable
      testID="mixed-hero-card"
      accessibilityRole="button"
      accessibilityLabel={strings.mixed.heroLabel}
      onPress={onPress}
      className="active:opacity-80"
      style={{ width }}
    >
      <BrandCardBack width={width} height={height} variant="wide">
        <View className="flex-1 flex-row items-center gap-4 px-5">
          <BrandSymbol size={Math.round(height * 0.62)} />
          <View className="flex-1 gap-1">
            <Text className="font-display text-2xl text-primary" numberOfLines={2}>
              {strings.mixed.title}
            </Text>
            <Text className="font-body text-sm text-secondary" numberOfLines={3}>
              {strings.mixed.description}
            </Text>
          </View>
        </View>
      </BrandCardBack>
    </Pressable>
  );
}
