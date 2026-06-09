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
  const [fontsLoaded, fontError] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
  });

  const appReady = fontsLoaded || Boolean(fontError);

  useEffect(() => {
    if (appReady) void SplashScreen.hideAsync();
  }, [appReady]);

  return appReady;
}
