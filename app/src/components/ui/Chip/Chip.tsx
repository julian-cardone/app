import { Pressable, StyleSheet } from "react-native";

import { AppText } from "@/components/ui/AppText";
import { borders, colors, fontFamily, fontSize, lineHeight, radii, spacing } from "@/styles/tokens";

const INPUT_VERTICAL_PADDING_ADJUSTMENT = 1;
const INPUT_PADDING_V = spacing.sm + INPUT_VERTICAL_PADDING_ADJUSTMENT;

type ChipProps = {
  label: string;
  selected?: boolean;
  onPress: () => void;
};

export function Chip({ label, selected = false, onPress }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <AppText style={[styles.label, selected && styles.labelSelected]}>{label}</AppText>
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
    lineHeight: lineHeight.body,
    color: colors.textTertiary,
  },
  labelSelected: {
    fontFamily: fontFamily.bold,
    color: colors.brandDark,
  },
});
