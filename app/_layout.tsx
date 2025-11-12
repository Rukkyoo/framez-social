import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { UserProvider, useUser } from "@/context/UserContext";
import "react-native-reanimated";
import { useEffect } from "react";

import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  anchor: "(auth)",
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { user, loading } = useUser() as any;
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Wait for auth state to be determined

    const inAuthGroup = segments[0] === "(auth)";

    if (user && inAuthGroup) {
      // User is logged in and in auth screens, redirect to tabs
      router.replace("/(tabs)/feed");
    } else if (!user && !inAuthGroup) {
      // User is not logged in and not in auth screens, redirect to auth
      router.replace("/(auth)/login");
    }
  }, [user, loading, segments, router]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName="(auth)">
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <UserProvider>
      <RootLayoutNav />
    </UserProvider>
  );
}
