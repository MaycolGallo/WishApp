import React from "react";
import { View, TouchableOpacity } from "react-native";
import Text from './ui/text-ui';

interface Category {
  id: number;
  name: string;
}

interface CategorySelectorProps {
  categories: Category[];
  selectedCategories: number[];
  toggleCategory: (categoryId: number) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategories,
  toggleCategory,
}) => (
  <View className="flex-grow flex-wrap mb-4">
    {categories.length > 0 ? (
      <>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            onPress={() => toggleCategory(cat.id)}
            className={`p-2 m-1 rounded-lg border ${
              selectedCategories.includes(cat.id)
                ? "bg-blue-500 border-blue-500"
                : "bg-white border-gray-300"
            }`}
          >
            <Text
              className={
                selectedCategories.includes(cat.id)
                  ? "text-white"
                  : "text-gray-700"
              }
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </>
    ) : (
      <Text weight="semiBold" variant="h4" className="text-neutal-900 text-muted-foreground">No categories available</Text>
    )}
  </View>
);

export default CategorySelector;
