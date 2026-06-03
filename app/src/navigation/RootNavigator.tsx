import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Button, ScrollView, Text } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { PhoneEntryScreen, SplashScreen, VerifyScreen } from "@/features/onboarding";

/** Route params for the root stack. Owned here, alongside the navigator that declares them. */
export type RootStackParamList = {
  Splash: undefined;
  PhoneEntry: undefined;
  Verify: { phoneNumber: string };
  DevMenu: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function DevMenuScreen({ navigation }: NativeStackScreenProps<RootStackParamList, "DevMenu">) {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 12 }}>Development Menu</Text>
      <View>
        <View style={{ marginTop: 8 }}>
          <Button title="Go to Splash" onPress={() => navigation.navigate("Splash")} />
        </View>
        <View style={{ marginTop: 8 }}>
          <Button title="Go to Phone Entry" onPress={() => navigation.navigate("PhoneEntry")} />
        </View>
        <View>
          <Button
            title="Go to Verify (sample)"
            onPress={() => navigation.navigate("Verify", { phoneNumber: "+15551234567" })}
          />
        </View>
      </View>
    </ScrollView>
  );
}

/**
 * The onboarding entry stack: Splash → Phone Entry → Verify. Headers are hidden so each
 * screen owns its own chrome. This navigator only wires routes to screens.
 */
export function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DevMenu" component={DevMenuScreen} />
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="PhoneEntry" component={PhoneEntryScreen} />
      <Stack.Screen name="Verify" component={VerifyScreen} />
    </Stack.Navigator>
  );
}
