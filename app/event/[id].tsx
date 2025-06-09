import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { db, auth } from "../../library/firebaseConfig";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useLocalSearchParams, useRouter } from "expo-router";

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: any;
  system?: boolean;
}

export default function EventChatScreen() {
  const { id: eventId } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [event, setEvent] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) setCurrentUser(user);
      else router.push("/login");
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!eventId) return;
    const fetchEvent = async () => {
      const eventDoc = await getDoc(doc(db, "events", eventId as string));
      if (eventDoc.exists()) setEvent({ id: eventDoc.id, ...eventDoc.data() });
    };
    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    if (!eventId) return;
    const messagesRef = collection(
      db,
      "events",
      eventId as string,
      "groupChat"
    );
    const q = query(messagesRef, orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];
      setMessages(messagesData);
    });
    return () => unsubscribe();
  }, [eventId]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUser?.uid || !eventId) return;
    await addDoc(collection(db, "events", eventId as string, "groupChat"), {
      text: newMessage,
      senderId: currentUser.uid,
      timestamp: serverTimestamp(),
    });
    setNewMessage("");
  };

  return (
    <View className="flex-1 bg-yellow-200">
      <View className="bg-yellow-500 pt-16 p-4 border-b border-gray-200 flex-row items-center">
        <View className="w-10 h-10 bg-pink-300 rounded-full mr-3" />
        <View>
          <Text className="text-lg font-semibold text-gray-900">
            {event?.title || "Grupo del evento"}
          </Text>
        </View>
      </View>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View
            className={`mb-3 ${
              item.senderId === currentUser?.uid ? "items-end" : "items-start"
            }`}
          >
            <View
              className={`px-4 py-2 rounded-lg max-w-[80%] ${
                item.system
                  ? "bg-gray-400"
                  : item.senderId === currentUser?.uid
                  ? "bg-pink-500 rounded-br-none"
                  : "bg-purple-500 rounded-bl-none"
              }`}
            >
              <Text
                className={`text-base ${
                  item.senderId === currentUser?.uid || item.system
                    ? "text-white"
                    : "text-gray-900"
                }`}
              >
                {item.text}
              </Text>
            </View>
          </View>
        )}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="bg-white border-t border-gray-200 p-3"
      >
        <View className="flex-row items-center">
          <TextInput
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Escribe un mensaje..."
            className="flex-1 mb-10 bg-gray-100 rounded-full px-4 py-6 mr-2"
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
