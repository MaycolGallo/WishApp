import React, { useMemo, useLayoutEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  runOnJS,
} from "react-native-reanimated";

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
  const prevDigit = React.useRef(digit);

  React.useEffect(() => {
    // Only animate if digit actually changed
    if (prevDigit.current !== digit) {
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
    }
    prevDigit.current = digit;
  }, [digit]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }, { scale: scale.value }],
      opacity: opacity.value,
      fontWeight: "600",
      fontSize: 24,
      fontFamily: "Nunito_600SemiBold",
    };
  });

  return (
    <AnimatedText className={className} style={animatedStyle}>
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
      // Roll up animation - smoother transition
      translateY.value = withTiming(
        -30,
        {
          duration: 150,
          easing: Easing.out(Easing.quad),
        },
        (finished) => {
          if (finished) {
            // Use runOnJS to ensure proper timing
            runOnJS(() => {
              translateY.value = 30; // Start from bottom
              translateY.value = withTiming(0, {
                duration: 200,
                easing: Easing.out(Easing.back(1.2)),
              });
            })();
          }
        }
      );
    }
    prevDigit.current = digit;
  }, [digit]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      fontWeight: "600",
      fontSize: 24,
      fontFamily: "Nunito_600SemiBold",
    };
  });

  return (
    <View style={{ overflow: 'hidden', height: 30 }}>
      <AnimatedText className={className} style={animatedStyle}>
        {digit}
      </AnimatedText>
    </View>
  );
};

// Main counter component
export const AnimatedCounter: React.FC<{
  value: number;
  className?: string;
  weight?: string;
  style?: "bounce" | "roll"; // Choose animation style
}> = ({ value, className, weight, style = "bounce" }) => {
  const formattedValue = value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const DigitComponent = style === "roll" ? RollingDigit : AnimatedDigit;

  // Memoize the digits to prevent unnecessary re-renders
  const digits = useMemo(() => formattedValue.split(""), [formattedValue]);

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Text className={className} style={{ fontWeight: "600", fontSize: 24 }}>Total: $</Text>
      {digits.map((char, index) => (
        <DigitComponent
          key={index} // Use stable index-based key
          digit={char}
          weight={weight}
          className={className}
        />
      ))}
    </View>
  );
};

// Your main component usage
