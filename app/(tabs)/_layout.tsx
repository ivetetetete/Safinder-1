import { Tabs } from 'expo-router';
import { FontAwesome, Entypo } from '@expo/vector-icons';
import '../global.css';

const TabsLayout = () => {
    return (
        <Tabs
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: '#A78BFA', 
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.3,
                    shadowRadius: 6,
                    elevation: 10,
                    height: 85,
                },
                tabBarActiveTintColor: '#dfd3e8',
                tabBarInactiveTintColor: '#2A2C38',
                tabBarLabelStyle: {
                    fontSize: 12,
                    marginBottom: -5,
                },
                tabBarIconStyle: {
                    marginTop: 8,
                },
                headerStyle: {
                    backgroundColor: '#424447',
                },
                headerTintColor: '#2A2C38',
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'home',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="home" color={color} size={30} />
                    ),
                }}
            />
            <Tabs.Screen
                name="map"
                options={{
                    headerShown: false,
                    title: 'map',
                    tabBarIcon: ({ color, size }) => (
                        <Entypo name="map" color={color} size={30} />
                    ),
                }}
            />
            <Tabs.Screen
                name="chat"
                options={{
                    headerShown: false,
                    title: 'chat',
                    tabBarIcon: ({ color, size }) => (
                        <Entypo name="message" color={color} size={30} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    headerShown: false,
                    title: 'profile',
                    tabBarIcon: ({ color, size }) => (
                        <Entypo name="user" color={color} size={30} />
                    ),
                }}
            />
        </Tabs>
    );
};

export default TabsLayout;