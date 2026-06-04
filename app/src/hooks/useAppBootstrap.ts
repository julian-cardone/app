import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
  useFonts,
} from "@expo-google-fonts/nunito";

// Must run before the component tree mounts so the native splash stays visible during init.
void SplashScreen.preventAutoHideAsync();

export function useAppBootstrap(): boolean {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
  });

  useEffect(() => {
    if (fontsLoaded) void SplashScreen.hideAsync();
  }, [fontsLoaded]);

  return fontsLoaded;
}
