import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useFirebase } from '../../context/FirebaseContext';
import { formatDistanceToNow } from '../../utils/dateUtils';

interface ChatData {
  userId: string;
  name: string;
  surname: string;
  photoURL?: string;
  online: boolean;
  lastMessage?: {
    text: string;
    timestamp: {
      toDate: () => Date;
    };
  };
  unread: boolean;
}

export default function ChatsScreen() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { getChats } = useFirebase();
  const [chats, setChats] = useState<ChatData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function fetchChats() {
      if (currentUser) {
        try {
          unsubscribe = getChats(currentUser.userId, (updatedChats) => {
            // Sort chats by most recent message
            const sortedChats = [...updatedChats].sort((a, b) => {
              if (!a.lastMessage?.timestamp || !b.lastMessage?.timestamp) return 0;
              return b.lastMessage.timestamp.toDate().getTime() - a.lastMessage.timestamp.toDate().getTime();
            });
            setChats(sortedChats);
            setLoading(false);
          });
        } catch (error) {
          console.error('Error fetching chats:', error);
          setLoading(false);
        }
      }
    }

    fetchChats();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [currentUser, getChats]);

  const renderChatItem = ({ item }: { item: ChatData }) => {
    const lastMessageTime = item.lastMessage?.timestamp?.toDate();
    const timeAgo = lastMessageTime ? formatDistanceToNow(lastMessageTime) : '';
    
    return (
      <TouchableOpacity 
        className="flex-row items-center py-3 border-b border-gray-100"
        onPress={() => router.push({ pathname: '/chat/[userId]', params: { userId: item.userId } })}
      >
        <View className="relative mr-3">
          <Image 
            source={{ 
              uri: item.photoURL || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60' 
            }} 
            className="w-[60px] h-[60px] rounded-full"
          />
          {item.online && (
            <View className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-success border-2 border-white" />
          )}
        </View>
        <View className="flex-1 justify-center">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-base font-bold text-text">{item.name} {item.surname}</Text>
            <Text className="text-xs text-gray-500">{timeAgo}</Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text 
              className={`text-sm flex-1 mr-2 ${item.unread ? 'font-bold text-text' : 'text-gray-600'}`}
              numberOfLines={1}
            >
              {item.lastMessage?.text || 'Start a conversation'}
            </Text>
            {item.unread && (
              <View className="bg-primary rounded-full w-5 h-5 justify-center items-center">
                <Text className="text-white text-xs font-bold">1</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white p-4">
        <Text>Loading chats...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mt-[50px] mb-5 text-text">Messages</Text>
      {chats.length > 0 ? (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.userId}
          renderItem={renderChatItem}
          showsVerticalScrollIndicator={false}
          contentContainerClassName="pb-5"
        />
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg font-bold text-text">No messages yet</Text>
          <Text className="text-base text-gray-600 mt-2 text-center px-10">
            When you match with someone, you can chat with them here!
          </Text>
        </View>
      )}
    </View>
  );
};