import { Text } from '../components/ui/text';
import { View } from 'react-native';

export default function TabOneScreen() {
  return (
    <View className='bg-background flex-1 items-center justify-center'>
      <Text className='text-foreground text-2xl'>Tab One</Text>
    </View>
  );
}

