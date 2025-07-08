import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { drizzle } from "drizzle-orm/expo-sqlite";
// import { db } from '../../lib/db';
import * as schema from "../../db/schema";
import { useSQLiteContext } from "expo-sqlite";
import { Input } from "../components/ui/input";
import * as FileSystem from "expo-file-system";
import "../../global.css";

const CreateWishlistScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      totalPrice: 0,
      imageUrl: "",
      url: "",
    },
  });

  const db = useSQLiteContext();
  const expoDB = drizzle(db, { schema });
  const router = useRouter();

  const [categories, setCategories] = useState<schema.Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");

  const fetchCategories = async () => {
    const allCategories = await expoDB.select().from(schema.categories);
    setCategories(allCategories);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      alert("Please enter a category name.");
      return;
    }
    try {
      await expoDB.insert(schema.categories).values({ name: newCategoryName });
      setNewCategoryName("");
      fetchCategories(); // Refetch categories to update the list
    } catch (error) {
      console.error("Error creating category:", error);
      alert("Failed to create category.");
    }
  };

  const toggleCategory = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  type FormData = {
    name: string;
    description: string;
    totalPrice: number;
    imageUrl: string;
    url: string;
  };

  const handleCreate = async (data: FormData): Promise<void> => {
    try {
      let localUri = "";
      if (data.imageUrl) {
        const fileUri =
          FileSystem.documentDirectory + data.imageUrl.split("/").pop();
        const downloadResult = await FileSystem.downloadAsync(
          data.imageUrl,
          fileUri
        );
        if (downloadResult.status === 200) {
          localUri = downloadResult.uri;
        } else {
          throw new Error("Failed to download image.");
        }
      }

      // 1. Create the product
      const [newProduct] = await expoDB
        .insert(schema.products)
        .values({
          nombre: data.name,
          price: data.totalPrice,
          imageUrl: localUri,
        })
        .returning();

      // 2. Link product to selected categories
      if (newProduct && selectedCategories.length > 0) {
        const productCategoryValues = selectedCategories.map((catId) => ({
          productId: newProduct.id,
          categoryId: catId,
        }));
        await expoDB
          .insert(schema.product_categories)
          .values(productCategoryValues);
      }

      if (router.canGoBack()) {
        router.back();
      } else {
        router.push("/(tabs)/index");
      }
      reset();
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product.");
    }
  };

  return (
    <ScrollView className="flex-1 p-4 bg-gray-100">
      <Text className="text-lg font-semibold mb-2 text-gray-700">
        Product Name
      </Text>
      <Controller
        control={control}
        rules={{ required: "Please enter a name for the product." }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className="bg-white border border-gray-300 rounded-lg p-3 mb-4 text-base"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="e.g., Awesome Laptop"
          />
        )}
        name="name"
      />
      {errors.name && (
        <Text className="text-red-500 mb-4">{errors.name.message}</Text>
      )}

      <Text className="text-lg font-semibold mb-2 text-gray-700">Amount</Text>
      <Controller
        control={control}
        rules={{ required: "Please enter an amount." }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className="bg-white border border-gray-300 rounded-lg p-3 mb-4 text-base"
            onBlur={onBlur}
            onChangeText={(text) => onChange(parseInt(text) || 0)}
            value={value.toString()}
            placeholder="e.g., 1200"
            keyboardType="numeric"
          />
        )}
        name="totalPrice"
      />
      {errors.totalPrice && (
        <Text className="text-red-500 mb-4">{errors.totalPrice.message}</Text>
      )}

      <Text className="text-lg font-semibold mb-2 text-gray-700">
        Description (Optional)
      </Text>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            className="bg-white border border-gray-300 rounded-lg p-3 mb-6 text-base"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="e.g., A really cool product"
          />
        )}
        name="description"
      />

      <Text className="text-lg font-semibold mb-2 text-gray-700">
        Image URL (Optional)
      </Text>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            className="bg-white border border-gray-300 rounded-lg p-3 mb-6 text-base"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="e.g., https://example.com/image.png"
          />
        )}
        name="imageUrl"
      />

      <Text className="text-lg font-semibold mb-2 text-gray-700">
        Product URL (Optional)
      </Text>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            className="bg-white border border-gray-300 rounded-lg p-3 mb-6 text-base"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="e.g., https://example.com/product"
          />
        )}
        name="url"
      />

      <Text className="text-lg font-semibold mb-2 text-gray-700">
        Categories
      </Text>
      <View className="flex-row flex-wrap mb-4">
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            onPress={() => toggleCategory(cat.id)}
            className={`p-2 m-1 rounded-lg border ${
              selectedCategories.includes(cat.id)
                ? "bg-blue-500 border-blue-500"
                : "bg-white border-gray-300"
            }`}
          >
            <Text
              className={
                selectedCategories.includes(cat.id)
                  ? "text-white"
                  : "text-gray-700"
              }
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text className="text-lg font-semibold mb-2 text-gray-700">
        Add New Category
      </Text>
      <View className="flex-row mb-4">
        <TextInput
          className="flex-1 bg-white border border-gray-300 rounded-l-lg p-3 text-base"
          placeholder="e.g., Home Goods"
          value={newCategoryName}
          onChangeText={setNewCategoryName}
        />
        <TouchableOpacity
          className="bg-green-500 rounded-r-lg p-3 justify-center"
          onPress={handleCreateCategory}
        >
          <Text className="text-white font-bold">Add</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-lg font-semibold mb-2 text-gray-700">
        Select Categories
      </Text>
      <View className="flex-row flex-wrap mb-4">
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            onPress={() => toggleCategory(cat.id)}
            className={`p-2 m-1 rounded-lg border ${
              selectedCategories.includes(cat.id)
                ? "bg-blue-500 border-blue-500"
                : "bg-white border-gray-300"
            }`}
          >
            <Text
              className={
                selectedCategories.includes(cat.id)
                  ? "text-white"
                  : "text-gray-700"
              }
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        className="bg-blue-500 rounded-lg p-4"
        onPress={handleSubmit(handleCreate)}
      >
        <Text className="text-white text-center font-bold text-lg">
          Create Wishlist
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CreateWishlistScreen;
