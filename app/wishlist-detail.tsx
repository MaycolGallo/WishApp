import React, { useRef, useCallback, useLayoutEffect } from "react";
import {
  View,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  Linking,
} from "react-native";
import Text from "./components/ui/text-ui";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
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
import { deleteAsync } from "expo-file-system";

const WishlistDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  const { isDarkColorScheme } = useColorScheme();

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
          <FontAwesome
            name="pencil"
            color={isDarkColorScheme ? "white" : "black"}
            size={16}
          />
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
        <RenderItem db={db} item={wishlist} />
      </SafeAreaView>
      <EditWishlistModal
        ref={bottomSheetRef}
        wishlist={wishlist}
        onClose={handleCloseModal}
      />
    </>
  );
};

const RenderItem = ({ item }: { item: schema.Wishlist; db: typeof db }) => {
  if (!item) {
    return <Text>Loading...</Text>;
  }

  // const router = useRouter();
  const navigation = useNavigation();

  const deleteWishlist = useCallback(() => {
    Alert.alert(
      "Delete Wishlist",
      "Are you sure you want to delete this wishlist?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: async () => {
            await db
              .delete(schema.wishlists)
              .where(eq(schema.wishlists.id, item.id));

            if (item.imageUrl) await deleteAsync(item.imageUrl);
            router.replace("/(tabs)");
          },
          style: "destructive",
        },
      ]
    );
  }, [item, navigation]);

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
        className="w-full p-6"
      >
        <View className="gap-3">
          <View className="flex-row items-center justify-start gap-3">
            {item.available ? (
              <Text className="w-32 px-3 py-1 text-center text-green-500 bg-green-100 border border-green-600 rounded-full dark:bg-green-950 dark:text-green-500 dark:border-green-800">
                <FontAwesome name="check" size={16} />
                Available
              </Text>
            ) : (
              <Text className="w-40 px-3 py-1 text-center text-red-500 bg-red-100 border border-red-600 rounded-full dark:bg-red-950 dark:text-red-500 dark:border-red-800">
                Not Available
              </Text>
            )}
            <View className="flex-row items-center gap-2 px-4 py-2 border rounded-full border-sky-600 dark:border-sky-800 bg-sky-100 dark:bg-sky-950">
              <FontAwesome name="calendar" color={"#0ea5e9"} size={14} />
              <Text
                variant="caption"
                className="flex items-center dark:text-sky-500 text-sky-600"
              >
                Agregado el {new Date(item?.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
          <Text weight="bold" variant="h2" className="my-4">
            {item?.name}
          </Text>
        </View>

        <View className="items-center justify-between border border-dashed border-neutral-400 dark:border-neutral-500 bg-neutral-200 dark:bg-neutral-600 rounded-xl">
          <Text weight="bold" variant="h1" className="mt-4 text-neutral-500">
            ${item?.totalPrice}
          </Text>
          <Text className="p-5">{item?.description}</Text>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 w-full gap-2 p-4">
        <TouchableOpacity
          onPress={() => Linking.openURL(item?.url!)}
          className="flex-row items-center justify-between px-4 py-6 bg-blue-300 border border-blue-200 dark:border-blue-800 rounded-2xl dark:bg-blue-950"
        >
          <View className="flex-row items-center justify-center flex-1">
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
          onPress={deleteWishlist}
          className="flex-row items-center justify-between px-4 py-6 bg-red-300 border border-red-200 dark:border-red-800 rounded-2xl dark:bg-red-950"
        >
          <View className="flex-row items-center justify-center flex-1">
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
