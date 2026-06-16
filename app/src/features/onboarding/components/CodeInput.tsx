import { useRef } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { borders, colors, fontFamily, fontSize, lineHeight, radii, spacing } from "@/styles/tokens";

const BOX_MAX_SIZE = 52;

type CodeInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  length: number;
};

/**
 * Controlled verification-code entry: one hidden input drives a row of styled segment boxes.
 */
export function CodeInput({ value, onChangeText, length }: CodeInputProps) {
  const inputRef = useRef<TextInput>(null);
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  const handleChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, "").slice(0, length);
    onChangeText(cleaned);
  };

  return (
    <Pressable
      style={styles.row}
      onPress={() => inputRef.current?.focus()}
      accessibilityRole="button"
      accessibilityLabel="Verification code"
    >
      {digits.map((digit, index) => (
        <View
          key={index}
          style={[
            styles.box,
            value.length === index && styles.boxActive,
            digit !== "" && styles.boxFilled,
          ]}
        >
          <Text style={styles.digit}>{digit}</Text>
        </View>
      ))}
      <TextInput
        ref={inputRef}
        style={styles.hiddenInput}
        value={value}
        onChangeText={handleChange}
        keyboardType="number-pad"
        maxLength={length}
        autoFocus
        autoComplete="one-time-code"
        textContentType="oneTimeCode"
        returnKeyType="done"
        caretHidden
        accessibilityElementsHidden
        importantForAccessibility="no"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  box: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: BOX_MAX_SIZE,
    borderWidth: borders.default,
    borderColor: colors.border,
    borderRadius: radii.sm,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  boxActive: {
    borderColor: colors.brand,
  },
  boxFilled: {
    borderColor: colors.brand,
    backgroundColor: colors.brandLight,
  },
  digit: {
    fontFamily: fontFamily.extrabold,
    fontSize: fontSize.h1,
    lineHeight: lineHeight.h1,
    color: colors.textPrimary,
  },
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    height: "100%",
    width: "100%",
  },
});
