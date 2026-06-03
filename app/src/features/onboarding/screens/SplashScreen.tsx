import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

import { Wordmark } from "@/components/ui";
import type { RootStackParamList } from "@/navigation/RootNavigator";
import { animation, colors } from "@/styles/tokens";

type Props = NativeStackScreenProps<RootStackParamList, "Splash">;

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

  return (
    <View style={styles.screen}>
      <Animated.View style={{ opacity: progress, transform: [{ scale }] }}>
        <Wordmark size="splash" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
});
