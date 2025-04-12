// components/ChatUserItem.tsx
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function ChatUserItem({ user, currentUserId }: { 
  user: any, 
  currentUserId: string | null 
}) {
  const router = useRouter();

  const handlePress = () => {
    if (!currentUserId) return;
    const chatId = [currentUserId, user.userId].sort().join('_');
    router.push(`/chat/${chatId}`);
  };

  return (
    <Pressable
      onPress={handlePress}
      className="bg-white p-4 rounded-lg mb-3 shadow-sm flex-row items-center"
    >
      <View className="w-12 h-12 bg-gray-300 rounded-full mr-4" />
      <View className="flex-1">
        <Text className="text-lg font-semibold text-gray-900">
          {user.name} {user.surname}
        </Text>
        <Text className="text-gray-500">{user.city}</Text>
      </View>
    </Pressable>
  );
}
