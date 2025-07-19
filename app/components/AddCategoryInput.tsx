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
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
    ),
    []
  );

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  return (
    // <GestureHandlerRootView>
    <View className="mb-4">
      <View className="flex-row  items-center justify-between">
        <Text
          size={24}
          variant="h3"
          className="mb-2 dark:text-white text-gray-700"
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
        // onChange={handleSheetChanges}
      >
        <BottomSheetView className="flex-1 p-4">
          <Text variant="subtitle" className="mb-2 dark:text-white text-gray-700">
            Nombre
          </Text>
          <BottomSheetTextInput
            className="p-3 mb-4 bg-white border border-gray-300 rounded-lg"
            placeholder="Category Name"
          />
          <TouchableOpacity
            className="justify-center p-3 m-4 bg-green-500 rounded-r-lg"
            onPress={handleCreateCategory}
          >
            <Text className="font-bold text-white">Add</Text>
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
