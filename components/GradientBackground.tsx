import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "@/constants/theme/colors";

interface GradientBackgroundProps {
  children: React.ReactNode;
  colors?: readonly [string, string, ...string[]];
  style?: any;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  children,
  colors = theme.colors.gradient.dark,
  style,
}) => (
  <LinearGradient colors={colors} style={[styles.gradient, style]}>
    {children}
  </LinearGradient>
);

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});
