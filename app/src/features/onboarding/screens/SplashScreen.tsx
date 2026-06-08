import { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Wordmark } from "@/components/branding";
import { Screen } from "@/components/layout";
import type { OnboardingStackParamList } from "@/navigation/types";
import { animation } from "@/styles/tokens";

type Props = NativeStackScreenProps<OnboardingStackParamList, "Splash">;

/**
 * The brand moment. The wordmark fades and scales in while the app finishes booting, then
 * we move on to phone entry. `replace` keeps the splash off the back stack so the user
 * cannot navigate back to it.
 */
export function SplashScreen({ navigation }: Props) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: animation.splashEnterMs,
      useNativeDriver: true, // opacity + transform run off the JS thread
    }).start();

    const timer = setTimeout(() => {
      navigation.replace("PhoneEntry");
    }, animation.splashMinMs);

    return () => clearTimeout(timer);
  }, [navigation, progress]);

  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.92, 1],
  });

  const animatedStyle = {
    opacity: progress,
    transform: [{ scale }],
  };

  return (
    <Screen style={styles.screen}>
      <Animated.View style={animatedStyle}>
        <Wordmark size="splash" />
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    alignItems: "center",
    justifyContent: "center",
  },
});
