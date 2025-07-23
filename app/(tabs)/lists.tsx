import React from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { db } from "../../lib/db";
import * as schema from "../../db/schema";
import Text from "../components/ui/text-ui";
import { Button } from "../../components/ui/button";
import { desc } from "drizzle-orm";

const ListsScreen = () => {
  const router = useRouter();
  const { data: lists } = useLiveQuery(
    db.select().from(schema.lists).orderBy(desc(schema.lists.createdAt))
  );

  const renderItem = ({ item }: { item: schema.List }) => (
    <TouchableOpacity
      className="m-2 p-4 bg-white dark:bg-neutral-700 rounded-lg shadow"
      onPress={() => router.push(`/list-detail?id=${item.id}` as any)}
    >
      <Text weight="bold" className="text-lg">
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 p-4 bg-neutral-100 dark:bg-neutral-800">
      <Button onPress={() => router.push("/create-list")} className="mb-4">
        <Text>Create New List</Text>
      </Button>
      <FlatList
        data={lists}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        ListEmptyComponent={
          <Text className="text-center">No lists created yet.</Text>
        }
      />
    </View>
  );
};

export default ListsScreen;
