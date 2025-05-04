import { Tabs } from 'expo-router';
import { FontAwesome, Entypo } from '@expo/vector-icons';
import '../global.css';
import { Home, Map, MessageSquare, UserRound } from 'lucide-react-native';

const TabsLayout = () => {
    return (
        <Tabs
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: '#FFF', 
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.3,
                    shadowRadius: 6,
                    elevation: 10,
                    height: 85,
                },
                tabBarActiveTintColor: '#FF7DB0',
                tabBarInactiveTintColor: '#98A2B3',
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
                    title: 'Inicio',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Home color={color} size={30} />
                    ),
                }}
            />
            <Tabs.Screen
                name="map"
                options={{
                    headerShown: false,
                    title: 'Mapa',
                    tabBarIcon: ({ color, size }) => (
                        <Map color={color} size={30} />
                    ),
                }}
            />
            <Tabs.Screen
                name="chat"
                options={{
                    headerShown: false,
                    title: 'Chat',
                    tabBarIcon: ({ color, size }) => (
                        <MessageSquare color={color} size={30} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    headerShown: false,
                    title: 'Perfil',
                    tabBarIcon: ({ color, size }) => (
                        <UserRound color={color} size={30} />
                    ),
                }}
            />
        </Tabs>
    );
};

export default TabsLayout;