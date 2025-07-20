import React, { useState, useEffect } from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Button, Text, Card, useTheme } from "react-native-paper";
import QRCode from "react-native-qrcode-svg";
import * as Clipboard from "expo-clipboard";
import data from "../../data.json";

export default function QRShareScreen() {
  const { id, disclosedFields } = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const theme = useTheme();
  const [qrData, setQrData] = useState("");

  const credential = data.credentials.find((c) => c.id === id);
  const fields = JSON.parse(disclosedFields as string);

  useEffect(() => {
    if (credential && fields) {
      const payload = {
        credentialId: credential.id,
        disclosedFields: fields.reduce(
          (obj: Record<string, any>, key: string) => {
            obj[key] = credential.attributes[key];
            return obj;
          },
          {}
        ),
        timestamp: new Date().toISOString(),
      };
      setQrData(JSON.stringify(payload));
    }
  }, [credential, fields]);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(qrData);
    alert("Copied to clipboard!");
  };

  if (!credential) {
    return (
      <View style={styles.container}>
        <Text>Credential not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title
          title={`Share ${credential.issuer} Credential`}
          subtitle={`${fields.length} attributes selected`}
        />
        <Card.Content style={styles.content}>
          <View style={styles.qrContainer}>
            {qrData ? (
              <QRCode
                value={qrData}
                size={width * 0.7}
                color={theme.colors.primary}
                backgroundColor="white"
              />
            ) : (
              <Text>Generating QR code...</Text>
            )}
          </View>

          <Text style={styles.disclaimer}>
            This QR contains only the selected attributes
          </Text>
        </Card.Content>
      </Card>

      <View style={styles.buttonGroup}>
        <Button
          mode="outlined"
          icon="content-copy"
          onPress={handleCopy}
          style={styles.button}
        >
          Copy Data
        </Button>
        <Button
          mode="contained"
          onPress={() => router.back()}
          style={styles.button}
        >
          Done
        </Button>
      </View>
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
    flex: 1,
    marginBottom: 20,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  qrContainer: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 20,
  },
  disclaimer: {
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});
