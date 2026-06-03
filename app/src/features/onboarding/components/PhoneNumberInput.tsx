import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { colors, fontFamily, fontSize, radii, spacing } from "@/styles/tokens";

type PhoneNumberInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  /** e.g. "🇺🇸 +1" — a full country picker is a later issue; today this is a static default. */
  countryCode: string;
  onCountryPress?: () => void;
};

/**
 * Controlled phone-entry field for onboarding: a country-code chip beside the number input.
 * The owning screen holds the value so it can pass the number on to verification.
 */
export function PhoneNumberInput({
  value,
  onChangeText,
  countryCode,
  onCountryPress,
}: PhoneNumberInputProps) {
  return (
    <View style={styles.row}>
      <Pressable
        style={styles.country}
        onPress={onCountryPress}
        accessibilityRole="button"
        accessibilityLabel="Select country code"
      >
        <Text style={styles.countryText}>{countryCode}</Text>
      </Pressable>
      <View style={styles.field}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          keyboardType="phone-pad"
          placeholder="Phone number"
          placeholderTextColor={colors.muted}
          autoComplete="tel"
          textContentType="telephoneNumber"
          returnKeyType="done"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  country: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radii.input,
    paddingVertical: spacing.sm + 1,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
  },
  countryText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.body,
    color: colors.ink,
  },
  field: {
    flex: 1,
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
});
