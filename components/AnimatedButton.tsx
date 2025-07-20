import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Animated,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../constants/theme/colors";

interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  style?: ViewStyle;
  textStyle?: TextStyle;
  loading?: boolean;
  icon?: React.ReactNode;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  title,
  onPress,
  disabled = false,
  variant = "primary",
  size = "medium",
  style,
  textStyle,
  loading = false,
  icon,
}) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current;
  const opacityValue = React.useRef(new Animated.Value(1)).current;

  const animatePress = () => {
    Animated.parallel([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityValue, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.parallel([
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handlePress = () => {
    if (!disabled && !loading) {
      animatePress();
      setTimeout(onPress, 150);
    }
  };

  const getButtonStyle = () => {
    const baseStyle = [
      styles.button,
      styles[size],
      disabled && styles.disabled,
      style,
    ];

    if (variant === "outline") {
      return [...baseStyle, styles.outline];
    }
    return baseStyle;
  };

  const ButtonContent = () => (
    <Animated.View
      style={[
        styles.content,
        { transform: [{ scale: scaleValue }], opacity: opacityValue },
      ]}
    >
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text
        style={[
          styles.text,
          styles[`${size}Text`],
          variant === "outline" && styles.outlineText,
          disabled && styles.disabledText,
          textStyle,
        ]}
      >
        {loading ? "Loading..." : title}
      </Text>
    </Animated.View>
  );

  if (variant === "primary") {
    return (
      <Pressable onPress={handlePress} style={getButtonStyle()}>
        <LinearGradient
          colors={
            disabled ? ["#64748B", "#475569"] : theme.colors.gradient.primary
          }
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <ButtonContent />
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={handlePress} style={getButtonStyle()}>
      <ButtonContent />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius.md,
    overflow: "hidden",
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.lg,
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
  text: {
    color: theme.colors.onPrimary,
    fontWeight: "600",
    textAlign: "center",
  },
  // Sizes
  small: {
    height: 40,
  },
  medium: {
    height: 52,
  },
  large: {
    height: 60,
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  // Variants
  outline: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: theme.colors.primaryLight,
  },
  outlineText: {
    color: theme.colors.primaryLight,
  },
  // States
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: theme.colors.onSurfaceVariant,
  },
});
