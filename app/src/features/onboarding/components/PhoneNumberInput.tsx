import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { borders, colors, fontFamily, fontSize, radii, spacing } from "@/styles/tokens";

const INPUT_PADDING_V = spacing.sm + 1;
const MAX_PHONE_LENGTH = 16;

type PhoneNumberInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  /** e.g. "🇺🇸 +1" — a full country picker is a later issue; today this is a static default. */
  countryCode: string;
  onCountryPress?: () => void;
};

export function PhoneNumberInput({
  value,
  onChangeText,
  countryCode,
  onCountryPress,
}: PhoneNumberInputProps) {
  const isCountrySelectable = Boolean(onCountryPress);

  return (
    <View style={styles.row}>
      <Pressable
        style={styles.country}
        onPress={onCountryPress}
        disabled={!isCountrySelectable}
        accessibilityRole={isCountrySelectable ? "button" : undefined}
        accessibilityLabel={isCountrySelectable ? "Select country code" : "Country code"}
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
          maxLength={MAX_PHONE_LENGTH}
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
    borderWidth: borders.input,
    borderColor: colors.border,
    borderRadius: radii.input,
    paddingVertical: INPUT_PADDING_V,
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
    borderWidth: borders.input,
    borderColor: colors.border,
    borderRadius: radii.input,
    paddingVertical: INPUT_PADDING_V,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.body,
    color: colors.ink,
  },
});
