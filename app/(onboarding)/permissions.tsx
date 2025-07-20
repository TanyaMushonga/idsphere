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
import { theme } from "../../constants/theme/colors";
import { GradientBackground } from "@/components/GradientBackground";
import { AnimatedButton } from "@/components/AnimatedButton";

interface Permission {
  id: string;
  title: string;
  description: string;
  icon: string;
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
      icon: "👆",
      enabled: true,
      required: true,
      benefits: ["Enhanced security", "Quick access", "No passwords needed"],
    },
    {
      id: "notifications",
      title: "Push Notifications",
      description: "Get alerts for credential requests and activity",
      icon: "🔔",
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
      icon: "☁️",
      enabled: false,
      benefits: ["Device recovery", "Automatic sync", "Peace of mind"],
    },
    {
      id: "analytics",
      title: "Anonymous Analytics",
      description: "Help improve IDSphere with anonymous usage data",
      icon: "📊",
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
    // Store permissions
    const enabledPermissions = permissions
      .filter((p) => p.enabled)
      .map((p) => p.id);

    try {
      // Here you would typically save to AsyncStorage or your preferred storage
      // await AsyncStorage.setItem('userPermissions', JSON.stringify(enabledPermissions));

      // Request actual system permissions for enabled items
      await requestSystemPermissions(enabledPermissions);

      // Navigate to next screen (likely dashboard or main app)
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
    // Request biometric permissions
    if (enabledPermissions.includes("biometrics")) {
      // await LocalAuthentication.requestPermissionsAsync();
    }

    // Request notification permissions
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
        <View style={styles.permissionIcon}>
          <Text style={styles.iconText}>{permission.icon}</Text>
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
          {permission.benefits.map((benefit, index) => (
            <Text key={index} style={styles.benefitItem}>
              • {benefit}
            </Text>
          ))}
        </View>
      )}
    </Animated.View>
  );

  return (
    <GradientBackground>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
    paddingHorizontal: theme.spacing.lg,
  },
  header: {
    paddingTop: theme.spacing.xxl + theme.spacing.md,
    paddingBottom: theme.spacing.xl,
    alignItems: "center",
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.onBackground,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.onSurfaceVariant,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: theme.spacing.md,
  },
  permissionsContainer: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
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
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  permissionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.md,
  },
  permissionIcon: {
    width: theme.spacing.xxl,
    height: theme.spacing.xxl,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.surfaceVariant,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.primary + "20",
  },
  iconText: {
    fontSize: 24,
  },
  permissionInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  permissionTitle: {
    ...theme.typography.h4,
    color: theme.colors.onSurface,
  },
  requiredBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  requiredText: {
    fontSize: 12,
    color: theme.colors.onPrimary,
    fontWeight: "600",
  },
  permissionDescription: {
    ...theme.typography.caption,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 20,
  },
  benefitsContainer: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceVariant,
  },
  benefitsTitle: {
    ...theme.typography.caption,
    fontWeight: "600",
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.sm,
  },
  benefitItem: {
    fontSize: 13,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 18,
    marginBottom: theme.spacing.xs,
  },
  footer: {
    paddingBottom: theme.spacing.xxl,
    alignItems: "center",
  },
  footerNote: {
    ...theme.typography.caption,
    color: theme.colors.onSurfaceVariant,
    textAlign: "center",
    marginBottom: theme.spacing.lg,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: theme.spacing.md,
    width: "100%",
  },
  skipButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
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
