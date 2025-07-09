import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, useFocusEffect } from "expo-router";
import { db } from "../lib/db";
import * as schema from "../db/schema";
import { eq, and } from "drizzle-orm";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { Image, useImage } from "expo-image";

const WishlistDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlist, setWishlist] = useState<schema.Wishlist | null>(null);

  // const image = useImage(wishlist?.imageUrl);

  const db = useSQLiteContext();
  const expoDB = drizzle(db, { schema });

  const fetchWishlistItems = useCallback(async () => {
    if (!id) return;
    try {
      const wishlistId = parseInt(id as string, 10);

      const wishlist = await expoDB.query.wishlists.findFirst({
        where: eq(schema.wishlists.id, wishlistId),
        // with:{

        // }
      });
      setWishlist(wishlist);

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

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <RenderItem item={wishlist!} />
    </SafeAreaView>
  );
};

const RenderItem = ({ item }: { item: schema.Wishlist }) => {
  // const image = useImage(item.imageUrl!);

  // if (!image) {
  //   return <Text>Image is loading...</Text>;
  // }

  if (!item) {
    return <Text>Loading...</Text>;
  }

  return (
    <View className="items-center flex-1">
      <Image
        source={{ uri: item?.imageUrl! }}
        style={{ width: "100%", height: 300, borderRadius: 10 }}
        contentFit="fill"
        transition={500}
        // contentPosition={"top"}
      />

      <View className="p-4">
        <Text className="mb-4 text-2xl font-bold">{item?.name}</Text>
        <Text className="mt-1 text-base text-gray-500">
          ${item?.totalPrice}
          {JSON.stringify(item)}
          {/* {image && JSON.stringify(image)} */}
        </Text>
      </View>
    </View>
  );
};

export default WishlistDetailScreen;
