import { useState } from "react";
import {
  type StyleProp,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
  type ViewStyle,
} from "react-native";

import { AppText } from "@/components/ui";
import { colors, fontFamily, fontSize, radii, spacing } from "@/styles/tokens";

type TextFieldProps = TextInputProps & {
  label: string;
  /** Inline validation message; when present the field reads as errored. */
  error?: string;
  /** Parent-owned placement (margin, width). Internal appearance stays in the primitive. */
  containerStyle?: StyleProp<ViewStyle>;
};

/**
 * The shared labeled text input. Domain-agnostic: it owns its label, focus highlight, and
 * error treatment, and forwards every other `TextInput` prop so callers control keyboard,
 * autofill, and masking. Validation rules and submission live with the caller.
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
        placeholderTextColor={colors.muted}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {Boolean(error) && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radii.input,
    paddingVertical: spacing.sm + 1,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.body,
    color: colors.ink,
  },
  inputFocused: {
    borderColor: colors.tealPrimary,
  },
  inputError: {
    borderColor: colors.danger,
  },
  error: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.caption,
    color: colors.danger,
  },
});
