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
    <View className="flex-1 items-center justify-center bg-[#FF7DB0]">
      <Text className='text-7xl font-bold p-2 text-white'>Here it's gonna be the chat,
         where you might find <Text className='italic'>love</Text> or friendship!
      </Text>
      <Text>
        
      </Text>
    </View>
  );
};

export default Chat;