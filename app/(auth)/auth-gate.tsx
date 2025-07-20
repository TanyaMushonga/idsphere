import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, Animated } from "react-native";
import { Button, Text, ActivityIndicator } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BiometricAuth } from "../../lib/auth";
import { router } from "expo-router";
import { theme } from "@/constants/theme/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY = "onboarding_complete";

export default function AuthGate() {
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.8))[0];

  useEffect(() => {
    checkAuthCapabilities();

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const checkAuthCapabilities = async () => {
    try {
      const isAvailable = await BiometricAuth.isAvailable();
      setBiometricAvailable(isAvailable);
    } catch (error) {
      console.error("Error checking auth capabilities:", error);
      setAuthError("Authentication setup failed");
    } finally {
      setLoading(false);
    }
  };
  const checkOnboardingStatus = async () => {
    try {
      const hasOnboarded = await AsyncStorage.getItem(ONBOARDING_KEY);

      if (hasOnboarded === "true") {
        router.replace("/(main)/(tabs)/home");
      } else {
        router.replace("/(onboarding)");
      }
    } catch (error) {
      console.error("Error checking onboarding status:", error);
    }
  };
  const handleBiometricAuth = async () => {
    setLoading(true);
    setAuthError("");

    try {
      const success = await BiometricAuth.authenticate();
      if (success) {
        checkOnboardingStatus();
      } else {
        setAuthError("Authentication failed. Please try again.");
      }
    } catch (error) {
      setAuthError("Biometric authentication error");
    } finally {
      setLoading(false);
    }
  };

  const handlePINFallback = () => {
    router.push("/pin");
  };

  return (
    <LinearGradient
      colors={theme.colors.gradient.dark}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* App Logo/Icon */}
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons
            name="shield-account"
            size={80}
            color={theme.colors.primaryLight}
          />
        </View>

        <Text style={styles.title}>IDSphere</Text>
        <Text style={styles.subtitle}>Secure Identity Wallet</Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={theme.colors.primaryLight}
            style={styles.loader}
          />
        ) : (
          <View style={styles.authOptions}>
            {authError ? (
              <Text style={styles.errorText}>{authError}</Text>
            ) : null}

            {biometricAvailable && (
              <Button
                mode="contained"
                onPress={handleBiometricAuth}
                style={styles.primaryButton}
                contentStyle={styles.buttonContent}
                labelStyle={[
                  styles.buttonLabel,
                  { color: theme.colors.onPrimary },
                ]}
                icon="fingerprint"
              >
                Use Biometric Authentication
              </Button>
            )}

            <Button
              mode="outlined"
              onPress={handlePINFallback}
              style={styles.secondaryButton}
              contentStyle={styles.buttonContent}
              labelStyle={[
                styles.buttonLabel,
                { color: theme.colors.primaryLight },
              ]}
              icon="numeric"
            >
              Use PIN Instead
            </Button>
          </View>
        )}
      </Animated.View>
    </LinearGradient>
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
    width: "90%",
    maxWidth: 400,
  },
  logoContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.onBackground,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.xxl,
    textAlign: "center",
  },
  loader: {
    marginTop: theme.spacing.xl,
  },
  authOptions: {
    width: "100%",
    marginTop: theme.spacing.lg,
  },
  errorText: {
    ...theme.typography.caption,
    color: theme.colors.error,
    textAlign: "center",
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  primaryButton: {
    backgroundColor: theme.colors.primaryLight,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  secondaryButton: {
    borderColor: theme.colors.primaryLight,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
  },
  buttonContent: {
    paddingVertical: theme.spacing.sm,
  },
  buttonLabel: {
    ...theme.typography.body,
    fontWeight: "600",
  },
});
