import { View, Text, FlatList } from "react-native";
import { useEffect, useState } from "react";
import { db, auth } from "../../library/firebaseConfig";
import {
  query,
  collection,
  where,
  getDocs,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import ChatUserItem from "../../components/chat/ChatUserItem";
import EmptyState from "../../components/chat/EmptyState";
import { useRouter } from "expo-router";

interface User {
  userId: string;
  name: string;
  surname: string;
  city: string;
}

interface Event {
  id: string;
  title: string;
  address?: string;
}

function GroupChatItem({ event }: { event: Event }) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/event/${event.id}`);
  };

  return (
    <View className="mb-3">
      <FlatList
        data={[event]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <View className="bg-white p-4 rounded-lg shadow-sm flex-row items-center">
              <View className="w-12 h-12 bg-yellow-300 rounded-full mr-4" />
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-900">
                  {item.title}
                </Text>
              </View>
              <Text
                className="text-blue-500 font-semibold ml-2"
                onPress={handlePress}
              >
                Chat
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

export default function ChatList() {
  const [matchedUsers, setMatchedUsers] = useState<User[]>([]);
  const [groupChats, setGroupChats] = useState<Event[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        setCurrentUserId(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!currentUserId) return;

    const userRef = doc(db, "users", currentUserId);
    const unsubscribe = onSnapshot(userRef, async (userDoc) => {
      const matchedIds = userDoc.data()?.matchedIds || [];
      if (matchedIds.length > 0) {
        const usersQuery = query(
          collection(db, "users"),
          where("userId", "in", matchedIds)
        );

        try {
          const querySnapshot = await getDocs(usersQuery);
          const users = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            userId: doc.id,
          })) as User[];
          setMatchedUsers(users);
        } catch (error) {
          console.error("Error fetching matches:", error);
        }
      } else {
        setMatchedUsers([]);
      }
    });

    const fetchGroupChats = async () => {
      try {
        const eventsQuery = query(
          collection(db, "events"),
          where("joiners_id", "array-contains", currentUserId)
        );
        const querySnapshot = await getDocs(eventsQuery);
        const groups = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          address: doc.data().address,
        })) as Event[];
        setGroupChats(groups);
      } catch (error) {
        console.error("Error fetching group chats:", error);
      }
    };

    fetchGroupChats();

    return () => unsubscribe();
  }, [currentUserId]);

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <Text className="text-3xl font-bold mb-6 mt-16 text-gray-900">
        Están enamorados de ti
      </Text>

      <FlatList
        data={matchedUsers}
        keyExtractor={(item) => item.userId}
        renderItem={({ item }) => (
          <ChatUserItem user={item} currentUserId={currentUserId} />
        )}
        ListEmptyComponent={<EmptyState />}
      />

      {groupChats.length > 0 && (
        <>
          <Text className="text-2xl font-bold mb-4 mt-10 text-gray-900">
            Tus grupos de eventos
          </Text>
          <FlatList
            data={groupChats}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <GroupChatItem event={item} />}
          />
        </>
      )}
    </View>
  );
}
