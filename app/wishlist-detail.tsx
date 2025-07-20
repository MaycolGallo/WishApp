import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import Text from "./components/ui/text-ui";
import { useLocalSearchParams, useFocusEffect } from "expo-router";
import { db } from "../lib/db";
import * as schema from "../db/schema";
import { eq, and } from "drizzle-orm";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { Image, useImage } from "expo-image";

const WishlistDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const [wishlistItems, setWishlistItems] = useState([]);
  // const [wishlist, setWishlist] = useState<schema.Wishlist | null>(null);

  const { data: wishlist } = useLiveQuery(
    db.query.wishlists.findFirst({
      where: eq(schema.wishlists.id, parseInt(id as string, 10)),
      
    })
  );

  // const fetchWishlistItems = useCallback(async () => {
  //   if (!id) return;
  //   try {
  //     const wishlistId = parseInt(id as string, 10);

  //     const wishlist = await expoDB.query.wishlists.findFirst({
  //       where: eq(schema.wishlists.id, wishlistId),
  //       // with:{

  //       // }
  //     });
  //     setWishlist(wishlist);

  //     // setWishlistItems(items);
  //   } catch (error) {
  //     console.error("Error fetching wishlist items:", error);
  //   }
  // }, [id]);

  // useFocusEffect(
  //   useCallback(() => {
  //     fetchWishlistItems();
  //   }, [fetchWishlistItems])
  // );

  const handleRemoveProduct = (productId: number) => {
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
              await db.delete(schema.wishlists).where(
                // id ? and(eq(schema.wishlists.id, wishlistId)) : null
                eq(schema.wishlists.id, wishlistId)
              );
              // fetchWishlistItems(); // Refresh the list
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
    <SafeAreaView className="flex-1 bg-neutral-100 dark:bg-neutral-800">
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
        <Text weight="bold" variant="h2" className="mb-4">{item?.name}</Text>
        <Text weight="medium" variant="h3" className="mt-1 text-gray-500">
          ${item?.totalPrice}
          {/* {JSON.stringify(item)} */}
          {/* {image && JSON.stringify(image)} */}
        </Text>
        <Text className="mt-1">{item?.description}</Text>
      </View>
    </View>
  );
};

export default WishlistDetailScreen;
