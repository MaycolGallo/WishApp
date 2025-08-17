import React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import * as schema from '../../../db/schema';
import Text from '../ui/text-ui';
import Animated, { 
  FadeInDown, 
  FadeOutUp, 
  LinearTransition
} from 'react-native-reanimated';

interface WishlistGridProps {
  wishlists: schema.Wishlist[];
}

const WishlistGrid: React.FC<WishlistGridProps> = ({ wishlists }) => {
  const router = useRouter();

  const handleWishlistPress = (wishlistId: number) => {
    router.push({ pathname: '/wishlist-detail', params: { id: wishlistId } });
  };

  const renderItem = ({ item, index }: { item: schema.Wishlist; index: number }) => {
    return (
      <Animated.View
        entering={FadeInDown.delay(index * 100).duration(400).springify()}
        exiting={FadeOutUp.duration(200)}
        layout={LinearTransition.springify()}
        style={{ flex: 1, margin: 8 }}
      >
        <TouchableOpacity
          onPress={() => handleWishlistPress(item.id)}
          activeOpacity={0.8}
        >
          <View className="overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 rounded-lg shadow">
            <Image
              source={{ uri: item.imageUrl! }}
              style={{ width: '100%', height: 120 }}
              contentFit="cover"
            />
            <View className="p-4">
              <Text variant="h4">{item.name}</Text>
              <Text weight="semiBold" className="mt-1 text-neutral-500">
                Total: ${item.totalPrice}
              </Text>
              <Text className="mt-1 text-sm text-gray-400">
                Created: {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <FlatList
      data={wishlists}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      ListEmptyComponent={
        <Animated.View 
          entering={FadeInDown.duration(400)}
          style={{ alignItems: 'center', marginTop: 40 }}
        >
          <Text>No wishlists found.</Text>
        </Animated.View>
      }
      numColumns={2}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
    />
  );
};

export default WishlistGrid;