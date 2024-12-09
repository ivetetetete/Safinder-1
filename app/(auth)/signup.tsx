import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from "../../library/firebaseConfig";
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function SignUp() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [confirmPasswordHidden, setConfirmPasswordHidden] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const togglePasswordVisibility = () => {
    setPasswordHidden(!passwordHidden);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordHidden(!confirmPasswordHidden);
  };

  const handleSignUp = async () => {
    if (!username || !email || !password || !confirmPassword) {
      setErrorMessage("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      console.log("Attempting to create user with email:", email);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User created successfully:", user.uid);

      console.log("Attempting to create Firestore document");
      try {
        await setDoc(doc(db, 'users', user.uid), {
          userId: user.uid,
          username: username,
          email: email,
        });
        console.log("Firestore document created successfully");
        router.push({
          pathname: '/profile/userData',
          params: { userId: user.uid }
        });
      } catch (firestoreError: any) {
        console.error("Firestore error:", firestoreError.code, firestoreError.message);
        setErrorMessage(`Error creating user profile: ${firestoreError.message}`);
      }
    } catch (authError: any) {
      console.error("Authentication error:", authError.code, authError.message);
      setErrorMessage(`Error creating user: ${authError.message}`);
    }
  };

  return (
    <LinearGradient
      colors={['#ff7db0', '#ffd43b']}
      style={{ flex: 1 }}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      className='h-screen'
    >
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 justify-center px-6"
        >
          <View className="bg-white rounded-3xl p-8 shadow-lg">
          <Text className="text-4xl font-bold text-[#FFA876] mb-6 text-center">Welcome to Safinder</Text>

            {errorMessage ? (
              <Text className="text-red-500 text-sm mb-4 text-center">{errorMessage}</Text>
            ) : null}

            <View className="space-y-4">
              <View className="border border-[#FFA876] rounded-xl mb-3 ">  
                <TextInput
                  placeholder="Username"
                  value={username}
                  onChangeText={setUsername}
                  className="px-4 py-3 text-black "
                  placeholderTextColor="#FFA876"
                  autoCapitalize="none"
                />
              </View>

              <View className="border border-[#FFA876] rounded-xl mb-3">
                <TextInput
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  className="px-4 py-3 text-black "
                  placeholderTextColor="#FFA876"
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              <View className="border border-[#FFA876] rounded-xl mb-3 flex-row items-center">
                <TextInput
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={passwordHidden}
                  className="flex-1 px-4 py-3 text-black "
                  placeholderTextColor="#FFA876"
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={togglePasswordVisibility} className="pr-4">
                  <Ionicons
                    name={passwordHidden ? 'eye-outline' : 'eye-off-outline'}
                    size={24}
                    color="#FFA876"
                  />
                </TouchableOpacity>
              </View>

              <View className="border border-[#FFA876] rounded-xl flex-row items-center">
                <TextInput
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={confirmPasswordHidden}
                  className="flex-1 px-4 py-3 text-black"
                  placeholderTextColor="#FFA876"
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={toggleConfirmPasswordVisibility} className="pr-4">
                  <Ionicons
                    name={confirmPasswordHidden ? 'eye-outline' : 'eye-off-outline'}
                    size={24}
                    color="#FFA876"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleSignUp}
              className="bg-[#FFA876] mt-6 py-3 rounded-2xl"
            >
              <Text className="text-white font-bold text-center text-lg">Sign Up</Text>
            </TouchableOpacity>

            <View className="flex-row justify-center mt-6">
              <Text className="text-gray-400">Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text className="text-[#FF7DB0] font-bold">Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>

  );
}

// you're the smartest 