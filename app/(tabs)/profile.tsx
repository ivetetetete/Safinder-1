import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
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

  // Sample profile data
  const profile = {
    username: "sunshine_vibes",
    bio: "Digital creator | Travel enthusiast | Good vibes only ✨\nSharing moments that make life beautiful",
    posts: [
      { id: 1, imageUrl: "/api/placeholder/150/150", likes: 234 },
      { id: 2, imageUrl: "/api/placeholder/150/150", likes: 189 },
      { id: 3, imageUrl: "/api/placeholder/150/150", likes: 327 },
      { id: 4, imageUrl: "/api/placeholder/150/150", likes: 156 },
      { id: 5, imageUrl: "/api/placeholder/150/150", likes: 298 },
      { id: 6, imageUrl: "/api/placeholder/150/150", likes: 211 }
    ],
    followers: 2458,
    following: 843
  };

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
    router.push('../(profile)/settings');
  }

  const goEditProfile = () => {
    router.push('../(profile)/editProfile');
  }

  return (
    <SafeAreaView className="flex flex-col w-full max-w-md mx-auto bg-yellow-50 min-h-screen overflow-y-auto">
      <ScrollView className=''>
        <View className='flex flex-row justify-between items-center p-4'>
          <TouchableOpacity onPress={goEditProfile} className='bg-yellow-200 p-2 rounded-full hover:bg-yellow-300 transition-colors'>
            <Ionicons name="pencil-outline" size={20} color="#FF7DB0" />
          </TouchableOpacity>

          <Text className="font-bold text-lg text-amber-800">Profile</Text>

          <TouchableOpacity onPress={goEditProfile} className='bg-yellow-200 p-2 rounded-full hover:bg-yellow-300 transition-colors'>
            <Ionicons name="settings-outline" size={20} color="#FF7DB0" />
          </TouchableOpacity>

        </View>
        {/* Profile Information */}
        <View className="flex flex-col items-center px-4 pt-2">
          <Image
            src="/api/placeholder/100/100"
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-yellow-300 object-cover"
          />

          <Text className="text-xl font-bold mt-2 text-amber-900">{name}</Text>

          <Text className="text-center text-amber-700 mt-1 px-8 whitespace-pre-line">{bio}</Text>

          <View className="flex flex-row mt-4 mb-6 items-center justify-center">
            <View className="flex flex-col items-center mx-4">
              <Text className="font-bold text-amber-900">{profile.posts.length}</Text>
              <Text className="text-amber-700 text-sm">Posts</Text>
            </View>

            <View className="flex flex-col items-center mx-4">
              <Text className="font-bold text-amber-900">{profile.followers}</Text>
              <Text className="text-amber-700 text-sm">Followers</Text>
            </View>

            <View className="flex flex-col items-center mx-4">
              <Text className="font-bold text-amber-900">{profile.following}</Text>
              <Text className="text-amber-700 text-sm">Following</Text>
            </View>
          </View>

          {/* TouchableOpacitys */}
          <View className="flex flex-row w-full justify-center mb-6">
            <TouchableOpacity
              className="bg-amber-400 rounded-full py-2 px-6 mr-3 hover:bg-amber-500 transition-colors"
            >
              <Text className="text-amber-900 font-bold">Follow</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-pink-300 rounded-full py-2 px-6 hover:bg-pink-400 transition-colors"
            >
              <Text className="text-pink-800 font-bold">Message</Text>
            </TouchableOpacity>
          </View>

          {/* Social Media Link */}
          <TouchableOpacity
            onPress={() => { }}
            className="flex flex-row items-center bg-yellow-100 px-4 py-2 rounded-full mb-6 hover:bg-yellow-200 transition-colors"
          >
            <Ionicons name="logo-instagram" size={20} color="#FF7DB0" />

            <Text className="ml-2 text-amber-800">@sunshine_vibes</Text>
            <Ionicons name="link-outline" size={20} color="#FF7DB0" className='ml-1' />
          </TouchableOpacity>
        </View>

        {/* Posts Grid */}
        <Text className="font-bold text-lg text-amber-800 px-4 mb-2">Posts</Text>
        <View className="flex flex-row flex-wrap px-2">
          {profile.posts.map(post => (
            <View key={post.id} className="w-1/3 p-1">
              <View className="bg-white rounded-lg overflow-hidden shadow-sm">
                <Image
                  src={post.imageUrl}
                  alt="Post"
                  className="w-full h-32 object-cover"
                />
                <View className="flex flex-row items-center p-2 bg-gray-100">
                  <Ionicons name="heart-outline" size={20} color="#FF7DB0" />
                  <Text className="ml-1 text-xs text-amber-700">{post.likes}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

//you're the best
