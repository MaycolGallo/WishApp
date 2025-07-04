import React,{Suspense} from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs, useRouter, useLocalSearchParams } from 'expo-router';
import { Pressable, View, Alert } from 'react-native';
import { ThemeToggle } from '../components/ThemeToggle';
// import { db } from '../../lib/db';
import { wishlists, wishlist_products } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { SQLiteProvider, openDatabaseSync } from 'expo-sqlite'
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { drizzle } from 'drizzle-orm/expo-sqlite';

import Colors from '@/constants/Colors';
import { useColorScheme } from '../lib/useColorScheme';
import migrations from '../../drizzle/migrations';

const expo = openDatabaseSync('wishlists');
const db = drizzle(expo);

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { success, error } = useMigrations(db, migrations);

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
    <Suspense>
      <SQLiteProvider databaseName='wishlists'
       options={{enableChangeListener:true}} useSuspense>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
            headerShown: true,
          }}>
          <Tabs.Screen
            name="home"
            options={{
              title: 'Wishlists',
              tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
              headerRight: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Pressable onPress={() => router.push('/(tabs)/create-wishlist')}>
                    {({ pressed }) => (
                      <FontAwesome
                        name="plus"
                        size={25}
                        color={Colors[colorScheme ?? 'light'].text}
                        style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                      />
                    )}
                  </Pressable>
                  <ThemeToggle />
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="wishlist-detail"
            options={{
              href: null, // Hide from tab bar
              title: 'Wishlist Details',
              headerRight: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Pressable onPress={() => router.push({ pathname: '/(tabs)/add-product', params: { id: params.id } })}>
                    {({ pressed }) => (
                      <FontAwesome
                        name="plus"
                        size={25}
                        color={Colors[colorScheme ?? 'light'].text}
                        style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                      />
                    )}
                  </Pressable>
                  <Pressable onPress={handleDeleteWishlist}>
                    {({ pressed }) => (
                      <FontAwesome
                        name="trash"
                        size={25}
                        color={Colors[colorScheme ?? 'light'].text}
                        style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                      />
                    )}
                  </Pressable>
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="add-product"
            options={{
              href: null, // Hide from tab bar
              title: 'Add Product',
            }}
          />
          <Tabs.Screen
            name="create-wishlist"
            options={{
              href: null, // Hide from tab bar
              title: 'Create Wishlist',
            }}
          />
        </Tabs>
      </SQLiteProvider>
    </Suspense>
  );
}
