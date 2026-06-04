import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native";

import type { PropsWithChildren } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, spacing } from "@/styles/tokens";

type ScreenProps = PropsWithChildren<{
  keyboardAware?: boolean;
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}>;

export function Screen({
  children,
  keyboardAware = false,
  scroll = false,
  style,
  contentContainerStyle,
}: ScreenProps) {
  const insets = useSafeAreaInsets();

  const screenStyle = [
    styles.screen,
    {
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
    },
    style,
  ];

  const contentStyle = [styles.content, contentContainerStyle];

  const content = scroll ? (
    <ScrollView
      style={screenStyle}
      contentContainerStyle={contentStyle}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[screenStyle, contentStyle]}>{children}</View>
  );

  if (!keyboardAware) {
    return content;
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {content}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
  },
  content: {
    flex: 1,
  },
});
