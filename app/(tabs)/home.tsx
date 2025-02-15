import { View, Text, TouchableOpacity } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function HomeScreen() {
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
    <View className='flex-1 items-center justify-center'>
      <View className="bg-pink-500 p-5 rounded-xl my-3">
        <Text className="text-white text-2xl">Countdown to next test:</Text>
        <Text className="font-bold text-white text-3xl text-right">3 days 2 hours 40 min</Text>
      </View>

      {/* <View>
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-400 py-3 rounded-lg mb-8"
        >
          <Text className="text-white text-center font-bold px-6 py-2">Logout</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
}

//you're amazing