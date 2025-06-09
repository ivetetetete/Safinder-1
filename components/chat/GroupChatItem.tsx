import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function GroupChatItem({ event }: { event: any }) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/event/${event.id}`);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="bg-white p-4 rounded-lg mb-3 shadow-sm flex-row items-center"
    >
      <View className="w-12 h-12 bg-yellow-300 rounded-full mr-4" />
      <View className="flex-1">
        <Text className="text-lg font-semibold text-gray-900">
          {event.title}
        </Text>
        <Text className="text-gray-500">{event.address}</Text>
      </View>
    </TouchableOpacity>
  );
}
