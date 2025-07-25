import React, { useCallback } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { db } from "../lib/db";
import * as schema from "../db/schema";
import { and, eq } from "drizzle-orm";
import Text from "./components/ui/text-ui";
import { FontAwesome } from "@expo/vector-icons";

const ListDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const listId = parseInt(id as string, 10);

  const { data: list } = useLiveQuery(
    db.query.lists.findFirst({
      where: eq(schema.lists.id, listId),
      with: {
        list_wishlist_items: {
          with: {
            wishlist: true,
          },
        },
      },
    })
  );

  const handleDeleteItem = useCallback(
    (wishlistToDelete: schema.Wishlist) => {
      Alert.alert(
        "Delete Item",
        `Are you sure you want to remove "${wishlistToDelete.name}" from this list?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            onPress: async () => {
              try {
                // This only removes the association, not the wishlist itself.
                await db
                  .delete(schema.list_wishlist_items)
                  .where(
                    and(
                      eq(schema.list_wishlist_items.listId, listId),
                      eq(
                        schema.list_wishlist_items.wishlistId,
                        wishlistToDelete.id
                      )
                    )
                  );
              } catch (error) {
                console.error("Error removing item from list:", error);
                Alert.alert("Error", "Failed to remove item from list.");
              }
            },
            style: "destructive",
          },
        ]
      );
    },
    [listId]
  );

  const renderItem = useCallback(
    ({
      item,
    }: {
      item: schema.ListWishlistItem & { wishlist: schema.Wishlist };
    }) => (
      <View className="flex-row items-center justify-between p-4 mb-2 bg-white border rounded-lg border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700">
        <View>
          <Text className="text-lg">{item.wishlist.name}</Text>
          <Text className="text-neutral-500">
            ${item.wishlist.totalPrice.toFixed(2)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => handleDeleteItem(item.wishlist)}
          className="p-2"
        >
          <FontAwesome name="trash" size={24} color="#ef4444" />
        </TouchableOpacity>
      </View>
    ),
    [handleDeleteItem]
  );

  if (!list) {
    return (
      <SafeAreaView className="items-center justify-center flex-1 bg-neutral-100 dark:bg-neutral-900">
        <Text>List not found.</Text>
      </SafeAreaView>
    );
  }

  // Calculate total price on the client side from the fetched wishlists
  const totalPrice =
    list.list_wishlist_items?.reduce(
      (sum, item) => sum + item.wishlist.totalPrice,
      0
    ) || 0;

  return (
    <SafeAreaView className="flex-1 bg-neutral-100 dark:bg-neutral-900">
      <View className="p-4">
        <View className="flex-row items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-700">
          <Text weight="bold" variant="h2">
            {list.name}
          </Text>
          <Text
            weight="bold"
            variant="h3"
            className="text-blue-600 dark:text-blue-400"
          >
            Total: ${totalPrice.toFixed(2)}
          </Text>
        </View>
      </View>
      <FlatList
        data={list.list_wishlist_items}
        renderItem={renderItem}
        keyExtractor={(item) => item.wishlist.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        ListEmptyComponent={
          <View className="items-center justify-center p-10 mt-10 bg-neutral-200 dark:bg-neutral-800 rounded-xl">
            <Text className="text-lg text-center text-neutral-500">
              No items in this list yet.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default ListDetailScreen;
