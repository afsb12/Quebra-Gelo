import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo, type ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { Category } from '../data/types';
import { tokens, type CategoryVisual } from '../theme';
import { CategoryPattern } from './CategoryPattern';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export interface CardBackProps {
  category: Category;
  visual: CategoryVisual;
  width: number;
  variant: 'full' | 'mini';
}

/** Splits a title into lines, one word per line, keeping short connectors ("e") with the next word. */
export const titleLines = (title: string): string[] => {
  const words = title.toUpperCase().split(/\s+/);
  const lines: string[] = [];
  for (let i = 0; i < words.length; i += 1) {
    if (words[i].length <= 2 && i + 1 < words.length) {
      lines.push(`${words[i]} ${words[i + 1]}`);
      i += 1;
    } else {
      lines.push(words[i]);
    }
  }
  return lines;
};

/** Face-down side: category color, geometric pattern, big icon and bold name. Never shows a question. */
export const CardBack = memo(function CardBack({ category, visual, width, variant }: CardBackProps) {
  const height = width / tokens.card.ratio;
  const radius = width * tokens.card.radiusRatio;
  const frame = variant === 'mini' ? tokens.card.frame / 2 : tokens.card.frame;
  const innerWidth = width - frame * 2;
  const innerHeight = height - frame * 2;
  const lines = titleLines(category.title);
  const titleSize = Math.round(width * (variant === 'mini' ? 0.12 : 0.11));

  return (
    <View style={[styles.frame, { width, height, borderRadius: radius, padding: frame }]}>
      <View style={[styles.face, { borderRadius: radius - frame, backgroundColor: visual.color }]}>
        <CategoryPattern kind={visual.pattern} color={visual.color} onColor={visual.onColor} width={innerWidth} height={innerHeight} />
        <View style={styles.iconArea}>
          <MaterialCommunityIcons name={visual.icon as IconName} size={Math.round(width * 0.3)} color={visual.onColor} />
        </View>
        <View style={styles.titleArea}>
          <Text
            testID="card-back-title"
            style={[
              styles.title,
              { color: visual.onColor, fontSize: titleSize, lineHeight: titleSize * 1.05, fontFamily: tokens.fonts.display },
            ]}
            numberOfLines={lines.length}
            adjustsFontSizeToFit
            allowFontScaling={false}
          >
            {lines.join('\n')}
          </Text>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  frame: {
    backgroundColor: tokens.colors.cream,
  },
  face: {
    flex: 1,
    overflow: 'hidden',
  },
  iconArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: '6%',
  },
  titleArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: '8%',
  },
  title: {
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});
