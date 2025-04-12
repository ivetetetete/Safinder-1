import { TouchableOpacity, View, Text, TextInput, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { db, auth } from '../../library/firebaseConfig';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';

interface Message {
    id: string;
    text: string;
    senderId: string;
    timestamp: any;
}

export default function ChatScreen() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [matchedUser, setMatchedUser] = useState<any>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const { userId: otherUserId } = useLocalSearchParams();
    const router = useRouter();

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
            } else {
                router.push('/login');
            }
        });

        return () => unsubscribeAuth();
    }, []);

    useEffect(() => {
        if (!currentUser?.uid || !otherUserId) return;

        const fetchMatchedUser = async () => {
            const userDoc = await getDoc(doc(db, 'users', otherUserId as string));
            if (userDoc.exists()) {
                setMatchedUser({ id: userDoc.id, ...userDoc.data() });
            }
        };

        const chatId = [currentUser.uid, otherUserId].sort().join('_');
        const messagesRef = collection(db, 'chats', chatId, 'messages');
        const q = query(messagesRef, orderBy('timestamp', 'asc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const messagesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as Message[];
            setMessages(messagesData);
        });
        
        fetchMatchedUser();
        return () => unsubscribe();
    }, [currentUser, otherUserId]);
    
    const sendMessage = async () => {
        if (!newMessage.trim() || !currentUser?.uid || !otherUserId) return;
            
        const chatId = [currentUser.uid, otherUserId].sort().join('_');
        
        await addDoc(collection(db, 'chats', chatId, 'messages'), {
            text: newMessage,
            senderId: currentUser.uid,
            timestamp: serverTimestamp(),
        });

        setNewMessage('');
    };

    return (
        <View className="flex-1 bg-yellow-200">
            <View className="bg-yellow-500 pt-16 p-4 border-b border-gray-200 flex-row items-center">
                <View className="w-10 h-10 bg-pink-300 rounded-full mr-3" />
                <Text className="text-lg font-semibold text-gray-900">
                    {matchedUser?.name || 'Chat'}
                </Text>
            </View>
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 16 }}
                renderItem={({ item }) => (
                    <View className={`mb-3 ${item.senderId === currentUser?.uid ? 'items-end' : 'items-start'}`}>
                        <View className={`px-4 py-2 rounded-lg max-w-[80%] ${item.senderId === currentUser?.uid
                                ? 'bg-pink-500 rounded-br-none'
                                : 'bg-purple-500 rounded-bl-none'
                            }`}>
                            <Text className={`text-base ${item.senderId === currentUser?.uid ? 'text-white' : 'text-gray-900'
                                }`}>
                                {item.text}
                            </Text>
                        </View>
                    </View>
                )}
            />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="bg-white border-t border-gray-200 p-3"
            >
                <View className="flex-row items-center">
                    <TextInput
                        value={newMessage}
                        onChangeText={setNewMessage}
                        placeholder="Type a message..."
                        className="flex-1  mb-10 bg-gray-100 rounded-full px-4 py-6 mr-2"
                        placeholderTextColor="#6b7280"
                    />
                    <TouchableOpacity
                        onPress={sendMessage}
                        className="bg-pink-500 pb-3 w-12 h-12 rounded-full items-center justify-center"
                    >
                        <Text className="text-white font-bold text-lg">➤</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}
