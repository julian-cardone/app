import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Button, Screen } from "@/components/ui";
import type { RootStackParamList } from "@/navigation/types";
import { colors, fontFamily, fontSize, lineHeight, spacing } from "@/styles/tokens";

import { CodeInput } from "../components/CodeInput";

type Props = NativeStackScreenProps<RootStackParamList, "Verify">;

const CODE_LENGTH = 6;

export function VerifyScreen({ route }: Props) {
  const { phoneNumber } = route.params;
  const [code, setCode] = useState("");

  const canVerify = code.length === CODE_LENGTH;

  const handleVerify = () => {
    if (!canVerify) return;
    // TODO: verify code once backend exists.
  };

  const handleResendCode = () => {
    // TODO: resend code once backend exists.
  };

  return (
    <Screen keyboardAware>
      <View style={styles.body}>
        <Text style={styles.headline}>Enter your code</Text>
        <Text style={styles.subhead}>We sent a 6-digit code to {phoneNumber}</Text>
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
