import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Button, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, setDoc } from 'firebase/firestore';
import { db } from "../../library/firebaseConfig";
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import RNPickerSelect from 'react-native-picker-select';
import { LinearGradient } from 'expo-linear-gradient';


export default function UserInterest() {
  const { userId } = useLocalSearchParams();

  const [relation, setRelation] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const router = useRouter();


  return (
    <LinearGradient
      colors={['#ff7db0', '#ffd43b']}
      style={{ flex: 1 }}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      className='h-screen'
    >
      <SafeAreaView className="flex-1 h-screen">
        <View className='p-3 flex flex-row justify-center gap-x-5'>
          <View className='border-2 rounded-full w-32 h-2  bg-pink-500 border-pink-500 flex justify-center items-center'>
          </View>
          <View className='border-2 rounded-full w-32 h-2  bg-pink-500 border-pink-500 flex justify-center items-center'>
          </View>
          <View className='border-2 rounded-full w-32 h-2 opacity-50  bg-white border-white flex justify-center items-center'>
          </View>
        </View>
        <View className='flex justify-center items-center my-auto mx-4 bg-white rounded-3xl p-8 shadow-lg'>
          <Text className='font-bold text-pink-500 text-2xl text-center py-3'>We want to know even more about you</Text>
          <View className='mt-3 gap-y-3 px-3 w-full'>
            <View className="border-2 border-pink-400 rounded-lg flex-row items-center p-2">
              <TextInput
                placeholder="Kind of relation"
                value={relation}
                onChangeText={setRelation}
                className="px-4 py-3 text-black"
                placeholderTextColor="#EC4899"
              />
            </View>

            <View className="border-2 border-pink-400 rounded-lg flex-row items-center p-2">
              <TextInput
                placeholder="Country"
                value={country}
                onChangeText={setCountry}
                className="px-4 py-3 text-black"
                placeholderTextColor="#EC4899"
              />
            </View>
            <View className="border-2 border-pink-400 rounded-lg flex-row items-center p-2">
              <TextInput
                placeholder="City"
                value={city}
                onChangeText={setCity}
                className="px-4 py-3 text-black"
                placeholderTextColor="#EC4899"
              />
            </View>
            {/* <DateTimePicker
          testID="dateTimePicker"
          value={dob}
          mode="date" // Set mode to "date" to select only date
          is24Hour={true}
          display="default"
          onChange={onChange}
        /> 
        <View className="border-2 border-[#FF7DB0] rounded-lg flex-row items-center p-2">
        <TextInput
            placeholder="Country"
            value={country}
            onChangeText={setCountry}
            className="px-4 py-3 text-black"
            placeholderTextColor="#FF7DB0"
          />
        </View>
        <View className="border-2 border-[#FF7DB0] rounded-lg flex-row items-center p-2">
          <TextInput
            placeholder="Ciudad"
            value={city}
            onChangeText={setCity}
            className="px-4 py-3 text-black"
            placeholderTextColor="#FF7DB0"
          />
        </View>
        <View className="border-2 border-[#FF7DB0] rounded-lg flex-row items-center p-2">
          <TextInput
            placeholder="Gender"
            value={gender}
            onChangeText={setGender}
            className="px-4 py-3 text-black"
            placeholderTextColor="#FF7DB0"
          />
        </View>
        <View className="border-2 border-[#FF7DB0] rounded-lg flex-row items-center p-2">
          <TextInput
            placeholder="Bio"
            value={bio}
            onChangeText={setBio}
            className="px-4 py-3 text-black"
            placeholderTextColor="#FF7DB0"
          />
        </View>
        */}
          </View>
          {/* <TouchableOpacity onPress={saveDetails} className="bg-red-400 m-4 p-3 rounded-lg mx-auto mb-8 w-40"
        >
          <Text className='text-center text-white'>Save Details</Text>
        </TouchableOpacity> */}

          <TouchableOpacity onPress={() => router.push('/userConfigProfile')} className="bg-pink-500 m-4 p-3 rounded-lg mx-auto mb-8 w-40"
          >
            <Text className='text-center text-white'>Next</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

