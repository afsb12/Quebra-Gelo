import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo, type ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { Category, Question } from '../data/types';
import { strings } from '../i18n/strings';
import { FRONT_LAYOUT, faceTextBox, questionFit, tokens, type CategoryVisual } from '../theme';
import { Vignette } from './Vignette';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export interface CardFrontProps {
  category: Category;
  visual: CategoryVisual;
  question: Question;
  isFavorite: boolean;
  width: number;
  /** Card height; defaults to the 5:7 ratio. */
  height?: number;
  /** OS font scale (PixelRatio.getFontScale()); text never renders below 20pt. */
  fontScale?: number;
}

/** Revealed side: cream paper, dark question text, category-colored frame, icon and footer. */
export const CardFront = memo(function CardFront({
  category,
  visual,
  question,
  isFavorite,
  width,
  height = width / tokens.card.ratio,
  fontScale = 1,
}: CardFrontProps) {
  const radius = width * tokens.card.radiusRatio;
  const box = faceTextBox(width, height);
  const fit = questionFit(question.text, box.width, box.height, fontScale);
  const { frame, innerFrame, innerInset } = tokens.card;

  return (
    <View style={[styles.card, { width, height, borderRadius: radius }]}>
      <Vignette width={width} height={height} tint="#6B4A1F" strength={0.1} />
      <View
        pointerEvents="none"
        style={[
          styles.innerFrame,
          {
            top: frame + innerInset - FRONT_LAYOUT.padding / 2,
            left: frame + innerInset - FRONT_LAYOUT.padding / 2,
            right: frame + innerInset - FRONT_LAYOUT.padding / 2,
            bottom: frame + innerInset - FRONT_LAYOUT.padding / 2,
            borderColor: visual.ink,
            borderWidth: innerFrame,
            borderRadius: Math.max(radius - innerInset, 4),
          },
        ]}
      />
      <View style={[styles.content, { padding: frame + innerInset + FRONT_LAYOUT.padding }]}>
        <View style={styles.topRow}>
          <MaterialCommunityIcons name={visual.icon as IconName} size={28} color={visual.ink} />
          {isFavorite ? (
            <View pointerEvents="none" accessibilityLabel={strings.card.favoritedIndicator} testID="favorite-indicator">
              <MaterialCommunityIcons name="star" size={22} color={visual.ink} />
            </View>
          ) : null}
        </View>
        <View style={styles.questionArea}>
          <Text
            testID="card-front-question"
            style={[styles.question, { fontSize: fit.fontSize, lineHeight: fit.lineHeight, fontFamily: tokens.fonts.question }]}
            adjustsFontSizeToFit
            minimumFontScale={fit.minimumFontScale}
            allowFontScaling
          >
            {question.text}
          </Text>
        </View>
        <Text
          testID="card-front-footer"
          style={[styles.footer, { color: visual.ink, fontFamily: tokens.fonts.body }]}
          numberOfLines={1}
          maxFontSizeMultiplier={1.4}
        >
          {category.title.toUpperCase()}
        </Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: tokens.colors.cream,
    overflow: 'hidden',
  },
  innerFrame: {
    position: 'absolute',
  },
  content: {
    flex: 1,
  },
  topRow: {
    height: FRONT_LAYOUT.topRow,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  questionArea: {
    flex: 1,
    justifyContent: 'center',
  },
  question: {
    color: tokens.colors.questionInk,
    textAlign: 'left',
  },
  footer: {
    height: FRONT_LAYOUT.footer,
    fontSize: tokens.type.footerSize,
    letterSpacing: 1.5,
    textAlignVertical: 'bottom',
    paddingTop: 10,
  },
});
