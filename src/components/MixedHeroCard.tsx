import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, Text, View } from 'react-native';

import { strings } from '../i18n/strings';
import { BRAND_SYMBOL, tokens } from '../theme';
import { BrandCardBack } from './BrandCardBack';
import { BrandSymbol } from './BrandSymbol';

export interface MixedHeroCardProps {
  /** Full content width of the Home screen. */
  width: number;
  /** Starts the mixed deck (the whole card, "Jogar" included). */
  onPress: () => void;
  /** Opens the category filter (006); never starts the game. */
  onOpenFilter: () => void;
  /** Filter chip text (015): "10 categorias" or "8 de 10 categorias". */
  filterLabel: string;
}

/** Height / width of the horizontal hero card. */
export const HERO_RATIO = 0.42;

/**
 * Home entry of the "Tudo Misturado" deck: a wide brand card back above the category grid, with a
 * "Jogar" cue and a filter chip that always shows how many categories are in the mix (015).
 */
export function MixedHeroCard({ width, onPress, onOpenFilter, filterLabel }: MixedHeroCardProps) {
  const height = Math.round(width * HERO_RATIO);
  return (
    <Pressable
      testID="mixed-hero-card"
      accessibilityRole="button"
      accessibilityLabel={`${strings.mixed.heroLabel} ${filterLabel}.`}
      onPress={onPress}
      className="active:opacity-80"
      style={{ width }}
    >
      <BrandCardBack width={width} height={height} variant="wide">
        <View className="flex-1 flex-row items-center gap-4 px-4">
          <BrandSymbol size={Math.round(height * 0.55)} />
          <View className="flex-1 gap-2">
            <Text className="font-display text-2xl text-primary" numberOfLines={1} adjustsFontSizeToFit>
              {strings.mixed.title}
            </Text>
            <Text className="font-body text-sm text-secondary" numberOfLines={2}>
              {strings.mixed.description}
            </Text>
            <View className="flex-row flex-wrap items-center gap-2">
              <View
                testID="mixed-play-pill"
                className="h-9 flex-row items-center gap-1 rounded-full px-4"
                style={{ backgroundColor: BRAND_SYMBOL.colors.accent }}
              >
                <MaterialCommunityIcons name="play" size={16} color={tokens.colors.onColorDark} />
                <Text className="font-question text-sm" style={{ color: tokens.colors.onColorDark }}>
                  {strings.mixed.play}
                </Text>
              </View>
              {/* Nested press target: the inner Pressable takes the touch, so it never starts the game. */}
              <Pressable
                testID="mix-filter-button"
                accessibilityRole="button"
                accessibilityLabel={`${strings.mixFilter.open}: ${filterLabel}`}
                onPress={onOpenFilter}
                hitSlop={6}
                className="h-9 flex-row items-center gap-1 rounded-full border px-3"
                style={{ borderColor: tokens.colors.textSecondary }}
              >
                <MaterialCommunityIcons name="filter-variant" size={16} color={tokens.colors.iceBlue} />
                <Text testID="mix-filter-summary" className="font-body text-sm text-ice" numberOfLines={1}>
                  {filterLabel}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </BrandCardBack>
    </Pressable>
  );
}
