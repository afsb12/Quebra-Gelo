import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, Text, View } from 'react-native';

import { strings } from '../i18n/strings';
import { BRAND_SYMBOL, tokens } from '../theme';
import { BrandCardBack } from './BrandCardBack';
import { BrandSymbol } from './BrandSymbol';

export interface MixedHeroCardProps {
  /** Full content width of the Home screen (= the category grid's width). */
  width: number;
  /** System font scale: grows the height floor so nothing is cut (019). Defaults to 1. */
  fontScale?: number;
  /** Starts the mixed deck (the whole card, "Jogar" included). */
  onPress: () => void;
  /** Opens the category filter (006); never starts the game. */
  onOpenFilter: () => void;
  /** Mix summary (015): "10 categorias" or "8 de 10 categorias". */
  filterLabel: string;
}

/** Height / width of the horizontal hero card (visual floor on wide screens). */
export const HERO_RATIO = 0.42;

/** Spacing of the hero card and around it, in pt (019). */
export const HERO_LAYOUT = {
  /** Space above (from the Home header) and below (to the category grid). */
  marginTop: 16,
  marginBottom: 24,
  /** Inner padding, vertical and horizontal. */
  padding: 20,
  /** Between symbol, title, description and the "Jogar" row. */
  gap: 8,
  /** Distance of the filter button from the card's top and right edges. */
  filterInset: 14,
  /** Extra touch area of the filter button on each side. */
  filterHitSlop: 10,
  /** Diameter of the filter button. */
  filterSize: 36,
  /** Right space kept free by the title so it never reaches the filter button. */
  titleReserve: 36,
} as const;

/** Height that fits the padded content: 2 × 20 + title + description + "Jogar" row + gaps + frame (019 R2). */
const HERO_MIN_HEIGHT = 176;
const MAX_FONT_GROWTH = 1.3;

/** Card height: the 0.42 ratio, but never below the padded content (grown with the font scale). */
export const heroHeight = (width: number, fontScale = 1): number => {
  const growth = Math.min(Math.max(fontScale, 1), MAX_FONT_GROWTH);
  return Math.max(Math.round(width * HERO_RATIO), Math.round(HERO_MIN_HEIGHT * growth));
};

const FILTER_HIT_SLOP = {
  top: HERO_LAYOUT.filterHitSlop,
  bottom: HERO_LAYOUT.filterHitSlop,
  left: HERO_LAYOUT.filterHitSlop,
  right: HERO_LAYOUT.filterHitSlop,
} as const;

/**
 * Home entry of the "Tudo Misturado" deck: a wide brand card back above the category grid, with a
 * "Jogar" cue, the mix summary and, alone in the top-right corner, the filter button (019).
 */
export function MixedHeroCard({ width, fontScale = 1, onPress, onOpenFilter, filterLabel }: MixedHeroCardProps) {
  const height = heroHeight(width, fontScale);
  const symbolSize = Math.round(Math.min(height - HERO_LAYOUT.padding * 2, width * 0.3) * 0.75);
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
        <View
          testID="mixed-hero-content"
          className="flex-1 flex-row items-center"
          style={{ padding: HERO_LAYOUT.padding, gap: HERO_LAYOUT.gap }}
        >
          <BrandSymbol size={symbolSize} />
          <View className="flex-1" style={{ gap: HERO_LAYOUT.gap }}>
            <View testID="mixed-hero-title" style={{ paddingRight: HERO_LAYOUT.titleReserve }}>
              <Text className="font-display text-2xl text-primary" numberOfLines={1} adjustsFontSizeToFit>
                {strings.mixed.title}
              </Text>
            </View>
            <Text className="font-body text-sm text-secondary" numberOfLines={2}>
              {strings.mixed.description}
            </Text>
            <View className="flex-row flex-wrap items-center" style={{ gap: HERO_LAYOUT.gap }}>
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
              <Text testID="mix-filter-summary" className="font-body text-sm text-ice" numberOfLines={1}>
                {filterLabel}
              </Text>
            </View>
          </View>
        </View>
      </BrandCardBack>
      {/* Nested press target: the inner Pressable takes the touch, so it never starts the game. */}
      <Pressable
        testID="mix-filter-button"
        accessibilityRole="button"
        accessibilityLabel={`${strings.mixFilter.open}: ${filterLabel}`}
        onPress={onOpenFilter}
        hitSlop={FILTER_HIT_SLOP}
        className="items-center justify-center rounded-full border"
        style={{
          position: 'absolute',
          top: HERO_LAYOUT.filterInset,
          right: HERO_LAYOUT.filterInset,
          width: HERO_LAYOUT.filterSize,
          height: HERO_LAYOUT.filterSize,
          borderColor: tokens.colors.textSecondary,
        }}
      >
        <MaterialCommunityIcons name="cog-outline" size={20} color={tokens.colors.iceBlue} />
      </Pressable>
    </Pressable>
  );
}
