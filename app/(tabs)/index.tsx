import React, { useState, useLayoutEffect, useMemo } from "react";
import { View } from "react-native";
import { useNavigation } from "expo-router";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import * as schema from "../../db/schema";
import CategoryPills from "../components/wishlist/CategoryPills";
import WishlistGrid from "../components/wishlist/WishlistGrid";
import CreateWishlistButton from "../components/wishlist/CreateWishlistButton";
import { db } from "~/lib/db";
import { eq } from "drizzle-orm";
import { AnimatedCounter } from '../components/ui/animated-counter-up';
import Animated, {
  LinearTransition,
  SlideInRight,
  SlideOutLeft
} from "react-native-reanimated";

const HomeScreen = () => {
  // const db = useSQLiteContext();
  // const expoDB = drizzle(db, { schema });
  const navigation = useNavigation();

  const { data: allWishlists } = useLiveQuery(
    db.select().from(schema.wishlists)
  );

  const { data: categories } = useLiveQuery(
    db.select().from(schema.categories)
  );

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  // const [filteredWishlists, setFilteredWishlists] = useState(allWishlists);
  const [categoryFilteredWishlists, setCategoryFilteredWishlists] =
    useState<schema.Wishlist[] | null>(null);


  const filteredWishlists = useMemo(
    () => (selectedCategory === null ? (allWishlists || []) : (categoryFilteredWishlists || [])),
    [selectedCategory, allWishlists, categoryFilteredWishlists]
  );

  const total = useMemo(() => {
    return filteredWishlists.reduce((acc, item) => acc + item.totalPrice, 0);
  }, [filteredWishlists]);

  useLayoutEffect(() => {
    navigation.setOptions({

      headerTitle: () => (
        <AnimatedCounter
          value={total}
          className=" dark:text-white"
          style="roll" // or "roll" for classic counter effect
        />
      ),
    });
  }, [navigation, total]);

  const handleCategoryPress = async (categoryId: number | null) => {
    setSelectedCategory(categoryId);

    if (categoryId === null) {
      setCategoryFilteredWishlists(null);
    } else {
      const wishlists = db
        .select()
        .from(schema.wishlist_categories)
        .leftJoin(
          schema.wishlists,
          eq(schema.wishlists.id, schema.wishlist_categories.wishlistId)
        )
        .leftJoin(
          schema.categories,
          eq(schema.categories.id, schema.wishlist_categories.categoryId)
        )
        .where(eq(schema.categories.id, categoryId))
        .all();

      setCategoryFilteredWishlists(
        wishlists.map((wishlist) => wishlist?.wishlists ?? []).flat()
      );
    }
  };

  return (
    <View className="flex-1 p-4 bg-gray-100 dark:bg-neutral-900 dark:text-white">
      <CategoryPills
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryPress={handleCategoryPress}
      />
      <Animated.View
        key={selectedCategory} // Force re-render on category change
        entering={SlideInRight.duration(300).springify()}
        exiting={SlideOutLeft.duration(200)}
        layout={LinearTransition.springify()}
        style={{ flex: 1 }}
      >
        <WishlistGrid wishlists={filteredWishlists} />
      </Animated.View>
      <CreateWishlistButton />
    </View>
  );
};

export default HomeScreen;
