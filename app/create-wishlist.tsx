import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import Text from "./components/ui/text-ui";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as schema from "../db/schema";
import { useSQLiteContext } from "expo-sqlite";
import { Input } from "./components/ui/input";
import CategorySelector from "./components/CategorySelector";
import AddCategoryInput from "./components/AddCategoryInput";
import ProductForm from "./components/ProductForm";
import * as FileSystem from "expo-file-system";
import "../global.css";
import { db } from "~/lib/db";
import { useBottomSheet, useBottomSheetModal } from "@gorhom/bottom-sheet";

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

  // const db = useSQLiteContext();
  // const expoDB = drizzle(db, { schema });
  const router = useRouter();
  const { dismiss } = useBottomSheetModal();

  const [categories, setCategories] = useState<schema.Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const fetchCategories = useCallback(async () => {
    try {
      const allCategories = await db.select().from(schema.categories);
      setCategories(allCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      alert("Failed to fetch categories.");
    }
  }, [db]);

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
      await db.insert(schema.categories).values({ name: newCategoryName });
      setValue("newCategoryName", "");
      fetchCategories(); // Refetch categories to update the list
      dismiss();
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
      if (data.imageUrl && FileSystem.documentDirectory) {
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
      const [newProduct] = await db
        .insert(schema.wishlists)
        .values({
          name: data.name,
          totalPrice: data.totalPrice,
          imageUrl: localUri,
          url: data.url,
          description: data.description,
          createdAt: new Date().toISOString(),
          completed: 0,
        })
        .returning();

      console.log("newProduct", newProduct);

      // 2. Link product to selected categories
      if (newProduct && selectedCategories.length > 0) {
        const productCategoryValues = selectedCategories.map((catId) => ({
          wishlistId: newProduct.id,
          categoryId: catId,
        }));
        await db
          .insert(schema.wishlist_categories)
          .values(productCategoryValues);
      }

      reset();
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product.");
    }
  };

  return (
    <View className="flex-1 bg-white dark:bg-neutral-900">
      <ScrollView className="flex-1 p-4">
        {/* Product Form Fields */}
        <ProductForm control={control} errors={errors} />

        <AddCategoryInput
          categories={categories}
          selectedCategories={selectedCategories}
          toggleCategory={toggleCategory}
          control={control}
          handleCreateCategory={handleCreateCategory}
        />
      </ScrollView>
      <KeyboardAvoidingView
        style={{ marginBottom: insets.bottom }}
        behavior="height"
      >
        <TouchableOpacity
          className="p-4 bg-blue-500 rounded-xl "
          onPress={handleSubmit(handleCreate)}
        >
          <Text weight="bold" variant="h4" className="text-center text-white ">
            Create Wishlist
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

export default CreateWishlistScreen;
