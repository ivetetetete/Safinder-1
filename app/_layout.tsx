import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import './global.css';
import { auth } from '../library/firebaseConfig';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const RootLayout = () => {
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user: any) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return null;
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack
                screenOptions={{
                    headerShown: false,
                }}>
                {currentUser ? (
                    <Stack.Screen
                        name="(tabs)"
                        options={{
                            headerShown: false,
                            title: 'Volver',
                        }}
                    />
                ) : (
                    <Stack.Screen
                        name="(auth)"
                        options={{
                            headerShown: false,
                            title: 'Volver',
                        }}
                    />
                )}
            </Stack>
        </GestureHandlerRootView>

    );
};

export default RootLayout;