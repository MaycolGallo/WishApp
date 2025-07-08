import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, useFocusEffect } from "expo-router";
import { db } from "../../lib/db";
import * as schema from "../../db/schema";
import { eq, and } from "drizzle-orm";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";

const WishlistDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistName, setWishlistName] = useState("");

  const db = useSQLiteContext();
  const expoDB = drizzle(db, { schema });

  const fetchWishlistItems = useCallback(async () => {
    if (!id) return;
    try {
      const wishlistId = parseInt(id as string, 10);

      const wishlist = await expoDB.query.wishlists.findFirst({
        where: eq(wishlists.id, wishlistId),
        // with:{

        // }
      });
      setWishlistName(wishlist?.name || "Wishlist");

      // setWishlistItems(items);
    } catch (error) {
      console.error("Error fetching wishlist items:", error);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      fetchWishlistItems();
    }, [fetchWishlistItems])
  );

  const handleRemoveProduct = (productId) => {
    const wishlistId = parseInt(id as string, 10);
    Alert.alert(
      "Remove Product",
      "Are you sure you want to remove this product from the wishlist?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await expoDB
                .delete(wishlist_products)
                .where(
                  and(
                    eq(wishlist_products.wishlistId, wishlistId),
                    eq(wishlist_products.productId, productId)
                  )
                );
              fetchWishlistItems(); // Refresh the list
            } catch (error) {
              console.error("Error removing product:", error);
              Alert.alert("Error", "Failed to remove product.");
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View className="flex-row mb-4 bg-white rounded-lg overflow-hidden shadow items-center">
      <Image source={{ uri: item.imageUrl }} className="w-24 h-24" />
      <View className="flex-1 p-3 justify-center">
        <Text className="text-lg font-bold">{item.name}</Text>
        <Text className="text-base text-gray-500 mt-1">${item.price}</Text>
        <Text className="text-sm text-gray-400 mt-1">{item.category}</Text>
      </View>
      <TouchableOpacity
        onPress={() => handleRemoveProduct(item.id)}
        className="p-3"
      >
        <FontAwesome name="trash" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 p-4 bg-gray-100">
      <Text className="text-2xl font-bold mb-4">{wishlistName}</Text>
      <FlatList
        data={wishlistItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text>This wishlist is empty.</Text>}
      />
    </View>
  );
};

export default WishlistDetailScreen;
