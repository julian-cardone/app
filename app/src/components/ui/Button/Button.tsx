import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text } from "react-native";

import { colors, fontFamily, fontSize, radii, shadows, spacing } from "@/styles/tokens";

type ButtonProps = {
  title: string;
  onPress: () => void;
  /** Only the brand teal-gradient variant exists today; add variants when a second is proven. */
  variant?: "primary";
  disabled?: boolean;
};

/**
 * The primary call-to-action primitive. Domain-agnostic: it owns its structure and visual
 * states (pressed, disabled) and nothing else — callers pass `onPress`, so navigation and
 * workflow stay with the feature that uses it.
 */
export function Button({ title, onPress, variant = "primary", disabled = false }: ButtonProps) {
  // `variant` selects the gradient palette; today there is a single primary treatment.
  void variant;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.pressable,
        shadows.buttonTeal,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Text style={styles.label}>{title}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    borderRadius: radii.button,
  },
  gradient: {
    borderRadius: radii.button,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontFamily: fontFamily.extrabold,
    fontSize: fontSize.body,
    color: colors.onTeal,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
});
