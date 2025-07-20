import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { Button, Text, ActivityIndicator } from "react-native-paper";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as Crypto from "expo-crypto";

export default function QRScanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return; // Prevent multiple scans

    setScanned(true);
    setLoading(true);

    try {
      // Validate QR data structure
      const parsed = JSON.parse(data);
      if (!parsed.credentialId || !parsed.disclosedFields) {
        throw new Error("Invalid credential format");
      }

      // Simulate verification
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate verification hash
      const hash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        data
      );

      router.push({
        pathname: "/verify",
        params: {
          scanData: data,
          verificationHash: hash,
        },
      });
    } catch (error) {
      Alert.alert(
        "Invalid QR Code",
        "This doesn't appear to be a valid IDSphere credential",
        [{ text: "OK", onPress: () => setScanned(false) }]
      );
    } finally {
      setLoading(false);
    }
  };

  if (!permission) {
    // Camera permissions are still loading
    return (
      <View style={styles.container}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>
          Camera permission is required to scan QR codes
        </Text>
        <Button mode="contained" onPress={requestPermission}>
          Grant Permission
        </Button>
        <Button
          mode="outlined"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Verifying credential...</Text>
        </View>
      ) : (
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: [
              "qr",
              "pdf417",
              "datamatrix",
              "code128",
              "code39",
              "ean13",
              "ean8",
            ],
          }}
        />
      )}

      {scanned && !loading && (
        <Button
          mode="contained"
          onPress={() => setScanned(false)}
          style={styles.rescanButton}
        >
          Tap to Scan Again
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  permissionText: {
    marginBottom: 20,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  backButton: {
    marginTop: 10,
  },
  loadingContainer: {
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 30,
    borderRadius: 10,
  },
  loadingText: {
    color: "white",
    marginTop: 10,
  },
  rescanButton: {
    position: "absolute",
    bottom: 30,
    backgroundColor: "#4a80f0",
  },
});
