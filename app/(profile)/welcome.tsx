import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Button, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, setDoc } from 'firebase/firestore';
import { db } from "../../library/firebaseConfig";
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Welcome() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 h-screen bg-[#FFFFD8]">
            <View className='flex justify-center items-center m-auto'>

                <Text className='font-bold text-pink-500 text-[60px] py-3'>Welcome to Safinder!</Text>
                <Text className='font-bold text-pink-500 text-2xl text-center py-1'>We're SO excited to have you here!</Text>

                <TouchableOpacity onPress={() => router.push('/userData')}>
                    <View className='border border-pink-500 rounded-xl p-3 mt-5'>
                        <Text className="text-pink-500 font-bold text-xl">Let's get started!</Text>
                    </View>
                </TouchableOpacity>


            </View>

        </SafeAreaView>
    );
}