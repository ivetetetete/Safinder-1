import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { getAuth, signOut } from 'firebase/auth';
import 'tailwindcss/tailwind.css';
import { doc, getDoc } from 'firebase/firestore';
import { db } from "../../library/firebaseConfig";
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pencil, Settings } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';


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
            <Pencil size={20} color="#FF7DB0" />
          </TouchableOpacity>

          <Text className="font-bold text-lg text-amber-800">Profile</Text>

          <TouchableOpacity onPress={goEditProfile} className='bg-yellow-200 p-2 rounded-full hover:bg-yellow-300 transition-colors'>
            <Settings size={20} color="#FF7DB0" />
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

          {/* Social Media Link */}
          {/* <TouchableOpacity
            onPress={() => { }}
            className="flex flex-row items-center bg-yellow-100 px-4 py-2 rounded-full mb-6 hover:bg-yellow-200 transition-colors"
          >
            <Ionicons name="logo-instagram" size={20} color="#FF7DB0" />

            <Text className="ml-2 text-amber-800">@sunshine_vibes</Text>
            <Ionicons name="link-outline" size={20} color="#FF7DB0" className='ml-1' />
          </TouchableOpacity> */}

          <View>
            <Svg
              fill="#ff7db0"
              height="50"
              width="50"
              // xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 425.517 425.517"
              // xmlSpace="preserve"
            >
              <Path d="M395.823 193.016c-20.635-13.847-46.359-13.433-70.218.717-4.881-19.376-15.446-34.394-30.224-43.121-1.049-23.959-9.14-45.377-23.54-62.115-13.841-16.088-32.52-26.579-52.594-29.542-18.381-2.712-36.118 1.041-51.301 10.85-14.311 9.245-25.601 23.632-33.009 41.915-26.587-22.848-58.395-28.787-86.592-15.703C16.369 110.853-2.914 146.204.36 183.985c2.579 29.753 18.464 58.621 45.937 83.483 32.261 29.194 79.335 52.219 139.916 68.433.521.14 1.042.206 1.556.206l.002-.013.004.011a5.975 5.975 0 004.026-1.554 519.582 519.582 0 0023.331-22.472c9.444 17.234 21.555 35.06 36.083 53.103a5.986 5.986 0 004.677 2.237l.008-.017s.423.006.636-.017c50.036-5.267 90.247-17.636 119.515-36.765 25.047-16.371 41.361-37.427 47.181-60.893 7.415-29.903-3.599-60.732-27.409-76.711zM186.155 323.447c-57.189-15.66-101.529-37.477-131.806-64.876-25.187-22.793-39.722-48.942-42.034-75.622-2.84-32.769 13.669-63.329 41.08-76.048 26.252-12.178 55.355-5.037 79.842 19.598a6 6 0 008.485.026c.712-.707 1.182-1.555 1.464-2.449l.032.011c14.377-45.229 47.794-57.172 74.278-53.261 29.314 4.326 61.006 29.309 65.467 74.265-4.903-1.542-9.959-2.433-15.056-2.722-4.841-32.059-26.65-54.848-54.485-56.118-14.816-.687-29.362 5.255-40.922 16.704-12.158 12.042-20.866 30.005-25.293 52.051-.469.15-1.391.691-3.372.821-24.829-31.162-55.345-44.128-82.053-34.688-22.106 7.811-35.978 29.594-35.34 55.494.581 23.565 13.187 48.31 35.495 69.674 26.718 25.587 66.207 46.313 117.372 61.601.564.168 1.13.248 1.689.251l.003.006a5.978 5.978 0 004.154-1.672c57.482-55.184 76.495-100.171 81.879-129.71a30.115 30.115 0 016.734 2.121 32.58 32.58 0 016.701 4.06c-9.651 44.225-42.168 92.666-94.314 140.483zm12.561-48.126c-5.856 6.501-12.286 13.192-19.338 20.063-47.68-14.625-84.391-34.043-109.14-57.745-20.003-19.156-31.296-40.928-31.798-61.303-.509-20.61 10.224-37.836 27.341-43.884 22.043-7.787 48.108 4.299 69.833 32.326 1.383 2.525 4.102 3.228 6.756 3.228 2.388 0 4.718-.563 5.961-.863 1.937-.47 3.693-1.058 5.096-1.668 3.871-1.683 5.042-5.54 5.052-5.595 3.797-20.866 11.565-37.602 22.467-48.4 9.149-9.062 20.498-13.77 31.93-13.242 17.807.814 38.082 15.123 42.975 44.568-15.609 2.008-30.821 9.525-42.533 21.708-24.641 25.632-29.889 65.871-14.602 110.807zm41.636-90.927c4.416-3.73 9.34-6.199 14.413-7.365-3.465 17.064-11.864 39.404-30.369 66.102-3.778-25.431 1.876-46.843 15.956-58.737zm62.478 52.344c1.089.706 2.478 1.417 4.01 2.053 1.536.64 3.02 1.122 4.288 1.396.832.18 1.587.226 2.271.259 2.668.128 4.653-1.736 4.711-1.791 20.358-19.33 42.093-25.686 58.146-16.992 12.291 6.655 18.375 21.091 15.5 36.774-2.879 15.706-14.331 31.21-32.246 43.655-22.2 15.422-53.201 26.056-92.136 31.657-12.096-16.257-21.86-32.167-29.077-47.381 25.982-31.351 43.514-62.521 51.751-92.249 5.461 9.245 8.596 21.646 8.975 36.327-.074 1.773.576 4.197 3.807 6.292zm108.754 30.103c-5.077 20.472-19.635 39.054-42.1 53.736-27.032 17.669-64.357 29.273-110.965 34.519-14.127-17.813-25.781-35.337-34.695-52.185a435.434 435.434 0 005.975-6.619c7.733 15.38 17.839 31.332 30.14 47.542a5.987 5.987 0 004.784 2.373s.517-.026.775-.061c42.485-5.715 76.419-17.22 100.858-34.197 20.536-14.267 33.748-32.502 37.203-51.347 3.829-20.89-4.646-40.315-21.59-49.491-20.224-10.948-46.195-4.626-69.929 16.836a19.63 19.63 0 01-1.134-.468c-1.39-29.271-13.027-50.88-32.212-59.517-15.083-6.789-32.743-4.007-46.087 7.266-19.494 16.468-26.09 46.609-17.876 81.032a328.63 328.63 0 01-6.795 8.429c-11.108-37.738-6.184-70.83 14.029-91.856 15.442-16.063 38.016-22.447 57.513-16.259 19.497 6.187 32.308 23.218 36.074 47.956l.02-.003a5.998 5.998 0 009.473 3.942c21.971-16.078 45.329-18.078 64.09-5.487 19.634 13.173 28.654 38.837 22.449 63.859z" />
            </Svg>
          </View>

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

        <View>
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-400 py-3 rounded-lg mb-8"
          >
            <Text className="text-white text-center font-bold px-6 py-2">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

//you're the best
