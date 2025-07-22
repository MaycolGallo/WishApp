import React, { Suspense } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs, useRouter, useLocalSearchParams } from "expo-router";
import { Pressable, View, Alert } from "react-native";
import { ThemeToggle } from "../components/ThemeToggle";

import Colors from "~/constants/Colors";
import { useColorScheme } from "../lib/useColorScheme";
import { SQLiteProvider } from "expo-sqlite";


function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const router = useRouter();
  const params = useLocalSearchParams();

  const handleDeleteWishlist = () => {
    const wishlistId = parseInt(params.id as string, 10);
    if (!wishlistId) return;

  };

  return (
    
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Wishlists",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerRight: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <ThemeToggle />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="lists"
        options={{
          title: "Lists",
          tabBarIcon: ({ color }) => <TabBarIcon name="list" color={color} />,
          headerRight: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <ThemeToggle />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
