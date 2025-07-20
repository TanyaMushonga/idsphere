import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Keyboard, BackHandler } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BiometricAuth } from "../../lib/auth";
import { router } from "expo-router";
import { theme } from "@/constants/theme/colors";

export default function PINEntry() {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [mode, setMode] = useState<"verify" | "create">("verify");
  const [step, setStep] = useState<"enter" | "confirm">("enter");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<any>(null);

  useEffect(() => {
    // Check if PIN exists, if not, switch to create mode
    checkPINExists();

    // Handle back button
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (mode === "create" && step === "confirm") {
          setStep("enter");
          setConfirmPin("");
          setError("");
          return true;
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, []);

  const checkPINExists = async () => {
    // You might want to add a method to check if PIN exists
    // For now, we'll assume verify mode unless explicitly creating
  };

  const handleSubmit = async () => {
    if (pin.length < 4) {
      setError("PIN must be at least 4 digits");
      return;
    }

    setLoading(true);
    Keyboard.dismiss();
    setError("");

    try {
      if (mode === "create") {
        if (step === "enter") {
          setStep("confirm");
          setLoading(false);
          return;
        }

        if (step === "confirm") {
          if (pin !== confirmPin) {
            setError("PINs do not match");
            setConfirmPin("");
            setLoading(false);
            return;
          }

          await BiometricAuth.setPIN(pin);
          router.replace("/(main)/(tabs)/home");
          return;
        }
      }

      if (mode === "verify") {
        const isValid = await BiometricAuth.verifyPIN(pin);
        if (isValid) {
          router.replace("/(main)/(tabs)/home");
        } else {
          setError("Invalid PIN");
          setPin("");
        }
      }
    } catch (error) {
      setError("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetPIN = () => {
    setMode("create");
    setStep("enter");
    setPin("");
    setConfirmPin("");
    setError("");
  };

  const goBack = () => {
    if (mode === "create" && step === "confirm") {
      setStep("enter");
      setConfirmPin("");
      setError("");
    } else {
      router.back();
    }
  };

  const getTitle = () => {
    if (mode === "create") {
      return step === "enter" ? "Create Secure PIN" : "Confirm Your PIN";
    }
    return "Enter Your PIN";
  };

  const getHint = () => {
    if (mode === "create") {
      return step === "enter"
        ? "Choose a secure PIN for backup authentication"
        : "Re-enter your PIN to confirm";
    }
    return "Use your backup PIN to unlock";
  };

  return (
    <LinearGradient
      colors={theme.colors.gradient.dark}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="shield-key"
            size={60}
            color={theme.colors.primaryLight}
          />
          <Text style={styles.title}>{getTitle()}</Text>
          <Text style={styles.hint}>{getHint()}</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            value={step === "confirm" ? confirmPin : pin}
            onChangeText={step === "confirm" ? setConfirmPin : setPin}
            placeholder="Enter PIN"
            secureTextEntry
            keyboardType="numeric"
            maxLength={8}
            style={styles.input}
            mode="outlined"
            outlineColor={theme.colors.surfaceVariant}
            activeOutlineColor={theme.colors.primaryLight}
            theme={{
              colors: {
                background: theme.colors.surface,
                onSurfaceVariant: theme.colors.onSurfaceVariant,
                onSurface: theme.colors.onSurface,
              },
            }}
            autoFocus
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={
              loading ||
              (step === "confirm" ? confirmPin.length < 4 : pin.length < 4)
            }
            style={styles.primaryButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            {mode === "create" && step === "enter"
              ? "Continue"
              : mode === "create" && step === "confirm"
              ? "Create PIN"
              : "Unlock"}
          </Button>

          {mode === "verify" && (
            <Button
              mode="text"
              onPress={resetPIN}
              style={styles.secondaryButton}
              labelStyle={[
                styles.buttonLabel,
                { color: theme.colors.primaryLight },
              ]}
            >
              Forgot PIN? Reset
            </Button>
          )}

          <Button
            mode="text"
            onPress={goBack}
            style={styles.tertiaryButton}
            labelStyle={[
              styles.buttonLabel,
              { color: theme.colors.onSurfaceVariant },
            ]}
            icon="arrow-left"
          >
            Back
          </Button>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: theme.spacing.lg,
    maxWidth: 400,
    alignSelf: "center",
    width: "100%",
  },
  header: {
    alignItems: "center",
    marginBottom: theme.spacing.xxl,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.onBackground,
    textAlign: "center",
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  hint: {
    ...theme.typography.caption,
    color: theme.colors.onSurfaceVariant,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: theme.spacing.xl,
  },
  input: {
    backgroundColor: theme.colors.surface,
    fontSize: 18,
  },
  errorText: {
    ...theme.typography.caption,
    color: theme.colors.error,
    textAlign: "center",
    marginTop: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  buttonContainer: {
    gap: theme.spacing.md,
  },
  primaryButton: {
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.borderRadius.md,
  },
  secondaryButton: {
    marginTop: theme.spacing.sm,
  },
  tertiaryButton: {
    marginTop: theme.spacing.sm,
  },
  buttonContent: {
    paddingVertical: theme.spacing.sm,
  },
  buttonLabel: {
    ...theme.typography.body,
    fontWeight: "600",
  },
});
