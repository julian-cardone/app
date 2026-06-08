import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import type { NavigationContainerRef } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { RootStackParamList } from "./types";

const BAR_BG = "rgba(0,0,0,0.75)";
const BTN_BG = "rgba(255,255,255,0.12)";
const LABEL_COLOR = "#ff6b6b";
const TEXT_COLOR = "#fff";
const MIN_TOP_INSET = 8;

type Props = {
  navigationRef: NavigationContainerRef<RootStackParamList>;
};

export function DevBar({ navigationRef }: Props) {
  const insets = useSafeAreaInsets();

  const go = (action: () => void) => {
    if (navigationRef.isReady()) action();
  };

  const buttons = [
    {
      label: "Splash",
      onPress: () => go(() => navigationRef.navigate("Onboarding", { screen: "Splash" })),
    },
    {
      label: "Phone",
      onPress: () => go(() => navigationRef.navigate("Onboarding", { screen: "PhoneEntry" })),
    },
    {
      label: "Verify",
      onPress: () =>
        go(() =>
          navigationRef.navigate("Onboarding", {
            screen: "Verify",
            params: { phoneNumber: "+15551234567" },
          }),
        ),
    },
    {
      label: "Profile",
      onPress: () => go(() => navigationRef.navigate("Onboarding", { screen: "ProfileSetup" })),
    },
    {
      label: "Discover",
      onPress: () => go(() => navigationRef.navigate("Main", { screen: "Discover" })),
    },
  ];

  return (
    <View style={[styles.bar, { paddingTop: Math.max(insets.top, MIN_TOP_INSET) }]}>
      <Text style={styles.label}>DEV</Text>
      {buttons.map(({ label, onPress }) => (
        <TouchableOpacity key={label} onPress={onPress} style={styles.button}>
          <Text style={styles.buttonText}>{label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingBottom: 8,
    backgroundColor: BAR_BG,
  },
  label: {
    color: LABEL_COLOR,
    fontSize: 10,
    fontWeight: "700",
    marginRight: 4,
  },
  button: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: BTN_BG,
    alignItems: "center",
  },
  buttonText: {
    color: TEXT_COLOR,
    fontSize: 12,
    fontWeight: "600",
  },
});
