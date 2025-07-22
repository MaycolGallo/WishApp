import React, { useMemo, useLayoutEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSpring,
  Easing
} from 'react-native-reanimated';

const AnimatedText = Animated.createAnimatedComponent(Text);

// Single digit animator
const AnimatedDigit: React.FC<{
  digit: string;
  className?: string;
  weight?: string;
}> = ({ digit, className, weight }) => {
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  React.useEffect(() => {
    // Animate when digit changes
    translateY.value = withSpring(-20, { damping: 15 }, () => {
      translateY.value = withSpring(0, { damping: 15 });
    });
    
    // Scale animation for emphasis
    scale.value = withTiming(1.2, { duration: 150 }, () => {
      scale.value = withTiming(1, { duration: 150 });
    });
    
    // Opacity flash
    opacity.value = withTiming(0.7, { duration: 100 }, () => {
      opacity.value = withTiming(1, { duration: 100 });
    });
  }, [digit]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
        { scale: scale.value }
      ],
      opacity: opacity.value,
      fontWeight: '600',
      fontFamily: 'Nunito_600SemiBold',
    };
  });

  return (
    <AnimatedText 
      className={className}
      style={animatedStyle}
    >
      {digit}
    </AnimatedText>
  );
};

// Rolling digit animator (classic counter style)
const RollingDigit: React.FC<{
  digit: string;
  className?: string;
  weight?: string;
}> = ({ digit, className, weight }) => {
  const translateY = useSharedValue(0);
  const prevDigit = React.useRef(digit);

  React.useEffect(() => {
    if (prevDigit.current !== digit) {
      // Roll up animation
      translateY.value = withTiming(-30, { 
        duration: 200,
        easing: Easing.out(Easing.cubic)
      }, () => {
        translateY.value = 30; // Jump to bottom
        translateY.value = withTiming(0, { 
          duration: 300,
          easing: Easing.out(Easing.bounce)
        });
      });
    }
    prevDigit.current = digit;
  }, [digit]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <AnimatedText 
      className={className}
      style={animatedStyle}
    >
      {digit}
    </AnimatedText>
  );
};

// Main counter component
export const AnimatedCounter: React.FC<{ 
  value: number; 
  className?: string;
  weight?: string;
  style?: 'bounce' | 'roll'; // Choose animation style
}> = ({ value, className, weight, style = 'bounce' }) => {
  const formattedValue =  '0.00';
  const DigitComponent = style === 'roll' ? RollingDigit : AnimatedDigit;
  
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text  className={className}>Total: $</Text>
      {formattedValue.split('').map((char, index) => (
        <DigitComponent
          key={`${index}-${char}`} // Key includes char to force re-render
          digit={char}
          weight={weight}
          className={className}
        />
      ))}
    </View>
  );
};

// Your main component usage
