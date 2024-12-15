import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Button, TextInput, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { getAuth, signOut } from 'firebase/auth';
import 'tailwindcss/tailwind.css';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import DateTimePicker from '@react-native-community/datetimepicker';

const Map = () => {
  const router = useRouter();
  const auth = getAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date());
  const [hour, setHour] = useState('');

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showDate, setShowDate] = React.useState(false);
  const [showTime, setShowTime] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [selectedTime, setSelectedTime] = React.useState(new Date());
  const [value, setValue] = React.useState('');
  const toggleModal = () => setIsModalVisible(!isModalVisible);

  const onChangeDate = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || selectedDate;
    setShowDate(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const onChangeTime = (event: any, selectedTime: any) => {
    const currentTime = selectedTime || selectedTime;
    setShowTime(Platform.OS === 'ios');
    const timeString = currentTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    setHour(timeString);
  };

  function getRandomCoordinatesInCatalonia() {
    const latitud = Math.random() * (42.9 - 40.5) + 40.5;
    const longitud = Math.random() * (3.3 - 0.15) + 0.15;
    return { latitude: latitud, longitude: longitud };
  }

  const onChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  function createEvent() {
    //guardar en la base de datos
  }

  const randomCoords = getRandomCoordinatesInCatalonia();

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <MapView
          style={{ flex: 1, height: '100%', width: '100%' }}
          initialRegion={{
            latitude: 41.8204600,
            longitude: 1.8676800,
            latitudeDelta: 2.5,
            longitudeDelta: 2.5,
          }}
        >
          <Marker
            coordinate={randomCoords}
            title="Punto aleatorio en Cataluña">
            <View className='w-28 p-5 bg-[#FFD43B] rounded-lg'>
              <Text className='text-center'>Prueba 1</Text>
            </View>
          </Marker>
        </MapView>
      </View>

      <View className='absolute z-30 right-8 top-12'>
        <TouchableOpacity onPress={toggleModal}>
          <Ionicons
            name={'add-circle-outline'}
            size={36}
            color="white"
          />
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View className="flex-1 justify-center items-center bg-[rgba(0,0,0,0.5)]">
            <View className="w-[90%] p-5 bg-white rounded-lg gap-y-3">
              <Text className="font-semibold text-lg mb-3 text-center">Crear evento</Text>
              <TextInput
                placeholder="Título"
                value={title}
                onChangeText={setTitle}
                className="px-4 py-3 text-black border border-black rounded-md w-full"
              />
              <TextInput
                placeholder="Descripción"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                className="px-4 py-3 text-black border border-black rounded-md w-full min-h-16"
              />

              <Text className="font-semibold text-base text-black">Seleccionar fecha</Text>
              <DateTimePicker
                testID="dateTimePicker"
                value={selectedDate}
                mode={'date'}
                is24Hour={true}
                display="default"
                onChange={onChangeDate}
              />

              <Text className="font-semibold text-base text-black">Seleccionar hora</Text>

              <DateTimePicker
                testID="dateTimePicker"
                value={new Date()}
                mode={'time'}
                is24Hour={true}
                display="default"
                onChange={onChangeTime}
              />

              <TouchableOpacity
                className="w-full mt-6 border border-black bg-transparent justify-center items-center h-14 rounded-lg"
                onPress={() => toggleModal()}
              >
                <Text className="font-semibold text-base text-black">Crear evento</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="w-full bg-black bg-opacity-10 justify-center items-center h-14 rounded-lg"
                onPress={() => toggleModal()}
              >
                <Text className="font-semibold text-base text-white">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default Map;
