import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Button, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, setDoc } from 'firebase/firestore';
import { db } from "../../library/firebaseConfig";
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';

export default function UserData() {
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

  const onChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
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
    <View className='bg-[#FFEA8A] h-screen' >
      <Text className='font-bold text-pink-500 text-2xl text-center py-3'>Sobre ti</Text>

      <View className='gap-y-3 px-3'>
        <Button title="Pick an image from camera roll" onPress={pickImage} />
        {image && <Image source={{ uri: image }} className='w-10' />}

      </View>
      <View className='gap-y-3 px-3'>
        <View className="border border-[#FF7DB0] rounded-xl flex-row items-center">
          <TextInput
            placeholder="Nombre"
            value={name}
            onChangeText={setName}
            className="px-4 py-3 text-black"
            placeholderTextColor="#FFA876"
          />
        </View>
        <View className="border border-[#FF7DB0] rounded-xl flex-row items-center">
          <TextInput
            placeholder="Apellidos"
            value={surname}
            onChangeText={setSurname}
            className="px-4 py-3 text-black"
            placeholderTextColor="#FFA876"
          />
        </View>
        <DateTimePicker
          testID="dateTimePicker"
          value={dob}
          mode="date" // Set mode to "date" to select only date
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
        <View className="border border-[#FF7DB0] rounded-xl flex-row items-center">
          <TextInput
            placeholder="Country"
            value={country}
            onChangeText={setCountry}
            className="px-4 py-3 text-black"
            placeholderTextColor="#FFA876"
          />
        </View>
        <View className="border border-[#FF7DB0] rounded-xl flex-row items-center">
          <TextInput
            placeholder="Ciudad"
            value={city}
            onChangeText={setCity}
            className="px-4 py-3 text-black"
            placeholderTextColor="#FFA876"
          />
        </View>
        <View className="border border-[#FF7DB0] rounded-xl flex-row items-center">
          <TextInput
            placeholder="Gender"
            value={gender}
            onChangeText={setGender}
            className="px-4 py-3 text-black"
            placeholderTextColor="#FFA876"
          />
        </View>
        <View className="border border-[#FF7DB0] rounded-xl flex-row items-center">
          <TextInput
            placeholder="Bio"
            value={bio}
            onChangeText={setBio}
            className="px-4 py-3 text-black"
            placeholderTextColor="#FFA876"
          />
        </View>
      </View>
      <TouchableOpacity onPress={saveDetails} className="bg-red-400 m-4 p-3 rounded-lg mx-auto mb-8 w-40"
      >
        <Text className='text-center text-white'>Save Details</Text>
      </TouchableOpacity>
    </View>
  );
}

// ... styles remain the same