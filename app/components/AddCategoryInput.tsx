import React, { useCallback } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Controller, Control } from "react-hook-form";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetTextInput,
  BottomSheetView,
  useBottomSheet,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Text from "./ui/text-ui";
import CategorySelector from "./CategorySelector";
import { Category } from "~/db/schema";
import FontAwesome from "@expo/vector-icons/FontAwesome";

interface AddCategoryInputProps {
  control: Control<any>;
  handleCreateCategory: () => void;
  categories: Category[];
  selectedCategories: number[];
  toggleCategory: (categoryId: number) => void;
}

const AddCategoryInput: React.FC<AddCategoryInputProps> = ({
  control,
  handleCreateCategory,
  categories,
  selectedCategories,
  toggleCategory,
}) => {
  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);
  // const { expand } = useBottomSheet();
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const snapPoints = React.useMemo(() => ["50%"], []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  return (
    // <GestureHandlerRootView>
    <View className="mb-4">
      <View className="flex-row items-center justify-between">
        <Text
          size={24}
          variant="h3"
          className="mb-2 text-gray-700 dark:text-white"
        >
          Categories
        </Text>

        <TouchableOpacity
          className="ml-2"
          onPress={handlePresentModalPress}
          activeOpacity={0.5}
        >
          <Text className="text-red-500">
            <FontAwesome name="plus" size={24} />
          </Text>
        </TouchableOpacity>
      </View>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: "#fff" }}
        // handleIndicatorStyle={{ backgroundColor: "red" }}
        // onChange={handleSheetChanges}
      >
        <BottomSheetView className="flex-1 p-4 dark:bg-neutral-900">
          <Text
            variant="subtitle"
            className="mb-2 text-gray-700 dark:text-white"
          >
            Nombre
          </Text>
          <Controller
            control={control}
            name="newCategoryName"
            rules={{ required: "Please enter a name for the category." }}
            render={({ field: { onChange, onBlur, value } }) => (
              <BottomSheetTextInput
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholderClassName="dark:text-gray-100"
                className="p-3 mb-4 bg-white border border-gray-300 rounded-lg dark:text-white dark:bg-neutral-800 dark:border-gray-700"
                placeholder="Category Name"
              />
            )}
          />
          <TouchableOpacity
            className="justify-center p-3 my-4 bg-primary rounded-xl"
            onPress={handleCreateCategory}
          >
            <Text variant="subtitle" className="text-center text-white ">
              Crear
            </Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetModal>

      <CategorySelector
        categories={categories}
        selectedCategories={selectedCategories}
        toggleCategory={toggleCategory}
      />
    </View>
    // </GestureHandlerRootView>
  );
};

export default AddCategoryInput;
