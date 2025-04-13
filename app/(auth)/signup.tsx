import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, TextInput, Modal, TouchableWithoutFeedback } from 'react-native';
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
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from '@/components/ui/select';
import {
  Ban,
  CheckIcon,
  ChevronDown,
  CircleCheckBig,
  Clock,
  Hourglass,
  Minus,
  OctagonAlert,
  Plus,
  ShieldCheck,
  UsersRound,
} from "lucide-react-native";

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
  const [showDatePicker, setShowDatePicker] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordHidden(!passwordHidden);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordHidden(!confirmPasswordHidden);
  };

  const onChangeDob = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || dob;
    setDob(currentDate);
    setShowDatePicker(false);
  }

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
            <View className="gap-y-4">
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

              <FormControl isRequired>
                <Input action='primary' className="rounded py-2.5 px-3.5" size="xl">
                  <InputField
                    placeholder="Surname"
                    value={surname}
                    onChangeText={setSurname}
                    className="text-neutral-900 text-base px-0"
                  //accessibilityLabel={t("name_label")}
                  />
                </Input>
              </FormControl>

              <View className="border border-secondary-200  rounded flex-row items-center">
                {/* Make TouchableOpacity and open modal */}
                <TouchableOpacity onPress={() => setShowDatePicker(true)} className="flex-1 px-4 py-3">
                  <Text className='text-neutral-400'>Dob</Text>
                </TouchableOpacity>
              </View>

              {showDatePicker && (
                <Modal
                  transparent={true}
                  visible={showDatePicker}
                  onRequestClose={() => setShowDatePicker(false)}
                >
                  <TouchableWithoutFeedback
                    onPress={() => setShowDatePicker(false)}
                  >
                    <View className="flex-1 justify-center items-center bg-black/50">
                      <View className="bg-white p-4 rounded-lg mx-5 flex items-center">
                        <DateTimePicker
                          textColor="red"
                          accentColor="#D00D2B"
                          themeVariant="light"
                          value={new Date()}
                          mode="date"
                          display={
                            Platform.OS === "ios" ? "inline" : "default"
                          }
                          onChange={onChangeDob}
                        />
                        {/* <HStack className="mt-4 w-full gap-x-1">
                            <Button
                              variant="outline"
                              size="md"
                              onPress={() => setShowCalendar(false)}
                              className="flex-1"
                            >
                              <ButtonText>{t("close")}</ButtonText>
                            </Button>
                            <Button
                              size="md"
                              className="flex-1"
                              onPress={handleAcceptDate}
                            >
                              <ButtonText>{t("accept")}</ButtonText>
                            </Button>
                          </HStack> */}
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </Modal>
              )}

              <FormControl isRequired>
                <Input action='primary' className="rounded py-2.5 px-3.5" size="xl">
                  <InputField
                    placeholder="Surname"
                    value={surname}
                    onChangeText={setSurname}
                    className="text-neutral-900 text-base px-0"
                  //accessibilityLabel={t("name_label")}
                  />
                </Input>
              </FormControl>

              <Select selectedValue={gender}
                onValueChange={(value) => {
                  console.log('Selected Value:', value);
                  setGender(value);
                }}>
                <SelectTrigger variant="outline" size="md" className='border border-secondary-200  rounded' >
                  <SelectInput placeholder="Genero" />
                  <SelectIcon className="mr-3" as={ChevronDown} color='#ffa876' />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    <SelectItem label="Femenino" value="f" />
                    <SelectItem label="No binario" value="nb" />
                  </SelectContent>
                </SelectPortal>
              </Select>


              <Select selectedValue={pronouns}
                onValueChange={(value) => {
                  console.log('Selected Value:', value);
                  setGender(value);
                }}>
                <SelectTrigger variant="outline" size="md" className='border border-secondary-200  rounded' >
                  <SelectInput placeholder="Pronombres" />
                  <SelectIcon className="mr-3" as={ChevronDown} color='#ffa876' />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    <SelectItem label="She/her" value="f" />
                    <SelectItem label="They/them" value="nb" />
                  </SelectContent>
                </SelectPortal>
              </Select>
            </View>

            <Text className='mt-4 mb-2 text-secondary-200 text-lg font-bold'>
            Demographics info
            </Text>
            <View className="gap-y-4">
              <Select selectedValue={country}
                onValueChange={(value) => {
                  console.log('Selected Value:', value);
                  setGender(value);
                }}>
                <SelectTrigger variant="outline" size="md" className='border border-secondary-200  rounded' >
                  <SelectInput placeholder="País" />
                  <SelectIcon className="mr-3" as={ChevronDown} color='#ffa876' />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    <SelectItem label="Femenino" value="f" />
                    <SelectItem label="No binario" value="nb" />
                  </SelectContent>
                </SelectPortal>
              </Select>


              <Select selectedValue={city}
                onValueChange={(value) => {
                  console.log('Selected Value:', value);
                  setGender(value);
                }}>
                <SelectTrigger variant="outline" size="md" className='border border-secondary-200  rounded' >
                  <SelectInput placeholder="Ciudad" />
                  <SelectIcon className="mr-3" as={ChevronDown} color='#ffa876' />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    <SelectItem label="She/her" value="f" />
                    <SelectItem label="They/them" value="nb" />
                  </SelectContent>
                </SelectPortal>
              </Select>
            </View>

            <Text className='mt-4 mb-2 text-secondary-200 text-lg font-bold'>
            Personal interests
            </Text>
            <View className="gap-y-4">
              <Select selectedValue={country}
                onValueChange={(value) => {
                  console.log('Selected Value:', value);
                  setGender(value);
                }}>
                <SelectTrigger variant="outline" size="md" className='border border-secondary-200  rounded' >
                  <SelectInput placeholder="Hobbies" />
                  <SelectIcon className="mr-3" as={ChevronDown} color='#ffa876' />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    <SelectItem label="Femenino" value="f" />
                    <SelectItem label="No binario" value="nb" />
                  </SelectContent>
                </SelectPortal>
              </Select>


              <Select selectedValue={city}
                onValueChange={(value) => {
                  console.log('Selected Value:', value);
                  setGender(value);
                }}>
                <SelectTrigger variant="outline" size="md" className='border border-secondary-200  rounded' >
                  <SelectInput placeholder="Ciudad" />
                  <SelectIcon className="mr-3" as={ChevronDown} color='#ffa876' />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    <SelectItem label="She/her" value="f" />
                    <SelectItem label="They/them" value="nb" />
                  </SelectContent>
                </SelectPortal>
              </Select>
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