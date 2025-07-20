import React, { useState } from "react";
import { View, StyleSheet, FlatList, Button } from "react-native";
import { Text, Card, Divider, Searchbar, useTheme } from "react-native-paper";
import data from "../../data.json";
import { MaterialIcons } from "@expo/vector-icons";

type ActivityItem = (typeof data.activityLog)[0] & {
  credential?: (typeof data.credentials)[0];
};

export default function ActivityScreen() {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "shared" | "received">("all");

  // Enrich activity data with credential info
  const enrichedActivities: ActivityItem[] = data.activityLog.map(
    (activity) => ({
      ...activity,
      credential: data.credentials.find((c) => c.id === activity.credentialId),
    })
  );

  // Filter activities based on search and filter
  const filteredActivities = enrichedActivities.filter((activity) => {
    const matchesSearch =
      activity.credential?.issuer
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      activity.recipient?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "shared" && activity.type === "share") ||
      (filter === "received" && activity.type === "receive");

    return matchesSearch && matchesFilter;
  });

  const renderItem = ({ item }: { item: ActivityItem }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.activityHeader}>
          <MaterialIcons
            name={item.type === "share" ? "upload" : "download"}
            size={24}
            color={item.type === "share" ? theme.colors.primary : "#4CAF50"}
          />
          <View style={styles.activityTitle}>
            <Text variant="titleSmall">
              {item.type === "share"
                ? `Shared with ${item.recipient}`
                : `Received from ${item.issuer}`}
            </Text>
            <Text variant="bodySmall" style={styles.dateText}>
              {new Date(item.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.activityDetails}>
          <Text variant="bodyMedium" style={styles.credentialName}>
            {item.credential?.issuer || "Unknown Credential"}
          </Text>

          {item.type === "share" && item.disclosedFields && (
            <Text variant="bodySmall" style={styles.fieldsText}>
              Shared fields: {item.disclosedFields.join(", ")}
            </Text>
          )}
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search activities..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <View style={styles.filterContainer}>
        <Button
          mode={filter === "all" ? "contained" : "outlined"}
          onPress={() => setFilter("all")}
          style={styles.filterButton}
        >
          All
        </Button>
        <Button
          mode={filter === "shared" ? "contained" : "outlined"}
          onPress={() => setFilter("shared")}
          style={styles.filterButton}
        >
          Shared
        </Button>
        <Button
          mode={filter === "received" ? "contained" : "outlined"}
          onPress={() => setFilter("received")}
          style={styles.filterButton}
        >
          Received
        </Button>
      </View>

      <FlatList
        data={filteredActivities}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No activities found</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  searchBar: {
    margin: 10,
    borderRadius: 8,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  filterButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    marginVertical: 5,
    marginHorizontal: 10,
  },
  activityHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  activityTitle: {
    marginLeft: 10,
  },
  dateText: {
    color: "#666",
  },
  divider: {
    marginVertical: 8,
  },
  activityDetails: {
    marginLeft: 34, // Align with title
  },
  credentialName: {
    fontWeight: "bold",
  },
  fieldsText: {
    color: "#666",
    marginTop: 4,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
});
