import { useState } from "react";
import { StyleSheet, View } from "react-native";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Screen } from "@/components/layout";
import { AppText, Button } from "@/components/ui";
import { ONBOARDING_ROUTES } from "@/navigation/routes";
import type { OnboardingStackParamList } from "@/navigation/types";
import { spacing } from "@/styles/tokens";

import { PhoneNumberInput } from "../components/PhoneNumberInput";
import { TermsFootnote } from "../components/TermsFootnote";

type Props = NativeStackScreenProps<OnboardingStackParamList, typeof ONBOARDING_ROUTES.PHONE_ENTRY>;

const DEFAULT_COUNTRY = "🇺🇸 +1";
const MIN_DIGITS = 7;

/**
 * The single-purpose entry screen: collect a phone number to start onboarding.
 */
export function PhoneEntryScreen({ navigation }: Props) {
  const [phoneNumber, setPhoneNumber] = useState("");

  const digitCount = phoneNumber.replace(/[^0-9]/g, "").length;
  const canSend = digitCount >= MIN_DIGITS;

  const handleSendCode = () => {
    if (!canSend) return;
    navigation.navigate(ONBOARDING_ROUTES.VERIFY, {
      phoneNumber: `${DEFAULT_COUNTRY} ${phoneNumber}`.trim(),
    });
  };

  return (
    <Screen keyboardAware>
      <View style={styles.header}>
        <AppText variant="headline">placecard</AppText>
      </View>

      <View style={styles.body}>
        <AppText variant="headline">Your next great night starts here</AppText>
        <AppText variant="subhead">Enter your number and we&apos;ll text you a code.</AppText>
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
  header: {
    paddingTop: spacing.xl,
  },
  body: {
    flex: 1,
    justifyContent: "center",
    gap: spacing.md,
  },
  footer: {
    gap: spacing.md,
  },
});
