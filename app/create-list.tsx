import React, { useMemo } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { db } from "../lib/db";
import * as schema from "../db/schema";
import Text from "./components/ui/text-ui";
import { Button } from "./components/ui/button";
import { Image } from "expo-image";
import { useForm, Controller } from "react-hook-form";
import { Input } from "./components/ui/input";

type FormData = {
  listName: string;
  wishlistIds: number[];
};

const CreateListScreen = () => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      listName: "",
      wishlistIds: [],
    },
  });

  const selectedWishlistIds = watch("wishlistIds");

  const { data: allWishlists } = useLiveQuery(
    db.select().from(schema.wishlists)
  );

  const handleToggleWishlist = (id: number) => {
    const currentIds = watch("wishlistIds");
    const newIds = currentIds.includes(id)
      ? currentIds.filter((i) => i !== id)
      : [...currentIds, id];
    setValue("wishlistIds", newIds, { shouldValidate: true });
  };

  const totalPrice = useMemo(() => {
    if (!allWishlists) return 0;
    return allWishlists
      .filter((w) => selectedWishlistIds.includes(w.id))
      .reduce((acc, curr) => acc + curr.totalPrice, 0);
  }, [selectedWishlistIds, allWishlists]);

  const onSubmit = async (data: FormData) => {
    if (data.wishlistIds.length === 0) {
      Alert.alert("Error", "Please select at least one wishlist.");
      return;
    }

    try {
      await db.transaction(async (tx) => {
        const [newList] = await tx
          .insert(schema.lists)
          .values({ name: data.listName, createdAt: new Date().toISOString() })
          .returning();

        const listItems = data.wishlistIds.map((wishlistId) => ({
          listId: newList.id,
          wishlistId,
        }));

        await tx.insert(schema.list_wishlist_items).values(listItems);
      });

      Alert.alert("Success", "List created successfully!");
      router.back();
    } catch (error) {
      console.error("Error creating list:", error);
      Alert.alert("Error", "Failed to create list.");
    }
  };

  const renderWishlistItem = ({ item }: { item: schema.Wishlist }) => {
    const isSelected = selectedWishlistIds.includes(item.id);
    return (
      <TouchableOpacity
        onPress={() => handleToggleWishlist(item.id)}
        className={`m-1 p-2 rounded-lg border-2 ${
          isSelected
            ? "border-blue-500 bg-blue-100 dark:bg-blue-900"
            : "border-transparent bg-white dark:bg-neutral-700"
        }`}
        style={{ flex: 1 / 2 }}
      >
        <Image
          source={{ uri: item.imageUrl! }}
          style={{ width: "100%", height: 100, borderRadius: 8 }}
          contentFit="cover"
        />
        <Text variant="h4" className="mt-2">{item.name}</Text>
        <Text className="text-gray-500">${item.totalPrice}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-100 dark:bg-neutral-800">
      <View className="p-4 flex-1">
        <Text variant="h2" className="mb-4">
          Create a New List
        </Text>
        <Controller
          control={control}
          rules={{ required: "List name is required." }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Enter list name"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="listName"
        />
        {errors.listName && (
          <Text className="text-red-500 mt-1">{errors.listName.message}</Text>
        )}
        <Text variant="h3" className="my-4">
          Select Wishlists
        </Text>
        <FlatList
          data={allWishlists}
          renderItem={renderWishlistItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          extraData={selectedWishlistIds}
          contentContainerStyle={{ paddingBottom: 200 }}
        />
      </View>
      <View className="p-4 bg-white dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-700">
        <Text variant="h3" className="text-center">
          Total Price: ${totalPrice.toFixed(2)}
        </Text>
        <Button onPress={handleSubmit(onSubmit)} className="mt-4">
          <Text>Save List</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default CreateListScreen;
