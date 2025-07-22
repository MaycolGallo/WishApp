import React from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  interpolateColor,
  runOnJS
} from 'react-native-reanimated';

interface CategoryPillsProps {
  categories: Array<{ id: number; name: string }>;
  selectedCategory: number | null;
  onCategoryPress: (categoryId: number | null) => void;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedText = Animated.createAnimatedComponent(Text);

const AnimatedPill: React.FC<{
  isSelected: boolean;
  onPress: () => void;
  children: React.ReactNode;
}> = ({ isSelected, onPress, children }) => {
  const scale = useSharedValue(1);
  const colorProgress = useSharedValue(0);

  // Update animations when selection changes
  React.useEffect(() => {
    scale.value = withSpring(isSelected ? 1.05 : 1, {
      damping: 15,
      stiffness: 150,
    });
    
    colorProgress.value = withTiming(isSelected ? 1 : 0, {
      duration: 200,
    });
  }, [isSelected]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      colorProgress.value,
      [0, 1],
      ['#d4d4d8', '#3b82f6'] // neutral-300 to blue-500
    );

    return {
      transform: [{ scale: scale.value }],
      backgroundColor,
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginRight: 8,
      borderRadius: 20,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      colorProgress.value,
      [0, 1],
      ['#000000', '#ffffff']
    );

    return {
      color,
      fontWeight: '600',
      fontFamily: 'Nunito_600SemiBold',
    };
  });

  const handlePress = () => {
    // Press animation
    scale.value = withSpring(0.95, {
      damping: 15,
      stiffness: 200,
    }, () => {
      scale.value = withSpring(isSelected ? 1.05 : 1, {
        damping: 15,
        stiffness: 150,
      });
    });

    // Call onPress on JS thread
    runOnJS(onPress)();
  };

  return (
    <AnimatedTouchableOpacity
      style={animatedStyle}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <AnimatedText style={animatedTextStyle}>
        {children}
      </AnimatedText>
    </AnimatedTouchableOpacity>
  );
};

const CategoryPills: React.FC<CategoryPillsProps> = ({ 
  categories, 
  selectedCategory, 
  onCategoryPress 
}) => {
  return (
    <View style={{ flexGrow: 0, marginBottom: 16 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <AnimatedPill
          isSelected={selectedCategory === null}
          onPress={() => onCategoryPress(null)}
        >
          All
        </AnimatedPill>
        
        {categories.map((category) => (
          <AnimatedPill
            key={category.id}
            isSelected={selectedCategory === category.id}
            onPress={() => onCategoryPress(category.id)}
          >
            {category.name}
          </AnimatedPill>
        ))}
      </ScrollView>
    </View>
  );
};

export default CategoryPills;