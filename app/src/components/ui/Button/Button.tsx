import { Pressable, type StyleProp, StyleSheet, Text, type ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { colors, fontFamily, fontSize, radii, shadows, spacing } from "@/styles/tokens";

const PRESSED_SCALE = 0.98;

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
  const handlePress = () => {
    if (disabled) return;
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.pressable,
        shadows.button,
        style,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <LinearGradient
        colors={[colors.brand, colors.brandDark]}
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
    color: colors.onBrand,
  },
  pressed: {
    transform: [{ scale: PRESSED_SCALE }],
  },
  disabled: {
    opacity: 0.5,
  },
});
