import React, { useRef, useCallback, useLayoutEffect } from "react";
import {
  View,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  Linking,
} from "react-native";
import Text from "./components/ui/text-ui";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { db } from "../lib/db";
import * as schema from "../db/schema";
import { eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Image } from "expo-image";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import EditWishlistModal from "./components/wishlist/EditWishlistModal";
import { Pencil, Scroll } from "lucide-react-native";
import { Button } from "./components/ui/button";
import { FontAwesome } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { useColorScheme } from "~/lib/useColorScheme";

const WishlistDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  const {isDarkColorScheme} = useColorScheme()

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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleOpenModal}>
          <FontAwesome name="pencil" color={isDarkColorScheme ? "white" : "black"}  size={16} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, handleOpenModal]);

  if (!wishlist) {
    return <Text>Loading...</Text>;
  }

  return (
    <>
      <SafeAreaView className="flex-1 bg-neutral-100 dark:bg-neutral-800">
        <RenderItem item={wishlist} />
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
}: {
  item: schema.Wishlist;
}) => {
  if (!item) {
    return <Text>Loading...</Text>;
  }

  return (
    <View className="items-center flex-1">
      {/* <Image
        source={{ uri: item?.imageUrl! }}
        style={{ width: "100%", height: 300, borderRadius: 10 }}
        contentFit="fill"
        transition={500}
      /> */}

      <Image
        source={{ uri: item?.imageUrl! }}
        style={{
          width: "100%",
          height: undefined,
          aspectRatio: 4 / 3, // 4:3 ratio
        }}
        contentFit="cover" // Fills container, may crop
      />


      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 250 }}
        className="p-6 w-full"
      >
        <View className="gap-3">
          <View className="flex-row justify-start gap-3 items-center">
            {item.available ? (
              <Text className="text-green-500 bg-green-100  dark:bg-green-950 dark:text-green-500 border border-green-600 dark:border-green-800 py-1 px-3 rounded-full w-32 text-center">
                <FontAwesome name="check" size={16} />
                Available
              </Text>
            ) : (
              <Text className="text-red-500 bg-red-100  dark:bg-red-950 dark:text-red-500 border border-red-600 dark:border-red-800 py-1 px-3 rounded-full w-40 text-center">
                Not Available
              </Text>
            )}
            <View className="flex-row gap-2 px-4 py-2 border border-sky-600 dark:border-sky-800 rounded-full bg-sky-100 dark:bg-sky-950 items-center">
              <FontAwesome name="calendar" color={"#0ea5e9"} size={14} />
              <Text
                variant="caption"
                className=" flex dark:text-sky-500 text-sky-600 items-center "
              >
                Agregado el {new Date(item?.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
          <Text weight="bold" variant="h2" className="my-4">
            {item?.name}
          </Text>
        </View>
       
        <View className="border border-dashed border-neutral-400 dark:border-neutral-500 items-center bg-neutral-200 dark:bg-neutral-600 rounded-xl justify-between">
          <Text weight="bold" variant="h1" className="mt-4 text-neutral-500">
            ${item?.totalPrice}
          </Text>
          <Text className="p-5">{item?.description}</Text>
        </View>
      </ScrollView>

      <View className="p-4 w-full gap-2 absolute bottom-0">
        <TouchableOpacity
          onPress={() => Linking.openURL(item?.url!)}
          className="flex-row bg-blue-300 border dark:border-blue-800 border-blue-200 py-6 px-4 rounded-2xl dark:bg-blue-950 justify-between items-center"
        >
          <View className="items-center flex-1 flex-row justify-center">
            <FontAwesome
              name="globe"
              color={"#fff"}
              style={{ marginRight: 10 }}
              size={18}
            />
            <Text
              weight="bold"
              variant="h3"
              className="text-blue-950 dark:text-blue-500"
            >
              Ver en el sitio
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => console.log("Delete")}
          className="flex-row bg-red-300 border dark:border-red-800 border-red-200 py-6 px-4 rounded-2xl dark:bg-red-950 justify-between items-center"
        >
          <View className="items-center flex-1 flex-row justify-center">
            <FontAwesome
              name="trash"
              color={"#fff"}
              style={{ marginRight: 10 }}
              size={18}
            />
            <Text
              weight="bold"
              variant="h3"
              className="text-red-950 dark:text-red-500"
            >
              Eliminar
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WishlistDetailScreen;