import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, StatusBar, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, setDoc } from 'firebase/firestore';
import { db } from "../../library/firebaseConfig";
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import RNPickerSelect from 'react-native-picker-select';


export default function UserConfigProfile() {
  const { userId } = useLocalSearchParams();
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [dob, setDob] = useState(new Date());
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [gender, setGender] = useState('');
  const [bio, setBio] = useState('');

  const router = useRouter();
  const [date, setDate] = useState(new Date());

  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };


  const saveDetails = async () => {
    try {
      const userDocRef = doc(db, "users", userId as string);
      await setDoc(userDocRef, {
        userId: userId,
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
    <SafeAreaView className="flex-1 h-screen bg-[#FF7DB0]">
      <View className='p-3 flex flex-row justify-center gap-x-5'>
        <View className='border-2 rounded-full w-32 h-2  bg-pink-500 border-pink-500 flex justify-center items-center'>
        </View>
        <View className='border-2 rounded-full w-32 h-2  bg-pink-500 border-pink-500 flex justify-center items-center'>
        </View>
        <View className='border-2 rounded-full w-32 h-2  bg-pink-500 border-pink-500 flex justify-center items-center'>
        </View>
      </View>
      <View className='flex justify-center items-center my-auto'>
        <Text className='font-bold text-white text-2xl text-center py-3'>Let's create your profile!</Text>
        <View>
          <View className='size-48 flex justify-center items-end m-auto relative'>
            <Image
              className='w-40 h-40 rounded-full border-8 border-white m-auto'
              source={require('../../assets/images/blank-profile.png')} />
            <View className='bg-pink-500 rounded-full size-10 flex justify-center items-center absolute bottom-5 right-5'>
              <Text className='font-bold text-2xl text-white m-0 p-0'>+</Text>
            </View>
          </View>
        </View>

        <View className='mt-3 gap-y-3 px-3 w-full'>
          <View className="border-2 border-white rounded-lg flex-row items-center p-2">
            <TextInput
              placeholder="Explain a little bit about youself"
              value={name}
              onChangeText={setName}
              className="px-4 pt-2 pb-12 mt-0 text-black"
              placeholderTextColor="#EC4899"
            />
          </View>
        </View>
        {/* <TouchableOpacity onPress={saveDetails} className="bg-red-400 m-4 p-3 rounded-lg mx-auto mb-8 w-40"
        >
          <Text className='text-center text-white'>Save Details</Text>
        </TouchableOpacity> */}

        <TouchableOpacity onPress={() => router.push('/home')} className="bg-pink-500 m-4 p-3 rounded-lg mx-auto mb-8 w-40"
        >
          <Text className='text-center text-white'>Save Details</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

