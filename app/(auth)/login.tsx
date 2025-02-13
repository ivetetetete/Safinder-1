import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../library/firebaseConfig';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in successfully:', userCredential.user.uid);
      router.push('/(tabs)/home');
    } catch (error: any) {
      setErrorMessage("The email and/or the password are incorrect!");
      console.error('Error logging in:', error.message);
    }
  };

  return (
    <>
      <LinearGradient
        colors={['#ffd43b', '#ff7db0']}
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
              <Text className="text-4xl font-bold text-[#FF7DB0] mb-6 text-center">Welcome to Safinder</Text>

              {errorMessage ? (
                <Text className="text-red-500 text-sm mb-4 text-center">{errorMessage}</Text>
              ) : null}

              <View className="space-y-2">
                <View className="border border-[#FF7DB0] rounded-xl mb-3">
                  <TextInput
                    placeholder="email"
                    value={email}
                    onChangeText={setEmail}
                    className="px-4 py-3 text-black"
                    placeholderTextColor="#FF7DB0"
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>

                <View className="border border-[#FF7DB0] rounded-xl flex-row items-center">
                  <TextInput
                    placeholder="password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={passwordHidden}
                    className="flex-1 px-4 py-3 text-white"
                    placeholderTextColor="#FF7DB0"
                    autoCapitalize="none"
                  />
                  <TouchableOpacity onPress={() => setPasswordHidden(!passwordHidden)} className="pr-4">
                    <Ionicons
                      name={passwordHidden ? 'eye-outline' : 'eye-off-outline'}
                      size={24}
                      color="gray"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                onPress={handleLogin}
                className="bg-[#FF7DB0] mt-6 py-3 rounded-2xl"
              >
                <Text className="text-white font-bold text-center text-lg">Login</Text>
              </TouchableOpacity>
              <View className="flex-row justify-center mt-6">
                <Text className="text-gray-400">You don't have an account? </Text>
                <TouchableOpacity onPress={() => router.push('/welcome')}>
                  <Text className="text-[#FFA876] font-bold">Sign up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </>

  );
}

// you're the cutest