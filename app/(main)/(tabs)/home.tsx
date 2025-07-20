import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import { FAB, Card, Avatar } from "react-native-paper";
import { useCredentials } from "../../../hooks/useCredentials";

export default function HomeScreen() {
  const { credentials, loading, refresh } = useCredentials();

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refresh}
            tintColor="#4a80f0"
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>My Credentials</Text>
          <Avatar.Icon icon="account" size={40} style={styles.avatar} />
        </View>

        {credentials.map((credential) => (
          <TouchableOpacity
            key={credential.id}
            onPress={() => router.push(`/credential/${credential.id}`)}
          >
            <Card style={styles.card}>
              <Card.Title
                title={credential.issuer}
                titleStyle={styles.cardTitle}
                subtitle={`${
                  Object.keys(credential.attributes).length
                } attributes`}
                left={(props) => (
                  <Avatar.Icon
                    {...props}
                    icon={getCredentialIcon(credential.type)}
                    style={styles.cardIcon}
                  />
                )}
                right={(props) =>
                  credential.verified && (
                    <Avatar.Icon
                      {...props}
                      icon="check-decagram"
                      color="#4CAF50"
                      style={styles.verifiedIcon}
                    />
                  )
                }
              />
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FAB
        icon="qrcode-scan"
        style={styles.fab}
        onPress={() => router.push("/credential/scan")}
        label="Share Credential"
      />
    </View>
  );
}

// Helper function for credential icons
function getCredentialIcon(type: string) {
  const icons: Record<string, string> = {
    "national-id": "card-account-details",
    diploma: "school",
    "proof-of-address": "home-city",
  };
  return icons[type] || "file-document";
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  avatar: {
    backgroundColor: "#4a80f0",
  },
  card: {
    margin: 10,
    elevation: 3,
  },
  cardTitle: {
    fontWeight: "bold",
  },
  cardIcon: {
    backgroundColor: "#e3f2fd",
  },
  verifiedIcon: {
    backgroundColor: "transparent",
    marginRight: 10,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#4a80f0",
  },
});
