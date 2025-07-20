import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import QRCode from "react-native-qrcode-svg";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../constants/theme/colors";
import * as Crypto from "expo-crypto";
import { GradientBackground } from "@/components/GradientBackground";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { AnimatedButton } from "@/components/AnimatedButton";

interface GenerationStep {
  id: number;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  duration: number;
}

const GENERATION_STEPS: GenerationStep[] = [
  {
    id: 1,
    title: "Generating Keys",
    description: "Creating your cryptographic key pair...",
    icon: "key",
    duration: 1500,
  },
  {
    id: 2,
    title: "Building Identity",
    description: "Constructing your decentralized identifier...",
    icon: "construct",
    duration: 1000,
  },
  {
    id: 3,
    title: "Securing Wallet",
    description: "Encrypting your digital identity...",
    icon: "shield-checkmark",
    duration: 800,
  },
  {
    id: 4,
    title: "Complete",
    description: "Your identity is ready!",
    icon: "checkmark-circle",
    duration: 500,
  },
];

export default function DIDGenerateScreen() {
  const [currentStep, setCurrentStep] = useState(0);

  const [did, setDid] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const qrScale = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    generateDID();
  }, []);

  const generateDID = async () => {
    let totalProgress = 0;

    for (let i = 0; i < GENERATION_STEPS.length; i++) {
      const step = GENERATION_STEPS[i];
      setCurrentStep(i);

      // Animate progress
      const stepProgress = 1 / GENERATION_STEPS.length;
      Animated.timing(progressAnim, {
        toValue: totalProgress + stepProgress,
        duration: step.duration,
        useNativeDriver: false,
      }).start();

      await new Promise((resolve) => setTimeout(resolve, step.duration));
      totalProgress += stepProgress;
    }

    const randomBytes = await Crypto.getRandomBytesAsync(32);
    const address = Array.from(randomBytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .slice(0, 40);

    const generatedDID = `did:ethr:0x${address}`;
    setDid(generatedDID);
    setIsComplete(true);

    Animated.timing(successScale, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      setShowQR(true);
      Animated.timing(qrScale, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 800);
  };

  const handleContinue = () => {
    router.push("/(onboarding)/permissions");
  };

  const handleCopyDID = async () => {
    console.log("DID copied:", did);
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Ionicons
                name="person-circle"
                size={48}
                color={theme.colors.primary}
              />
            </View>
            <Text style={styles.title}>Creating Your Identity</Text>
            <Text style={styles.subtitle}>
              Generating your unique decentralized identifier
            </Text>
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressContainer}>
              <Animated.View
                style={[
                  styles.progressBar,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0%", "100%"],
                    }),
                  },
                ]}
              />
            </View>

            <View style={styles.progressText}>
              <Text style={styles.progressLabel}>
                Step {currentStep + 1} of {GENERATION_STEPS.length}
              </Text>
            </View>

            {!isComplete && (
              <View style={styles.stepInfo}>
                <View style={styles.stepIconContainer}>
                  <Ionicons
                    name={GENERATION_STEPS[currentStep]?.icon}
                    size={32}
                    color={theme.colors.primary}
                  />
                  <View style={styles.spinnerOverlay}>
                    <LoadingSpinner size={24} />
                  </View>
                </View>
                <Text style={styles.stepTitle}>
                  {GENERATION_STEPS[currentStep]?.title}
                </Text>
                <Text style={styles.stepDescription}>
                  {GENERATION_STEPS[currentStep]?.description}
                </Text>
              </View>
            )}
          </View>

          {isComplete && (
            <View style={styles.resultSection}>
              <Animated.View
                style={[
                  styles.successIndicator,
                  { transform: [{ scale: successScale }] },
                ]}
              >
                <View style={styles.successIconContainer}>
                  <Ionicons
                    name="checkmark-circle"
                    size={64}
                    color={theme.colors.success}
                  />
                </View>
                <Text style={styles.successText}>Identity Created!</Text>
              </Animated.View>

              {showQR && (
                <Animated.View
                  style={[
                    styles.qrSection,
                    { transform: [{ scale: qrScale }] },
                  ]}
                >
                  <Text style={styles.qrLabel}>QR Code</Text>
                  <View style={styles.qrContainer}>
                    <QRCode
                      value={did}
                      size={140}
                      backgroundColor="white"
                      color={theme.colors.primary}
                    />
                  </View>
                  <Text style={styles.qrHint}>
                    Share this QR code to verify your identity
                  </Text>
                </Animated.View>
              )}
            </View>
          )}

          <View style={styles.ctaSection}>
            <AnimatedButton
              title="Continue Setup"
              onPress={handleContinue}
              disabled={!isComplete}
              size="large"
              style={styles.continueButton}
            />

            {isComplete && (
              <View style={styles.securityNote}>
                <Ionicons
                  name="lock-closed"
                  size={16}
                  color={theme.colors.success}
                />
                <Text style={styles.securityText}>
                  Your private key is stored securely on this device only
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  header: {
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  headerIcon: {
    marginBottom: theme.spacing.md,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.onBackground,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
    fontSize: 24,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.onSurfaceVariant,
    textAlign: "center",
    fontSize: 16,
  },
  progressSection: {
    marginBottom: theme.spacing.xl,
  },
  progressContainer: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: theme.spacing.sm,
  },
  progressBar: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  progressText: {
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  progressLabel: {
    ...theme.typography.caption,
    color: theme.colors.onSurfaceVariant,
    fontSize: 14,
  },
  stepInfo: {
    alignItems: "center",
    minHeight: 120,
  },
  stepIconContainer: {
    position: "relative",
    marginBottom: theme.spacing.md,
  },
  spinnerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  stepTitle: {
    ...theme.typography.h4,
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.sm,
    fontSize: 18,
  },
  stepDescription: {
    ...theme.typography.body,
    color: theme.colors.onSurfaceVariant,
    textAlign: "center",
    fontSize: 14,
  },
  resultSection: {
    alignItems: "center",
    flex: 1,
    minHeight: 300,
  },
  successIndicator: {
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  successIconContainer: {
    marginBottom: theme.spacing.md,
  },
  successText: {
    ...theme.typography.h3,
    color: theme.colors.success,
    fontSize: 20,
  },
  didContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  didLabel: {
    ...theme.typography.body,
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.sm,
    fontWeight: "600",
    fontSize: 16,
  },
  didBox: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    width: "100%",
    marginBottom: theme.spacing.xs,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  didText: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontFamily: "monospace",
    textAlign: "center",
    lineHeight: 18,
    flex: 1,
    fontSize: 12,
  },
  copyIcon: {
    marginLeft: theme.spacing.sm,
  },
  didHint: {
    ...theme.typography.caption,
    color: theme.colors.onSurfaceVariant,
    fontStyle: "italic",
    fontSize: 12,
  },
  qrSection: {
    alignItems: "center",
    marginTop: theme.spacing.md,
  },
  qrLabel: {
    ...theme.typography.body,
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.md,
    fontWeight: "600",
    fontSize: 16,
  },
  qrContainer: {
    backgroundColor: "white",
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    elevation: 8,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    marginBottom: theme.spacing.md,
  },
  qrHint: {
    ...theme.typography.caption,
    color: theme.colors.onSurfaceVariant,
    textAlign: "center",
    fontSize: 12,
  },
  ctaSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
  continueButton: {
    width: "100%",
    marginBottom: theme.spacing.md,
  },
  securityNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.md,
  },
  securityText: {
    ...theme.typography.caption,
    color: theme.colors.success,
    textAlign: "center",
    lineHeight: 18,
    marginLeft: theme.spacing.xs,
    fontSize: 12,
  },
});
