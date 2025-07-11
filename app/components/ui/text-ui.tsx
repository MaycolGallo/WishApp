import React from 'react';
import { Text as RNText, StyleSheet, TextProps, TextStyle } from 'react-native';
import { useFonts, 
  Nunito_200ExtraLight,
  Nunito_300Light,
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black
} from '@expo-google-fonts/nunito';

// Define the available font weights
type FontWeight = 
  | 'extraLight' 
  | 'light' 
  | 'regular' 
  | 'medium' 
  | 'semiBold' 
  | 'bold' 
  | 'extraBold' 
  | 'black';

// Define the available text variants
type TextVariant = 
  | 'h1' 
  | 'h2' 
  | 'h3' 
  | 'h4' 
  | 'subtitle' 
  | 'body' 
  | 'caption' 
  | 'small';

// Define the props interface
interface CustomTextProps extends TextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  weight?: FontWeight;
  size?: number;
  color?: string;
  className?: string; // NativeWind className prop
}

const Text: React.FC<CustomTextProps> = ({ 
  children, 
  variant = 'body', 
  weight = 'regular',
  size,
  color,
  style,
  className,
  ...props 
}) => {
  // Load all Nunito font weights
  const [fontsLoaded] = useFonts({
    Nunito_200ExtraLight,
    Nunito_300Light,
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
  });

  if (!fontsLoaded) {
    return null; // or loading spinner
  }

  // Font weight mapping
  const getFontFamily = (weight: FontWeight): string => {
    const fontMap: Record<FontWeight, string> = {
      'extraLight': 'Nunito_200ExtraLight',
      'light': 'Nunito_300Light',
      'regular': 'Nunito_400Regular',
      'medium': 'Nunito_500Medium',
      'semiBold': 'Nunito_600SemiBold',
      'bold': 'Nunito_700Bold',
      'extraBold': 'Nunito_800ExtraBold',
      'black': 'Nunito_900Black',
    };
    return fontMap[weight];
  };

  // Predefined text variants with proper font families
  const getVariantStyle = (variant: TextVariant, weight: FontWeight): TextStyle => {
    // Get the appropriate font family for headers (they should be bold by default)
    const getVariantFontFamily = (variant: TextVariant, weight: FontWeight): string => {
      // Headers are bold by default unless explicitly overridden
      if (['h1', 'h2', 'h3', 'h4'].includes(variant)) {
        return weight === 'regular' ? getFontFamily('bold') : getFontFamily(weight);
      }
      // Subtitle is semiBold by default
      if (variant === 'subtitle') {
        return weight === 'regular' ? getFontFamily('semiBold') : getFontFamily(weight);
      }
      return getFontFamily(weight);
    };

    const fontFamily = getVariantFontFamily(variant, weight);
    
    switch (variant) {
      case 'h1':
        return { ...styles.h1, fontFamily };
      case 'h2':
        return { ...styles.h2, fontFamily };
      case 'h3':
        return { ...styles.h3, fontFamily };
      case 'h4':
        return { ...styles.h4, fontFamily };
      case 'subtitle':
        return { ...styles.subtitle, fontFamily };
      case 'body':
        return { ...styles.body, fontFamily };
      case 'caption':
        return { ...styles.caption, fontFamily };
      case 'small':
        return { ...styles.small, fontFamily };
      default:
        return { ...styles.body, fontFamily };
    }
  };

  const variantStyle = getVariantStyle(variant, weight);

  return (
    <RNText
      style={[
        variantStyle, // This now includes the proper fontFamily
        size && { fontSize: size },
        color && { color },
        style
      ]}
      className={className}
      {...props}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  h1: {
    fontSize: 32,
    lineHeight: 38,
  } as TextStyle,
  h2: {
    fontSize: 28,
    lineHeight: 34,
  } as TextStyle,
  h3: {
    fontSize: 24,
    lineHeight: 30,
  } as TextStyle,
  h4: {
    fontSize: 20,
    lineHeight: 26,
  } as TextStyle,
  subtitle: {
    fontSize: 18,
    lineHeight: 24,
  } as TextStyle,
  body: {
    fontSize: 16,
    lineHeight: 22,
  } as TextStyle,
  caption: {
    fontSize: 14,
    lineHeight: 18,
  } as TextStyle,
  small: {
    fontSize: 12,
    lineHeight: 16,
  } as TextStyle,
});

export default Text;
export type { CustomTextProps, FontWeight, TextVariant };