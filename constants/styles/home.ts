import { StyleSheet, Dimensions } from "react-native";
import { theme } from "@/constants/theme/colors";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: 30,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
  greeting: {
    ...theme.typography.h2,
    color: theme.colors.onBackground,
    marginBottom: theme.spacing.md,
  },
  didContainer: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  didLabel: {
    ...theme.typography.caption,
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.xs,
  },
  didValue: {
    ...theme.typography.body,
    color: theme.colors.onSurface,
    fontFamily: "monospace",
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  quickActionButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    minWidth: 70,
  },
  quickActionText: {
    ...theme.typography.caption,
    color: theme.colors.onPrimary,
    marginTop: theme.spacing.xs,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.onBackground,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  credentialsList: {
    paddingLeft: theme.spacing.lg,
  },
  credentialCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginRight: theme.spacing.md,
    width: width * 0.7,
  },
  credentialHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  statusText: {
    ...theme.typography.caption,
    color: theme.colors.onPrimary,
    fontSize: 12,
  },
  credentialTitle: {
    ...theme.typography.h4,
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.xs,
  },
  credentialIssuer: {
    ...theme.typography.body,
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.xs,
  },
  credentialDate: {
    ...theme.typography.caption,
    color: theme.colors.onSurfaceVariant,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surfaceVariant,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityType: {
    ...theme.typography.body,
    color: theme.colors.onSurface,
    fontWeight: "600",
  },
  activityTarget: {
    ...theme.typography.caption,
    color: theme.colors.onSurfaceVariant,
    marginTop: theme.spacing.xs,
  },
  activityTime: {
    ...theme.typography.caption,
    color: theme.colors.onSurfaceVariant,
    marginTop: theme.spacing.xs,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  modalTitle: {
    ...theme.typography.h3,
    color: theme.colors.onSurface,
  },
  modalContent: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  // QR Scanner Modal Styles
  qrScannerContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  qrScannerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.lg,
    paddingTop: 60,
    backgroundColor: theme.colors.primary,
  },
  qrScannerTitle: {
    ...theme.typography.h3,
    color: theme.colors.onPrimary,
  },
  qrScannerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  scanningContainer: {
    alignItems: "center",
  },
  scanningFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  scanningText: {
    ...theme.typography.body,
    color: theme.colors.onSurface,
    marginTop: theme.spacing.md,
  },
  scanningInstruction: {
    ...theme.typography.caption,
    color: theme.colors.onSurfaceVariant,
    textAlign: "center",
  },
  scanResultContainer: {
    alignItems: "center",
    maxWidth: "90%",
  },
  scanResultTitle: {
    ...theme.typography.h3,
    color: theme.colors.onSurface,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  scanResultText: {
    ...theme.typography.body,
    color: theme.colors.onSurfaceVariant,
    textAlign: "center",
    marginBottom: theme.spacing.xl,
    fontFamily: "monospace",
  },
  processScanButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  processScanButtonText: {
    ...theme.typography.button,
    color: theme.colors.onPrimary,
  },
  scanAgainButton: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
  },
  scanAgainButtonText: {
    ...theme.typography.button,
    color: theme.colors.primary,
  },
  // Progress Styles (for Receive and Backup)
  progressContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  progressTitle: {
    ...theme.typography.h3,
    color: theme.colors.onSurface,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  progressBar: {
    width: "80%",
    height: 8,
    backgroundColor: theme.colors.outline,
    borderRadius: 4,
    marginBottom: theme.spacing.md,
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  progressText: {
    ...theme.typography.h4,
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.sm,
  },
  progressDescription: {
    ...theme.typography.caption,
    color: theme.colors.onSurfaceVariant,
    textAlign: "center",
  },
  // Receive Modal Styles
  receiveContent: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  receiveTitle: {
    ...theme.typography.h3,
    color: theme.colors.onSurface,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  receiveDescription: {
    ...theme.typography.body,
    color: theme.colors.onSurfaceVariant,
    textAlign: "center",
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  receiveButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
  },
  receiveButtonText: {
    ...theme.typography.button,
    color: theme.colors.onPrimary,
  },
  // Backup Modal Styles
  backupContent: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  backupTitle: {
    ...theme.typography.h3,
    color: theme.colors.onSurface,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  backupDescription: {
    ...theme.typography.body,
    color: theme.colors.onSurfaceVariant,
    textAlign: "center",
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  backupFeatures: {
    marginBottom: theme.spacing.xl,
    alignSelf: "stretch",
  },
  backupFeature: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  backupFeatureText: {
    ...theme.typography.body,
    color: theme.colors.onSurface,
    marginLeft: theme.spacing.md,
  },
  backupButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
  },
  backupButtonText: {
    ...theme.typography.button,
    color: theme.colors.onPrimary,
  },
  // Credential Modal Styles
  credentialInfo: {
    marginBottom: theme.spacing.lg,
  },
  modalCredentialTitle: {
    ...theme.typography.h3,
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.sm,
  },
  modalCredentialIssuer: {
    ...theme.typography.body,
    color: theme.colors.onSurfaceVariant,
  },
  attributesTitle: {
    ...theme.typography.h4,
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.lg,
  },
  attributeItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.surfaceVariant,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  attributeSelected: {
    backgroundColor: theme.colors.primaryContainer,
  },
  attributeInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  attributeName: {
    ...theme.typography.body,
    color: theme.colors.onSurfaceVariant,
    fontWeight: "600",
  },
  attributeNameSelected: {
    color: theme.colors.onPrimaryContainer,
  },
  attributeValue: {
    ...theme.typography.caption,
    color: theme.colors.onSurfaceVariant,
    marginTop: theme.spacing.xs,
  },
  attributeValueSelected: {
    color: theme.colors.onPrimaryContainer,
  },
  requiredIndicator: {
    color: theme.colors.error,
  },
  shareButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    marginTop: theme.spacing.lg,
  },
  shareButtonDisabled: {
    backgroundColor: theme.colors.outline,
  },
  shareButtonText: {
    ...theme.typography.button,
    color: theme.colors.onPrimary,
  },
  // Activity Modal Styles
  activityDetails: {
    marginBottom: theme.spacing.lg,
  },
  activityDetailType: {
    ...theme.typography.h3,
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.sm,
  },
  activityDetailTarget: {
    ...theme.typography.body,
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.sm,
  },
  activityDetailTime: {
    ...theme.typography.caption,
    color: theme.colors.onSurfaceVariant,
  },
  detailsContainer: {
    backgroundColor: theme.colors.surfaceVariant,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  detailsTitle: {
    ...theme.typography.h4,
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.md,
  },
  detailsContent: {
    gap: theme.spacing.sm,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  detailKey: {
    ...theme.typography.caption,
    color: theme.colors.onSurfaceVariant,
    fontWeight: "600",
    minWidth: 100,
  },
  detailValue: {
    ...theme.typography.caption,
    color: theme.colors.onSurfaceVariant,
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
});
