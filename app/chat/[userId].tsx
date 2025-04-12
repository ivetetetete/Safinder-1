import { View, Text, TextInput, FlatList, KeyboardAvoidingView } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { db } from '../../library/firebaseConfig';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: any;
}

export default function ChatScreen() {
  const { userId: currentUserId } = useAuth();
  const { userId: otherUserId } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!currentUserId || !otherUserId) return;

    // Get or create chat channel
    const chatId = [currentUserId, otherUserId].sort().join('_');
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [currentUserId, otherUserId]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUserId || !otherUserId) return;

    const chatId = [currentUserId, otherUserId].sort().join('_');
    
    await addDoc(collection(db, 'chats', chatId, 'messages'), {
      text: newMessage,
      senderId: currentUserId,
      timestamp: serverTimestamp(),
    });

    setNewMessage('');
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-gray-50"
      behavior="padding"
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className={`p-3 my-1 rounded-lg max-w-[80%] ${
            item.senderId === currentUserId 
              ? 'bg-blue-500 self-end' 
              : 'bg-gray-200 self-start'
          }`}>
            <Text className={`${
              item.senderId === currentUserId ? 'text-white' : 'text-gray-900'
            }`}>
              {item.text}
            </Text>
          </View>
        )}
        className="p-4"
      />

      <View className="flex-row p-4 bg-white border-t border-gray-200">
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          className="flex-1 bg-gray-100 rounded-full px-4 mr-2"
          placeholderTextColor="#6b7280"
        />
        <TouchableOpacity
          onPress={sendMessage}
          className="bg-blue-500 p-3 rounded-full"
        >
          <Text className="text-white font-semibold">Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
