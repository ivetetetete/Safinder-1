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
<>
<View className="flex-1 items-center justify-center">
      <Text className="font-bold">Welcome to Safinder!</Text>
    </View>

<View>
<TouchableOpacity
  onPress={handleLogout}
  className="bg-red-400 py-3 rounded-lg mb-8"
>
  <Text className="text-white text-center font-bold px-6 py-2">Logout</Text>
</TouchableOpacity>
</View></>
  );
}

//you're amazing