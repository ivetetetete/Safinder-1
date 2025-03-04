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
  idUser: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
}

const Map = () => {
  const router = useRouter();
  const authInstance = getAuth();
  const user = authInstance.currentUser;

  console.log('User:', user);
  console.log('userIdName:', user?.uid);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [location, setLocation] = useState('');


  const [events, setEvents] = useState<Event[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(true);

  const toggleModal = () => setIsModalVisible(!isModalVisible);

  const toggleModalEvent = () => {
    setIsModalEventVisible(!isModalEventVisible)
  };

  function getRandomCoordinatesInCatalonia() {
    const latitud = Math.random() * (42.9 - 40.5) + 40.5;
    const longitud = Math.random() * (3.3 - 0.15) + 0.15;
    return { latitude: latitud, longitude: longitud };
  }

  //modal evento
  const [isModalEventVisible, setIsModalEventVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);


  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);

        const eventsCollection = collection(db, 'events');
        const querySnapshot = await getDocs(eventsCollection);

        const fetchedEvents: Event[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          console.log('Data:', data);
          fetchedEvents.push({
            id: doc.id,
            idUser: data.userId,
            title: data.title || 'Sin título',
            description: data.description || '',
            latitude: data.x,
            longitude: data.y,
          });
        });

        console.log('Fetched events:', fetchedEvents);
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Error fetching events: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    console.log('Events state updated:', events);
  }, [events]);


  const handleMarkerPress = (event: Event) => {
    setSelectedEvent(event);
    setIsModalEventVisible(!isModalEventVisible);
  };

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
      idUser: userId,
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
            idUser: userId || '',
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
    <>
      {loading ? (
        <Text>Loading events...</Text>
      ) : (
        <View className='flex-1'>
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
              <Marker key={event.id}
                //onPress={toggleModalEvent}
                coordinate={{
                  latitude: event.latitude,
                  longitude: event.longitude,
                }}
                onPress={() => {
                  handleMarkerPress(event);
                  toggleModalEvent();
                }}
              >
                <View className='w-28 p-5 bg-[#FFD43B] rounded-lg'
                >
                  <Text className='text-center font-bold'>{event.title}</Text>
                  <Text className='text-center'>{event.description}</Text>
                </View>
              </Marker>
            ))}
          </MapView>

          {/* Modal Event */}
          <Modal
            transparent={true}
            visible={isModalEventVisible}
            onRequestClose={toggleModalEvent}
          >
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <View className="flex-1 justify-center items-center bg-[rgba(0,0,0,0.5)]">
                <View className="w-[90%] p-5 bg-white rounded-lg gap-y-3">
                  <Text className="font-semibold text-lg mb-3 text-center">Evento</Text>
                  <Text className="font-semibold text-lg mb-3 text-center">{selectedEvent?.idUser}</Text>
                  <Text className="font-semibold text-lg mb-3 text-center">{selectedEvent?.title}</Text>
                  <Text className="font-semibold text-lg mb-3 text-center">{selectedEvent?.description}</Text>
                  <View className='flex flex-row gap-3 items-center'>
                    <TouchableOpacity
                      //onPress={toggleModalEvent}
                      className="w-full bg-gray-200 justify-center items-center h-12 rounded-lg"
                    >
                      <Text className="text-black font-semibold">Voy a ir!</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      //onPress={toggleModalEvent}
                      className="w-full bg-gray-200 justify-center items-center h-12 rounded-lg"
                    >
                      <Text className="text-black font-semibold">Unirme al grupo</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    onPress={toggleModalEvent}
                    className="w-full bg-gray-200 justify-center items-center h-12 rounded-lg"
                  >
                    <Text className="text-black font-semibold">Cerrar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          {/* Botón crear evento */}
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
                  <TextInput
                    placeholder="Donde"
                    value={location}
                    onChangeText={setLocation}
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
      )}
    </>
  );
};

export default Map;