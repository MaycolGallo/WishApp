import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { db } from '../../lib/db';
import { products, wishlist_products } from '../../db/schema';
import { eq, inArray } from 'drizzle-orm';

const AddProductScreen = () => {
  const { id: wishlistId } = useLocalSearchParams();
  const [allProducts, setAllProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await db.select().from(products);
        setAllProducts(result);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const toggleProductSelection = (productId) => {
    const newSelection = new Set(selectedProducts);
    if (newSelection.has(productId)) {
      newSelection.delete(productId);
    } else {
      newSelection.add(productId);
    }
    setSelectedProducts(newSelection);
  };

  const handleSaveChanges = async () => {
    if (selectedProducts.size === 0) {
      router.back();
      return;
    }

    try {
      const valuesToInsert = Array.from(selectedProducts).map(productId => ({
        wishlistId: parseInt(wishlistId as string, 10),
        productId: productId,
      }));

      await db.insert(wishlist_products).values(valuesToInsert);
      
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace(`/(tabs)/wishlist-detail?id=${wishlistId}`);
      }
    } catch (error) {
      console.error('Error adding products to wishlist:', error);
      alert('Failed to add products.');
    }
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedProducts.has(item.id);
    return (
      <TouchableOpacity onPress={() => toggleProductSelection(item.id)}>
        <View className={`flex-row items-center p-3 mb-3 bg-white rounded-lg shadow ${isSelected ? 'border-2 border-blue-500' : ''}`}>
          <Image source={{ uri: item.imageUrl }} className="w-16 h-16 rounded" />
          <View className="ml-3">
            <Text className="text-base font-bold">{item.nombre}</Text>
            <Text className="text-sm text-gray-600">${item.price}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 p-4 bg-gray-100">
      <Text className="text-2xl font-bold mb-4">Add Products</Text>
      <FlatList
        data={allProducts}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={<Text>No products available.</Text>}
      />
      <TouchableOpacity
        className="bg-blue-500 rounded-lg p-4 mt-4"
        onPress={handleSaveChanges}
      >
        <Text className="text-white text-center font-bold text-lg">Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddProductScreen;
