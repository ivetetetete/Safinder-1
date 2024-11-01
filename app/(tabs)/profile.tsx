import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { getAuth, signOut } from 'firebase/auth';
import 'tailwindcss/tailwind.css';

const Profile = () => {
  const router = useRouter();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-xl font-bold mb-4">Profile Page incoming</Text>
      <View>
        <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-400 py-3 rounded-lg mb-8"
            >
            <Text className="text-white text-center font-bold px-6 py-2">Logout</Text>
            </TouchableOpacity>
        </View>
    </View>
  );
};

export default Profile;

//you're the best
