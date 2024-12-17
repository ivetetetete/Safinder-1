import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Platform, Button, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import 'tailwindcss/tailwind.css';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { auth, db } from "../../library/firebaseConfig";

interface Event {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
}

const Map = () => {
  const router = useRouter();
  const authInstance = getAuth();
  const user = authInstance.currentUser;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());

  const [events, setEvents] = useState<Event[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const toggleModal = () => setIsModalVisible(!isModalVisible);

  function getRandomCoordinatesInCatalonia() {
    const latitud = Math.random() * (42.9 - 40.5) + 40.5;
    const longitud = Math.random() * (3.3 - 0.15) + 0.15;
    return { latitude: latitud, longitude: longitud };
  }

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsCollection = collection(db, 'events');
        const querySnapshot = await getDocs(eventsCollection);

        const fetchedEvents: Event[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedEvents.push({
            id: doc.id,
            title: data.title || 'Sin título',
            description: data.description || '',
            latitude: data.x,
            longitude: data.y,
          });
        });

        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Error fetching events: ', error);
      }
    };

    fetchEvents();
  }, []);

  const onChangeDate = (event: any, selected: Date | undefined) => {
    const currentDate = selected || selectedDate;
    setShowDatePicker(false);
    setSelectedDate(currentDate);
  };

  const onChangeTime = (event: any, selected: Date | undefined) => {
    const currentTime = selected || selectedTime;
    setShowTimePicker(false);
    setSelectedTime(currentTime);
  };

  const createEvent = () => {
    const userId = user?.uid;
    const { latitude, longitude } = getRandomCoordinatesInCatalonia();

    const newEvent = {
      title: title || 'Sin título',
      description: description || '',
      x: latitude,
      y: longitude,
      date: selectedDate.toDateString(),
      hour: selectedTime.toTimeString().slice(0, 5),
      userId: userId,
    };

    addDoc(collection(db, 'events'), newEvent)
      .then((docRef) => {
        console.log('Create Event Success: Data successfully added!');

        setEvents((prevEvents) => [
          ...prevEvents,
          {
            id: docRef.id,
            title: newEvent.title,
            description: newEvent.description,
            latitude: newEvent.x,
            longitude: newEvent.y,
          },
        ]);

        setTitle('');
        setDescription('');
        setSelectedDate(new Date());
        setSelectedTime(new Date());
        toggleModal();
      })
      .catch((error) => {
        console.error('Create Event Error: ', error);
      });
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 41.8204600,
          longitude: 1.8676800,
          latitudeDelta: 2.5,
          longitudeDelta: 2.5,
        }}
      >
        {events.map((event) => (
          <Marker
          key={event.id}
          coordinate={{
            latitude: event.latitude,
            longitude: event.longitude,
          }}
          title={event.title}
          description={event.description}
        >
          <View className='w-28 p-5 bg-[#FFD43B] rounded-lg'>
            <Text className='text-center font-bold'>{event.title}</Text>
            <Text className='text-center'>{event.description}</Text>
          </View>
        </Marker>
        ))}
      </MapView>

      {/* Floating Button */}
      <View className="absolute z-30 right-8 top-12">
        <TouchableOpacity onPress={toggleModal}>
          <Ionicons name={'add-circle-outline'} size={36} color="white" />
        </TouchableOpacity>
      </View>

      {/* Modal Form */}
      <Modal transparent={true} visible={isModalVisible} onRequestClose={toggleModal}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View className="flex-1 justify-center items-center bg-[rgba(0,0,0,0.5)]">
            <View className="w-[90%] p-5 bg-white rounded-lg gap-y-3">
              <Text className="font-semibold text-lg mb-3 text-center">Crear evento</Text>
              <TextInput
                placeholder="Título"
                value={title}
                onChangeText={setTitle}
                className="px-4 py-3 border border-gray-300 rounded-md w-full"
              />
              <TextInput
                placeholder="Descripción"
                value={description}
                onChangeText={setDescription}
                multiline
                className="px-4 py-3 border border-gray-300 rounded-md w-full"
              />

              <Text className="font-semibold">Seleccionar fecha</Text>
              {showDatePicker && (
                <DateTimePicker value={selectedDate} mode="date" display="default" onChange={onChangeDate} />
              )}
              <Button title="Seleccionar fecha" onPress={() => setShowDatePicker(true)} />

              <Text className="font-semibold">Seleccionar hora</Text>
              {showTimePicker && (
                <DateTimePicker value={selectedTime} mode="time" display="default" onChange={onChangeTime} />
              )}
              <Button title="Seleccionar hora" onPress={() => setShowTimePicker(true)} />

              <TouchableOpacity
                className="w-full mt-6 bg-black justify-center items-center h-12 rounded-lg"
                onPress={createEvent}
              >
                <Text className="text-white font-semibold">Crear evento</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="w-full bg-gray-200 justify-center items-center h-12 rounded-lg"
                onPress={toggleModal}
              >
                <Text className="text-black font-semibold">Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default Map;
