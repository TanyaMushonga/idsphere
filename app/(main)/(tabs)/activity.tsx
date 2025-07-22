import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

// Theme definition
const theme = {
  colors: {
    primary: "#1E3A8A",
    primaryLight: "#3B82F6",
    primaryDark: "#1E40AF",
    secondary: "#06B6D4",
    background: "#0F172A",
    surface: "#1E293B",
    surfaceVariant: "#334155",
    onPrimary: "#FFFFFF",
    onBackground: "#F1F5F9",
    onSurface: "#E2E8F0",
    onSurfaceVariant: "#94A3B8",
    error: "#EF4444",
    warning: "#F59E0B",
    success: "#10B981",
    accent: "#8B5CF6",
    gradient: {
      primary: ["#1E3A8A", "#3B82F6"],
      secondary: ["#06B6D4", "#8B5CF6"],
      dark: ["#0F172A", "#1E293B"],
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  typography: {
    h1: { fontSize: 32, fontWeight: "800" as const },
    h2: { fontSize: 28, fontWeight: "700" as const },
    h3: { fontSize: 24, fontWeight: "600" as const },
    h4: { fontSize: 20, fontWeight: "600" as const },
    body: { fontSize: 16, fontWeight: "400" as const },
    caption: { fontSize: 14, fontWeight: "400" as const },
  },
} as const;

// Type definitions
interface ActivityDetails {
  sharedCredential?: string;
  sharedAttributes?: string[];
  method?: string;
  requestedCredential?: string;
  attributesVerified?: string[];
  verificationMethod?: string;
  credentialType?: string;
  attributes?: string[];
  issuerContact?: string;
  message?: string;
  reason?: string;
}

interface Activity {
  id: string;
  type: string;
  target: string;
  timestamp: string;
  details: ActivityDetails;
}

interface IconConfig {
  name: string;
  color: string;
}

interface ActivityStyles {
  borderColor: string;
  backgroundColor: string;
}

interface FilterOption {
  value: string;
  label: string;
  count: number;
}

interface AttributeBadgeProps {
  text: string;
  color?: string;
}

const ActivityScreen: React.FC = () => {
  const [filter, setFilter] = useState<string>("all");

  const activityData: Activity[] = [
    {
      id: "act_001",
      type: "Credential Shared",
      target: "CBZ Bank Zimbabwe",
      timestamp: "2025-07-20T10:30:00Z",
      details: {
        sharedCredential: "Bank Account Verification",
        sharedAttributes: ["Full Name", "National ID Number"],
        method: "QR Code Scan",
      },
    },
    {
      id: "act_002",
      type: "Verification Request",
      target: "Ministry of Health Verification Portal",
      timestamp: "2025-07-19T15:00:00Z",
      details: {
        requestedCredential: "COVID-19 Vaccination Certificate",
        attributesVerified: ["Full Name", "Vaccine Type"],
        verificationMethod: "Online Verification",
      },
    },
    {
      id: "act_003",
      type: "New Credential Received",
      target: "Bulawayo City Council",
      timestamp: "2025-07-18T09:45:00Z",
      details: {
        credentialType: "Residential Permit",
        attributes: ["Resident Name", "Physical Address", "Permit Number"],
        issuerContact: "info@byocity.gov.zw",
      },
    },
    {
      id: "act_004",
      type: "Backup Reminder",
      target: "IDSphere App",
      timestamp: "2025-07-17T08:00:00Z",
      details: {
        message: "You have not backed up your DID in the last 30 days.",
      },
    },
    {
      id: "act_005",
      type: "Credential Shared",
      target: "TechExpo Organizer",
      timestamp: "2025-07-16T16:20:00Z",
      details: {
        sharedCredential: "University Degree Certificate",
        sharedAttributes: ["Graduate Name", "Degree"],
        method: "Bluetooth Share",
      },
    },
    {
      id: "act_006",
      type: "Credential Revoked",
      target: "Old Driver's License",
      timestamp: "2025-07-15T14:10:00Z",
      details: {
        credentialType: "Driver's License",
        reason: "Replaced with new license issued on 2023-08-10",
      },
    },
    {
      id: "act_007",
      type: "Verification Request",
      target: "Bulawayo Traffic Police",
      timestamp: "2025-07-14T11:50:00Z",
      details: {
        requestedCredential: "Driver's License",
        attributesVerified: ["Full Name", "License Number"],
        verificationMethod: "Roadside QR Check",
      },
    },
    {
      id: "act_008",
      type: "New Credential Received",
      target: "Ministry of Health Zimbabwe",
      timestamp: "2025-07-13T10:00:00Z",
      details: {
        credentialType: "COVID-19 Vaccination Certificate",
        attributes: ["Full Name", "Vaccine Type", "Certificate ID"],
        issuerContact: "vaccines@moh.gov.zw",
      },
    },
    {
      id: "act_009",
      type: "Credential Shared",
      target: "ZimRide Car Hire",
      timestamp: "2025-07-12T09:30:00Z",
      details: {
        sharedCredential: "Driver's License",
        sharedAttributes: ["Full Name", "License Number", "Vehicle Class"],
        method: "Manual Share via NFC",
      },
    },
    {
      id: "act_010",
      type: "New Credential Received",
      target: "National University of Science and Technology (NUST)",
      timestamp: "2025-07-11T08:00:00Z",
      details: {
        credentialType: "University Degree Certificate",
        attributes: ["Graduate Name", "Degree", "Graduation Year"],
        issuerContact: "registrar@nust.ac.zw",
      },
    },
  ];

  const getActivityIcon = (type: string): IconConfig => {
    switch (type) {
      case "Credential Shared":
        return { name: "share", color: theme.colors.primaryLight };
      case "Verification Request":
        return { name: "verified", color: theme.colors.success };
      case "New Credential Received":
        return { name: "download", color: theme.colors.accent };
      case "Backup Reminder":
        return { name: "warning", color: theme.colors.warning };
      case "Credential Revoked":
        return { name: "delete", color: theme.colors.error };
      default:
        return { name: "access-time", color: theme.colors.onSurfaceVariant };
    }
  };

  const getActivityStyles = (type: string): ActivityStyles => {
    switch (type) {
      case "Credential Shared":
        return {
          borderColor: theme.colors.primaryLight,
          backgroundColor: theme.colors.surface,
        };
      case "Verification Request":
        return {
          borderColor: theme.colors.success,
          backgroundColor: theme.colors.surface,
        };
      case "New Credential Received":
        return {
          borderColor: theme.colors.accent,
          backgroundColor: theme.colors.surface,
        };
      case "Backup Reminder":
        return {
          borderColor: theme.colors.warning,
          backgroundColor: theme.colors.surface,
        };
      case "Credential Revoked":
        return {
          borderColor: theme.colors.error,
          backgroundColor: theme.colors.surface,
        };
      default:
        return {
          borderColor: theme.colors.onSurfaceVariant,
          backgroundColor: theme.colors.surface,
        };
    }
  };

  const formatDate = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFilteredActivities = (): Activity[] => {
    if (filter === "all") return activityData;
    return activityData.filter((activity) =>
      activity.type.toLowerCase().includes(filter.toLowerCase())
    );
  };

  const filterOptions: FilterOption[] = [
    { value: "all", label: "All", count: activityData.length },
    {
      value: "shared",
      label: "Shared",
      count: activityData.filter((a) => a.type === "Credential Shared").length,
    },
    {
      value: "verification",
      label: "Verified",
      count: activityData.filter((a) => a.type === "Verification Request")
        .length,
    },
    {
      value: "received",
      label: "Received",
      count: activityData.filter((a) => a.type === "New Credential Received")
        .length,
    },
    {
      value: "revoked",
      label: "Revoked",
      count: activityData.filter((a) => a.type === "Credential Revoked").length,
    },
  ];

  const AttributeBadge: React.FC<AttributeBadgeProps> = ({
    text,
    color = theme.colors.primaryLight,
  }) => (
    <View
      style={[
        styles.attributeBadge,
        { backgroundColor: color + "20", borderColor: color },
      ]}
    >
      <Text style={[styles.attributeText, { color }]}>{text}</Text>
    </View>
  );

  const renderActivityItem = ({ item }: { item: Activity }) => {
    const iconConfig = getActivityIcon(item.type);
    const activityStyles = getActivityStyles(item.type);

    return (
      <View style={[styles.activityCard, activityStyles]}>
        <View style={styles.activityHeader}>
          <View style={styles.activityIconContainer}>
            <Icon name={iconConfig.name} size={24} color={iconConfig.color} />
          </View>
          <View style={styles.activityInfo}>
            <Text style={styles.activityType}>{item.type}</Text>
            <Text style={styles.activityTarget}>{item.target}</Text>
            <View style={styles.timestampContainer}>
              <Icon
                name="schedule"
                size={14}
                color={theme.colors.onSurfaceVariant}
              />
              <Text style={styles.timestamp}>
                {formatDate(item.timestamp)} at {formatTime(item.timestamp)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.detailsHeader}>Details</Text>

          {item.details.sharedCredential && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Credential:</Text>
              <Text style={styles.detailValue}>
                {item.details.sharedCredential}
              </Text>
            </View>
          )}

          {item.details.credentialType && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Type:</Text>
              <Text style={styles.detailValue}>
                {item.details.credentialType}
              </Text>
            </View>
          )}

          {item.details.requestedCredential && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Requested:</Text>
              <Text style={styles.detailValue}>
                {item.details.requestedCredential}
              </Text>
            </View>
          )}

          {item.details.sharedAttributes && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Shared Attributes:</Text>
              <View style={styles.attributesContainer}>
                {item.details.sharedAttributes.map((attr, i) => (
                  <AttributeBadge
                    key={i}
                    text={attr}
                    color={theme.colors.primaryLight}
                  />
                ))}
              </View>
            </View>
          )}

          {item.details.attributesVerified && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Verified Attributes:</Text>
              <View style={styles.attributesContainer}>
                {item.details.attributesVerified.map((attr, i) => (
                  <AttributeBadge
                    key={i}
                    text={attr}
                    color={theme.colors.success}
                  />
                ))}
              </View>
            </View>
          )}

          {item.details.attributes && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Attributes:</Text>
              <View style={styles.attributesContainer}>
                {item.details.attributes.map((attr, i) => (
                  <AttributeBadge
                    key={i}
                    text={attr}
                    color={theme.colors.accent}
                  />
                ))}
              </View>
            </View>
          )}

          {item.details.method && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Method:</Text>
              <Text style={styles.detailValue}>{item.details.method}</Text>
            </View>
          )}

          {item.details.verificationMethod && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Verification:</Text>
              <Text style={styles.detailValue}>
                {item.details.verificationMethod}
              </Text>
            </View>
          )}

          {item.details.reason && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Reason:</Text>
              <Text style={styles.detailValue}>{item.details.reason}</Text>
            </View>
          )}

          {item.details.message && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Message:</Text>
              <Text style={styles.detailValue}>{item.details.message}</Text>
            </View>
          )}

          {item.details.issuerContact && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Contact:</Text>
              <Text style={[styles.detailValue, styles.contactLink]}>
                {item.details.issuerContact}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon
        name="access-time"
        size={48}
        color={theme.colors.onSurfaceVariant}
      />
      <Text style={styles.emptyTitle}>No activities found</Text>
      <Text style={styles.emptySubtitle}>
        Try selecting a different filter to see more activities.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={theme.colors.background}
        barStyle="light-content"
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Recent Activity</Text>
          <Text style={styles.headerSubtitle}>
            Track your digital identity interactions
          </Text>
        </View>
        <View style={styles.secureIndicator}>
          <Icon name="security" size={20} color={theme.colors.success} />
          <Text style={styles.secureText}>Secure</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => setFilter(option.value)}
              style={[
                styles.filterTab,
                filter === option.value
                  ? styles.filterTabActive
                  : styles.filterTabInactive,
              ]}
            >
              <Text
                style={[
                  styles.filterTabText,
                  filter === option.value
                    ? styles.filterTabTextActive
                    : styles.filterTabTextInactive,
                ]}
              >
                {option.label} ({option.count})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Activity List */}
      <FlatList
        data={getFilteredActivities()}
        renderItem={renderActivityItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceVariant,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    ...theme.typography.h3,
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.onSurfaceVariant,
  },
  secureIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.success + "20",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  secureText: {
    fontSize: 12,
    color: theme.colors.success,
    fontWeight: "600",
    marginLeft: theme.spacing.xs,
  },
  filterContainer: {
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceVariant,
  },
  filterScroll: {
    paddingHorizontal: theme.spacing.lg,
  },
  filterTab: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    borderRadius: theme.borderRadius.xl,
    minWidth: 80,
    alignItems: "center",
  },
  filterTabActive: {
    backgroundColor: theme.colors.primary,
  },
  filterTabInactive: {
    backgroundColor: theme.colors.surfaceVariant,
    borderWidth: 1,
    borderColor: theme.colors.surfaceVariant,
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: "600",
  },
  filterTabTextActive: {
    color: theme.colors.onPrimary,
  },
  filterTabTextInactive: {
    color: theme.colors.onSurfaceVariant,
  },
  listContainer: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  activityCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 4,
  },
  activityHeader: {
    flexDirection: "row",
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  activityIconContainer: {
    marginRight: theme.spacing.md,
    marginTop: 2,
  },
  activityInfo: {
    flex: 1,
  },
  activityType: {
    ...theme.typography.h4,
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.xs,
  },
  activityTarget: {
    ...theme.typography.caption,
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.xs,
  },
  timestampContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timestamp: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginLeft: theme.spacing.xs,
  },
  detailsContainer: {
    backgroundColor: theme.colors.surfaceVariant,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
  },
  detailsHeader: {
    ...theme.typography.caption,
    fontWeight: "600",
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.sm,
  },
  detailRow: {
    marginBottom: theme.spacing.sm,
  },
  detailLabel: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 2,
  },
  detailValue: {
    ...theme.typography.caption,
    color: theme.colors.onSurface,
    fontWeight: "500",
  },
  contactLink: {
    color: theme.colors.secondary,
  },
  attributesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: theme.spacing.xs,
  },
  attributeBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
    borderWidth: 1,
  },
  attributeText: {
    fontSize: 10,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.xxl,
  },
  emptyTitle: {
    ...theme.typography.h4,
    color: theme.colors.onSurface,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    ...theme.typography.caption,
    color: theme.colors.onSurfaceVariant,
    textAlign: "center",
  },
});

export default ActivityScreen;
