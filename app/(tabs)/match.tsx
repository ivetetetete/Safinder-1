import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity,  ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { getAuth, signOut } from 'firebase/auth';
import 'tailwindcss/tailwind.css';
import Svg, { G, Path } from "react-native-svg";
import { doc, getDoc } from 'firebase/firestore';
import { db } from "../../library/firebaseConfig";
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';


const Profile = () => {
    const router = useRouter();
    const auth = getAuth();
    const [user, setUser] = useState(auth.currentUser);
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [dob, setDob] = useState(new Date());
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [gender, setGender] = useState('');
    const [bio, setBio] = useState('');

    //CONSEGUIR DATOS DEL MATCH

    return (
        <SafeAreaView className="flex flex-col w-full max-w-md mx-auto bg-yellow-50/50  min-h-screen overflow-y-auto">
            <Text>ITS A MATCH</Text>

            <View className='w-80 h-[500px] bg-yellow-300 rounded-lg mx-auto mt-5 mb-3' >
                <Image
                    src={require("assets/images/fake-images/mirror.jpg")}
                    alt="Profile"
                    style={{ width: 70, height: 70 }}
                    className='w-full h-full object-cover rounded-lg'
                    //resizeMode='contain'
                />

                <Text className='font-semibold text-xl'>ivette, 22</Text>

            </View>
        </SafeAreaView>
    );
};

export default Profile;

//you're the best
