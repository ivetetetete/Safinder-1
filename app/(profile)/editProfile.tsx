import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { getAuth, signOut } from 'firebase/auth';
import 'tailwindcss/tailwind.css';
import Svg, { G, Path } from "react-native-svg";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from "../../library/firebaseConfig";
import { SafeAreaView } from 'react-native-safe-area-context';


const EditProfile = () => {
    const router = useRouter();
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    const [user, setUser] = useState(auth.currentUser);
    const [username, setUsername] = useState(auth.currentUser?.displayName);
    const [email, setEmail] = useState(auth.currentUser?.email);
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [dob, setDob] = useState(new Date());
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [gender, setGender] = useState('');
    const [bio, setBio] = useState('');

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.replace('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    //BORRAR CUENTA
    //LOG OUT

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        if (user) {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setUsername(userData.username || "");
                setEmail(userData.email || "");
                setSurname(userData.surname || "");
                setName(userData.name || "");
                setDob(userData.dateOfBirth || "");
                setCountry(userData.country || "");
                setCity(userData.city || "");
                setGender(userData.gender || "");
                setBio(userData.bio || "");
            }
        }
    };

    const saveDetails = async () => {
        try {
            const userDocRef = doc(db, "users", userId as string);
            await setDoc(userDocRef, {
                userId: userId,
                username,
                email,
                name,
                surname,
                dateOfBirth: dob,
                country,
                city,
                gender,
                bio
            });
            router.push({
                pathname: '/home',
                params: { name: name }
            });
        } catch (error) {
            console.error("Error saving user details: ", error);
        }
    };

    return (
        <SafeAreaView className='bg-[#FFEA8A]'>
            <View className=' p-5 h-screen'>
                <Text className='text-center font-bold text-xl mb-2'>EditProfile</Text>
                <View className='gap-y-2'>
                    <TextInput
                        placeholder="Nombre"
                        value={name}
                        onChangeText={setName}
                        className="px-4 py-3 border border-pink-500 rounded-xl disabled:opacity-40"
                        //readOnly
                        placeholderTextColor={"#FFA876"}
                    />
                    <TextInput
                        placeholder="Apellidos"
                        value={surname}
                        onChangeText={setSurname}
                        className="px-4 py-3 border border-pink-500 rounded-xl disabled:opacity-40"
                        // readOnly
                        placeholderTextColor={"#FFA876"}
                    />
                </View>
                <TouchableOpacity
                    onPress={saveDetails}
                    className="bg-pink-500 py-3 rounded-lg mb-8"
                >
                    <Text className="text-white text-center font-bold px-6 py-2">Save</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default EditProfile;