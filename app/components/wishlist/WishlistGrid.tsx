import React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import * as schema from '../../../db/schema';
import Text from '../ui/text-ui';

interface WishlistGridProps {
  wishlists: schema.Wishlist[];
}

const WishlistGrid: React.FC<WishlistGridProps> = ({ wishlists }) => {
  const router = useRouter();

  const handleWishlistPress = (wishlistId: number) => {
    router.push({ pathname: '/wishlist-detail', params: { id: wishlistId } });
  };

  const renderItem = ({ item }: { item: schema.Wishlist }) => {
    return (
      <TouchableOpacity
        onPress={() => handleWishlistPress(item.id)}
        className="flex-1 m-2"
      >
        <View className="overflow-hidden bg-white rounded-lg shadow">
          <Image
            source={{ uri: item.imageUrl! }}
            style={{ width: '100%', height: 120 }}
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
    <FlatList
      data={wishlists}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      ListEmptyComponent={<Text>No wishlists found.</Text>}
      numColumns={2}
    />
  );
};

export default WishlistGrid;