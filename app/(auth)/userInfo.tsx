import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, TextInput, Modal, TouchableWithoutFeedback, FlatList, Alert } from 'react-native';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from "../../library/firebaseConfig";
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { FormControl } from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';

import Select from '@/components/Select';
import SelectMultiple from '@/components/SelectMultiple';
import { Button, ButtonText } from '@/components/ui/button';
import { ScrollView } from 'react-native';
import { Divider } from '@/components/ui/divider';
import { Calendar } from 'lucide-react-native';

export default function UserInfo() {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;

    const router = useRouter();
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [dob, setDob] = useState<Date | null>(null);
    const [tempDob, setTempDob] = useState<Date | null>(null);

    const [pronouns, setPronouns] = useState('');

    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [gender, setGender] = useState('');
    const [bio, setBio] = useState('');

    const [username, setUsername] = useState("");
    const [hobbies, setHobbies] = useState<string[]>([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    const genderData = [
        { key: "NB", value: "No binarie" },
        { key: "F", value: "Femenino" },
    ];

    const pronounsData = [
        { key: "S", value: "She/Her" },
        { key: "T", value: "They/Them" },
    ];

    const countryData = [
        { key: "US", value: "United States" },
        { key: "FR", value: "France" },
        { key: "BR", value: "Brazil" },
        { key: "JP", value: "Japan" },
        { key: "ZA", value: "South Africa" },
        { key: "IN", value: "India" },
        { key: "AU", value: "Australia" },
        { key: "CA", value: "Canada" },
        { key: "DE", value: "Germany" },
        { key: "EG", value: "Egypt" },
        { key: "IT", value: "Italy" },
        { key: "MX", value: "Mexico" },
        { key: "NG", value: "Nigeria" },
        { key: "RU", value: "Russia" },
        { key: "ES", value: "Spain" },
        { key: "GB", value: "United Kingdom" },
    ];

    const cityData = [
        { key: "tokyo", value: "Tokyo" },
        { key: "delhi", value: "Delhi" },
        { key: "shanghai", value: "Shanghai" },
        { key: "sao_paulo", value: "São Paulo" },
        { key: "mexico_city", value: "Mexico City" },
        { key: "cairo", value: "Cairo" },
        { key: "dhaka", value: "Dhaka" },
        { key: "mumbai", value: "Mumbai" },
        { key: "beijing", value: "Beijing" },
        { key: "osaka", value: "Osaka" },
        { key: "chongqing", value: "Chongqing" },
        { key: "karachi", value: "Karachi" },
        { key: "kinshasa", value: "Kinshasa" },
        { key: "lagos", value: "Lagos" },
    ];

    const activityOptions = [
        { value: "hiking", label: "Hiking" },
        { value: "swimming", label: "Swimming" },
        { value: "cycling", label: "Cycling" },
        { value: "reading", label: "Reading" },
        { value: "cooking", label: "Cooking" },
        { value: "painting", label: "Painting" },
        { value: "yoga", label: "Yoga" },
        { value: "running", label: "Running" },
        { value: "dancing", label: "Dancing" },
        { value: "photography", label: "Photography" },
    ];

    const formatDate = (date: Date) => {
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const getMaxDate = () => {
        const today = new Date();
        return new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    };

    // When opening, set tempDob to current dob or default
    const openPicker = () => {
        setTempDob(dob || new Date(2000, 0, 1));
        setShowDatePicker(true);
    };

    // Only update tempDob while picker is open
    const onChangeDob = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (selectedDate) {
            setTempDob(selectedDate);
        }
        // Don't close modal here!
    };

    const handleAccept = () => {
        if (tempDob && tempDob > getMaxDate()) {
            Alert.alert("Debes tener al menos 18 años");
            return;
        }
        if (tempDob) setDob(tempDob);
        setShowDatePicker(false);
    };

    //surnamw
    const handleUserData = async () => {
        if (!name || !dob || !pronouns || !country || !city || !gender || !hobbies) {
            setErrorMessage("All fields are required");
            return;
        }

        try {
            const userDocRef = doc(db, "users", userId as string);
            await setDoc(userDocRef, {
                userId: userId,
                username,
                name,
                surname,
                dateOfBirth: dob,
                country,
                city,
                gender,
                bio
            });
            router.push({
                pathname: '/home',
                params: { name: name }
            });

            console.log("User details saved successfully");
        } catch (error) {
            console.error("Error saving user details: ", error);
        }
    };

    console.log("User ID:", userId);
    console.log("Name:", name);
    console.log("Surname:", surname);
    console.log("Date of Birth:", dob);
    console.log("Country:", country);
    console.log("City:", city);
    console.log("Pronouns:", pronouns);
    console.log("Username:", username);
    console.log("Hobbies:", hobbies);

    return (
        // <LinearGradient
        //     colors={['#ff7db0', '#ffd43b']}
        //     style={{ flex: 1 }}
        //     start={{ x: 0, y: 1 }}
        //     end={{ x: 0, y: 0 }}
        //     className='h-screen'
        // >
        <SafeAreaView className='flex-1 bg-yellow-400'>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled">
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    className="flex-1"
                >
                    <Text className="text-2xl p-5 font-bold text-white">Crea tu cuenta</Text>
                    <View className="bg-white mt-15 p-5">
                        <View className='mb-2'>
                            {errorMessage ? (
                                <Text className="text-red-500 text-sm mb-4 text-center">{errorMessage}</Text>
                            ) : null}
                        </View>
                        <Text className='text-lg font-bold mb-2 text-neutral-600'>
                            Información Personal Basica
                        </Text>
                        <Divider className="bg-secondary-200" />

                        <View className="gap-y-4 my-3">

                            <FormControl isRequired>
                                <View className='flex-row items-center mb-2 gap-x-1'>
                                    <Text>Nombre</Text>
                                    <Text className="text-red-400">*</Text>
                                </View>

                                <Input action='secondary' className="rounded py-2.5 px-3.5" size="xl">
                                    <InputField
                                        className=" text-base px-0"
                                        placeholder=""
                                        value={name}
                                        onChangeText={setName}
                                    //accessibilityLabel={t("name_label")}
                                    />
                                </Input>
                            </FormControl>

                            <FormControl isRequired>
                                <View className='flex-row items-center mb-2 gap-x-1'>
                                    <Text>Apellidos</Text>
                                    <Text className="text-red-400">*</Text>
                                </View>
                                <Input action='secondary' className="rounded py-2.5 px-3.5" size="xl">
                                    <InputField
                                        value={surname}
                                        onChangeText={setSurname}
                                        className="text-base px-0"
                                    //accessibilityLabel={t("name_label")}
                                    />
                                </Input>
                            </FormControl>

                            <View>
                                <View className='flex-row items-center mb-2 gap-x-1'>
                                    <Text>Fecha de nacimiento</Text>
                                    <Text className="text-red-400">*</Text>
                                </View>
                                <View className="border border-secondary-200  rounded flex-row items-center">
                                    <TouchableOpacity onPress={openPicker} activeOpacity={1} className="flex-1 flex-row justify-between px-4 py-3">
                                        <Text className={dob ? "text-black" : "text-neutral-400"}>
                                            {dob ? formatDate(dob) : "dd/mm/yyyy"}
                                        </Text>
                                        <Calendar size={20} color={"#98A2B3"} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {showDatePicker && (
                                <Modal
                                    transparent={true}
                                    visible={showDatePicker}
                                    onRequestClose={() => setShowDatePicker(false)}
                                >
                                    <View className="flex-1 justify-center items-center bg-black/50">
                                        <View className="bg-white p-4 rounded-lg mx-5 items-center">
                                            <DateTimePicker
                                                textColor="orange"
                                                accentColor="#ffa876"
                                                themeVariant="light"
                                                value={tempDob || new Date(2000, 0, 1)}
                                                mode="date"
                                                display={Platform.OS === "ios" ? "inline" : "default"}
                                                onChange={onChangeDob}
                                                maximumDate={new Date()}
                                            />
                                            <View className="flex flex-row justify-between w-full mt-4 space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="md"
                                                    onPress={() => setShowDatePicker(false)}
                                                    className="flex-1"
                                                >
                                                    <ButtonText>Cerrar</ButtonText>
                                                </Button>
                                                <Button
                                                    size="md"
                                                    className="flex-1"
                                                    onPress={handleAccept}
                                                >
                                                    <ButtonText>Aceptar</ButtonText>
                                                </Button>
                                            </View>
                                        </View>
                                    </View>
                                </Modal>
                            )}


                            {/* <FormControl isRequired>
                                    
                                    <Input action='secondary' className="rounded py-2.5 px-3.5" size="xl">
                                        <InputField
                                            className=" text-base px-0"
                                            placeholder="Gender"
                                            value={gender}
                                            onChangeText={setGender}
                                        />
                                    </Input>
                                </FormControl> */}
                            <View>
                                <View className='flex-row items-center mb-2 gap-x-1'>
                                    <Text>Genero</Text>
                                    <Text className="text-red-400">*</Text>
                                </View>

                                <View className='flex-row gap-x-2'>
                                    {genderData.map((item) => {
                                        const isSelected = gender === item.value;
                                        return (
                                            <TouchableOpacity
                                                key={item.key}
                                                className={`border rounded-lg p-2 ${isSelected
                                                    ? 'border-secondary-200 bg-secondary-100'
                                                    : 'border-neutral-200 bg-neutral-200'
                                                    }`}
                                                onPress={() => setGender(item.value)}
                                            >
                                                <Text
                                                    className={`text-sm ${isSelected ? 'text-neutral-50 font-bold' : 'text-secondary-200'
                                                        }`}
                                                >
                                                    {item.value}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>

                            <View>
                                <View className='flex-row items-center mb-2 gap-x-1'>
                                    <Text>Pronombres</Text>
                                    <Text className="text-red-400">*</Text>
                                </View>

                                <View className='flex-row gap-x-2'>
                                    {pronounsData.map((item) => {
                                        const isSelected = pronouns === item.value;
                                        return (
                                            <TouchableOpacity
                                                key={item.key}
                                                className={`border rounded-lg p-2 ${isSelected
                                                    ? 'border-secondary-200 bg-secondary-100'
                                                    : 'border-neutral-200 bg-neutral-200'
                                                    }`}
                                                onPress={() => setPronouns(item.value)}
                                            >
                                                <Text
                                                    className={`text-sm ${isSelected ? 'text-neutral-50 font-bold' : 'text-secondary-200'
                                                        }`}
                                                >
                                                    {item.value}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>
                        </View>

                        <Text className='mt-4 text-lg font-bold mb-2 text-neutral-600'>
                            Información Demográfica
                        </Text>
                        <Divider className="bg-secondary-200" />
                        <View className="gap-y-4 my-3">
                            <View>
                                <View className='flex-row items-center mb-2 gap-x-1'>
                                    <Text>País</Text>
                                    <Text className="text-red-400">*</Text>
                                </View>
                                <Select
                                    options={countryData}
                                    labelKey="value"
                                    valueKey="key"
                                    //placeholder="País"
                                    onSelect={(item) => setCountry(item.key)}
                                />
                            </View>

                            <View>
                                <View className='flex-row items-center mb-2 gap-x-1'>
                                    <Text>Ciudad</Text>
                                    <Text className="text-red-400">*</Text>
                                </View>
                                <Select
                                    options={cityData}
                                    labelKey="value"
                                    valueKey="key"
                                    //placeholder="Ciudad"
                                    onSelect={(item) => setCity(item.key)}
                                />
                            </View>

                        </View>

                        <Text className='mt-4 mb-2 text-secondary-200 text-lg font-bold'>
                            Personal interests
                        </Text>
                        <View className="mb-3">
                            <SelectMultiple
                                options={activityOptions}
                                labelKey="label"
                                valueKey="value"
                                placeholder="Select hobbies"
                                searchPlaceholder="Search hobbies..."
                                onChange={(selected) =>
                                    setHobbies((selected as { value: string; label: string }[]).map(item => item.value))
                                }
                            />
                        </View>

                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={handleUserData}
                            className="bg-secondary-300 mt-6 py-3 rounded-lg"
                        >
                            <Text className="text-white font-bold text-center text-lg">Sign Up</Text>
                        </TouchableOpacity>

                        <View className="flex-row justify-center mt-6">
                            <Text className="text-gray-400">Already have an account? </Text>
                            <TouchableOpacity activeOpacity={1} onPress={() => router.push('/login')}>
                                <Text className="text-[#FF7DB0] font-bold">Log In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* <FlatList
                        data={[]}
                        keyExtractor={() => "dummy"}
                        ListHeaderComponent={
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
                                        <Input action='secondary' className="rounded py-2.5 px-3.5" size="xl">
                                            <InputField
                                                className=" text-base px-0"
                                                placeholder="Name"
                                                value={name}
                                                onChangeText={setName}
                                            //accessibilityLabel={t("name_label")}
                                            />
                                        </Input>
                                    </FormControl>

                                    <FormControl isRequired>
                                        <Input action='secondary' className="rounded py-2.5 px-3.5" size="xl">
                                            <InputField
                                                placeholder="Surname"
                                                value={surname}
                                                onChangeText={setSurname}
                                                className="text-base px-0"
                                            //accessibilityLabel={t("name_label")}
                                            />
                                        </Input>
                                    </FormControl>

                                    <View className="border border-secondary-200  rounded flex-row items-center">
                                        <TouchableOpacity onPress={openPicker} className="flex-1 px-4 py-3">
                                            <Text className={dob ? "text-black" : "text-neutral-400"}>
                                                {dob ? formatDate(dob) : "Fecha de nacimiento"}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>

                                    {showDatePicker && (
                                        <Modal
                                            transparent={true}
                                            visible={showDatePicker}
                                            onRequestClose={() => setShowDatePicker(false)}
                                        >
                                            <View className="flex-1 justify-center items-center bg-black/50">
                                                <View className="bg-white p-4 rounded-lg mx-5 items-center">
                                                    <DateTimePicker
                                                        textColor="orange"
                                                        accentColor="#ffa876"
                                                        themeVariant="light"
                                                        value={tempDob || new Date(2000, 0, 1)}
                                                        mode="date"
                                                        display={Platform.OS === "ios" ? "inline" : "default"}
                                                        onChange={onChangeDob}
                                                        maximumDate={new Date()}
                                                    />
                                                    <View className="flex flex-row justify-between w-full mt-4 space-x-2">
                                                        <Button
                                                            variant="outline"
                                                            size="md"
                                                            onPress={() => setShowDatePicker(false)}
                                                            className="flex-1"
                                                        >
                                                            <ButtonText>Cerrar</ButtonText>
                                                        </Button>
                                                        <Button
                                                            size="md"
                                                            className="flex-1"
                                                            onPress={handleAccept}
                                                        >
                                                            <ButtonText>Aceptar</ButtonText>
                                                        </Button>
                                                    </View>
                                                </View>
                                            </View>
                                        </Modal>
                                    )}

                                    <Select
                                        options={genderData}
                                        labelKey="value"
                                        valueKey="key"
                                        placeholder="Género"
                                        onSelect={(item) => setGender(item.key)}
                                    />

                                    <Select
                                        options={pronounsData}
                                        labelKey="value"
                                        valueKey="key"
                                        placeholder="Pronombres"
                                        onSelect={(item) => setPronouns(item.key)}
                                    />
                                </View>

                                <Text className='mt-4 mb-2 text-secondary-200 text-lg font-bold'>
                                    Demographics info
                                </Text>
                                <View className="gap-y-4">
                                    <Select
                                        options={countryData}
                                        labelKey="value"
                                        valueKey="key"
                                        placeholder="País"
                                        onSelect={(item) => setCountry(item.key)}
                                    />

                                    <Select
                                        options={cityData}
                                        labelKey="value"
                                        valueKey="key"
                                        placeholder="Ciudad"
                                        onSelect={(item) => setCity(item.key)}
                                    />

                                </View>

                                <Text className='mt-4 mb-2 text-secondary-200 text-lg font-bold'>
                                    Personal interests
                                </Text>
                                <View className="mb-20">
                                    <SelectMultiple
                                        options={activityOptions}
                                        labelKey="label"
                                        valueKey="value"
                                        placeholder="Select hobbies"
                                        searchPlaceholder="Search hobbies..."
                                        onChange={(selected) =>
                                            setHobbies((selected as { value: string; label: string }[]).map(item => item.value))
                                        }
                                    />
                                </View>

                                <TouchableOpacity
                                    onPress={handleUserData}
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
                        }
                        renderItem={() => null} // Safe no-op renderer
                    /> */}
                </KeyboardAvoidingView>

            </ScrollView>
        </SafeAreaView>
        //</LinearGradient> 

    );
}

// you're the smartest 