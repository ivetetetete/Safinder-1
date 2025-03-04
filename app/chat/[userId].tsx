import { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Image,
    ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useFirebase } from '../../context/FirebaseContext';
import { ArrowLeft, Send } from 'lucide-react-native';
import { formatMessageTime } from '../../utils/dateUtils';

export default function ChatScreen() {
    const { userId } = useLocalSearchParams();
    const router = useRouter();
    const { currentUser } = useAuth();
    const { getUser, getMessages, sendMessage, markMessagesAsRead } = useFirebase();
    const [chatUser, setChatUser] = useState<{ name: string; surname: string; photoURL?: string; online?: boolean } | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const flatListRef = useRef<FlatList<any>>(null);

    useEffect(() => {
        let messagesUnsubscribe: (() => void) | undefined;

        async function fetchChatData() {
            if (currentUser && userId) {
                try {
                    // Get chat user details
                    const user = await getUser(userId.toString());
                    setChatUser(user);

                    // Subscribe to messages
                    messagesUnsubscribe = getMessages(
                        currentUser.userId,
                        userId.toString(),
                        (updatedMessages) => {
                            setMessages(updatedMessages);
                            setLoading(false);

                            // Mark messages as read
                            markMessagesAsRead(currentUser.userId, userId.toString());
                        }
                    );
                } catch (error) {
                    console.error('Error fetching chat data:', error);
                    setLoading(false);
                }
            }
        }

        fetchChatData();

        return () => {
            if (messagesUnsubscribe) {
                messagesUnsubscribe();
            }
        };
    }, [currentUser, userId, getUser, getMessages, markMessagesAsRead]);

    const handleSendMessage = async () => {
        if (newMessage.trim() === '') return;

        if (currentUser && chatUser) {
            try {
                await sendMessage(
                    currentUser.userId,
                    userId.toString(),
                    newMessage.trim(),
                    {
                        senderName: `${currentUser.name} ${currentUser.surname}`,
                        receiverName: `${chatUser.name} ${chatUser.surname}`,
                    }
                );
                setNewMessage('');
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    const renderMessageItem = ({ item }: { item: { id: string; senderId: string; text: string; timestamp: { toDate: () => Date } } }) => {
        const isCurrentUser = item.senderId === currentUser?.userId;

        return (
            <View className={`mb-4 flex-row ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                <View
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${isCurrentUser
                            ? 'bg-primary rounded-br-sm'
                            : 'bg-white rounded-bl-sm'
                        }`}
                >
                    <Text
                        className={isCurrentUser ? 'text-white text-base' : 'text-text text-base'}
                    >
                        {item.text}
                    </Text>
                    <Text
                        className={`text-xs mt-1 self-end ${isCurrentUser ? 'text-white/70' : 'text-gray-500'
                            }`}
                    >
                        {formatMessageTime(item.timestamp?.toDate())}
                    </Text>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-card">
                <ActivityIndicator size="large" color="#FF4D67" />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-card"
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <View className="flex-row items-center px-4 pt-[50px] pb-2.5 bg-white border-b border-gray-100">
                <TouchableOpacity
                    className="p-2"
                    onPress={() => router.back()}
                >
                    <ArrowLeft size={24} color="#333333" />
                </TouchableOpacity>

                {chatUser && (
                    <TouchableOpacity
                        className="flex-1 flex-row items-center ml-2"
                        onPress={() => {/* Navigate to user profile */ }}
                    >
                        <Image
                            source={{
                                uri: chatUser.photoURL || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
                            }}
                            className="w-10 h-10 rounded-full mr-3"
                        />
                        <View>
                            <Text className="text-base font-bold text-text">{chatUser.name} {chatUser.surname}</Text>
                            <Text className="text-xs text-gray-500">
                                {chatUser.online ? 'Online' : 'Offline'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={renderMessageItem}
                contentContainerClassName="px-4 pt-4"
                inverted={true} // Display newest messages at the bottom
                onContentSizeChange={() => {
                    if (messages.length > 0) {
                        flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
                    }
                }}
            />

            <View className="flex-row items-center px-4 py-3 bg-white border-t border-gray-100">
                <TextInput
                    className="flex-1 bg-gray-100 rounded-3xl px-4 py-2.5 max-h-[100px] text-base"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChangeText={setNewMessage}
                    multiline
                />
                <TouchableOpacity
                    className={`bg-primary rounded-3xl w-12 h-12 justify-center items-center ml-2 ${newMessage.trim() === '' ? 'bg-tertiary' : 'bg-primary'
                        }`}
                    onPress={handleSendMessage}
                    disabled={newMessage.trim() === ''}
                >
                    <Send size={20} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}