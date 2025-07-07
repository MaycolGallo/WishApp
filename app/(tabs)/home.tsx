import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';
// import { db } from '../../lib/db';
import * as schema from '../../db/schema';
import {useSQLiteContext} from 'expo-sqlite'


const HomeScreen = () => {
  const [allWishlists, setAllWishlists] = useState([]);
  const db = useSQLiteContext()
  const expoDB = drizzle(db, {schema})
  const router = useRouter();
  const {data} = useLiveQuery(expoDB.select().from(schema.wishlists))

  // useEffect(() => {
  //   const fetchWishlists = async () => {
  //     try {
  //       setAllWishlists(data);
  //     } catch (error) {
  //       console.error('Error fetching wishlists:', error);
  //     }
  //   };

  //   fetchWishlists();
  // }, []);

  const handleWishlistPress = (wishlistId: number) => {
    router.push({ pathname: '/(tabs)/wishlist-detail', params: { id: wishlistId } });
  };

  const renderItem = ({ item }: { item: schema.Wishlist }) => (
    <TouchableOpacity onPress={() => handleWishlistPress(item.id)}>
      <View className="p-4 mb-4 bg-white rounded-lg shadow">
        <Text className="text-lg font-bold">{item.name}</Text>
        <Text className="text-base text-gray-500 mt-1">Total: ${item.totalPrice}</Text>
        <Text className="text-sm text-gray-400 mt-1">Created: {new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 p-4 bg-gray-100 dark:bg-neutral-600">
      <Text className="text-2xl font-bold mb-4">All Wishlists</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={<Text>No wishlists found.</Text>}
      />
    </View>
  );
};

export default HomeScreen;
