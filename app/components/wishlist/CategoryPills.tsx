import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import Text from '../ui/text-ui';
import { Category } from '~/db/schema';

interface CategoryPillsProps {
  categories: Category[];
  selectedCategory: number | null;
  onCategoryPress: (categoryId: number | null) => void;
}

const CategoryPills: React.FC<CategoryPillsProps> = ({ categories, selectedCategory, onCategoryPress }) => {
  return (
    <View style={{ flexGrow: 0 }} className="mb-4">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          onPress={() => onCategoryPress(null)}
          className={`px-4 py-2 mr-2 rounded-full ${
            selectedCategory === null ? 'bg-blue-500' : 'bg-gray-300'
          }`}
        >
          <Text weight='medium' className={`${selectedCategory === null ? 'text-white' : 'text-black'}`}>All</Text>
        </TouchableOpacity>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => onCategoryPress(category.id)}
            className={`px-4 py-2 mr-2 rounded-full ${
              selectedCategory === category.id ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          >
            <Text weight='medium' className={`${selectedCategory === category.id ? 'text-white' : 'text-black'}`}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default CategoryPills;