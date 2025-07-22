import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
  Dimensions,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { theme } from "@/constants/theme/colors";
import data from "./data.json";
import { styles } from "@/constants/styles/home";

interface Credential {
  id: string;
  type: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  status: "Valid" | "Revoked" | "Pending";
  attributes: Array<{
    name: string;
    value: string;
    required: boolean;
  }>;
}

interface Activity {
  id: string;
  type: string;
  target: string;
  timestamp: string;
  details: any;
}

interface UserData {
  did: string;
  credentials: Credential[];
  recentActivity: Activity[];
}

const userData: UserData = data as UserData;

const { width } = Dimensions.get("window");

const HomeScreen: React.FC = () => {
  const [credentialModalVisible, setCredentialModalVisible] = useState(false);
  const [activityModalVisible, setActivityModalVisible] = useState(false);
  const [qrScannerModalVisible, setQrScannerModalVisible] = useState(false);
  const [receiveModalVisible, setReceiveModalVisible] = useState(false);
  const [backupModalVisible, setBackupModalVisible] = useState(false);

  const [selectedCredential, setSelectedCredential] =
    useState<Credential | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);

  // Mock states
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string>("");
  const [isReceiving, setIsReceiving] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [receivingProgress, setReceivingProgress] = useState(0);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInHours = Math.floor(
      (now.getTime() - activityTime.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const getCredentialIcon = (type: string): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case "Bank Account Verification":
        return "card";
      case "COVID-19 Vaccination Certificate":
        return "medical";
      case "Residential Permit":
        return "home";
      case "Driver's License":
        return "car";
      case "University Degree Certificate":
        return "school";
      default:
        return "document-text";
    }
  };

  const getActivityIcon = (type: string): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case "Credential Shared":
        return "share";
      case "Verification Request":
        return "checkmark-circle";
      case "New Credential Received":
        return "add-circle";
      case "Backup Reminder":
        return "cloud-upload";
      case "Credential Revoked":
        return "close-circle";
      default:
        return "information-circle";
    }
  };

  const openCredentialModal = (credential: Credential) => {
    setSelectedCredential(credential);
    const requiredAttrs = credential.attributes
      .filter((attr) => attr.required)
      .map((attr) => attr.name);
    setSelectedAttributes(requiredAttrs);
    setCredentialModalVisible(true);
  };

  const openActivityModal = (activity: Activity) => {
    setSelectedActivity(activity);
    setActivityModalVisible(true);
  };

  const toggleAttribute = (attributeName: string) => {
    const attribute = selectedCredential?.attributes.find(
      (attr) => attr.name === attributeName
    );
    if (attribute?.required && selectedAttributes.includes(attributeName)) {
      return;
    }

    setSelectedAttributes((prev) =>
      prev.includes(attributeName)
        ? prev.filter((name) => name !== attributeName)
        : [...prev, attributeName]
    );
  };

  const shareCredential = () => {
    const selectedData = selectedCredential?.attributes
      .filter((attr) => selectedAttributes.includes(attr.name))
      .map((attr) => ({ [attr.name]: attr.value }));

    console.log("Sharing Credential:", {
      credentialType: selectedCredential?.type,
      selectedAttributes: selectedData,
    });

    Alert.alert(
      "Credential Shared",
      `Successfully shared ${selectedAttributes.length} attributes`
    );
    setCredentialModalVisible(false);
  };

  // Mock QR Scanner
  const scanQR = () => {
    setQrScannerModalVisible(true);
    setIsScanning(true);
    setScanResult("");

    // Simulate scanning delay
    setTimeout(() => {
      setIsScanning(false);
      const mockResults = [
        "did:example:123456789abcdefghi",
        "vc://request/bank-verification",
        "https://issuer.example.com/credential/abc123",
        "Invalid QR Code",
        "vc://share/university-degree",
      ];
      const randomResult =
        mockResults[Math.floor(Math.random() * mockResults.length)];
      setScanResult(randomResult);
    }, 2000);
  };

  const processScanResult = () => {
    if (scanResult.startsWith("did:")) {
      Alert.alert(
        "DID Detected",
        `Found DID: ${scanResult.substring(0, 30)}...`
      );
    } else if (scanResult.startsWith("vc://request")) {
      Alert.alert(
        "Verification Request",
        "A verifier is requesting your credentials"
      );
    } else if (scanResult.startsWith("vc://share")) {
      Alert.alert(
        "Credential Offer",
        "Someone wants to share a credential with you"
      );
    } else if (scanResult.startsWith("https://")) {
      Alert.alert("Credential Link", "Found a credential issuance link");
    } else {
      Alert.alert("Scan Error", "Unable to process this QR code");
    }
    setQrScannerModalVisible(false);
  };

  // Mock Share DID
  const shareMyDID = async () => {
    await Clipboard.setStringAsync(userData.did);

    // Show share options
    Alert.alert(
      "Share Your DID",
      "Your DID has been copied to clipboard. How would you like to share it?",
      [
        { text: "QR Code", onPress: () => showQRCode() },
        { text: "Text Message", onPress: () => shareViaText() },
        { text: "Email", onPress: () => shareViaEmail() },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const showQRCode = () => {
    Alert.alert("QR Code", "QR code displayed for your DID");
  };

  const shareViaText = () => {
    Alert.alert("Share via SMS", "Opening SMS app with your DID");
  };

  const shareViaEmail = () => {
    Alert.alert("Share via Email", "Opening email app with your DID");
  };

  // Mock Receive Credential
  const receiveCredential = () => {
    setReceiveModalVisible(true);
    setIsReceiving(true);
    setReceivingProgress(0);

    // Simulate receiving progress
    const interval = setInterval(() => {
      setReceivingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsReceiving(false);
          setTimeout(() => {
            Alert.alert(
              "Credential Received!",
              "New Professional Certificate from TechCorp has been added to your wallet",
              [{ text: "OK", onPress: () => setReceiveModalVisible(false) }]
            );
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  // Mock Backup DID
  const backupDID = () => {
    setBackupModalVisible(true);
    setIsBackingUp(true);
    setBackupProgress(0);

    // Simulate backup progress
    const interval = setInterval(() => {
      setBackupProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBackingUp(false);
          setTimeout(() => {
            Alert.alert(
              "Backup Complete",
              "Your DID and credentials have been securely backed up to encrypted cloud storage",
              [{ text: "OK", onPress: () => setBackupModalVisible(false) }]
            );
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  // Render Functions
  const renderCredentialCard = ({ item }: { item: Credential }) => (
    <TouchableOpacity
      style={styles.credentialCard}
      onPress={() => openCredentialModal(item)}
    >
      <View style={styles.credentialHeader}>
        <Ionicons
          name={getCredentialIcon(item.type)}
          size={24}
          color={theme.colors.primaryLight}
        />
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                item.status === "Valid"
                  ? theme.colors.success
                  : theme.colors.error,
            },
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.credentialTitle}>{item.type}</Text>
      <Text style={styles.credentialIssuer}>{item.issuer}</Text>
      <Text style={styles.credentialDate}>
        Expires: {formatDate(item.expiryDate)}
      </Text>
    </TouchableOpacity>
  );

  const renderActivityItem = ({ item }: { item: Activity }) => (
    <TouchableOpacity
      style={styles.activityItem}
      onPress={() => openActivityModal(item)}
    >
      <View style={styles.activityIcon}>
        <Ionicons
          name={getActivityIcon(item.type)}
          size={20}
          color={theme.colors.primaryLight}
        />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityType}>{item.type}</Text>
        <Text style={styles.activityTarget}>{item.target}</Text>
        <Text style={styles.activityTime}>{getTimeAgo(item.timestamp)}</Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={16}
        color={theme.colors.onSurfaceVariant}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.background}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome back, Tanya</Text>
          <View style={styles.didContainer}>
            <Text style={styles.didLabel}>Your DID:</Text>
            <Text style={styles.didValue}>{userData.did}</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionButton} onPress={scanQR}>
            <Ionicons name="qr-code" size={24} color={theme.colors.onPrimary} />
            <Text style={styles.quickActionText}>Scan QR</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={shareMyDID}
          >
            <Ionicons
              name="share-outline"
              size={24}
              color={theme.colors.onPrimary}
            />
            <Text style={styles.quickActionText}>Share DID</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={receiveCredential}
          >
            <Ionicons
              name="download-outline"
              size={24}
              color={theme.colors.onPrimary}
            />
            <Text style={styles.quickActionText}>Receive</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={backupDID}
          >
            <Ionicons
              name="cloud-upload-outline"
              size={24}
              color={theme.colors.onPrimary}
            />
            <Text style={styles.quickActionText}>Backup</Text>
          </TouchableOpacity>
        </View>

        {/* Credentials Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Credentials</Text>
          <FlatList
            data={userData.credentials}
            renderItem={renderCredentialCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.credentialsList}
          />
        </View>

        {/* Recent Activity Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {userData.recentActivity.slice(0, 6).map((item) => (
            <View key={item.id}>{renderActivityItem({ item })}</View>
          ))}
        </View>
      </ScrollView>

      {/* QR Scanner Modal */}
      <Modal
        visible={qrScannerModalVisible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setQrScannerModalVisible(false)}
      >
        <View style={styles.qrScannerContainer}>
          <View style={styles.qrScannerHeader}>
            <TouchableOpacity onPress={() => setQrScannerModalVisible(false)}>
              <Ionicons name="close" size={28} color={theme.colors.onPrimary} />
            </TouchableOpacity>
            <Text style={styles.qrScannerTitle}>Scan QR Code</Text>
            <View style={{ width: 28 }} />
          </View>

          <View style={styles.qrScannerContent}>
            {isScanning ? (
              <View style={styles.scanningContainer}>
                <View style={styles.scanningFrame}>
                  <ActivityIndicator
                    size="large"
                    color={theme.colors.primary}
                  />
                  <Text style={styles.scanningText}>Scanning...</Text>
                </View>
                <Text style={styles.scanningInstruction}>
                  Point your camera at a QR code
                </Text>
              </View>
            ) : scanResult ? (
              <View style={styles.scanResultContainer}>
                <Ionicons
                  name="checkmark-circle"
                  size={64}
                  color={theme.colors.success}
                />
                <Text style={styles.scanResultTitle}>QR Code Detected</Text>
                <Text style={styles.scanResultText}>{scanResult}</Text>
                <TouchableOpacity
                  style={styles.processScanButton}
                  onPress={processScanResult}
                >
                  <Text style={styles.processScanButtonText}>
                    Process Result
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.scanAgainButton}
                  onPress={scanQR}
                >
                  <Text style={styles.scanAgainButtonText}>Scan Again</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </View>
      </Modal>

      {/* Receive Credential Modal */}
      <Modal
        visible={receiveModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setReceiveModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setReceiveModalVisible(false)}>
              <Ionicons name="close" size={24} color={theme.colors.onSurface} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Receive Credential</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.modalContent}>
            {isReceiving ? (
              <View style={styles.progressContainer}>
                <Ionicons
                  name="download"
                  size={64}
                  color={theme.colors.primary}
                />
                <Text style={styles.progressTitle}>Receiving Credential</Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${receivingProgress}%` },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>{receivingProgress}%</Text>
                <Text style={styles.progressDescription}>
                  Verifying credential authenticity...
                </Text>
              </View>
            ) : (
              <View style={styles.receiveContent}>
                <Ionicons
                  name="qr-code-outline"
                  size={100}
                  color={theme.colors.primary}
                />
                <Text style={styles.receiveTitle}>Ready to Receive</Text>
                <Text style={styles.receiveDescription}>
                  Present this screen to the credential issuer or scan their QR
                  code
                </Text>
                <TouchableOpacity
                  style={styles.receiveButton}
                  onPress={receiveCredential}
                >
                  <Text style={styles.receiveButtonText}>Start Receiving</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Backup Modal */}
      <Modal
        visible={backupModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setBackupModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setBackupModalVisible(false)}>
              <Ionicons name="close" size={24} color={theme.colors.onSurface} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Backup DID</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.modalContent}>
            {isBackingUp ? (
              <View style={styles.progressContainer}>
                <Ionicons
                  name="cloud-upload"
                  size={64}
                  color={theme.colors.primary}
                />
                <Text style={styles.progressTitle}>Backing Up</Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${backupProgress}%` },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>{backupProgress}%</Text>
                <Text style={styles.progressDescription}>
                  Encrypting and uploading your DID securely...
                </Text>
              </View>
            ) : (
              <View style={styles.backupContent}>
                <Ionicons
                  name="shield-checkmark"
                  size={100}
                  color={theme.colors.success}
                />
                <Text style={styles.backupTitle}>Secure Backup</Text>
                <Text style={styles.backupDescription}>
                  Your DID and credentials will be encrypted and backed up to
                  secure cloud storage. This ensures you can recover your
                  identity even if you lose this device.
                </Text>
                <View style={styles.backupFeatures}>
                  <View style={styles.backupFeature}>
                    <Ionicons
                      name="lock-closed"
                      size={20}
                      color={theme.colors.primary}
                    />
                    <Text style={styles.backupFeatureText}>
                      End-to-end encrypted
                    </Text>
                  </View>
                  <View style={styles.backupFeature}>
                    <Ionicons
                      name="cloud"
                      size={20}
                      color={theme.colors.primary}
                    />
                    <Text style={styles.backupFeatureText}>
                      Secure cloud storage
                    </Text>
                  </View>
                  <View style={styles.backupFeature}>
                    <Ionicons
                      name="sync"
                      size={20}
                      color={theme.colors.primary}
                    />
                    <Text style={styles.backupFeatureText}>
                      Auto-sync enabled
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.backupButton}
                  onPress={backupDID}
                >
                  <Text style={styles.backupButtonText}>Start Backup</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Credential Modal */}
      <Modal
        visible={credentialModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setCredentialModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setCredentialModalVisible(false)}>
              <Ionicons name="close" size={24} color={theme.colors.onSurface} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Share Credential</Text>
            <View style={{ width: 24 }} />
          </View>

          {selectedCredential && (
            <ScrollView style={styles.modalContent}>
              <View style={styles.credentialInfo}>
                <Text style={styles.modalCredentialTitle}>
                  {selectedCredential.type}
                </Text>
                <Text style={styles.modalCredentialIssuer}>
                  {selectedCredential.issuer}
                </Text>
              </View>

              <Text style={styles.attributesTitle}>
                Select attributes to share:
              </Text>

              {selectedCredential.attributes.map((attribute) => (
                <TouchableOpacity
                  key={attribute.name}
                  style={[
                    styles.attributeItem,
                    selectedAttributes.includes(attribute.name) &&
                      styles.attributeSelected,
                  ]}
                  onPress={() => toggleAttribute(attribute.name)}
                  disabled={
                    attribute.required &&
                    selectedAttributes.includes(attribute.name)
                  }
                >
                  <View style={styles.attributeInfo}>
                    <Text
                      style={[
                        styles.attributeName,
                        selectedAttributes.includes(attribute.name) &&
                          styles.attributeNameSelected,
                      ]}
                    >
                      {attribute.name}
                      {attribute.required && (
                        <Text style={styles.requiredIndicator}> *</Text>
                      )}
                    </Text>
                    <Text
                      style={[
                        styles.attributeValue,
                        selectedAttributes.includes(attribute.name) &&
                          styles.attributeValueSelected,
                      ]}
                    >
                      {attribute.value}
                    </Text>
                  </View>
                  <Ionicons
                    name={
                      selectedAttributes.includes(attribute.name)
                        ? "checkbox"
                        : "square-outline"
                    }
                    size={24}
                    color={
                      selectedAttributes.includes(attribute.name)
                        ? theme.colors.primary
                        : theme.colors.onSurfaceVariant
                    }
                  />
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={[
                  styles.shareButton,
                  selectedAttributes.length === 0 && styles.shareButtonDisabled,
                ]}
                onPress={shareCredential}
                disabled={selectedAttributes.length === 0}
              >
                <Text style={styles.shareButtonText}>
                  Share Selected Attributes
                </Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      </Modal>

      {/* Activity Modal */}
      <Modal
        visible={activityModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setActivityModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setActivityModalVisible(false)}>
              <Ionicons name="close" size={24} color={theme.colors.onSurface} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Activity Details</Text>
            <View style={{ width: 24 }} />
          </View>

          {selectedActivity && (
            <ScrollView style={styles.modalContent}>
              <View style={styles.activityDetails}>
                <Text style={styles.activityDetailType}>
                  {selectedActivity.type}
                </Text>
                <Text style={styles.activityDetailTarget}>
                  {selectedActivity.target}
                </Text>
                <Text style={styles.activityDetailTime}>
                  {formatDate(selectedActivity.timestamp)} at{" "}
                  {new Date(selectedActivity.timestamp).toLocaleTimeString()}
                </Text>
              </View>

              <View style={styles.detailsContainer}>
                <Text style={styles.detailsTitle}>Details:</Text>
                <View style={styles.detailsContent}>
                  {Object.entries(selectedActivity.details).map(
                    ([key, value]) => (
                      <View key={key} style={styles.detailItem}>
                        <Text style={styles.detailKey}>{key}:</Text>
                        <Text style={styles.detailValue}>
                          {Array.isArray(value)
                            ? value.join(", ")
                            : String(value)}
                        </Text>
                      </View>
                    )
                  )}
                </View>
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default HomeScreen;
