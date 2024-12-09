import { Stack } from 'expo-router';
import '../global.css';

export default function AuthLayout() {
    return (
        <Stack screenOptions={{ headerShown: false}}>
            <Stack.Screen name="editProfile" options={{ headerShown: false }} />
            <Stack.Screen name="settings" options={{ headerShown: false }} />
            <Stack.Screen name="userData" options={{ headerShown: false }} />
        </Stack>
    );
}