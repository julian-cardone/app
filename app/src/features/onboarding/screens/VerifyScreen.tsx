import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { AppText, Button, Screen } from "@/components/ui";
import type { RootStackParamList } from "@/navigation/types";
import { colors, fontFamily, fontSize, spacing } from "@/styles/tokens";

import { CodeInput } from "../components/CodeInput";

type Props = NativeStackScreenProps<RootStackParamList, "Verify">;

const CODE_LENGTH = 6;

export function VerifyScreen({ navigation, route }: Props) {
  const { phoneNumber } = route.params;
  const [code, setCode] = useState("");

  const canVerify = code.length === CODE_LENGTH;

  const handleVerify = () => {
    if (!canVerify) return;
    // No real check yet: any 6-digit code advances to signup. Backend verification is a
    // later issue. New numbers go through fast signup; returning users will skip it once
    // account lookup exists.
    navigation.navigate("ProfileSetup");
  };

  const handleResendCode = () => {
    // TODO: resend code once backend exists.
  };

  return (
    <Screen keyboardAware>
      <View style={styles.body}>
        <AppText variant="headline">Enter your code</AppText>
        <AppText variant="subhead">We sent a 6-digit code to {phoneNumber}</AppText>
        <CodeInput value={code} onChangeText={setCode} length={CODE_LENGTH} />
        <Pressable accessibilityRole="button" hitSlop={spacing.sm} onPress={handleResendCode}>
          <Text style={styles.resend}>Resend code</Text>
        </Pressable>
      </View>

      <View style={styles.footer}>
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
  resend: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.body,
    color: colors.tealDeep,
    paddingTop: spacing.xs,
  },
  footer: {
    paddingBottom: spacing.lg,
  },
});
