import { Pressable, ScrollView, Text, View } from 'react-native';

import { tokens } from '../theme';

export interface FilterChip {
  id: string;
  label: string;
  /** Color of the small dot before the label (already visible on the dark background). */
  dotColor: string;
}

export interface FilterChipsProps {
  chips: FilterChip[];
  selected: string;
  onSelect: (id: string) => void;
  /** Accessibility label of the chip row. */
  label: string;
}

/** Horizontal single-select chips (017): the selected one is cream with dark text. */
export function FilterChips({ chips, selected, onSelect, label }: FilterChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      accessibilityLabel={label}
      contentContainerClassName="gap-2 px-4 py-2"
    >
      {chips.map((chip) => {
        const on = chip.id === selected;
        return (
          <Pressable
            key={chip.id}
            testID={`filter-chip-${chip.id}`}
            accessibilityRole="button"
            accessibilityLabel={chip.label}
            accessibilityState={{ selected: on }}
            onPress={() => onSelect(chip.id)}
            hitSlop={4}
            className={`h-9 flex-row items-center gap-2 rounded-full border px-4 ${on ? 'border-cream bg-cream' : 'bg-transparent'}`}
            style={on ? undefined : { borderColor: tokens.colors.textSecondary }}
          >
            <View className="h-2 w-2 rounded-full" style={{ backgroundColor: chip.dotColor }} />
            <Text className={`font-body text-sm ${on ? 'text-ink' : 'text-primary'}`}>{chip.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
