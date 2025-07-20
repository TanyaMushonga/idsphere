import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../constants/theme/colors";
import { GradientBackground } from "@/components/GradientBackground";
import { AnimatedButton } from "@/components/AnimatedButton";

const { height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    StatusBar.setBarStyle("light-content");
    Animated.sequence([
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const handleGetStarted = () => {
    router.push("/(onboarding)/did-generate");
  };

  const features = [
    {
      icon: "shield-checkmark",
      title: "Military-grade encryption",
      description: "End-to-end security for your data",
    },
    {
      icon: "finger-print",
      title: "Biometric authentication",
      description: "Secure access with your unique identity",
    },
    {
      icon: "globe",
      title: "Decentralized & private",
      description: "You control your data, not big tech",
    },
    {
      icon: "checkmark-circle",
      title: "Instant verification",
      description: "Quick and seamless credential sharing",
    },
  ];

  return (
    <GradientBackground
      colors={[theme.colors.background, theme.colors.primary]}
    >
      <View style={styles.container}>
        <Animated.View
          style={[styles.logoSection, { transform: [{ scale: logoScale }] }]}
        >
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>ID</Text>
            </View>
          </View>
          <Text style={styles.brandName}>IDSphere</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.contentSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.title}>Own Your Digital Identity</Text>
          <Text style={styles.subtitle}>
            Securely store, manage, and share your verifiable credentials with
            complete control and privacy.
          </Text>

          <View style={styles.features}>
            {features.map((feature, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.featureItem,
                  {
                    opacity: fadeAnim,
                    transform: [
                      {
                        translateX: slideAnim.interpolate({
                          inputRange: [0, 50],
                          outputRange: [0, -20 - index * 10],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <View style={styles.featureContent}>
                  <View style={styles.iconContainer}>
                    <Ionicons
                      name={feature.icon as any}
                      size={20}
                      color={theme.colors.primary}
                    />
                  </View>
                  <View style={styles.featureTextContainer}>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDescription}>
                      {feature.description}
                    </Text>
                  </View>
                </View>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* CTA Section */}
        <Animated.View style={[styles.ctaSection, { opacity: fadeAnim }]}>
          <AnimatedButton
            title="Get Started"
            onPress={handleGetStarted}
            size="large"
            style={styles.primaryButton}
          />
          <Text style={styles.disclaimer}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </Animated.View>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: height * 0.1,
    paddingBottom: theme.spacing.xl,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: theme.spacing.xxl,
  },
  logoContainer: {
    marginBottom: theme.spacing.md,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: theme.colors.primaryLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  logoText: {
    ...theme.typography.h2,
    color: theme.colors.onPrimary,
    fontWeight: "800",
  },
  brandName: {
    ...theme.typography.h2,
    color: theme.colors.onBackground,
    fontWeight: "700",
    letterSpacing: 1,
  },
  contentSection: {
    flex: 1,
    justifyContent: "flex-start",
    minHeight: height * 0.5,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.onBackground,
    textAlign: "center",
    marginBottom: theme.spacing.md,
    lineHeight: 40,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.onSurfaceVariant,
    textAlign: "center",
    marginBottom: theme.spacing.xl,
    lineHeight: 24,
    paddingHorizontal: theme.spacing.sm,
  },
  features: {
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xs,
  },
  featureItem: {
    marginBottom: theme.spacing.md,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 12,
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  featureContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.sm,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    color: theme.colors.onSurface,
    fontWeight: "600",
    marginBottom: 2,
    fontSize: 14,
  },
  featureDescription: {
    ...theme.typography.caption,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 14,
    fontSize: 12,
  },
  ctaSection: {
    alignItems: "center",
  },
  primaryButton: {
    width: "100%",
    marginBottom: theme.spacing.md,
  },
  disclaimer: {
    ...theme.typography.caption,
    color: theme.colors.onSurfaceVariant,
    textAlign: "center",
    lineHeight: 18,
  },
});
