import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/ui";
import type { RootStackParamList } from "@/navigation/types";
import { colors, fontFamily, fontSize, lineHeight, spacing } from "@/styles/tokens";

import { CodeInput } from "../components/CodeInput";

type Props = NativeStackScreenProps<RootStackParamList, "Verify">;

const CODE_LENGTH = 6;

/**
 * Placeholder verification screen. There is no SMS backend yet, so the code is not actually
 * checked and "Verify" has no destination — the main app is a later issue. This exists to
 * complete the entry flow's shape.
 */
export function VerifyScreen({ route }: Props) {
  const insets = useSafeAreaInsets();
  const { phoneNumber } = route.params;
  const [code, setCode] = useState("");

  const canVerify = code.length === CODE_LENGTH;

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.body}>
        <Text style={styles.headline}>Enter your code</Text>
        <Text style={styles.subhead}>We sent a 6-digit code to {phoneNumber}</Text>
        <CodeInput value={code} onChangeText={setCode} length={CODE_LENGTH} />
        <Pressable accessibilityRole="button" hitSlop={spacing.sm}>
          <Text style={styles.resend}>Resend code</Text>
        </Pressable>
      </View>

      <View style={styles.footer}>
        {/* Inert until the verification backend and main app exist. */}
        <Button title="Verify" onPress={() => {}} disabled={!canVerify} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
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
