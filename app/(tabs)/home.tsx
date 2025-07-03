import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { db } from '../../lib/db';
import { wishlists } from '../../db/schema';

const HomeScreen = () => {
  const [allWishlists, setAllWishlists] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchWishlists = async () => {
      try {
        const result = await db.select().from(wishlists);
        setAllWishlists(result);
      } catch (error) {
        console.error('Error fetching wishlists:', error);
      }
    };

    fetchWishlists();
  }, []);

  const handleWishlistPress = (wishlistId) => {
    router.push({ pathname: '/(tabs)/wishlist-detail', params: { id: wishlistId } });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleWishlistPress(item.id)}>
      <View className="p-4 mb-4 bg-white rounded-lg shadow">
        <Text className="text-lg font-bold">{item.name}</Text>
        <Text className="text-base text-gray-500 mt-1">Total: ${item.totalPrice}</Text>
        <Text className="text-sm text-gray-400 mt-1">Created: {new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 p-4 bg-gray-100">
      <Text className="text-2xl font-bold mb-4">All Wishlists</Text>
      <FlatList
        data={allWishlists}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={<Text>No wishlists found.</Text>}
      />
    </View>
  );
};

export default HomeScreen;
