import { useRef } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { colors, fontFamily, fontSize, radii, spacing } from "@/styles/tokens";

type CodeInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  length?: number;
};

/**
 * Controlled verification-code entry: one hidden input drives a row of styled segment boxes.
 * A single input keeps OS autofill, paste, and the keyboard working correctly while the
 * boxes are purely presentational.
 */
export function CodeInput({ value, onChangeText, length = 6 }: CodeInputProps) {
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
      accessibilityLabel="Verification code"
    >
      {digits.map((digit, i) => (
        <View
          key={i}
          style={[
            styles.box,
            value.length === i && styles.boxActive,
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
        textContentType="oneTimeCode"
        // The visible boxes render the value; this input only captures keystrokes.
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
    maxWidth: 52,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radii.input,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  boxActive: {
    borderColor: colors.tealPrimary,
  },
  boxFilled: {
    borderColor: colors.tealPrimary,
    backgroundColor: colors.tealSoft,
  },
  digit: {
    fontFamily: fontFamily.extrabold,
    fontSize: fontSize.h1,
    color: colors.ink,
  },
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    height: "100%",
    width: "100%",
  },
});
