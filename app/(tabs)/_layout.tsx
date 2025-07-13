import React, { Suspense } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs, useRouter, useLocalSearchParams } from "expo-router";
import { Pressable, View, Alert } from "react-native";
import { ThemeToggle } from "../components/ThemeToggle";

import Colors from "~/constants/Colors";
import { useColorScheme } from "../lib/useColorScheme";


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

    // Alert.alert(
    //   "Delete Wishlist",
    //   "Are you sure you want to delete this wishlist and all its products?",
    //   [
    //     { text: "Cancel", style: "cancel" },
    //     {
    //       text: "Delete",
    //       style: "destructive",
    //       onPress: async () => {
    //         try {
    //           await db.delete(wishlist_products).where(eq(wishlist_products.wishlistId, wishlistId));
    //           await db.delete(wishlists).where(eq(wishlists.id, wishlistId));
    //           router.back();
    //         } catch (error) {
    //           console.error("Error deleting wishlist:", error);
    //           Alert.alert("Error", "Failed to delete wishlist.");
    //         }
    //       },
    //     },
    //   ]
    // );
  };

  return (
    // <Suspense>
    //   <SQLiteProvider
    //     databaseName="wishlists"
    //     options={{ enableChangeListener: true }}
    //     useSuspense
    //   >
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
    </Tabs>
    //   </SQLiteProvider>
    // </Suspense>
  );
}
