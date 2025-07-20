import { useEffect } from "react";
import { router } from "expo-router";

import { View, ActivityIndicator } from "react-native";

export default function Index() {
  useEffect(() => {
    redirectingToAuth();
  }, []);

  const redirectingToAuth = async () => {
    router.replace("/(auth)/auth-gate");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
