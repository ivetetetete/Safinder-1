import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from "../../library/firebaseConfig";
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { FormControl, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';

export default function SignUp() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [dob, setDob] = useState(new Date());
  const [pronouns, setPronouns] = useState('');

  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [gender, setGender] = useState('');
  const [bio, setBio] = useState('');

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

  const onChangeDob = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || dob;
    setDob(currentDate);
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
          pathname: '/(profile)/welcome',
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
          className="flex-1"
        >
          <View className="bg-white h-screen mt-32 rounded-3xl p-8 shadow-lg">
            <View className='mb-2'>
              <Text className="text-4xl font-bold text-secondary-200 mb-4">Registration</Text>

              {errorMessage ? (
                <Text className="text-red-500 text-sm mb-4 text-center">{errorMessage}</Text>
              ) : null}

              <Text className='text-secondary-200 text-lg font-bold'>
                Personal info
              </Text>
            </View>
            <View className="space-y-4">
              <FormControl isRequired>
                <Input action='primary' className="rounded py-2.5 px-3.5" size="xl">
                  <InputField
                    className="text-neutral-900 text-base px-0"
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
                    //accessibilityLabel={t("name_label")}
                  />
                </Input>
              </FormControl>

              <View className="border border-secondary-200 rounded-xl mb-3 ">
                <TextInput
                  placeholder="Name"
                  value={name}
                  onChangeText={setName}
                  className="px-4 py-3 text-black "
                  placeholderTextColor="#FFA876"
                  autoCapitalize="none"
                />
              </View>
              

              <View className="border border-secondary-200  rounded-xl mb-3">
                <TextInput
                  placeholder="Surname"
                  value={surname}
                  onChangeText={setSurname}
                  className="px-4 py-3 text-black "
                  placeholderTextColor="#FFA876"
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              <View className="border border-secondary-200  rounded-xl mb-3 flex-row items-center">
                {/* Make TouchableOpacity and open modal */}
                {/* <DateTimePicker value={dob} mode="date" display="default" onChange={onChangeDob} /> */}
              </View>

              <View className="border border-secondary-200  rounded-xl flex-row items-center">
                <TextInput
                  placeholder="Gender identity"
                  value={gender}
                  onChangeText={setGender}
                  className="flex-1 px-4 py-3 text-black"
                  placeholderTextColor="#FFA876"
                />
              </View>


              <View className="border border-secondary-200  rounded-xl flex-row items-center">
                <TextInput
                  placeholder="Pronouns"
                  value={pronouns}
                  onChangeText={setPronouns}
                  className="flex-1 px-4 py-3 text-black"
                  placeholderTextColor="#FFA876"
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={handleSignUp}
              className="bg-secondary-200 mt-6 py-3 rounded-2xl"
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