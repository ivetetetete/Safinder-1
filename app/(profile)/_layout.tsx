import { Stack } from 'expo-router';
import '../global.css';

export default function ProfileLayout() {
    return (
        <Stack>
            <Stack.Screen name="editProfile" options={{ headerShown: false }} />
            <Stack.Screen name="settings" options={{ headerShown: false }} />
            <Stack.Screen name="userData" options={{ headerShown: false }} />
            <Stack.Screen name="welcome" options={{ headerShown: false }} />
            <Stack.Screen name="userInterest" options={{ headerShown: false }} />
            <Stack.Screen name="userConfigProfile" options={{ headerShown: false }} />

        </Stack>
    );
}