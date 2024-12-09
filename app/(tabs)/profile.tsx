import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { getAuth, signOut } from 'firebase/auth';
import 'tailwindcss/tailwind.css';
import Svg, { G, Path } from "react-native-svg";
import { doc, getDoc } from 'firebase/firestore';
import { db } from "../../library/firebaseConfig";
import { Ionicons } from '@expo/vector-icons';


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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    if (user) {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
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

  const goSettings = () => {
    router.push('../profile/settings');
  }

  const goEditProfile = () => {
    router.push('../profile/editProfile');
  }

  return (
    <ScrollView className=''>
      <View className="bg-[#FFA876]">
        <View className='flex flex-row pt-10 px-3 h-24 w-full justify-between items-center'>
          <Text className="text-xl font-bold text-white">Profile</Text>
          <View className='flex flex-row gap-4'>
            <TouchableOpacity onPress={goEditProfile}>
              <Ionicons name="pencil-outline" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={goSettings}>
              <Svg
                viewBox="0 0 28 28"
                fill="none"
                width={20}
                height={20}
              //xmlns="http://www.w3.org/2000/svg"
              >
                <G clipRule="evenodd" fill="#fff" fillRule="evenodd">
                  <Path d="M14 20a6 6 0 100-12 6 6 0 000 12zm4-6a4 4 0 11-8 0 4 4 0 018 0z" />
                  <Path d="M0 13v2a3 3 0 002.678 2.983c.128.363.273.718.433 1.064a3 3 0 00.182 4.045l1.414 1.414a3 3 0 003.963.247c.434.216.884.406 1.346.569A3 3 0 0013 28h2a3 3 0 002.983-2.677c.42-.148.83-.318 1.227-.51a3 3 0 003.884-.307l1.414-1.414a3 3 0 00.307-3.884c.191-.397.362-.806.51-1.226A3 3 0 0028 15v-2a3 3 0 00-2.677-2.983 11.927 11.927 0 00-.569-1.348 3 3 0 00-.248-3.962l-1.414-1.414a3 3 0 00-4.043-.183 11.943 11.943 0 00-1.067-.434A3 3 0 0014.999 0h-2a3 3 0 00-2.983 2.678 11.94 11.94 0 00-1.193.494 3 3 0 00-4.115.12L3.294 4.708a3 3 0 00-.121 4.115c-.186.387-.351.786-.495 1.195A3 3 0 000 13zM16 3a1 1 0 00-1-1h-2a1 1 0 00-1 1v.383c0 .475-.337.88-.794 1.012a9.94 9.94 0 00-2.021.838c-.417.23-.94.182-1.277-.154l-.372-.372a1 1 0 00-1.414 0L4.708 6.12a1 1 0 000 1.414l.372.372c.336.336.384.86.155 1.277a9.938 9.938 0 00-.839 2.022c-.133.457-.537.794-1.013.794H3a1 1 0 00-1 1v2a1 1 0 001 1h.383c.476 0 .88.336 1.013.793.194.666.454 1.304.775 1.905.221.415.17.931-.162 1.264l-.302.301a1 1 0 000 1.414l1.414 1.415a1 1 0 001.415 0l.243-.244c.34-.34.872-.385 1.29-.147.668.38 1.384.684 2.137.903.457.133.793.537.793 1.013V25a1 1 0 001 1h2a1 1 0 001-1v-.383c0-.475.337-.88.794-1.012a9.934 9.934 0 002.023-.84c.417-.229.941-.18 1.277.156l.171.17a1 1 0 001.414 0l1.415-1.414a1 1 0 000-1.414l-.171-.17c-.337-.337-.384-.861-.155-1.278.35-.635.632-1.312.838-2.022.133-.457.537-.793 1.013-.793H25a1 1 0 001-1v-2a1 1 0 00-1-1h-.382c-.476 0-.88-.337-1.013-.794a9.939 9.939 0 00-.903-2.138c-.238-.419-.193-.95.147-1.29l.243-.243a1 1 0 000-1.414l-1.414-1.414a1 1 0 00-1.415 0l-.3.3c-.333.333-.85.384-1.264.163a9.935 9.935 0 00-1.906-.775c-.457-.133-.794-.537-.794-1.013V3z" />
                </G>
              </Svg>
            </TouchableOpacity>
          </View>

        </View>
        <View>
          <View className='flex justify-center items-center'>
            <Image
              className='w-40 h-40 rounded-full border-8 border-white -mb-20 z-20'
              source={require('../../assets/images/blank-profile.png')} />
          </View>
          <View className='bg-white pt-20  rounded-t-3xl mx-2 p-3'>
            <View className='flex flex-col items-center'>
              <Text className='py-3 font-bold text-2xl'>{name}</Text>
              <Text>{bio}</Text>

              <View className='flex flex-row gap-x-2 mt-5'>
                <TouchableOpacity className='bg-[#FFA876] rounded-full p-3 w-28'>
                  <Text className='text-center text-white font-semibold'>Follow</Text>
                </TouchableOpacity>
                <TouchableOpacity className='bg-[#FFA876] rounded-full p-3 w-28'>
                  <Text className='text-center text-white font-semibold'>SM</Text>
                </TouchableOpacity>
              </View>

              <View className='flex flex-row gap-x-6 mt-5'>
                <View className='flex justify-center items-center '>
                  <Text className='text-black'>900</Text>
                  <Text className='text-black'>Followers</Text>
                </View>
                <View className='flex justify-center items-center'>
                  <Text className='text-black'>15</Text>
                  <Text className='text-black'>Following</Text>
                </View>
                <View className='flex justify-center items-center'>
                  <Text className='text-black'>165</Text>
                  <Text className='text-black'>Posts</Text>
                </View>
              </View>
            </View>

            <View className='mt-6'>
              <Text className='font-bold mb-3 text-lg'>Posts</Text>
              <View className='flex flex-row gap-x-3 px-4'>
                <View className='bg-red-300 w-28 h-40 rounded-xl'></View>
                <View className='bg-red-300 w-28 h-40 rounded-xl'></View>
                <View className='bg-red-300 w-28 h-40 rounded-xl'></View>
              </View>
            </View>

            <View className='mt-6'>
              <Text className='font-bold mb-3 text-lg'>Social media</Text>
              <View className='flex flex-row gap-x-3 px-4'>
                <View className='bg-[#FFEA8A] w-16 h-16 rounded-xl'></View>
                <View className='bg-[#FFEA8A] w-16 h-16 rounded-xl'></View>
                <View className='bg-[#FFEA8A] w-16 h-16 rounded-xl'></View>
              </View>
            </View>

            <View className='my-5'>
              <TouchableOpacity
                onPress={handleLogout}
                className="bg-red-400 py-3 rounded-2xl"
              >
                <Text className="text-white text-center font-bold px-6 py-2">Logout</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </View>
    </ScrollView>
  );
};

export default Profile;

//you're the best
