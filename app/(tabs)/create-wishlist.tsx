import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { drizzle } from 'drizzle-orm/expo-sqlite';
// import { db } from '../../lib/db';
import * as schema from '../../db/schema';
import {useSQLiteContext} from 'expo-sqlite'

const CreateWishlistScreen = () => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      description: ''
    }
  });
  const db = useSQLiteContext()
  const expoDB = drizzle(db, {schema})
  const router = useRouter();

  const handleCreate = async (data) => {
    try {
      await expoDB.insert(schema.wishlists).values({
        name: data.name,
        description: data.description,
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
      <Controller
        control={control}
        rules={{ required: 'Please enter a name for the wishlist.' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className="bg-white border border-gray-300 rounded-lg p-3 mb-4 text-base"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="e.g., Birthday Gifts"
          />
        )}
        name="name"
      />
      {errors.name && <Text className="text-red-500 mb-4">{errors.name.message}</Text>}

      <Text className="text-lg font-semibold mb-2 text-gray-700">Description (Optional)</Text>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className="bg-white border border-gray-300 rounded-lg p-3 mb-6 text-base"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="e.g., For my upcoming birthday"
          />
        )}
        name="description"
      />
      
      <TouchableOpacity
        className="bg-blue-500 rounded-lg p-4"
        onPress={handleSubmit(handleCreate)}
      >
        <Text className="text-white text-center font-bold text-lg">Create Wishlist</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateWishlistScreen;