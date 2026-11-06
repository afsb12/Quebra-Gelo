import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';
import { Modal, Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import type { Category, CategoryId } from '../data/types';
import { strings } from '../i18n/strings';
import { tokens, type CategoryVisual } from '../theme';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export interface MixFilterOption {
  category: Category;
  visual: CategoryVisual;
}

export interface MixFilterSheetProps {
  visible: boolean;
  /** Categories in Home order. */
  options: readonly MixFilterOption[];
  selected: readonly CategoryId[];
  /** False below the minimum: "Salvar" is disabled and the minimum message shows. */
  canSave: boolean;
  onToggle: (id: CategoryId) => void;
  onSave: () => void;
  /** Discards the draft: tap outside, Android back. */
  onClose: () => void;
}

const BACKDROP = 'rgba(0, 0, 0, 0.6)';

/** Bottom panel to choose which categories feed "Tudo Misturado" (006). Fully controlled. */
export function MixFilterSheet({ visible, options, selected, canSave, onToggle, onSave, onClose }: MixFilterSheetProps) {
  const reducedMotion = useReducedMotion();
  if (!visible) return null;

  return (
    <Modal
      testID="mix-filter-sheet"
      visible
      transparent
      statusBarTranslucent
      animationType={reducedMotion ? 'none' : 'slide'}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        <Pressable
          testID="mix-filter-backdrop"
          accessible={false}
          onPress={onClose}
          className="absolute inset-0"
          style={{ backgroundColor: BACKDROP }}
        />
        <View accessibilityViewIsModal className="max-h-[85%] rounded-t-3xl bg-surface px-6 pb-8 pt-3">
          <View className="mb-3 h-1 w-10 self-center rounded-full bg-secondary" />
          <Text accessibilityRole="header" className="pb-3 font-display text-xl text-primary">
            {strings.mixFilter.title}
          </Text>
          <ScrollView>
            {options.map(({ category, visual }) => {
              const on = selected.includes(category.id);
              return (
                <View key={category.id} testID={`mix-filter-row-${category.id}`} className="flex-row items-center gap-3 py-2">
                  <View className="h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: visual.color }}>
                    <MaterialCommunityIcons name={visual.icon as IconName} size={20} color={visual.onColor} />
                  </View>
                  <Text className="flex-1 font-body text-base text-primary">{category.title}</Text>
                  <Switch
                    testID={`mix-filter-switch-${category.id}`}
                    accessibilityLabel={category.title}
                    value={on}
                    onValueChange={() => onToggle(category.id)}
                    trackColor={{ false: tokens.colors.appBackground, true: tokens.colors.iceBlue }}
                    thumbColor={tokens.colors.cream}
                  />
                </View>
              );
            })}
          </ScrollView>
          {canSave ? null : (
            <Text testID="mix-filter-minimum" accessibilityLiveRegion="polite" className="pt-3 text-center font-body text-sm text-ice">
              {strings.mixFilter.minimum}
            </Text>
          )}
          <Pressable
            testID="mix-filter-save"
            accessibilityRole="button"
            accessibilityState={{ disabled: !canSave }}
            accessibilityHint={canSave ? undefined : strings.mixFilter.minimum}
            disabled={!canSave}
            onPress={onSave}
            className="mt-4 items-center rounded-full py-4"
            style={{ backgroundColor: canSave ? tokens.colors.iceBlue : tokens.colors.appBackground }}
          >
            <Text
              className="font-display text-base"
              style={{ color: canSave ? tokens.colors.appBackground : tokens.colors.textSecondary }}
            >
              {strings.mixFilter.save}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
