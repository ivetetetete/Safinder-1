import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { getAuth, signOut } from 'firebase/auth';
import 'tailwindcss/tailwind.css';
import Svg, { G, Path } from "react-native-svg";
import { doc, getDoc } from 'firebase/firestore';
import { db } from "../../library/firebaseConfig";


const Settings = () => {
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

  return (
    <Text>Settings</Text>
  );
};

export default Settings;