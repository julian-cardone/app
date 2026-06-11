import { Pressable, type StyleProp, StyleSheet, Text, type ViewStyle } from "react-native";

import { borders, colors, fontFamily, fontSize, radii, spacing } from "@/styles/tokens";

const INPUT_PADDING_V = spacing.sm + 1;

type ChipProps = {
  label: string;
  selected?: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export function Chip({ label, selected = false, onPress, style }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[styles.chip, selected && styles.chipSelected, style]}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: borders.default,
    borderColor: colors.border,
    borderRadius: radii.pill,
    paddingVertical: INPUT_PADDING_V,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
  },
  chipSelected: {
    borderColor: colors.brand,
    backgroundColor: colors.brandLight,
  },
  label: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.body,
    color: colors.textTertiary,
  },
  labelSelected: {
    fontFamily: fontFamily.bold,
    color: colors.brandDark,
  },
});
