import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Button, Screen, Wordmark } from "@/components/ui";
import type { RootStackParamList } from "@/navigation/types";
import { colors, fontFamily, fontSize, lineHeight, spacing } from "@/styles/tokens";

import { PhoneNumberInput } from "../components/PhoneNumberInput";
import { TermsFootnote } from "../components/TermsFootnote";

type Props = NativeStackScreenProps<RootStackParamList, "PhoneEntry">;

const DEFAULT_COUNTRY = "🇺🇸 +1";
const MIN_DIGITS = 7;

/**
 * The single-purpose entry screen: collect a phone number to start onboarding. The screen
 * owns the phone value and the send action; the gradient CTA is a shared primitive.
 */
export function PhoneEntryScreen({ navigation }: Props) {
  const [phoneNumber, setPhoneNumber] = useState("");

  const digitCount = phoneNumber.replace(/[^0-9]/g, "").length;
  const canSend = digitCount >= MIN_DIGITS;

  const handleSendCode = () => {
    if (!canSend) return;
    navigation.navigate("Verify", { phoneNumber: `${DEFAULT_COUNTRY} ${phoneNumber}`.trim() });
  };

  return (
    <Screen keyboardAware>
      <View style={styles.header}>
        <Wordmark size="compact" />
      </View>

      <View style={styles.body}>
        <Text style={styles.headline}>Your next great night starts here</Text>
        <Text style={styles.subhead}>Enter your number and we&apos;ll text you a code.</Text>
        <PhoneNumberInput
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          countryCode={DEFAULT_COUNTRY}
        />
      </View>

      <View style={styles.footer}>
        <Button title="Send code" onPress={handleSendCode} disabled={!canSend} />
        <TermsFootnote />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
  },
  header: {
    paddingTop: spacing.xl,
  },
  body: {
    flex: 1,
    justifyContent: "center",
    gap: spacing.md,
  },
  headline: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.h1,
    lineHeight: lineHeight.h1,
    color: colors.ink,
  },
  subhead: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    color: colors.muted,
  },
  footer: {
    gap: spacing.md,
  },
});
