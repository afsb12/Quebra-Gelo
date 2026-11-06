import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, Text, View } from 'react-native';

import { strings } from '../i18n/strings';
import { tokens } from '../theme';
import { BrandCardBack } from './BrandCardBack';
import { BrandSymbol } from './BrandSymbol';

export interface MixedHeroCardProps {
  /** Full content width of the Home screen. */
  width: number;
  /** Starts the mixed deck. */
  onPress: () => void;
  /** Opens the category filter (006); never starts the game. */
  onOpenFilter: () => void;
  /** e.g. "6 de 8 categorias" when the mix is filtered; omitted with every category on. */
  summary?: string;
}

/** Height / width of the horizontal hero card. */
export const HERO_RATIO = 0.42;

/** Home entry of the "Tudo Misturado" deck: a wide brand card back above the category grid. */
export function MixedHeroCard({ width, onPress, onOpenFilter, summary }: MixedHeroCardProps) {
  const height = Math.round(width * HERO_RATIO);
  return (
    <Pressable
      testID="mixed-hero-card"
      accessibilityRole="button"
      accessibilityLabel={summary ? `${strings.mixed.heroLabel} ${summary}.` : strings.mixed.heroLabel}
      onPress={onPress}
      className="active:opacity-80"
      style={{ width }}
    >
      <BrandCardBack width={width} height={height} variant="wide">
        <View className="flex-1 flex-row items-center gap-4 px-5">
          <BrandSymbol size={Math.round(height * 0.62)} />
          <View className="flex-1 gap-1 pr-8">
            <Text className="font-display text-2xl text-primary" numberOfLines={2}>
              {strings.mixed.title}
            </Text>
            <Text className="font-body text-sm text-secondary" numberOfLines={3}>
              {strings.mixed.description}
            </Text>
            {summary ? (
              <Text testID="mix-filter-summary" className="font-body text-xs text-ice" numberOfLines={1}>
                {summary}
              </Text>
            ) : null}
          </View>
        </View>
      </BrandCardBack>
      {/* Nested press target: the inner Pressable takes the touch, so it never starts the game. */}
      <Pressable
        testID="mix-filter-button"
        accessibilityRole="button"
        accessibilityLabel={strings.mixFilter.open}
        onPress={onOpenFilter}
        hitSlop={8}
        className="absolute right-3 top-3 h-11 w-11 items-center justify-center rounded-full"
        style={{ backgroundColor: 'rgba(22, 19, 28, 0.7)' }}
      >
        <MaterialCommunityIcons name="filter-variant" size={22} color={tokens.colors.iceBlue} />
      </Pressable>
    </Pressable>
  );
}
