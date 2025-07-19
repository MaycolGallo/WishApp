import "~/global.css";

import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform, Text } from "react-native";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { PortalHost } from "@rn-primitives/portal";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "../drizzle/migrations";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export default function RootLayout() {
  return (
    <React.Suspense fallback={<Text>Loading...</Text>}>
      <SQLiteProvider
        databaseName="wishlists"
        options={{ enableChangeListener: true }}
        useSuspense
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          <App />
        </GestureHandlerRootView>
      </SQLiteProvider>
    </React.Suspense>
  );
}

function App() {
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const db = useSQLiteContext();
  const { success, error } = useMigrations(drizzle(db), migrations);

  React.useLayoutEffect(() => {
    if (Platform.OS === "android") {
      setAndroidNavigationBar(colorScheme);
    }
  }, [colorScheme]);

  if (error) {
    return <Text>Migration error: {error.message}</Text>;
  }

  if (!success) {
    return <Text>Loading...</Text>;
  }

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="create-wishlist"
          options={{
            title: "Create Wishlist",
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="wishlist-detail"
          options={{
            title: "Wishlist Details",
            headerTitleAlign: "center",
          }}
        />
      </Stack>
      <PortalHost />
    </ThemeProvider>
  );
}
