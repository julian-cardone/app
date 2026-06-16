import { Pressable, StyleSheet, View } from "react-native";

import { AppText } from "@/components/ui/AppText/AppText";
import { TextField } from "@/components/ui/TextField/TextField";
import { borders, colors, inputPaddingVertical, radii, spacing } from "@/styles/tokens";

const MAX_PHONE_LENGTH = 16;

type PhoneNumberInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  /** e.g. "🇺🇸 +1" — a full country picker is a later issue; right now this is a static default. */
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
        <AppText variant="label" style={styles.countryText}>
          {countryCode}
        </AppText>
      </Pressable>

      <TextField
        containerStyle={styles.field}
        value={value}
        onChangeText={onChangeText}
        keyboardType="phone-pad"
        placeholder="Phone number"
        autoComplete="tel"
        textContentType="telephoneNumber"
        returnKeyType="done"
        maxLength={MAX_PHONE_LENGTH}
      />
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
    borderWidth: borders.default,
    borderColor: colors.border,
    borderRadius: radii.sm,
    paddingVertical: inputPaddingVertical,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
  },
  countryText: {
    color: colors.textPrimary,
  },
  field: {
    flex: 1,
  },
});
