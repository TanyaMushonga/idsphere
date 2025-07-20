import { useEffect } from "react";
import { AppState } from "react-native";
import { BiometricAuth } from "../lib/auth";
import { router } from "expo-router";

export const useAutoLock = (timeoutMinutes = 5) => {
  useEffect(() => {
    let backgroundTime: Date | null = null;
    let timeoutId: NodeJS.Timeout;

    const handleAppStateChange = (nextState: string) => {
      if (nextState === "background") {
        backgroundTime = new Date();
      } else if (nextState === "active" && backgroundTime) {
        const elapsedMinutes =
          (new Date().getTime() - backgroundTime.getTime()) / 60000;
        if (elapsedMinutes >= timeoutMinutes) {
          router.replace("/auth-gate");
        }
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    // Lock after timeout
    const setupTimeout = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        router.replace("/auth-gate");
      }, timeoutMinutes * 60000);
    };

    setupTimeout();
    return () => {
      subscription.remove();
      clearTimeout(timeoutId);
    };
  }, [timeoutMinutes]);
};
