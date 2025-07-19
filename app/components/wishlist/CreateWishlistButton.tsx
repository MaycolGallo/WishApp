import React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '~/constants/Colors';
import Text from '../ui/text-ui';

const CreateWishlistButton = () => {
    const router = useRouter();

    return (
        <View
        style={{
          position: "absolute",
          bottom: 10,
          boxShadow:
            "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset",
          right: 10,
          height: 50,
          width: 50,
          backgroundColor: Colors.light.tint,
          borderRadius: 50,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Pressable
          onPress={() => {
            router.push({ pathname: "/create-wishlist" });
          }}
        >
          <Text className="text-2xl font-bold">
            <FontAwesome name="plus" color="white" size={20} />
          </Text>
        </Pressable>
      </View>
    )
}

export default CreateWishlistButton;