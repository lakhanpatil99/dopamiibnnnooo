import React, { useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/context/AuthContext";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { LDPSColors } from "@/constants/theme";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SplashScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const { isLoading, isLoggedIn } = useAuth();

  const logoScale = useSharedValue(0.5);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 600 });
    logoScale.value = withSequence(
      withTiming(1.1, { duration: 400, easing: Easing.out(Easing.back(2)) }),
      withTiming(1, { duration: 200 }),
    );
    textOpacity.value = withDelay(400, withTiming(1, { duration: 500 }));
    subtitleOpacity.value = withDelay(600, withTiming(1, { duration: 500 }));
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        if (isLoggedIn) {
          navigation.reset({
            index: 0,
            routes: [{ name: "Main" }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, isLoggedIn, navigation]);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  return (
    <View style={[styles.container, { backgroundColor: LDPSColors.primary }]}>
      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <Image
            source={require("../../assets/images/icon.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.View style={textAnimatedStyle}>
          <ThemedText
            type="h1"
            style={[styles.title, { color: "#FFFFFF" }]}
          >
            LDPS
          </ThemedText>
        </Animated.View>

        <Animated.View style={subtitleAnimatedStyle}>
          <ThemedText
            type="body"
            style={[styles.subtitle, { color: "rgba(255,255,255,0.8)" }]}
          >
            Local Delivery Partner Service
          </ThemedText>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <View style={styles.loadingDots}>
          {[0, 1, 2].map((i) => (
            <LoadingDot key={i} delay={i * 200} />
          ))}
        </View>
      </View>
    </View>
  );
}

function LoadingDot({ delay }: { delay: number }) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    const animate = () => {
      opacity.value = withSequence(
        withDelay(delay, withTiming(1, { duration: 400 })),
        withTiming(0.3, { duration: 400 }),
      );
    };
    animate();
    const interval = setInterval(animate, 1200);
    return () => clearInterval(interval);
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.dot, animatedStyle]} />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    overflow: "hidden",
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 48,
    fontWeight: "800",
    letterSpacing: 4,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    letterSpacing: 0.5,
  },
  footer: {
    position: "absolute",
    bottom: 80,
  },
  loadingDots: {
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.8)",
  },
});
