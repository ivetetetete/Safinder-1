import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Button, StatusBar, ScrollView } from 'react-native';
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
        <SafeAreaView className="flex-1 h-screen bg-[#FFEA8A]">
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
        //     <SafeAreaView className="flex-1 bg-[#FFFFD8] items-center justify-center p-4">
        //   <Text className="text-4xl font-bold text-center mb-8 color-[##FF7DB0]">
        //     Welcome to Safinder
        //   </Text>
        //   <Image 
        //     source={require('../../assets/images/safinder-logo.png')} 
        //     className="w-64 h-64 mb-8"
        //     resizeMode="contain"
        //   />
        //   <TouchableOpacity 
        //     onPress={() => router.push('/userData')}
        //     className="w-full p-4 rounded-full items-center"
        //     style={{ backgroundColor: '##FFA876' }}
        //   >
        //     <Text className="text-white text-lg font-bold">Get Started</Text>
        //   </TouchableOpacity>
        // </SafeAreaView>

        // <ScrollView className="flex-1 bg-[#FFEA8A] p-4">
        //     <Text className="text-2xl font-bold mb-6 color-[#FF7DB0]">
        //         Personal Information
        //     </Text>

        //     <TextInput
        //         placeholder="First Name"
        //         value={firstName}
        //         onChangeText={setFirstName}
        //         className="bg-white p-3 rounded-lg mb-4"
        //     />

        //     <TextInput
        //         placeholder="Last Name"
        //         value={lastName}
        //         onChangeText={setLastName}
        //         className="bg-white p-3 rounded-lg mb-4"
        //     />

        //     <View className="flex-row space-x-4 mb-4">
        //         {['Male', 'Female', 'Other'].map((option) => (
        //             <TouchableOpacity
        //                 key={option}
        //                 onPress={() => setGender(option)}
        //                 className={`p-3 rounded-lg ${gender === option ? 'bg-[#FF7DB0]' : 'bg-white'}`}
        //             >
        //                 <Text>{option}</Text>
        //             </TouchableOpacity>
        //         ))}
        //     </View>

        //     <TextInput
        //         placeholder="Birthdate (YYYY-MM-DD)"
        //         value={birthdate}
        //         onChangeText={setBirthdate}
        //         className="bg-white p-3 rounded-lg mb-4"
        //     />

        //     <TouchableOpacity
        //         onPress={() => router.push('/welcome')}
        //         className="w-full p-4 rounded-full items-center mt-4 color-[#FF7DB0]"

        //     >
        //         <Text className="text-white text-lg font-bold">Next</Text>
        //     </TouchableOpacity>
        // </ScrollView>
    );
}