import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { theme } from "../../constants/theme/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

import WelcomeScreen from "./welcome";
import DidGenerateScreen from "./did-generate";
import PermissionsScreen from "./permissions";

const ONBOARDING_KEY = "onboarding_complete";
const { width: screenWidth } = Dimensions.get("window");

export default function OnboardingLayout() {
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const pages = [
    { component: WelcomeScreen, name: "welcome" },
    { component: DidGenerateScreen, name: "did-generate" },
    { component: PermissionsScreen, name: "permissions" },
  ];

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const pageIndex = Math.round(contentOffsetX / screenWidth);
    setCurrentPage(pageIndex);
  };

  const goToPage = (pageIndex: number) => {
    scrollViewRef.current?.scrollTo({
      x: pageIndex * screenWidth,
      animated: true,
    });
    setCurrentPage(pageIndex);
  };

  useEffect(() => {
    (async () => {
      await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    })();
  }, []);

  const handleSkip = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    router.replace("/(main)/(tabs)/home");
  };

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {pages.map((_, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor:
                index === currentPage
                  ? theme.colors.primary
                  : theme.colors.surfaceVariant,
            },
          ]}
          onPress={() => goToPage(index)}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {pages.map((page, index) => {
          const PageComponent = page.component;
          return (
            <View key={index} style={styles.pageContainer}>
              <PageComponent />
            </View>
          );
        })}
      </ScrollView>

      {renderDots()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  pageContainer: {
    width: screenWidth,
    flex: 1,
  },
  skipButton: {
    position: "absolute",
    top: 60,
    right: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    zIndex: 1000,
  },
  skipText: {
    color: theme.colors.onBackground,
    fontSize: 16,
    fontWeight: "500",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
