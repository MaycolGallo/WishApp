import React, { useRef, useCallback } from "react";
import {
  View,
  Alert,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import Text from "./components/ui/text-ui";
import { useLocalSearchParams } from "expo-router";
import { db } from "../lib/db";
import * as schema from "../db/schema";
import { eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Image } from "expo-image";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import EditWishlistModal from "./components/wishlist/EditWishlistModal";
import { Pencil } from "lucide-react-native";
import { Button } from "./components/ui/button";

const WishlistDetailScreen = () => {
  const { id } = useLocalSearchParams();

  const { data: wishlist } = useLiveQuery(
    db.query.wishlists.findFirst({
      where: eq(schema.wishlists.id, parseInt(id as string, 10)),
    })
  );

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const handleOpenModal = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const handleCloseModal = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  if (!wishlist) {
    return <Text>Loading...</Text>;
  }

  return (
    <>
      <SafeAreaView className="flex-1 bg-neutral-100 dark:bg-neutral-800">
        <RenderItem item={wishlist} onEdit={handleOpenModal} />
      </SafeAreaView>
      <EditWishlistModal
        ref={bottomSheetRef}
        wishlist={wishlist}
        onClose={handleCloseModal}
      />
    </>
  );
};

const RenderItem = ({
  item,
  onEdit,
}: {
  item: schema.Wishlist;
  onEdit: () => void;
}) => {
  if (!item) {
    return <Text>Loading...</Text>;
  }

  return (
    <View className="items-center flex-1">
      <Image
        source={{ uri: item?.imageUrl! }}
        style={{ width: "100%", height: 300, borderRadius: 10 }}
        contentFit="fill"
        transition={500}
      />

      <View className="absolute top-4 right-4">
        <Button
          onPress={onEdit}
          className="bg-neutral-800/50 rounded-full p-2"
        >
          <Pencil className="text-white" size={24} />
        </Button>
      </View>

      <View className="p-4 w-full">
        <View className="flex-row justify-between items-center">
          <Text weight="bold" variant="h2" className="mb-4 flex-1">
            {item?.name}
          </Text>
          {item.available ? (
            <Text className="text-green-500">Available</Text>
          ) : (
            <Text className="text-red-500">Not Available</Text>
          )}
        </View>
        <Text weight="medium" variant="h3" className="mt-1 text-gray-500">
          ${item?.totalPrice}
        </Text>
        <Text className="mt-1">{item?.description}</Text>
      </View>
    </View>
  );
};

export default WishlistDetailScreen;
