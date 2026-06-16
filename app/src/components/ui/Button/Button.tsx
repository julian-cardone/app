import { Pressable, type StyleProp, StyleSheet, type ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { colors, fontFamily, fontSize, lineHeight, radii, shadows, spacing } from "@/styles/tokens";

import { AppText } from "../AppText";

const PRESSED_SCALE = 0.98;
const GRADIENT_START = { x: 0, y: 0 };
const GRADIENT_END = { x: 1, y: 1 };
const BUTTON_GRADIENT_COLORS = [colors.brand, colors.brandDark] as const;

type ButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * Primary call-to-action button. Owns visual states (pressed, disabled); callers own the action.
 */
export function Button({ title, onPress, disabled = false, style }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.pressable,
        !disabled && shadows.button,
        style,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <LinearGradient
        colors={BUTTON_GRADIENT_COLORS}
        start={GRADIENT_START}
        end={GRADIENT_END}
        style={styles.gradient}
      >
        <AppText style={styles.label}>{title}</AppText>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    borderRadius: radii.md,
  },
  gradient: {
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontFamily: fontFamily.extrabold,
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    color: colors.onBrand,
  },
  pressed: {
    transform: [{ scale: PRESSED_SCALE }],
  },
  disabled: {
    opacity: 0.5,
  },
});
