import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Controller, Control } from "react-hook-form";

interface AddCategoryInputProps {
  control: Control<any>;
  handleCreateCategory: () => void;
}

const AddCategoryInput: React.FC<AddCategoryInputProps> = ({ control, handleCreateCategory }) => (
  <View className="flex-row mb-4">
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
  </View>
);

export default AddCategoryInput;
