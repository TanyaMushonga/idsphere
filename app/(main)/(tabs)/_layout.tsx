import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#4a80f0",
        tabBarInactiveTintColor: "#a0a0a0",
        tabBarStyle: {
          backgroundColor: "#0a1f3d",
          borderTopWidth: 0,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Wallet",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons
              name="account-balance-wallet"
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: "Activity",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="history" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
