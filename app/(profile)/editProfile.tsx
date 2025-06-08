import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { getAuth, signOut } from 'firebase/auth';
import 'tailwindcss/tailwind.css';
import Svg, { G, Path } from "react-native-svg";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from "../../library/firebaseConfig";
import { SafeAreaView } from 'react-native-safe-area-context';
import { FormControl } from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';


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

    const formatDate = (date: Date) => {
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <SafeAreaView className="flex flex-col w-full max-w-md mx-auto bg-yellow-50 min-h-screen overflow-y-auto">
            <ScrollView className='p-4'>
                <View className=''>
                    <Text className="font-bold text-center text-lg text-amber-800">Edit profile</Text>
                    <View className='gap-y-4'>
                        <View>
                            <Image
                                source={require('../../assets/images/safinder-logo.png')}
                                style={{ width: 100, height: 100, alignSelf: 'center', marginTop: 20 }}
                                resizeMode="cover"
                            />
                        </View>
                        <FormControl isRequired>
                            <View className='flex-row items-center mb-2 gap-x-1'>
                                <Text>Nombre</Text>
                                <Text className="text-red-400">*</Text>
                            </View>
                            <Input action='primary' className="rounded-xl py-2.5 px-3.5" size="xl">
                                <InputField
                                    className=" text-base px-0"
                                    placeholder="Email"
                                    value={name}
                                    onChangeText={setName}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                //accessibilityLabel={t("name_label")}
                                />
                            </Input>
                        </FormControl>
                        <FormControl isRequired>
                            <View className='flex-row items-center mb-2 gap-x-1'>
                                <Text>Apellidos</Text>
                                <Text className="text-red-400">*</Text>
                            </View>
                            <Input action='primary' className="rounded-xl py-2.5 px-3.5" size="xl">
                                <InputField
                                    className=" text-base px-0"
                                    placeholder="Surname"
                                    value={surname}
                                    onChangeText={setSurname}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                //accessibilityLabel={t("name_label")}
                                />
                            </Input>
                        </FormControl>
                        <FormControl isRequired>
                            <View className='flex-row items-center mb-2 gap-x-1'>
                                <Text>Fecha de nacimiento</Text>
                                <Text className="text-red-400">*</Text>
                            </View>
                            <Input action='primary' className="rounded-xl py-2.5 px-3.5" size="xl">
                                <InputField
                                    className=" text-base px-0"
                                    placeholder="Fecha de nacimiento"
                                    value= {dob ? formatDate(dob) : "dd/mm/yyyy"}
                                    onChangeText={(text) => setDob(new Date(text))}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                //accessibilityLabel={t("name_label")}
                                />
                            </Input>
                        </FormControl>
                        <FormControl isRequired>
                            <View className='flex-row items-center mb-2 gap-x-1'>
                                <Text>Biografía</Text>
                                <Text className="text-red-400">*</Text>
                            </View>
                            <Input action='primary' className="rounded-xl py-2.5 px-3.5 h-40 items-start" size="xl">
                                <InputField
                                    className=" text-base px-0 h-5"
                                    placeholder="Descripción"
                                    value={bio}
                                    onChangeText={setBio}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                //accessibilityLabel={t("name_label")}
                                />
                            </Input>
                        </FormControl>
                        <FormControl isRequired>
                            <Input action='primary' className="rounded-xl py-2.5 px-3.5" size="xl">
                                <InputField
                                    className=" text-base px-0"
                                    placeholder="Country"
                                    value={country}
                                    onChangeText={setCountry}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                //accessibilityLabel={t("name_label")}
                                />
                            </Input>
                        </FormControl>
                        <TouchableOpacity
                            onPress={saveDetails}
                            className="bg-pink-500 py-3 rounded-lg mb-8"
                        >
                            <Text className="text-white text-center font-bold px-6 py-2">Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default EditProfile;