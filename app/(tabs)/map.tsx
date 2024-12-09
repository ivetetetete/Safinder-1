import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { getAuth, signOut } from 'firebase/auth';
import 'tailwindcss/tailwind.css';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

const Map = () => {
  const router = useRouter();
  const auth = getAuth();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const toggleModal = () => setIsModalVisible(!isModalVisible);

  function getRandomCoordinatesInCatalonia() {
    const latitud = Math.random() * (42.9 - 40.5) + 40.5;
    const longitud = Math.random() * (3.3 - 0.15) + 0.15;
    return { latitude: latitud, longitude: longitud };
  }

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
        <View className="flex-1 justify-center items-center bg-[rgba(0,0,0,0.5)]">
          <View className="w-[90%] p-5 bg-white rounded-lg">
            <Text className="font-semibold text-lg mb-3 text-center">Crear evento</Text>
            <Text className="text-base leading-6 opacity-70">
              Formulariooo
            </Text>
            <TouchableOpacity
              className="w-full mt-6 bg-black bg-opacity-10 justify-center items-center h-14 rounded-lg"
              onPress={() => toggleModal()}
            >
              <Text className="font-semibold text-base text-white">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Map;

//you're the best
