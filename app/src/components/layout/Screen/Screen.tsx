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

import { SCREEN_INSET_MODE, type ScreenInsetMode } from "./types";

type ScreenProps = PropsWithChildren<{
  insetMode?: ScreenInsetMode;
  keyboardAware?: boolean;
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}>;

export function Screen({
  children,
  insetMode = SCREEN_INSET_MODE.BOTH,
  keyboardAware = false,
  scroll = false,
  style,
  contentContainerStyle,
}: ScreenProps) {
  const insets = useSafeAreaInsets();

  const shouldInsetTop =
    insetMode === SCREEN_INSET_MODE.TOP || insetMode === SCREEN_INSET_MODE.BOTH;
  const shouldInsetBottom =
    insetMode === SCREEN_INSET_MODE.BOTTOM || insetMode === SCREEN_INSET_MODE.BOTH;

  const safeAreaStyle = {
    paddingTop: shouldInsetTop ? insets.top : 0,
    paddingBottom: shouldInsetBottom ? insets.bottom : 0,
  };

  const screenStyle = [styles.screen, safeAreaStyle, style];
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
    <View style={screenStyle}>
      <View style={contentStyle}>{children}</View>
    </View>
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
