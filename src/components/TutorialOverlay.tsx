import { Modal, Pressable, Text, useWindowDimensions, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { strings } from '../i18n/strings';
import { tokens } from '../theme';
import { BrandCardBack } from './BrandCardBack';
import { TutorialHintIcon } from './TutorialHintIcon';

export interface TutorialOverlayProps {
  visible: boolean;
  /** Called by every closing path: "Pular", a tap outside the card, Android back. */
  onClose: () => void;
}

const BACKDROP = 'rgba(0, 0, 0, 0.8)';
const MAX_CARD_WIDTH = 220;
const ignore = () => undefined;

/**
 * First-launch tutorial (005): a single overlay over Home with a face-down example card and three
 * short hints. Taps on the card are absorbed; any other tap closes it.
 */
export function TutorialOverlay({ visible, onClose }: TutorialOverlayProps) {
  const reducedMotion = useReducedMotion();
  const window = useWindowDimensions();
  const cardWidth = Math.min(window.width * 0.5, MAX_CARD_WIDTH);
  const ink = tokens.colors.textPrimary;

  if (!visible) return null;

  return (
    <Modal
      testID="tutorial-modal"
      visible
      transparent
      statusBarTranslucent
      animationType={reducedMotion ? 'none' : 'fade'}
      onRequestClose={onClose}
    >
      <Pressable testID="tutorial-backdrop" accessible={false} onPress={onClose} className="flex-1" style={{ backgroundColor: BACKDROP }}>
        <SafeAreaView testID="tutorial-content" accessibilityViewIsModal accessibilityLabel={strings.tutorial.title} className="flex-1 px-6">
          <View className="flex-1 items-center justify-center gap-5">
            <View testID="tutorial-hint-swipe" accessible accessibilityLabel={strings.tutorial.hintSwipe}>
              <Text className="text-center font-body text-base text-primary">{strings.tutorial.hintSwipe}</Text>
            </View>

            <View className="flex-row items-center gap-3">
              <TutorialHintIcon name="chevron-left" size={36} color={ink} motion="nudge-x" reverse />
              <Pressable testID="tutorial-card" accessible={false} onPress={ignore}>
                <BrandCardBack width={cardWidth} variant="full" />
                <View pointerEvents="none" className="absolute inset-0 items-center justify-end pb-6">
                  <TutorialHintIcon name="gesture-tap" size={44} color={ink} motion="pulse" />
                </View>
              </Pressable>
              <TutorialHintIcon name="chevron-right" size={36} color={ink} motion="nudge-x" />
            </View>

            <View testID="tutorial-hint-flip" accessible accessibilityLabel={strings.tutorial.hintFlip}>
              <Text className="text-center font-body text-base text-primary">{strings.tutorial.hintFlip}</Text>
            </View>
          </View>

          <View testID="tutorial-hint-deck" accessible accessibilityLabel={strings.tutorial.hintDeck} className="items-center gap-2 pb-8">
            <Text className="text-center font-display text-lg text-primary">{strings.tutorial.hintDeck}</Text>
            <TutorialHintIcon name="chevron-double-down" size={32} color={ink} motion="nudge-y" />
          </View>

          <Pressable
            testID="tutorial-skip"
            accessibilityRole="button"
            accessibilityLabel={strings.tutorial.skipLabel}
            onPress={onClose}
            hitSlop={12}
            className="absolute right-6 top-4 h-11 justify-center rounded-full bg-surface px-5"
          >
            <Text className="font-display text-base text-primary">{strings.tutorial.skip}</Text>
          </Pressable>
        </SafeAreaView>
      </Pressable>
    </Modal>
  );
}
