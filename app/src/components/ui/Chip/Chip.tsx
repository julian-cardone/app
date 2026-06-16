import { Pressable, type StyleProp, StyleSheet, type ViewStyle } from "react-native";

import { AppText } from "@/components/ui/AppText";
import { borders, colors, fontFamily, inputPaddingVertical, radii, spacing } from "@/styles/tokens";

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
      <AppText variant="body" style={[styles.label, selected && styles.labelSelected]}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: borders.default,
    borderColor: colors.border,
    borderRadius: radii.pill,
    paddingVertical: inputPaddingVertical,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
  },
  chipSelected: {
    borderColor: colors.brand,
    backgroundColor: colors.brandLight,
  },
  label: {
    color: colors.textTertiary,
  },
  labelSelected: {
    fontFamily: fontFamily.bold,
    color: colors.brandDark,
  },
});
