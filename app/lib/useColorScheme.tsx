import { useColorScheme as useNativewindColorScheme } from 'nativewind';
import { setAndroidNavigationBar } from './android-navigation-bar';
import { colorScheme as r } from "nativewind";

export function useColorScheme() {
  const { colorScheme, setColorScheme, toggleColorScheme } = useNativewindColorScheme();

  function handleSetColorScheme(theme: 'light' | 'dark') {
    r.set(theme);
    setAndroidNavigationBar(theme);
  }

  function handleToggleColorScheme() {
    const newTheme = colorScheme === 'dark' ? 'light' : 'dark';
    handleSetColorScheme(newTheme);
  }

  return {
    colorScheme: colorScheme ?? 'dark',
    isDarkColorScheme: colorScheme === 'dark',
    setColorScheme: handleSetColorScheme,
    toggleColorScheme: handleToggleColorScheme,
  };
}
