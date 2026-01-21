import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  Pressable,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, LDPSColors } from "@/constants/theme";

interface InputProps extends TextInputProps {
  label?: string;
  icon?: keyof typeof Feather.glyphMap;
  error?: string;
  rightIcon?: keyof typeof Feather.glyphMap;
  onRightIconPress?: () => void;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export function Input({
  label,
  icon,
  error,
  rightIcon,
  onRightIconPress,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const focusProgress = useSharedValue(0);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    focusProgress.value = withTiming(1, { duration: 200 });
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    focusProgress.value = withTiming(0, { duration: 200 });
    onBlur?.(e);
  };

  const animatedContainerStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      focusProgress.value,
      [0, 1],
      [error ? LDPSColors.error : theme.border, LDPSColors.primary],
    ),
    transform: [{ scale: 1 + focusProgress.value * 0.01 }],
  }));

  return (
    <View style={styles.wrapper}>
      {label ? (
        <ThemedText
          type="small"
          style={[
            styles.label,
            isFocused && { color: LDPSColors.primary },
            error && { color: LDPSColors.error },
          ]}
        >
          {label}
        </ThemedText>
      ) : null}
      <AnimatedView
        style={[
          styles.container,
          { backgroundColor: theme.backgroundSecondary },
          animatedContainerStyle,
        ]}
      >
        {icon ? (
          <Feather
            name={icon}
            size={20}
            color={
              isFocused
                ? LDPSColors.primary
                : error
                  ? LDPSColors.error
                  : theme.textSecondary
            }
            style={styles.icon}
          />
        ) : null}
        <TextInput
          style={[styles.input, { color: theme.text }]}
          placeholderTextColor={theme.textSecondary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        {rightIcon ? (
          <Pressable onPress={onRightIconPress} style={styles.rightIcon}>
            <Feather name={rightIcon} size={20} color={theme.textSecondary} />
          </Pressable>
        ) : null}
      </AnimatedView>
      {error ? (
        <ThemedText
          type="small"
          style={[styles.error, { color: LDPSColors.error }]}
        >
          {error}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  label: {
    fontWeight: "500",
    marginLeft: 4,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: Spacing.inputHeight,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.lg,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: "100%",
  },
  rightIcon: {
    padding: 4,
  },
  error: {
    marginLeft: 4,
  },
});
