import React from "react";
import { Stack } from "expo-router";


const _layout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="did-generate" options={{ headerShown: false }} />
      <Stack.Screen name="permissions" options={{ headerShown: false }} />
    </Stack>
  );
};

export default _layout;
