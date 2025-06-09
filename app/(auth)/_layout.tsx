import { Stack } from 'expo-router';
import '../global.css';

export default function AuthLayout() {
    return (
        <Stack>
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="signup" options={{ headerShown: false }} />
            <Stack.Screen name="userInfo" options={{ headerShown: false }} />
            <Stack.Screen name="welcome" options={{ headerShown: false }} />
                        <Stack.Screen name="createProfile" options={{ headerShown: false }} />

            <Stack.Screen name="userInterest" options={{ headerShown: false }} />
            <Stack.Screen name="userConfigProfile" options={{ headerShown: false }} />
        </Stack>
    );
}