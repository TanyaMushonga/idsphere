import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Button, Card, Text, useTheme } from "react-native-paper";
import data from "../../data.json";

export default function VerificationScreen() {
  const { scanData, verificationHash } = useLocalSearchParams();
  const theme = useTheme();
  const [approved, setApproved] = useState(false);

  const request = scanData ? JSON.parse(scanData as string) : null;
  const credential = request
    ? data.credentials.find((c) => c.id === request.credentialId)
    : null;

  const handleApprove = () => {
    setApproved(true);
    // In a real app, you would send verification to the requester
    setTimeout(() => router.replace("/(tabs)/activity"), 2000);
  };

  if (!request || !credential) {
    return (
      <View style={styles.container}>
        <Text>Invalid verification request</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title
          title="Verification Request"
          subtitle={`From: ${request.requester || "Unknown verifier"}`}
        />
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Requested Attributes:
          </Text>

          {Object.keys(request.disclosedFields).map((field) => (
            <View key={field} style={styles.attributeRow}>
              <Text style={styles.attributeName}>{field}:</Text>
              <Text style={styles.attributeValue}>
                {credential.attributes[field]}
              </Text>
            </View>
          ))}

          {approved ? (
            <View style={styles.approvedContainer}>
              <Text style={styles.approvedText}>✓ Verification Sent</Text>
            </View>
          ) : (
            <View style={styles.buttonGroup}>
              <Button
                mode="outlined"
                onPress={() => router.back()}
                style={styles.button}
              >
                Deny
              </Button>
              <Button
                mode="contained"
                onPress={handleApprove}
                style={styles.button}
              >
                Approve
              </Button>
            </View>
          )}
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  card: {
    width: "100%",
  },
  sectionTitle: {
    marginTop: 10,
    marginBottom: 15,
  },
  attributeRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  attributeName: {
    fontWeight: "bold",
    width: 120,
  },
  attributeValue: {
    flex: 1,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  approvedContainer: {
    backgroundColor: "#E8F5E9",
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
  },
  approvedText: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
});
