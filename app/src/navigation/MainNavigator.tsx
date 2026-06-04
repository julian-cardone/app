import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { DiscoverScreen } from "@/features/discover";
import { ProfileCompletionProvider } from "@/features/profile";

import type { MainStackParamList } from "./types";

const Stack = createNativeStackNavigator<MainStackParamList>();

/**
 * The signed-in app. A native stack for now (Discover only); it becomes a tab navigator once
 * Chat/Profile arrive, with no change here. `ProfileCompletionProvider` wraps the navigator so the
 * profile-completion banner's state is shared across every main-app screen — screens render the
 * banner themselves and own their own safe area; this stays pure route wiring plus shared state.
 */
export function MainNavigator() {
  return (
    <ProfileCompletionProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Discover" component={DiscoverScreen} />
      </Stack.Navigator>
    </ProfileCompletionProvider>
  );
}
