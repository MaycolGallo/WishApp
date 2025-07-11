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
import { Appearance, Platform, View } from "react-native";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { PortalHost } from "@rn-primitives/portal";
import { ThemeToggle } from "~/components/ThemeToggle";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { openDatabaseSync, SQLiteProvider } from "expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "../drizzle/migrations";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { SafeAreaProvider } from "react-native-safe-area-context";

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

const expo = openDatabaseSync("wishlists");
const db = drizzle(expo);

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// const usePlatformSpecificSetup = Platform.select({
//   web: useSetWebBackgroundClassName,
//   android: useSetAndroidNavigationBar,
//   default: noop,
// });

export default function RootLayout() {
  // usePlatformSpecificSetup();
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const { success, error } = useMigrations(db, migrations);

  React.useLayoutEffect(() => {
    if (Platform.OS === "android") {
      setAndroidNavigationBar(colorScheme);
    }
  }, [colorScheme]);

  return (
    <React.Suspense>
      <SQLiteProvider
        databaseName="wishlists"
        options={{ enableChangeListener: true }}
        useSuspense
      >
        <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
          <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
          {/* <SafeAreaProvider> */}
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
                options={{ title: "Wishlist Details", headerShown: false }}
              />
            </Stack>
          {/* </SafeAreaProvider> */}
          <PortalHost />
        </ThemeProvider>
      </SQLiteProvider>
    </React.Suspense>
  );
}

/*
const useIsomorphicLayoutEffect =
  Platform.OS === 'web' && typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

function useSetWebBackgroundClassName() {
  useIsomorphicLayoutEffect(() => {
    // Adds the background color to the html element to prevent white background on overscroll.
    document.documentElement.classList.add('bg-background');
  }, []);
}

function useSetAndroidNavigationBar() {
  React.useLayoutEffect(() => {
    setAndroidNavigationBar(Appearance.getColorScheme() ?? 'light');
  }, []);
}

function noop() {}
*/
