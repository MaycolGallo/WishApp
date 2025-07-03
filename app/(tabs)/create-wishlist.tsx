import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { db } from '../../lib/db';
import { wishlists } from '../../db/schema';

const CreateWishlistScreen = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();

  const handleCreate = async () => {
    if (!name.trim()) {
      alert('Please enter a name for the wishlist.');
      return;
    }

    try {
      await db.insert(wishlists).values({
        name,
        description,
        createdAt: new Date().toISOString(),
        totalPrice: 0,
        completed: 0,
      });
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/(tabs)/home');
      }
    } catch (error) {
      console.error('Error creating wishlist:', error);
      alert('Failed to create wishlist.');
    }
  };

  return (
    <View className="flex-1 p-4 bg-gray-100">
      <Text className="text-lg font-semibold mb-2 text-gray-700">Wishlist Name</Text>
      <TextInput
        className="bg-white border border-gray-300 rounded-lg p-3 mb-4 text-base"
        value={name}
        onChangeText={setName}
        placeholder="e.g., Birthday Gifts"
      />
      <Text className="text-lg font-semibold mb-2 text-gray-700">Description (Optional)</Text>
      <TextInput
        className="bg-white border border-gray-300 rounded-lg p-3 mb-6 text-base"
        value={description}
        onChangeText={setDescription}
        placeholder="e.g., For my upcoming birthday"
      />
      <TouchableOpacity
        className="bg-blue-500 rounded-lg p-4"
        onPress={handleCreate}
      >
        <Text className="text-white text-center font-bold text-lg">Create Wishlist</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateWishlistScreen;
