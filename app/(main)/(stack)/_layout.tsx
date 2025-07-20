import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
      <Stack.Screen name="scan" options={{ headerShown: false }} />
      <Stack.Screen name="share" options={{ headerShown: false }} />
      <Stack.Screen name="verify" options={{ headerShown: false }} />
    </Stack>
  );
};

export default _layout;
