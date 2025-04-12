import { useEffect, useState } from 'react';
import { ClerkProvider } from '@clerk/clerk-expo';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SecureStore from 'expo-secure-store';
import { Stack } from 'expo-router';
import './global.css';
import { auth } from '../library/firebaseConfig';


const CLERK_PUBLISHABLE_KEY = "pk_test_c291Z2h0LWxlZWNoLTUzLmNsZXJrLmFjY291bnRzLmRldiQ";

const RootLayout = () => {
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    const tokenCache = {
        async getToken(key: string) {
            return SecureStore.getItemAsync(key);
        },
        async saveToken(key: string, value: string) {
            return SecureStore.setItemAsync(key, value);
        },
    };

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
        <ClerkProvider
            publishableKey={CLERK_PUBLISHABLE_KEY}
            tokenCache={tokenCache}
        >
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
        </ClerkProvider>
    );
};

export default RootLayout;