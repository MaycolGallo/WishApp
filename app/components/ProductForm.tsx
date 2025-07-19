import React from "react";
import { TextInput } from "react-native";
import { Controller, Control, FieldErrors } from "react-hook-form";
import { Input } from "../components/ui/input";
import  Text  from "../components/ui/text-ui";

interface ProductFormProps {
  control: Control<any>;
  errors: FieldErrors<any>;
}

const ProductForm: React.FC<ProductFormProps> = ({ control, errors }) => (
  <>
    <Text variant="subtitle" className="mb-2 dark:text-white text-gray-700">
      Product Name
    </Text>
    <Controller
      control={control}
      rules={{ required: "Please enter a name for the product." }}
      render={({ field: { onChange, onBlur, value } }) => (
        <Input
          className="p-3 mb-4 bg-white border border-gray-300 rounded-lg"
          onBlur={onBlur}
          onChangeText={onChange}
          value={value}
          placeholder="e.g., Awesome Laptop"
        />
      )}
      name="name"
    />
    {errors.name && (
      <Text className="mb-4 text-red-500">{errors.name.message.toString()}</Text>
    )}

    <Text variant="subtitle" className="mb-2 dark:text-white text-gray-700">Amount</Text>
    <Controller
      control={control}
      rules={{ required: "Please enter an amount." }}
      render={({ field: { onChange, onBlur, value } }) => (
        <Input
          className="p-3 mb-4  bg-white border border-gray-300"
          onBlur={onBlur}
          onChangeText={(text) => onChange(parseInt(text))}
          value={value.toString()}
          placeholder="e.g., 1200"
          keyboardType="numeric"
        />
      )}
      name="totalPrice"
    />
    {errors.totalPrice && (
      <Text className="mb-4 text-red-500">{errors.totalPrice.message?.toString()}</Text>
    )}

    <Text variant="subtitle" className="mb-2 dark:text-white text-gray-700">
      Description (Optional)
    </Text>
    <Controller
      control={control}
      render={({ field: { onChange, onBlur, value } }) => (
        <Input
          className="p-3 mb-6 bg-white border border-gray-300 rounded-lg"
          onBlur={onBlur}
          onChangeText={onChange}
          value={value}
          placeholder="e.g., A really cool product"
        />
      )}
      name="description"
    />

    <Text variant="subtitle" className="mb-2 dark:text-white text-gray-700">
      Image URL (Optional)
    </Text>
    <Controller
      control={control}
      render={({ field: { onChange, onBlur, value } }) => (
        <Input
          className="p-3 mb-6 text-base bg-white border border-gray-300 rounded-lg"
          onBlur={onBlur}
          onChangeText={onChange}
          value={value}
          placeholder="e.g., https://example.com/image.png"
        />
      )}
      name="imageUrl"
    />

    <Text variant="subtitle" className="mb-2 dark:text-white text-gray-700">
      Product URL (Optional)
    </Text>
    <Controller
      control={control}
      render={({ field: { onChange, onBlur, value } }) => (
        <Input
          className="p-3 mb-6 text-base bg-white border border-gray-300 rounded-lg"
          onBlur={onBlur}
          onChangeText={onChange}
          value={value}
          placeholder="e.g., https://example.com/product"
        />
      )}
      name="url"
    />
  </>
);

export default ProductForm;
