import { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Wordmark } from "@/components/branding";
import { Screen } from "@/components/layout";
import { ONBOARDING_ROUTES } from "@/navigation/routes";
import type { OnboardingStackParamList } from "@/navigation/types";
import { animation } from "@/styles/tokens";

const SPLASH_SCALE_FROM = 0.92;

type Props = NativeStackScreenProps<OnboardingStackParamList, typeof ONBOARDING_ROUTES.SPLASH>;

/**
 * The brand moment. `replace` keeps the splash off the back stack so the user
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
      navigation.replace(ONBOARDING_ROUTES.PHONE_ENTRY);
    }, animation.splashMinMs);

    return () => clearTimeout(timer);
  }, [navigation, progress]);

  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [SPLASH_SCALE_FROM, 1],
  });

  const animatedStyle = {
    opacity: progress,
    transform: [{ scale }],
  };

  return (
    <Screen contentContainerStyle={styles.screen}>
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
