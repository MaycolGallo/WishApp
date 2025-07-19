import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Controller, Control } from "react-hook-form";
import BottomSheet, {
  BottomSheetView,
  useBottomSheet,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Text from "./ui/text-ui";

interface AddCategoryInputProps {
  control: Control<any>;
  handleCreateCategory: () => void;
}

const AddCategoryInput: React.FC<AddCategoryInputProps> = ({
  control,
  handleCreateCategory,
}) => {
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  // const { expand } = useBottomSheet();
  const snapPoints = React.useMemo(() => ["50%"], []);

  return (
    <GestureHandlerRootView>
      <View className="flex-row mb-4">
        <Text className="mb-2 text-lg font-semibold text-gray-700">
          Add New Category
        </Text>

        <TouchableOpacity
          className="ml-2"
          onPress={() => bottomSheetRef.current?.expand()}
          activeOpacity={0.5}
        >
          <Text className="text-blue-500">+</Text>
        </TouchableOpacity>

        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          // onChange={handleSheetChanges}
        >
          <BottomSheetView className="flex-1">
            <Controller
              control={control}
              name="newCategoryName"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="flex-1 p-3 text-base bg-white border border-gray-300 rounded-l-lg"
                  placeholder="e.g., Home Goods"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            <TouchableOpacity
              className="justify-center p-3 bg-green-500 rounded-r-lg"
              onPress={handleCreateCategory}
            >
              <Text className="font-bold text-white">Add</Text>
            </TouchableOpacity>
          </BottomSheetView>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
};

export default AddCategoryInput;
