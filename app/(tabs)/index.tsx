import React, { useState, useLayoutEffect, useCallback, useMemo } from "react";
import {
  View,
} from "react-native";
import { useNavigation } from "expo-router";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import * as schema from "../../db/schema";
import { useSQLiteContext } from "expo-sqlite";
import Text from "../components/ui/text-ui";
import { drizzle } from "drizzle-orm/expo-sqlite";
import CategoryPills from "../components/wishlist/CategoryPills";
import WishlistGrid from "../components/wishlist/WishlistGrid";
import CreateWishlistButton from "../components/wishlist/CreateWishlistButton";

const HomeScreen = () => {
  const db = useSQLiteContext();
  const expoDB = useMemo(() => drizzle(db, { schema }), [db]);
  const navigation = useNavigation();

  const { data: allWishlists } = useLiveQuery(
    expoDB.query.wishlists.findMany()
  );
  const { data: categories } = useLiveQuery(expoDB.query.categories.findMany());

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [filteredWishlists, setFilteredWishlists] = useState(allWishlists);

  const total = useMemo(() => {
    return filteredWishlists.reduce((acc, item) => acc + item.totalPrice, 0);
  }, [filteredWishlists]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text className="text-lg font-bold text-white">
          Total: ${total.toFixed(2)}
        </Text>
      ),
    });
  }, [navigation, total]);

  const handleCategoryPress = async (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    if (categoryId === null) {
      setFilteredWishlists(allWishlists);
    } else {
      const wishlists = await expoDB.query.wishlists.findMany({
        with: {
          products: {
            with: {
              product: {
                with: {
                  categories: {
                    where: (categories, { eq }) => eq(categories.categoryId, categoryId),
                  },
                },
              },
            },
          },
        },
      });
      setFilteredWishlists(wishlists.filter(w => w.products.length > 0));
    }
  };

  return (
    <View className="flex-1 p-4 bg-gray-100 dark:bg-neutral-900 dark:text-white">
      <CategoryPills categories={categories} selectedCategory={selectedCategory} onCategoryPress={handleCategoryPress} />
      <WishlistGrid wishlists={filteredWishlists} />
      <CreateWishlistButton />
    </View>
  );
};

export default HomeScreen;
