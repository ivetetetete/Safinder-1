// app/(tabs)/chat.tsx
import { View, Text, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import { db, auth } from '../../library/firebaseConfig';
import { query, collection, where, getDocs, doc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import ChatUserItem from '../../components/chat/ChatUserItem';
import EmptyState from '../../components/chat/EmptyState';

interface User {
  userId: string;
  name: string;
  surname: string;
  city: string;
}

export default function ChatList() {
  const [matchedUsers, setMatchedUsers] = useState<User[]>([]);
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

    const userRef = doc(db, 'users', currentUserId);
    
    const unsubscribe = onSnapshot(userRef, async (userDoc) => {
      const matchedIds = userDoc.data()?.matchedIds || [];
      console.log('Current matches:', matchedIds);

      if (matchedIds.length > 0) {
        const usersQuery = query(
          collection(db, 'users'),
          where('userId', 'in', matchedIds)
        );

        try {
          const querySnapshot = await getDocs(usersQuery);
          const users = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            userId: doc.id,
          })) as User[];
          console.log('Fetched users:', users);
          setMatchedUsers(users);
        } catch (error) {
          console.error('Error fetching matches:', error);
        }
      } else {
        setMatchedUsers([]);
      }
    });

    return () => unsubscribe();
  }, [currentUserId]);

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <Text className="text-3xl font-bold mb-6 mt-16 text-gray-900">Están enamorados de ti</Text>
      
      <FlatList
        data={matchedUsers}
        keyExtractor={(item) => item.userId}
        renderItem={({ item }) => <ChatUserItem user={item} currentUserId={currentUserId} />}
        ListEmptyComponent={<EmptyState />}
      />
    </View>
  );
}
