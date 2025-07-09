import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as schema from "../db/schema";
import { useSQLiteContext } from "expo-sqlite";
import { Input } from "./components/ui/input";
import * as FileSystem from "expo-file-system";
import "../global.css";

const CreateWishlistScreen = () => {
  const insets = useSafeAreaInsets();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      totalPrice: 0,
      imageUrl: "",
      url: "",
      newCategoryName: "",
    },
  });

  const db = useSQLiteContext();
  const expoDB = drizzle(db, { schema });
  const router = useRouter();

  const [categories, setCategories] = useState<schema.Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const fetchCategories = useCallback(async () => {
    try {
      const allCategories = await expoDB.select().from(schema.categories);
      setCategories(allCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      alert("Failed to fetch categories.");
    }
  }, [expoDB]);

  useFocusEffect(
    useCallback(() => {
      fetchCategories();
    }, [fetchCategories])
  );

  const handleCreateCategory = async () => {
    const newCategoryName = getValues("newCategoryName");
    if (!newCategoryName.trim()) {
      alert("Please enter a category name.");
      return;
    }
    try {
      await expoDB.insert(schema.categories).values({ name: newCategoryName });
      setValue("newCategoryName", "");
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
        router.push("/(tabs)");
      }
      reset();
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F3F4F6" }}>
      <View
        style={{
          paddingTop: insets.top,
          paddingBottom: 12,
          paddingHorizontal: 16,
          backgroundColor: "white",
          borderBottomWidth: 1,
          borderBottomColor: "#E5E7EB",
        }}
      >
        <Text
          style={{ fontSize: 17, fontWeight: "600", textAlign: "center" }}
        >
          Create Wishlist
        </Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="mb-2 text-lg font-semibold text-gray-700">
          Product Name
        </Text>
        <Controller
          control={control}
          rules={{ required: "Please enter a name for the product." }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="p-3 mb-4 text-base bg-white border border-gray-300 rounded-lg"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="e.g., Awesome Laptop"
            />
          )}
          name="name"
        />
        {errors.name && (
          <Text className="mb-4 text-red-500">{errors.name.message}</Text>
        )}

        <Text className="mb-2 text-lg font-semibold text-gray-700">Amount</Text>
        <Controller
          control={control}
          rules={{ required: "Please enter an amount." }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="p-3 mb-4 text-base bg-white border border-gray-300 rounded-lg"
              onBlur={onBlur}
              onChangeText={(text) => onChange(parseInt(text))}
              value={value.toString()}
              placeholder="e.g., 1200"
              keyboardType="numeric"
            />
          )}
          name="totalPrice"
        />
        {errors.totalPrice && (
          <Text className="mb-4 text-red-500">{errors.totalPrice.message}</Text>
        )}

        <Text className="mb-2 text-lg font-semibold text-gray-700">
          Description (Optional)
        </Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              className="p-3 mb-6 text-base bg-white border border-gray-300 rounded-lg"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="e.g., A really cool product"
            />
          )}
          name="description"
        />

        <Text className="mb-2 text-lg font-semibold text-gray-700">
          Image URL (Optional)
        </Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              className="p-3 mb-6 text-base bg-white border border-gray-300 rounded-lg"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="e.g., https://example.com/image.png"
            />
          )}
          name="imageUrl"
        />

        <Text className="mb-2 text-lg font-semibold text-gray-700">
          Product URL (Optional)
        </Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              className="p-3 mb-6 text-base bg-white border border-gray-300 rounded-lg"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="e.g., https://example.com/product"
            />
          )}
          name="url"
        />

        <Text className="mb-2 text-lg font-semibold text-gray-700">
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

        <Text className="mb-2 text-lg font-semibold text-gray-700">
          Add New Category
        </Text>
        <View className="flex-row mb-4">
          <Controller
            control={control}
            name="newCategoryName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="flex-1 p-3 text-base bg-white border border-gray-300 rounded-l-lg"
                placeholder="e.g., Home Goods"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          <TouchableOpacity
            className="justify-center p-3 bg-green-500 rounded-r-lg"
            onPress={handleCreateCategory}
          >
            <Text className="font-bold text-white">Add</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="p-4 mb-24 bg-blue-500 rounded-lg"
          onPress={handleSubmit(handleCreate)}
        >
          <Text className="text-lg font-bold text-center text-white">
            Create Wishlist {JSON.stringify(db)}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default CreateWishlistScreen;
