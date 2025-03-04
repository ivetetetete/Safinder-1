import React, { createContext, useContext } from 'react';
import { initializeApp } from "firebase/app";
import { Firestore, getFirestore, collection, doc, getDoc, getDocs, setDoc, query, where, writeBatch, orderBy, limit, addDoc, onSnapshot, DocumentSnapshot, serverTimestamp } from "firebase/firestore";
import { Auth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyABYLq8OhTtlXNAFp_jdV8p1mAw8dYmSnA",
    authDomain: "safinder-86c3c.firebaseapp.com",
    projectId: "safinder-86c3c",
    storageBucket: "safinder-86c3c.firebasestorage.app",
    messagingSenderId: "673674171046",
    appId: "1:673674171046:web:58049f77a71d6ec46b9a67",
    measurementId: "G-BWSZ8W3C7N"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Types for better type safety
interface UserData {
    userId?: string;
    name?: string;
    surname?: string;
    photoURL?: string;
    dateOfBirth?: Date;
    matchedIds?: string[];
}

interface LastMessage {
    id?: string;
    senderId: string;
    text: string;
    timestamp: any;
    read: boolean;
}

interface ChatData {
    userId: string;
    name: string;
    surname: string;
    photoURL: string;
    lastMessage?: LastMessage;
    unread: boolean;
    online: boolean;
}

type FirebaseContextType = {
    auth: Auth;
    firestore: Firestore;
    getUser: (userId: string) => Promise<UserData | null>;
    getMatchedUsers: (userId: string) => Promise<UserData[]>;
    getChats: (userId: string, callback: (chats: ChatData[]) => void) => () => void;
    getMessages: (
        currentUserId: string,
        otherUserId: string,
        callback: (messages: any[]) => void
    ) => () => void;
    sendMessage: (
        senderId: string,
        receiverId: string,
        text: string,
        metadata?: any
    ) => Promise<void>;
    markMessagesAsRead: (currentUserId: string, otherUserId: string) => Promise<void>;
};

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
    const getUser = async (userId: string): Promise<UserData | null> => {
        try {
            const userDocRef = doc(db, 'users', userId);
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
                return { 
                    userId, 
                    ...userDoc.data() 
                } as UserData;
            }
            return null;
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    };

    const getMatchedUsers = async (userId: string): Promise<UserData[]> => {
        try {
            const userDocRef = doc(db, 'users', userId);
            const userDoc = await getDoc(userDocRef);
            
            if (!userDoc.exists()) return [];

            const userData = userDoc.data();
            const matchedIds = userData?.matchedIds || [];

            if (matchedIds.length === 0) return [];

            const matchedUsersPromises = matchedIds.map(async (matchId: string) => {
                const matchDocRef = doc(db, 'users', matchId);
                const matchDoc = await getDoc(matchDocRef);
                
                if (matchDoc.exists()) {
                    const matchData = matchDoc.data();
                    
                    // Calculate age from dateOfBirth
                    let age = '';
                    if (matchData?.dateOfBirth) {
                        const birthDate = matchData.dateOfBirth instanceof Date
                            ? matchData.dateOfBirth
                            : new Date(matchData.dateOfBirth);
                        const today = new Date();
                        age = String(today.getFullYear() - birthDate.getFullYear());
                    }

                    return {
                        userId: matchId,
                        ...matchData,
                        age
                    } as UserData;
                }
                return null;
            });

            const matchedUsers = await Promise.all(matchedUsersPromises);
            return matchedUsers.filter(Boolean) as UserData[];
        } catch (error) {
            console.error('Error fetching matched users:', error);
            throw error;
        }
    };

    const getChats = (userId: string, callback: (chats: ChatData[]) => void) => {
        // Create a chat ID from two user IDs
        const createChatId = (user1: string, user2: string) => {
            return [user1, user2].sort().join('_');
        };

        // Get user's matched IDs
        const userDocRef = doc(db, 'users', userId);

        const unsubscribe = onSnapshot(userDocRef, async (userDoc: DocumentSnapshot) => {
            if (!userDoc.exists()) {
                callback([]);
                return;
            }

            const userData = userDoc.data();
            const matchedIds = userData?.matchedIds || [];

            if (matchedIds.length === 0) {
                callback([]);
                return;
            }

            // Get the last message for each chat
            const chatsPromises = matchedIds.map(async (matchId: string) => {
                try {
                    // Get match user data
                    const matchDocRef = doc(db, 'users', matchId);
                    const matchDoc = await getDoc(matchDocRef);
                    
                    if (!matchDoc.exists()) return null;

                    const matchData = matchDoc.data();

                    // Get the last message
                    const chatId = createChatId(userId, matchId);
                    const messagesRef = collection(db, 'chats', chatId, 'messages');
                    const lastMessageQuery = query(
                        messagesRef, 
                        orderBy('timestamp', 'desc'), 
                        limit(1)
                    );

                    const lastMessageSnapshot = await getDocs(lastMessageQuery);

                    let lastMessage = null;
                    let unread = false;

                    if (!lastMessageSnapshot.empty) {
                        const lastMessageDoc = lastMessageSnapshot.docs[0];
                        lastMessage = {
                            id: lastMessageDoc.id,
                            ...(lastMessageDoc.data() as LastMessage)
                        };

                        // Check if there are unread messages
                        if ((lastMessage as LastMessage).senderId !== userId && !(lastMessage as LastMessage).read) {
                            unread = true;
                        }
                    }

                    return {
                        userId: matchId,
                        name: matchData?.name || '',
                        surname: matchData?.surname || '',
                        photoURL: matchData?.photoURL || '',
                        lastMessage,
                        unread,
                        online: Math.random() > 0.5 // Mock online status
                    } as ChatData;
                } catch (error) {
                    console.error('Error fetching chat:', error);
                    return null;
                }
            });

            const chats = await Promise.all(chatsPromises);
            callback(chats.filter(Boolean) as ChatData[]);
        });

        return unsubscribe;
    };

    const getMessages = (
        currentUserId: string,
        otherUserId: string,
        callback: (messages: any[]) => void
    ) => {
        // Create a chat ID from two user IDs
        const chatId = [currentUserId, otherUserId].sort().join('_');

        const messagesRef = collection(db, 'chats', chatId, 'messages');
        const messagesQuery = query(messagesRef, orderBy('timestamp', 'desc'));

        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
            const messages = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));

            callback(messages);
        });

        return unsubscribe;
    };

    const sendMessage = async (
        senderId: string,
        receiverId: string,
        text: string,
        metadata: any = {}
    ) => {
        try {
            // Create a chat ID from two user IDs
            const chatId = [senderId, receiverId].sort().join('_');

            // Create message object
            const message = {
                senderId,
                receiverId,
                text,
                timestamp: serverTimestamp(),
                read: false,
                ...metadata
            };

            // Add message to chat
            const chatMessagesRef = collection(db, 'chats', chatId, 'messages');
            await addDoc(chatMessagesRef, message);

            // Update chat metadata
            const chatDocRef = doc(db, 'chats', chatId);
            await setDoc(chatDocRef, {
                participants: [senderId, receiverId],
                lastMessage: {
                    text,
                    senderId,
                    timestamp: serverTimestamp()
                },
                updatedAt: serverTimestamp()
            }, { merge: true });

        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    };

    const markMessagesAsRead = async (currentUserId: string, otherUserId: string) => {
        try {
            // Create a chat ID from two user IDs
            const chatId = [currentUserId, otherUserId].sort().join('_');

            // Get unread messages sent by the other user
            const messagesRef = collection(db, 'chats', chatId, 'messages');
            const unreadQuery = query(
                messagesRef, 
                where('senderId', '==', otherUserId),
                where('read', '==', false)
            );

            const unreadSnapshot = await getDocs(unreadQuery);

            // Batch update
            const batch = writeBatch(db);

            unreadSnapshot.docs.forEach((docRef) => {
                batch.update(docRef.ref, { read: true });
            });

            await batch.commit();
        } catch (error) {
            console.error('Error marking messages as read:', error);
        }
    };

    const value = {
        auth,
        firestore: db,
        getUser,
        getMatchedUsers,
        getChats,
        getMessages,
        sendMessage,
        markMessagesAsRead
    };

    return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>;
}

export function useFirebase() {
    const context = useContext(FirebaseContext);
    if (context === undefined) {
        throw new Error('useFirebase must be used within a FirebaseProvider');
    }
    return context;
}