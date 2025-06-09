import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, TextInput, Modal, TouchableWithoutFeedback, FlatList, Alert, Image } from 'react-native';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from "../../library/firebaseConfig";
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { FormControl } from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';

import Select from '@/components/Select';
import SelectMultiple from '@/components/SelectMultiple';
import { Button, ButtonText } from '@/components/ui/button';
import { ScrollView } from 'react-native';
import { Divider } from '@/components/ui/divider';
import { Calendar } from 'lucide-react-native';

export default function CreateProfile() {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;

    const router = useRouter();
        const [id, setId] = useState(userId || '');
    
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleUserData = async () => {
        if (!userId) {
    setErrorMessage("User not authenticated");
    return;
}


        if (!username || !bio) {
            setErrorMessage("All fields are required");
            return;
        }

        

        try {
            const userDocRef = doc(db, "users", userId as string);
            await setDoc(userDocRef, {
                userId: userId,
                username,
                bio
            }, { merge: true });
            router.push({
                pathname: '/home',
                params: { id: userId }
            });

            console.log("User details saved successfully");
        } catch (error) {
            console.error("Error saving user details: ", error);
        }
    };

    return (
        <SafeAreaView className='flex-1 bg-yellow-50'>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled">
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    className="flex-1"
                >
                    <Text className="text-4xl p-5 font-bold text-yellow-400">Crea tu perfil</Text>
                    <View className="bg-yellow-50 p-5">
                        <View className='mb-2'>
                            {errorMessage ? (
                                <Text className="text-red-500 text-sm mb-4 text-center">{errorMessage}</Text>
                            ) : null}
                        </View>
                        <View className="gap-y-4 my-3">

                            <View className='size-48 flex justify-center items-end m-auto relative'>
                                <Image
                                    className='w-40 h-40 rounded-full border-8 border-white m-auto'
                                    source={require('../../assets/images/blank-profile.png')} />
                                <View className='bg-pink-500 rounded-full size-10 flex justify-center items-center absolute bottom-5 right-5'>
                                    <Text className='font-bold text-2xl text-white m-0 p-0'>+</Text>
                                </View>
                            </View>

                            <FormControl isRequired>
                                <View className='flex-row items-center mb-2 gap-x-1'>
                                    <Text>Apodo (nombre visible en los chats) </Text>
                                    <Text className="text-red-400">*</Text>
                                </View>

                                <Input action='secondary' className="rounded py-2.5 px-3.5" size="xl">
                                    <InputField
                                        className=" text-base px-0"
                                        placeholder=""
                                        value={username}
                                        onChangeText={setUsername}
                                    //accessibilityLabel={t("name_label")}
                                    />
                                </Input>
                            </FormControl>

                            <FormControl isRequired>
                                <View className=' mb-2 '>
                                    <View className='flex-row items-center gap-x-1'>
                                        <Text>Biografía</Text>
                                        <Text className="text-red-400 ">*</Text>
                                    </View>
                                    <Text className='text-sm text-neutral-500'>Explica un poco sobre ti!</Text>
                                </View>

                                <Input action='secondary' className="rounded py-2.5 px-3.5 h-32" size="xl">
                                    <InputField
                                        value={bio}
                                        onChangeText={setBio}
                                        className="text-base px-0"
                                        multiline={true}
                                        textAlignVertical="top" // (Optional) Aligns text to the top on Android
                                    />
                                </Input>

                            </FormControl>

                        </View>


                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={handleUserData}
                            className="bg-secondary-300 mt-6 py-3 rounded-lg"
                        >
                            <Text className="text-white font-bold text-center text-lg">Aceptar </Text>
                        </TouchableOpacity>

                    </View>
                </KeyboardAvoidingView>

            </ScrollView>
        </SafeAreaView>
    )


}