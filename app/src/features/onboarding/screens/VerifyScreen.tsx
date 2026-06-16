import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Screen } from "@/components/layout";
import { AppText, Button } from "@/components/ui";
import { ONBOARDING_ROUTES } from "@/navigation/routes";
import type { OnboardingStackParamList } from "@/navigation/types";
import { colors, spacing } from "@/styles/tokens";

import { CodeInput } from "../components/CodeInput";

type Props = NativeStackScreenProps<OnboardingStackParamList, typeof ONBOARDING_ROUTES.VERIFY>;

const CODE_LENGTH = 6;

export function VerifyScreen({ navigation, route }: Props) {
  const { phoneNumber } = route.params;
  const [code, setCode] = useState("");

  const canVerify = code.length === CODE_LENGTH;

  const handleVerify = () => {
    if (!canVerify) return;
    navigation.navigate(ONBOARDING_ROUTES.PROFILE_SETUP);
  };

  const handleResendCode = () => {
    // TODO: resend code once backend exists.
  };

  return (
    <Screen keyboardAware>
      <View style={styles.body}>
        <AppText variant="headline">Enter your code</AppText>
        <AppText variant="body" style={styles.description}>
          We sent a 6-digit code to {phoneNumber}
        </AppText>
        <CodeInput value={code} onChangeText={setCode} length={CODE_LENGTH} />
        <Pressable accessibilityRole="button" hitSlop={spacing.sm} onPress={handleResendCode}>
          <AppText variant="label" style={styles.resend}>
            Resend code
          </AppText>
        </Pressable>
      </View>

      <View>
        <Button title="Verify" onPress={handleVerify} disabled={!canVerify} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: "center",
    gap: spacing.md,
  },
  description: {
    color: colors.textSecondary,
  },
  resend: {
    color: colors.brandDark,
    paddingTop: spacing.xs,
  },
});
