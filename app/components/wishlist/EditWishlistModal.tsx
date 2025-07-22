
import React, { useMemo, useCallback, forwardRef } from "react";
import { View, StyleSheet, Switch } from "react-native";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetView
} from "@gorhom/bottom-sheet";
import { useForm, Controller } from "react-hook-form";
import { db } from "../../../lib/db";
import * as schema from "../../../db/schema";
import { eq } from "drizzle-orm";
import Text from "../ui/text-ui";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface EditWishlistModalProps {
  wishlist: schema.Wishlist;
  onClose: () => void;
}

type Ref = BottomSheetModal;

const EditWishlistModal = forwardRef<Ref, EditWishlistModalProps>(
  ({ wishlist, onClose }, ref) => {
    const snapPoints = useMemo(() => ["50%", "75%"], []);

    const { control, handleSubmit } = useForm({
      defaultValues: {
        name: wishlist.name,
        totalPrice: wishlist.totalPrice,
        description: wishlist.description || "",
        available: wishlist.available,
      },
    });

    const onSubmit = async (data: any) => {
      try {
        await db
          .update(schema.wishlists)
          .set({
            ...data,
            totalPrice: Number(data.totalPrice),
          })
          .where(eq(schema.wishlists.id, wishlist.id));
        onClose();
      } catch (error) {
        console.error("Error updating wishlist:", error);
      }
    };

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
        />
      ),
      []
    );

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose
        onDismiss={onClose}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ backgroundColor: "grey" }}
        backgroundStyle={{ backgroundColor: "#fff" }}
      >
        <BottomSheetView style={styles.contentContainer}>
          <Text variant="h2" className="mb-4">
            Edit Wishlist
          </Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Wishlist Name"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                className="mb-2"
              />
            )}
          />

          <Controller
            control={control}
            name="totalPrice"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Total Price"
                onBlur={onBlur}
                onChangeText={onChange}
                value={String(value)}
                keyboardType="numeric"
                className="mb-2"
              />
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Description"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                multiline
                className="mb-2"
              />
            )}
          />

          <View className="flex-row items-center justify-between my-4">
            <Text>Available</Text>
            <Controller
              control={control}
              name="available"
              render={({ field: { onChange, value } }) => (
                <Switch onValueChange={onChange} value={value} />
              )}
            />
          </View>

          <Button onPress={handleSubmit(onSubmit)} className="mt-4">
            <Text>Update Wishlist</Text>
          </Button>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 16,
  },
});

export default EditWishlistModal;
