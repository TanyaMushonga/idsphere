import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Animated,
  StatusBar,
  Dimensions,
  Platform,
  Modal,
  TextInput,
  Alert,
  Switch,
  SafeAreaView,
  KeyboardAvoidingView,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "@/constants/theme/colors";

const { width, height } = Dimensions.get("window");

const dummyCredentials = [
  {
    id: "1",
    type: "National ID",
    issuer: "NADRA",
    issuerLogo: "🏛️",
    status: "Verified",
    statusColor: theme.colors.success,
    borderColor: theme.colors.success,
    expires: "Jan 15, 2030",
    lastVerified: null,
    details: {
      fullName: "John Doe",
      idNumber: "12345-6789012-3",
      dateOfBirth: "15/01/1990",
      address: "123 Main Street, Islamabad",
      issueDate: "15/01/2020",
    },
  },
  {
    id: "2",
    type: "University Credential",
    issuer: "NUST University",
    issuerLogo: "🎓",
    status: "NUST Student - Enrolled",
    statusColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    program: "Computer Science",
    lastVerified: null,
    details: {
      studentName: "John Doe",
      studentId: "2020-CS-123",
      program: "Bachelor of Computer Science",
      enrollmentYear: "2020",
      currentSemester: "8th",
      cgpa: "3.85",
    },
  },
  {
    id: "3",
    type: "Utility Bill",
    issuer: "IESCO",
    issuerLogo: "⚡",
    status: "Proof of Address - Islamabad",
    statusColor: theme.colors.warning,
    borderColor: theme.colors.warning,
    lastVerified: "May 3, 2023",
    details: {
      accountHolder: "John Doe",
      accountNumber: "123456789",
      address: "123 Main Street, Islamabad",
      billMonth: "December 2024",
      amount: "PKR 5,250",
    },
  },
];

const dummyActivity = [
  {
    id: "1",
    action: "Shared University Credential",
    time: "Today, 10:23 AM",
    icon: "share",
    color: theme.colors.primary,
  },
  {
    id: "2",
    action: "National ID Verified",
    time: "Yesterday, 3:45 PM",
    icon: "shield-checkmark",
    color: theme.colors.success,
  },
];

const institutionTypes = [
  {
    id: "gov",
    name: "Government Agencies",
    icon: "🏛️",
    description: "NADRA, Passport Office, Tax Authorities",
    requiredDocs: ["National ID", "Birth Certificate", "Proof of Address"],
  },
  {
    id: "edu",
    name: "Educational Institutions",
    icon: "🎓",
    description: "Universities, Colleges, Schools",
    requiredDocs: ["Academic Transcripts", "Certificates", "Student ID"],
  },
  {
    id: "bank",
    name: "Financial Institutions",
    icon: "🏦",
    description: "Banks, Insurance Companies",
    requiredDocs: ["Bank Statements", "Salary Certificate", "Tax Returns"],
  },
  {
    id: "health",
    name: "Healthcare Providers",
    icon: "🏥",
    description: "Hospitals, Clinics, Health Insurance",
    requiredDocs: [
      "Medical Records",
      "Insurance Card",
      "Vaccination Certificate",
    ],
  },
];

export default function HomeScreen() {
  const [loading, setLoading] = useState(false);
  const [presentationModal, setPresentationModal] = useState(false);
  const [addCredentialModal, setAddCredentialModal] = useState(false);
  const [verificationModal, setVerificationModal] = useState(false);
  const [shareModal, setShareModal] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState(null);
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [fabExpanded, setFabExpanded] = useState(false);

  // Form states
  const [newCredential, setNewCredential] = useState({
    type: "",
    issuer: "",
    details: "",
  });

  const [verificationRequest, setVerificationRequest] = useState({
    institutionType: "",
    message: "",
    documents: [],
  });

  // Sharing toggles
  const [shareToggles, setShareToggles] = useState({});

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const fabAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const toggleFab = () => {
    setFabExpanded(!fabExpanded);
    Animated.timing(fabAnim, {
      toValue: fabExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const refresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const openPresentationModal = (credential) => {
    setSelectedCredential(credential);
    // Initialize share toggles
    const toggles = {};
    Object.keys(credential.details).forEach((key) => {
      toggles[key] = true;
    });
    setShareToggles(toggles);
    setPresentationModal(true);
  };

  const openShareModal = () => {
    setShareModal(true);
    setFabExpanded(false);
    Animated.timing(fabAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const openScanModal = () => {
    router.push("/credential/scan");
    setFabExpanded(false);
    Animated.timing(fabAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleAddCredential = () => {
    if (!newCredential.type || !newCredential.issuer) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    Alert.alert("Success", "Credential added successfully!");
    setAddCredentialModal(false);
    setNewCredential({ type: "", issuer: "", details: "" });
  };

  const handleVerificationRequest = () => {
    if (!verificationRequest.institutionType || !verificationRequest.message) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    Alert.alert("Success", "Verification request submitted successfully!");
    setVerificationModal(false);
    setSelectedInstitution(null);
    setVerificationRequest({ institutionType: "", message: "", documents: [] });
  };

  const shareCredential = () => {
    const sharedData = {};
    Object.keys(shareToggles).forEach((key) => {
      if (shareToggles[key]) {
        sharedData[key] = selectedCredential.details[key];
      }
    });

    Alert.alert(
      "Shared Successfully",
      `Credential shared with selected information`
    );
    setShareModal(false);
  };

  const CredentialCard = ({
    credential,
    index,
  }: {
    credential: any;
    index: number;
  }) => (
    <Animated.View
      style={[
        styles.credentialCard,
        { borderColor: credential.borderColor },
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 30],
                outputRange: [0, 30 + index * 10],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => openPresentationModal(credential)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[theme.colors.surface, theme.colors.surfaceVariant + "50"]}
          style={styles.cardGradient}
        >
          <View style={styles.cardContent}>
            {/* Header */}
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleRow}>
                <View style={styles.credentialIcon}>
                  <Text style={styles.iconEmoji}>{credential.issuerLogo}</Text>
                </View>
                <View style={styles.titleContainer}>
                  <Text style={styles.credentialType}>{credential.type}</Text>
                  <View style={styles.statusRow}>
                    <Ionicons
                      name="checkmark-circle"
                      size={14}
                      color={credential.statusColor}
                    />
                    <Text
                      style={[
                        styles.credentialStatus,
                        { color: credential.statusColor },
                      ]}
                    >
                      {credential.status}
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={styles.moreButton}
                onPress={() => openPresentationModal(credential)}
              >
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.colors.onSurfaceVariant}
                />
              </TouchableOpacity>
            </View>

            {/* Body */}
            <View style={styles.cardBody}>
              <View style={styles.issuerRow}>
                <Text style={styles.issuerLabel}>Issued by</Text>
                {credential.program && (
                  <Text style={styles.programLabel}>Program</Text>
                )}
              </View>
              <View style={styles.issuerValueRow}>
                <View style={styles.issuerContainer}>
                  <Text style={styles.issuerName}>{credential.issuer}</Text>
                  <Text style={styles.issuerEmoji}>
                    {credential.issuerLogo}
                  </Text>
                </View>
                {credential.program && (
                  <Text style={styles.programValue}>{credential.program}</Text>
                )}
              </View>
            </View>

            {/* Footer */}
            {(credential.expires || credential.lastVerified) && (
              <View style={styles.cardFooter}>
                {credential.expires && (
                  <Text style={styles.footerText}>
                    Expires: {credential.expires}
                  </Text>
                )}
                {credential.lastVerified && (
                  <Text style={styles.footerText}>
                    Last verified: {credential.lastVerified}
                  </Text>
                )}
              </View>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const ActivityItem = ({
    activity,
    index,
  }: {
    activity: any;
    index: number;
  }) => (
    <Animated.View
      style={[
        styles.activityItem,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 30],
                outputRange: [0, 20 + index * 5],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity activeOpacity={0.7}>
        <LinearGradient
          colors={[theme.colors.surface, theme.colors.surfaceVariant + "30"]}
          style={styles.activityGradient}
        >
          <View style={styles.activityContent}>
            <View
              style={[
                styles.activityIcon,
                { backgroundColor: activity.color + "20" },
              ]}
            >
              <Ionicons name={activity.icon} size={16} color={activity.color} />
            </View>
            <View style={styles.activityText}>
              <Text style={styles.activityAction}>{activity.action}</Text>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const FloatingActionButtons = () => (
    <View style={styles.fabContainer}>
      {/* Secondary FABs */}
      <Animated.View
        style={[
          styles.secondaryFab,
          {
            transform: [
              {
                translateY: fabAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -120],
                }),
              },
              {
                scale: fabAnim,
              },
            ],
            opacity: fabAnim,
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.fab, styles.secondaryFabButton]}
          onPress={() => setVerificationModal(true)}
          activeOpacity={0.8}
        >
          <Ionicons
            name="shield-checkmark"
            size={24}
            color={theme.colors.onPrimary}
          />
        </TouchableOpacity>
        <Text style={styles.fabLabel}>Verify</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.secondaryFab,
          {
            transform: [
              {
                translateY: fabAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -80],
                }),
              },
              {
                scale: fabAnim,
              },
            ],
            opacity: fabAnim,
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.fab, styles.secondaryFabButton]}
          onPress={() => setAddCredentialModal(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={24} color={theme.colors.onPrimary} />
        </TouchableOpacity>
        <Text style={styles.fabLabel}>Add</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.secondaryFab,
          {
            transform: [
              {
                translateY: fabAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -160],
                }),
              },
              {
                scale: fabAnim,
              },
            ],
            opacity: fabAnim,
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.fab, styles.secondaryFabButton]}
          onPress={openShareModal}
          activeOpacity={0.8}
        >
          <Ionicons name="share" size={24} color={theme.colors.onPrimary} />
        </TouchableOpacity>
        <Text style={styles.fabLabel}>Share</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.secondaryFab,
          {
            transform: [
              {
                translateY: fabAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -200],
                }),
              },
              {
                scale: fabAnim,
              },
            ],
            opacity: fabAnim,
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.fab, styles.secondaryFabButton]}
          onPress={openScanModal}
          activeOpacity={0.8}
        >
          <Ionicons name="scan" size={24} color={theme.colors.onPrimary} />
        </TouchableOpacity>
        <Text style={styles.fabLabel}>Scan</Text>
      </Animated.View>

      {/* Main FAB */}
      <TouchableOpacity
        style={[styles.fab, styles.mainFab]}
        onPress={toggleFab}
        activeOpacity={0.8}
      >
        <Animated.View
          style={{
            transform: [
              {
                rotate: fabAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", "45deg"],
                }),
              },
            ],
          }}
        >
          <Ionicons name="add" size={28} color={theme.colors.onPrimary} />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.surface + "30"]}
      style={styles.container}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.background}
      />

      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.primaryDark]}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <Text style={styles.title}>My Identity</Text>
            <TouchableOpacity style={styles.profileButton}>
              <Ionicons
                name="person"
                size={24}
                color={theme.colors.onPrimary}
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refresh}
            tintColor={theme.colors.primary}
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* Credentials Section */}
        <View style={styles.credentialsSection}>
          {dummyCredentials.map((credential, index) => (
            <CredentialCard
              key={credential.id}
              credential={credential}
              index={index}
            />
          ))}
        </View>

        {/* Recent Activity Section */}
        <Animated.View
          style={[
            styles.activitySection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {dummyActivity.map((activity, index) => (
            <ActivityItem key={activity.id} activity={activity} index={index} />
          ))}
        </Animated.View>
      </ScrollView>

      {/* Floating Action Buttons */}
      <FloatingActionButtons />

      {/* Credential Presentation Modal */}
      <Modal
        visible={presentationModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setPresentationModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <LinearGradient
            colors={[theme.colors.background, theme.colors.surface]}
            style={styles.modalGradient}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Credential Details</Text>
              <TouchableOpacity
                onPress={() => setPresentationModal(false)}
                style={styles.closeButton}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={theme.colors.onSurface}
                />
              </TouchableOpacity>
            </View>

            {selectedCredential && (
              <ScrollView style={styles.modalContent}>
                <View style={styles.credentialDetail}>
                  <View style={styles.detailHeader}>
                    <Text style={styles.detailIcon}>
                      {selectedCredential.issuerLogo}
                    </Text>
                    <View>
                      <Text style={styles.detailTitle}>
                        {selectedCredential.type}
                      </Text>
                      <Text style={styles.detailIssuer}>
                        Issued by {selectedCredential.issuer}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailsGrid}>
                    {Object.entries(selectedCredential.details).map(
                      ([key, value]) => (
                        <View key={key} style={styles.detailRow}>
                          <Text style={styles.detailLabel}>
                            {key
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (str) => str.toUpperCase())}
                          </Text>
                          <Text style={styles.detailValue}>{value}</Text>
                        </View>
                      )
                    )}
                  </View>

                  <View style={styles.modalActions}>
                    <TouchableOpacity
                      style={styles.shareButton}
                      onPress={() => {
                        setPresentationModal(false);
                        setTimeout(() => setShareModal(true), 300);
                      }}
                    >
                      <LinearGradient
                        colors={[
                          theme.colors.primary,
                          theme.colors.primaryDark,
                        ]}
                        style={styles.actionButtonGradient}
                      >
                        <Ionicons
                          name="share"
                          size={20}
                          color={theme.colors.onPrimary}
                        />
                        <Text style={styles.actionButtonText}>Share</Text>
                      </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.verifyButton}>
                      <LinearGradient
                        colors={[
                          theme.colors.success + "20",
                          theme.colors.success + "10",
                        ]}
                        style={styles.actionButtonGradient}
                      >
                        <Ionicons
                          name="shield-checkmark"
                          size={20}
                          color={theme.colors.success}
                        />
                        <Text
                          style={[
                            styles.actionButtonText,
                            { color: theme.colors.success },
                          ]}
                        >
                          Re-verify
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            )}
          </LinearGradient>
        </SafeAreaView>
      </Modal>

      {/* Share Modal */}
      <Modal
        visible={shareModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShareModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <LinearGradient
            colors={[theme.colors.background, theme.colors.surface]}
            style={styles.modalGradient}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Share Credential</Text>
              <TouchableOpacity
                onPress={() => setShareModal(false)}
                style={styles.closeButton}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={theme.colors.onSurface}
                />
              </TouchableOpacity>
            </View>

            {selectedCredential && (
              <ScrollView style={styles.modalContent}>
                <Text style={styles.shareDescription}>
                  Select which information you want to share from your{" "}
                  {selectedCredential.type}
                </Text>

                <View style={styles.shareToggles}>
                  {Object.entries(selectedCredential.details).map(
                    ([key, value]) => (
                      <View key={key} style={styles.toggleRow}>
                        <View style={styles.toggleInfo}>
                          <Text style={styles.toggleLabel}>
                            {key
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (str) => str.toUpperCase())}
                          </Text>
                          <Text style={styles.toggleValue}>{value}</Text>
                        </View>
                        <Switch
                          value={shareToggles[key]}
                          onValueChange={(val) =>
                            setShareToggles({ ...shareToggles, [key]: val })
                          }
                          trackColor={{
                            false: theme.colors.surfaceVariant,
                            true: theme.colors.primary,
                          }}
                          thumbColor={
                            shareToggles[key]
                              ? theme.colors.onPrimary
                              : theme.colors.onSurfaceVariant
                          }
                        />
                      </View>
                    )
                  )}
                </View>

                <TouchableOpacity
                  style={styles.shareConfirmButton}
                  onPress={shareCredential}
                >
                  <LinearGradient
                    colors={[theme.colors.primary, theme.colors.primaryDark]}
                    style={styles.actionButtonGradient}
                  >
                    <Ionicons
                      name="share"
                      size={20}
                      color={theme.colors.onPrimary}
                    />
                    <Text style={styles.actionButtonText}>
                      Share Selected Information
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </ScrollView>
            )}
          </LinearGradient>
        </SafeAreaView>
      </Modal>

      {/* Add Credential Modal */}
      <Modal
        visible={addCredentialModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setAddCredentialModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContainer}
          >
            <LinearGradient
              colors={[theme.colors.background, theme.colors.surface]}
              style={styles.modalGradient}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add New Credential</Text>
                <TouchableOpacity
                  onPress={() => setAddCredentialModal(false)}
                  style={styles.closeButton}
                >
                  <Ionicons
                    name="close"
                    size={24}
                    color={theme.colors.onSurface}
                  />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalContent}>
                <View style={styles.formContainer}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Credential Type *</Text>
                    <TextInput
                      style={styles.textInput}
                      value={newCredential.type}
                      onChangeText={(text) =>
                        setNewCredential({ ...newCredential, type: text })
                      }
                      placeholder="e.g., Driver's License, Passport"
                      placeholderTextColor={theme.colors.onSurfaceVariant}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>
                      Issuing Organization *
                    </Text>
                    <TextInput
                      style={styles.textInput}
                      value={newCredential.issuer}
                      onChangeText={(text) =>
                        setNewCredential({ ...newCredential, issuer: text })
                      }
                      placeholder="e.g., Government of Pakistan"
                      placeholderTextColor={theme.colors.onSurfaceVariant}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Additional Details</Text>
                    <TextInput
                      style={[styles.textInput, styles.textArea]}
                      value={newCredential.details}
                      onChangeText={(text) =>
                        setNewCredential({ ...newCredential, details: text })
                      }
                      placeholder="Enter any additional information..."
                      placeholderTextColor={theme.colors.onSurfaceVariant}
                      multiline
                      numberOfLines={4}
                    />
                  </View>

                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleAddCredential}
                  >
                    <LinearGradient
                      colors={[theme.colors.primary, theme.colors.primaryDark]}
                      style={styles.actionButtonGradient}
                    >
                      <Ionicons
                        name="add-circle"
                        size={20}
                        color={theme.colors.onPrimary}
                      />
                      <Text style={styles.actionButtonText}>
                        Add Credential
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </LinearGradient>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>

      {/* Verification Request Modal */}
      <Modal
        visible={verificationModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setVerificationModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContainer}
          >
            <LinearGradient
              colors={[theme.colors.background, theme.colors.surface]}
              style={styles.modalGradient}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Request Verification</Text>
                <TouchableOpacity
                  onPress={() => setVerificationModal(false)}
                  style={styles.closeButton}
                >
                  <Ionicons
                    name="close"
                    size={24}
                    color={theme.colors.onSurface}
                  />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalContent}>
                <Text style={styles.verificationDescription}>
                  Select an institution type to request identity verification
                </Text>

                <View style={styles.institutionGrid}>
                  {institutionTypes.map((institution) => (
                    <TouchableOpacity
                      key={institution.id}
                      style={[
                        styles.institutionCard,
                        selectedInstitution?.id === institution.id &&
                          styles.institutionCardSelected,
                      ]}
                      onPress={() => {
                        setSelectedInstitution(institution);
                        setVerificationRequest({
                          ...verificationRequest,
                          institutionType: institution.name,
                        });
                      }}
                    >
                      <Text style={styles.institutionIcon}>
                        {institution.icon}
                      </Text>
                      <Text style={styles.institutionName}>
                        {institution.name}
                      </Text>
                      <Text style={styles.institutionDescription}>
                        {institution.description}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {selectedInstitution && (
                  <View style={styles.verificationForm}>
                    <View style={styles.requiredDocsSection}>
                      <Text style={styles.requiredDocsTitle}>
                        Required Documents:
                      </Text>
                      {selectedInstitution.requiredDocs.map((doc, index) => (
                        <Text key={index} style={styles.requiredDoc}>
                          • {doc}
                        </Text>
                      ))}
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>
                        Verification Message *
                      </Text>
                      <TextInput
                        style={[styles.textInput, styles.textArea]}
                        value={verificationRequest.message}
                        onChangeText={(text) =>
                          setVerificationRequest({
                            ...verificationRequest,
                            message: text,
                          })
                        }
                        placeholder="Please describe what you need verified and why..."
                        placeholderTextColor={theme.colors.onSurfaceVariant}
                        multiline
                        numberOfLines={4}
                      />
                    </View>

                    <TouchableOpacity
                      style={styles.submitButton}
                      onPress={handleVerificationRequest}
                    >
                      <LinearGradient
                        colors={[
                          theme.colors.success,
                          theme.colors.success + "DD",
                        ]}
                        style={styles.actionButtonGradient}
                      >
                        <Ionicons
                          name="shield-checkmark"
                          size={20}
                          color={theme.colors.onPrimary}
                        />
                        <Text style={styles.actionButtonText}>
                          Submit Request
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                )}
              </ScrollView>
            </LinearGradient>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerGradient: {
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.onPrimary,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.onPrimary + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  credentialsSection: {
    gap: 16,
    marginBottom: 32,
  },
  credentialCard: {
    borderRadius: 16,
    borderWidth: 2,
    overflow: "hidden",
  },
  cardGradient: {
    borderRadius: 14,
  },
  cardContent: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  cardTitleRow: {
    flexDirection: "row",
    flex: 1,
    gap: 12,
  },
  credentialIcon: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  iconEmoji: {
    fontSize: 20,
  },
  titleContainer: {
    flex: 1,
  },
  credentialType: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  credentialStatus: {
    fontSize: 14,
    fontWeight: "500",
  },
  moreButton: {
    padding: 4,
  },
  cardBody: {
    marginBottom: 16,
  },
  issuerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  issuerLabel: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  programLabel: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  issuerValueRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  issuerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  issuerName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.onSurface,
  },
  issuerEmoji: {
    fontSize: 16,
  },
  programValue: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.onSurface,
  },
  cardFooter: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  footerText: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
  },
  activitySection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.onSurface,
    marginBottom: 16,
  },
  activityItem: {
    borderRadius: 12,
    marginBottom: 8,
    overflow: "hidden",
  },
  activityGradient: {
    borderRadius: 12,
  },
  activityContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  activityText: {
    flex: 1,
  },
  activityAction: {
    fontSize: 16,
    fontWeight: "500",
    color: theme.colors.onSurface,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
  },

  // Floating Action Button Styles
  fabContainer: {
    position: "absolute",
    bottom: 30,
    right: 20,
    alignItems: "center",
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  mainFab: {
    backgroundColor: theme.colors.primary,
  },
  secondaryFab: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  secondaryFabButton: {
    backgroundColor: theme.colors.secondary,
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  fabLabel: {
    backgroundColor: theme.colors.surface,
    color: theme.colors.onSurface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    fontSize: 12,
    fontWeight: "500",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
  },
  modalGradient: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.onSurface,
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },

  // Credential Detail Styles
  credentialDetail: {
    gap: 24,
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 8,
  },
  detailIcon: {
    fontSize: 32,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.colors.onSurface,
  },
  detailIssuer: {
    fontSize: 16,
    color: theme.colors.onSurfaceVariant,
    marginTop: 4,
  },
  detailsGrid: {
    gap: 16,
  },
  detailRow: {
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  detailLabel: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: theme.colors.onSurface,
    fontWeight: "500",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  shareButton: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  verifyButton: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  actionButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.onPrimary,
  },

  // Share Modal Styles
  shareDescription: {
    fontSize: 16,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 24,
    textAlign: "center",
  },
  shareToggles: {
    gap: 16,
    marginBottom: 32,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  toggleInfo: {
    flex: 1,
    marginRight: 16,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  toggleValue: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
  },
  shareConfirmButton: {
    borderRadius: 12,
    overflow: "hidden",
  },

  // Form Styles
  formContainer: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.onSurface,
  },
  textInput: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: theme.colors.onSurface,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 16,
  },

  // Verification Modal Styles
  verificationDescription: {
    fontSize: 16,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 24,
    textAlign: "center",
  },
  institutionGrid: {
    gap: 12,
    marginBottom: 24,
  },
  institutionCard: {
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: "center",
  },
  institutionCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + "10",
  },
  institutionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  institutionName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  institutionDescription: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    textAlign: "center",
  },
  verificationForm: {
    gap: 20,
  },
  requiredDocsSection: {
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  requiredDocsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.onSurface,
    marginBottom: 12,
  },
  requiredDoc: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 4,
  },
});
