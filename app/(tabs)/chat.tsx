import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { getAuth, signOut } from 'firebase/auth';
import 'tailwindcss/tailwind.css';
import Svg, { G, Path } from "react-native-svg";


const Chat = () => {
  const router = useRouter();
  const auth = getAuth();

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className='text-9xl'>CHAT</Text>
    </View>
  );
};

export default Chat;

//you're the best
