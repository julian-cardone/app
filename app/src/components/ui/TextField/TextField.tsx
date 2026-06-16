import { useState } from "react";
import {
  type StyleProp,
  StyleSheet,
  TextInput,
  type TextInputProps,
  View,
  type ViewStyle,
} from "react-native";

import { AppText } from "@/components/ui";
import { borders, colors, fontFamily, fontSize, lineHeight, radii, spacing } from "@/styles/tokens";

const INPUT_VERTICAL_PADDING_ADJUSTMENT = 1;
const INPUT_PADDING_V = spacing.sm + INPUT_VERTICAL_PADDING_ADJUSTMENT;

type TextFieldProps = TextInputProps & {
  label: string;
  error?: string;
  /** Parent-owned placement (margin, width). Internal appearance stays in the primitive. */
  containerStyle?: StyleProp<ViewStyle>;
};

/**
 * The shared labeled text input. Domain-agnostic: it owns its label, focus highlight, and
 * error treatment, and forwards every other `TextInput` prop so callers control keyboard,
 * autofill, and masking.
 */
export function TextField({
  label,
  error,
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...inputProps
}: TextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus: NonNullable<TextInputProps["onFocus"]> = (event) => {
    setIsFocused(true);
    onFocus?.(event);
  };

  const handleBlur: NonNullable<TextInputProps["onBlur"]> = (event) => {
    setIsFocused(false);
    onBlur?.(event);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <AppText variant="label">{label}</AppText>
      <TextInput
        {...inputProps}
        style={[
          styles.input,
          isFocused && styles.inputFocused,
          Boolean(error) && styles.inputError,
          style,
        ]}
        placeholderTextColor={colors.textSecondary}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {Boolean(error) && <AppText style={styles.error}>{error}</AppText>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  input: {
    borderWidth: borders.default,
    borderColor: colors.border,
    borderRadius: radii.sm,
    paddingVertical: INPUT_PADDING_V,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    color: colors.textPrimary,
  },
  inputFocused: {
    borderColor: colors.brand,
  },
  inputError: {
    borderColor: colors.danger,
  },
  error: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.caption,
    lineHeight: lineHeight.caption,
    color: colors.danger,
  },
});
