import React, { useEffect, useState } from "react";
import {
  View,
  // Text,
  FlatList,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
// import { db } from '../../lib/db';
import * as schema from "../../db/schema";
import { useSQLiteContext } from "expo-sqlite";
import { Image } from "expo-image";
import * as FileSystem from "expo-file-system";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Colors from "~/constants/Colors";
import Text  from "../components/ui/text-ui";

const HomeScreen = () => {
  const [allWishlists, setAllWishlists] = useState([]);
  const db = useSQLiteContext();
  const expoDB = drizzle(db, { schema });
  const router = useRouter();
  const { data } = useLiveQuery(expoDB.select().from(schema.wishlists));

  useEffect(() => {
    const fetchWishlists = async () => {
      try {
        setAllWishlists(data);
      } catch (error) {
        console.error("Error fetching wishlists:", error);
      }
    };

    fetchWishlists();
  }, [data]);

  const handleWishlistPress = (wishlistId: number) => {
    router.push({ pathname: "/wishlist-detail", params: { id: wishlistId } });
  };

  const renderItem = ({ item }: { item: schema.Wishlist }) => {
    return (
      <TouchableOpacity
        onPress={() => handleWishlistPress(item.id)}
        className="flex-1 m-2"
      >
        <View className="overflow-hidden bg-white rounded-lg shadow">
          <Image
            source={{ uri: item.imageUrl }}
            style={{ width: "100%", height: "120" }}
            contentFit="cover"
          />
          <View className="p-4">
            <Text variant="h2">{item.name}</Text>
            <Text weight="semiBold" className="mt-1 text-base text-gray-500">
              Total: ${item.totalPrice}
            </Text>
            <Text className="mt-1 text-sm text-gray-400">
              Created: {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 p-4 bg-gray-100 dark:bg-blue-200">
      <Text variant="h1" className="text-center mb-4">Main Header</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text>No wishlists found.</Text>}
        numColumns={2}
        // key={2} // Force re-render on column change
      />
      {/* <Text>{JSON.stringify(data)}</Text> */}
      <View
        style={{
          position: "absolute",
          bottom: 10,
          boxShadow:
            "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset",
          right: 10,
          height: 50,
          width: 50,
          backgroundColor: Colors.light.tint,
          borderRadius: 50,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Pressable
          onPress={() => {
            router.push({ pathname: "/create-wishlist" });
          }}
        >
          <Text className="text-2xl font-bold">
            <FontAwesome name="plus" color="white" size={20} />
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default HomeScreen;
