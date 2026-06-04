import { createNavigationContainerRef, NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { DevBar } from "@/navigation/DevBar";
import { RootNavigator } from "@/navigation/RootNavigator";
import type { RootStackParamList } from "@/navigation/types";

const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function AppProviders() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer ref={navigationRef}>
          <RootNavigator />
          {__DEV__ && <DevBar navigationRef={navigationRef} />}
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
