import { Stack } from 'expo-router';
import '../global.css';

export default function AuthLayout() {
    return (
        <Stack screenOptions={{ headerShown: false}}>
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="signup" options={{ headerShown: false }} />
            <Stack.Screen name="userData" options={{ headerShown: false }} />
        </Stack>
    );
}