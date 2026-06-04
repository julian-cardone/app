import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {
  PhoneEntryScreen,
  ProfileSetupScreen,
  SplashScreen,
  VerifyScreen,
} from "@/features/onboarding";

import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * The onboarding entry stack: Splash → Phone Entry → Verify → Profile Setup. Headers are hidden so each
 * screen owns its own chrome. This navigator only wires routes to screens.
 */
export function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="PhoneEntry" component={PhoneEntryScreen} />
      <Stack.Screen name="Verify" component={VerifyScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
    </Stack.Navigator>
  );
}
