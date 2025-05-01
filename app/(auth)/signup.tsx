import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from "../../library/firebaseConfig";
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { FormControl } from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native';

export default function SignUp() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [confirmPasswordHidden, setConfirmPasswordHidden] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
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
          //username: username,
          email: email,
          firstEntry: true,
        });
        console.log("Firestore document created successfully");
        router.push({
          pathname: '/userInfo',
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
      <SafeAreaView className='flex-1'>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <Image
            source={require('../../assets/images/safinder-logo.png')}
            style={{ position: 'absolute', top: 13, right: 0 }}
            resizeMode="cover"
            className="w-56 h-56"
          />
          <View className="bg-white h-screen mt-32 rounded-3xl p-8 shadow-lg">
            <View className='mb-2'>
              <Text className="text-4xl font-bold text-secondary-200 mb-4">Registro</Text>

              {errorMessage ? (
                <Text className="text-red-500 text-sm mb-4 text-center">{errorMessage}</Text>
              ) : null}
            </View>
            <View className="gap-y-4">
              <FormControl isRequired>
                <Input action='secondary' className="rounded-xl py-2.5 px-3.5" size="xl">
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
                <Input action='secondary' className="rounded-xl py-2.5 px-3.5" size="xl">
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

              <FormControl isRequired>
                <Input action='secondary' className="rounded-xl py-2.5 px-3.5" size="xl">
                  <InputField
                    placeholder="Repetir Contraseña"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={confirmPasswordHidden}
                    className="text-base px-0"
                  //accessibilityLabel={t("name_label")}
                  />
                  <TouchableOpacity onPress={() => setConfirmPasswordHidden(!confirmPasswordHidden)} className="pr-4">
                    <Ionicons
                      name={confirmPasswordHidden ? 'eye-outline' : 'eye-off-outline'}
                      size={24}
                      color="gray"
                    />
                  </TouchableOpacity>
                </Input>
              </FormControl>


            </View>
            <TouchableOpacity
              onPress={handleSignUp}
              className="bg-secondary-200 mt-6 py-3 rounded-2xl"
            >
              <Text className="text-white font-bold text-center text-lg">Sign Up</Text>
            </TouchableOpacity>

            <View className="flex-row justify-center mt-6">
              <Text className="text-gray-400">¿Ya tienes una cuenta? </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text className="text-[#FF7DB0] font-bold">Inicia sesión</Text>
              </TouchableOpacity>
            </View>
          </View>

        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// you're the smartest 