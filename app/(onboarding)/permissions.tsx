import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  Animated,
  TouchableOpacity,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../constants/theme/colors";
import { GradientBackground } from "@/components/GradientBackground";
import { AnimatedButton } from "@/components/AnimatedButton";

interface Permission {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  enabled: boolean;
  required?: boolean;
  benefits?: string[];
}

export default function PermissionsScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const [permissions, setPermissions] = useState<Permission[]>([
    {
      id: "biometrics",
      title: "Biometric Authentication",
      description: "Use Face ID or fingerprint to secure your wallet",
      icon: "finger-print",
      enabled: true,
      required: true,
      benefits: ["Enhanced security", "Quick access", "No passwords needed"],
    },
    {
      id: "notifications",
      title: "Push Notifications",
      description: "Get alerts for credential requests and activity",
      icon: "notifications",
      enabled: true,
      benefits: [
        "Real-time alerts",
        "Security notifications",
        "Activity updates",
      ],
    },
    {
      id: "backup",
      title: "Encrypted Backup",
      description: "Securely backup your identity to iCloud/Google Drive",
      icon: "cloud-upload",
      enabled: false,
      benefits: ["Device recovery", "Automatic sync", "Peace of mind"],
    },
    {
      id: "analytics",
      title: "Anonymous Analytics",
      description: "Help improve IDSphere with anonymous usage data",
      icon: "analytics",
      enabled: false,
      benefits: [
        "Better user experience",
        "Privacy preserved",
        "App improvements",
      ],
    },
  ]);

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const togglePermission = (id: string) => {
    setPermissions((prev) =>
      prev.map((p) =>
        p.id === id && !p.required ? { ...p, enabled: !p.enabled } : p
      )
    );
  };

  const handleContinue = async () => {
    const enabledPermissions = permissions
      .filter((p) => p.enabled)
      .map((p) => p.id);

    try {
      await requestSystemPermissions(enabledPermissions);

      router.replace("/(main)/(tabs)/home");
    } catch (error) {
      Alert.alert(
        "Permission Error",
        "There was an issue setting up your permissions. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  const requestSystemPermissions = async (enabledPermissions: string[]) => {
    if (enabledPermissions.includes("biometrics")) {
    }

    if (enabledPermissions.includes("notifications")) {
      // await Notifications.requestPermissionsAsync();
    }

    // Additional permission requests would go here
  };

  const handleSkip = () => {
    Alert.alert(
      "Skip Permissions?",
      "You can always enable permissions later in Settings. Continue without setting up permissions?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Skip",
          style: "default",
          onPress: () => router.replace("/(main)/(tabs)/home"),
        },
      ]
    );
  };

  const PermissionItem = ({ permission }: { permission: Permission }) => (
    <Animated.View
      style={[
        styles.permissionCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.permissionHeader}>
        <View
          style={[
            styles.permissionIcon,
            {
              backgroundColor: permission.enabled
                ? theme.colors.primary + "20"
                : theme.colors.surfaceVariant,
            },
          ]}
        >
          <Ionicons
            name={permission.icon}
            size={24}
            color={
              permission.enabled
                ? theme.colors.primary
                : theme.colors.onSurfaceVariant
            }
          />
        </View>
        <View style={styles.permissionInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.permissionTitle}>{permission.title}</Text>
            {permission.required && (
              <View style={styles.requiredBadge}>
                <Text style={styles.requiredText}>Required</Text>
              </View>
            )}
          </View>
          <Text style={styles.permissionDescription}>
            {permission.description}
          </Text>
        </View>
        <Switch
          value={permission.enabled}
          onValueChange={() => togglePermission(permission.id)}
          disabled={permission.required}
          trackColor={{
            false: theme.colors.surfaceVariant,
            true: theme.colors.primary,
          }}
          thumbColor={
            permission.enabled
              ? theme.colors.onPrimary
              : theme.colors.onSurfaceVariant
          }
          ios_backgroundColor={theme.colors.surfaceVariant}
        />
      </View>

      {permission.benefits && permission.enabled && (
        <View style={styles.benefitsContainer}>
          <Text style={styles.benefitsTitle}>Benefits:</Text>
          <View style={styles.benefitsList}>
            {permission.benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitRow}>
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={theme.colors.primary}
                  style={styles.benefitIcon}
                />
                <Text style={styles.benefitItem}>{benefit}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </Animated.View>
  );

  return (
    <GradientBackground>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.title}>Set Your Preferences</Text>
          <Text style={styles.subtitle}>
            Configure permissions to personalize your IDSphere experience
          </Text>
        </Animated.View>

        <View style={styles.permissionsContainer}>
          {permissions.map((permission) => (
            <PermissionItem key={permission.id} permission={permission} />
          ))}
        </View>

        <Animated.View
          style={[
            styles.footer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.footerNote}>
            You can change these settings anytime in the app preferences
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipButtonText}>Skip for Now</Text>
            </TouchableOpacity>

            <AnimatedButton
              title="Continue"
              onPress={handleContinue}
              style={styles.continueButton}
            />
          </View>
        </Animated.View>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  header: {
    paddingTop: theme.spacing.xxl + theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
    alignItems: "center",
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.onBackground,
    textAlign: "center",
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.onSurfaceVariant,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: theme.spacing.lg,
    maxWidth: 320,
  },
  permissionsContainer: {
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.xxl,
  },
  permissionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.surfaceVariant,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  permissionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.md,
  },
  permissionIcon: {
    width: theme.spacing.xxl + theme.spacing.sm,
    height: theme.spacing.xxl + theme.spacing.sm,
    borderRadius: theme.borderRadius.xl,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.primary + "30",
  },
  permissionInfo: {
    flex: 1,
    paddingTop: 2,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    flexWrap: "wrap",
  },
  permissionTitle: {
    ...theme.typography.h4,
    color: theme.colors.onSurface,
    lineHeight: 24,
  },
  requiredBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  requiredText: {
    fontSize: 12,
    color: theme.colors.onPrimary,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  permissionDescription: {
    ...theme.typography.caption,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 22,
  },
  benefitsContainer: {
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceVariant,
  },
  benefitsTitle: {
    ...theme.typography.caption,
    fontWeight: "600",
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  benefitsList: {
    gap: theme.spacing.sm,
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  benefitIcon: {
    marginTop: 1,
  },
  benefitItem: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 20,
    flex: 1,
  },
  footer: {
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
    alignItems: "center",
  },
  footerNote: {
    ...theme.typography.caption,
    color: theme.colors.onSurfaceVariant,
    textAlign: "center",
    marginBottom: theme.spacing.xl,
    lineHeight: 22,
    maxWidth: 280,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: theme.spacing.md,
    width: "100%",
    paddingHorizontal: theme.spacing.sm,
  },
  skipButton: {
    flex: 1,
    paddingVertical: theme.spacing.md + 2,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1.5,
    borderColor: theme.colors.surfaceVariant,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
  },
  skipButtonText: {
    ...theme.typography.body,
    fontWeight: "600",
    color: theme.colors.onSurfaceVariant,
  },
  continueButton: {
    flex: 1,
  },
});
