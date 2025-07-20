import { View, Text, ScrollView, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Button, Card, IconButton, useTheme } from "react-native-paper";
import data from "../../data.json";
import { useState } from "react";

export default function CredentialDetail() {
  const { id } = useLocalSearchParams();
  const theme = useTheme();
  const [disclosedFields, setDisclosedFields] = useState<string[]>([]);

  const credential = data.credentials.find((c) => c.id === id);

  if (!credential) {
    return (
      <View style={styles.container}>
        <Text>Credential not found</Text>
      </View>
    );
  }

  const toggleField = (field: string) => {
    setDisclosedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Title
          title={credential.issuer}
          subtitle={`Issued: ${credential.issuedDate}`}
          left={(props) => (
            <Avatar.Icon
              {...props}
              icon={getCredentialIcon(credential.type)}
              size={48}
            />
          )}
          right={(props) =>
            credential.verified && (
              <Avatar.Icon
                {...props}
                icon="check-decagram"
                color="#4CAF50"
                size={48}
              />
            )
          }
        />
      </Card>

      <Card style={styles.detailsCard}>
        <Card.Title title="Attributes" />
        <Card.Content>
          {Object.entries(credential.attributes).map(([key, value]) => (
            <View key={key} style={styles.attributeRow}>
              <Text style={styles.attributeName}>{key}:</Text>
              <View style={styles.attributeValue}>
                <Text style={styles.attributeText}>
                  {disclosedFields.includes(key) ? value : "••••••••"}
                </Text>
                <IconButton
                  icon={disclosedFields.includes(key) ? "eye-off" : "eye"}
                  onPress={() => toggleField(key)}
                  iconColor={theme.colors.primary}
                />
              </View>
            </View>
          ))}
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        icon="qrcode"
        style={styles.shareButton}
        onPress={() =>
          router.push({
            pathname: "/credential/share",
            params: {
              id: credential.id,
              disclosedFields: JSON.stringify(disclosedFields),
            },
          })
        }
      >
        Share via QR
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  headerCard: {
    marginBottom: 15,
    elevation: 3,
  },
  detailsCard: {
    marginBottom: 20,
    elevation: 2,
  },
  attributeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  attributeName: {
    fontWeight: "bold",
    width: "30%",
  },
  attributeValue: {
    flexDirection: "row",
    alignItems: "center",
    width: "65%",
  },
  attributeText: {
    flex: 1,
  },
  shareButton: {
    marginHorizontal: 10,
    marginBottom: 20,
    backgroundColor: "#4a80f0",
  },
});
