import { useEffect, useState } from 'react';
import { ClerkProvider } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';
import { auth } from '../library/firebaseConfig';

export default function HomeScreen() {
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

    return currentUser ? (
        <Redirect href={{
            pathname: "/(tabs)/home",
        }} />
    ) : (
        <Redirect href="/(auth)/login" />
    );
}

//you're perfect