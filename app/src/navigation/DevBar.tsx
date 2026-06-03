import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { NavigationContainerRef } from "@react-navigation/native";

import type { RootStackParamList } from "./RootNavigator";

type Props = {
  navigationRef: NavigationContainerRef<RootStackParamList>;
};

export function DevBar({ navigationRef }: Props) {
  const insets = useSafeAreaInsets();

  const go = (action: () => void) => {
    if (navigationRef.isReady()) action();
  };

  const buttons = [
    { label: "Splash", onPress: () => go(() => navigationRef.navigate("Splash")) },
    { label: "Phone", onPress: () => go(() => navigationRef.navigate("PhoneEntry")) },
    {
      label: "Verify",
      onPress: () => go(() => navigationRef.navigate("Verify", { phoneNumber: "+15551234567" })),
    },
  ];

  return (
    <View style={[styles.bar, { paddingTop: Math.max(insets.top, 8) }]}>
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
    backgroundColor: "rgba(0,0,0,0.75)",
  },
  label: {
    color: "#ff6b6b",
    fontSize: 10,
    fontWeight: "700",
    marginRight: 4,
  },
  button: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
