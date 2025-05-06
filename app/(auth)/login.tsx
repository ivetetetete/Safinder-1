import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../library/firebaseConfig';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { FormControl } from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';


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
          className="flex-1"
        >
          <Image
            source={require('../../assets/images/safinder-logo.png')}
            style={{ position: 'absolute', top: 13, right: 0}}
            resizeMode="cover"
            className="w-56 h-56"
          />
          <View className="bg-white h-screen mt-32 rounded-3xl p-8 shadow-lg">
            <Text className="text-4xl font-bold text-primary-600 mb-6">Inicio de sesión</Text>

            {errorMessage ? (
              <Text className="text-red-500 text-sm mb-4 text-center">{errorMessage}</Text>
            ) : null}


            <View className="gap-y-4">
              <FormControl isRequired>
                <Input action='primary' className="rounded-xl py-2.5 px-3.5" size="xl">
                  <InputField
                    className=" text-base px-0"
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    textContentType="emailAddress"
                  //accessibilityLabel={t("name_label")}
                  />
                </Input>
              </FormControl>

              <FormControl isRequired>
                <Input action='primary' className="rounded-xl py-2.5 px-3.5" size="xl">
                  <InputField
                    placeholder="Contraseña"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={passwordHidden}
                    className="text-base px-0"
                  //accessibilityLabel={t("name_label")}
                  />
                  <TouchableOpacity onPress={() => setPasswordHidden(!passwordHidden)} className="pr-4">
                    <Ionicons
                      name={passwordHidden ? 'eye-outline' : 'eye-off-outline'}
                      size={24}
                      color="gray"
                    />
                  </TouchableOpacity>
                </Input>
              </FormControl>
            </View>


            <TouchableOpacity
              onPress={handleLogin}
              className="bg-[#FF7DB0] mt-6 py-3 rounded-2xl"
            >
              <Text className="text-white font-bold text-center text-lg">Login</Text>
            </TouchableOpacity>
            <View className="flex-row justify-center mt-6">
              <Text className="text-gray-400">¿Todavía no tienes una cuenta? </Text>
              <TouchableOpacity onPress={() => router.push('/signup')}>
                <Text className="text-[#FFA876] font-bold">Regístrate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};


