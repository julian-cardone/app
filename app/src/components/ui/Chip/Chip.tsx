import { Pressable, type StyleProp, StyleSheet, Text, type ViewStyle } from "react-native";

import { colors, fontFamily, fontSize, radii, spacing } from "@/styles/tokens";

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
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radii.pill,
    paddingVertical: spacing.sm + 1,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
  },
  chipSelected: {
    borderColor: colors.tealPrimary,
    backgroundColor: colors.tealSoft,
  },
  label: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.body,
    color: colors.subtle,
  },
  labelSelected: {
    fontFamily: fontFamily.bold,
    color: colors.tealDeep,
  },
});
