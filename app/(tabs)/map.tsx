import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import 'tailwindcss/tailwind.css';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { auth, db } from "../../library/firebaseConfig";
import InputLocation from '@/components/InputLocation';
import { Calendar, CalendarDays, MapPinned, Volleyball } from 'lucide-react-native';
import { FormControl } from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';

interface Event {
  id: string;
  idUser: string;
  title: string;
  description: string;
  address?: string;
  latitude: number;
  longitude: number;
  date: string;
  hour: string;
}

const MapScreen = () => {
  const router = useRouter();
  const authInstance = getAuth();
  const user = authInstance.currentUser;

  console.log('User:', user);
  console.log('userIdName:', user?.uid);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date(2000, 0, 1, 12, 0)); 
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedLat, setSelectedLat] = useState<number>(0);
  const [selectedLon, setSelectedLon] = useState<number>(0);

  const [events, setEvents] = useState<Event[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(true);

  const toggleModal = () => setIsModalVisible(!isModalVisible);

  const toggleModalEvent = () => {
    setIsModalEventVisible(!isModalEventVisible)
  };

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
            address: data.address || '',           // <-- Read address
            latitude: data.latitude,               // <-- Use latitude
            longitude: data.longitude,
            date: data.date || new Date().toDateString(),
            hour: data.hour || new Date().toTimeString().slice(0, 5),
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
    setSelectedDate(currentDate);
  };

  const onChangeTime = (event: any, selected: Date | undefined) => {
    const currentTime = selected || selectedTime;
    setShowTimePicker(false);
    setSelectedTime(currentTime);
  };

  const openPickerDate = () => {
    setSelectedDate(selectedDate || new Date(2000, 0, 1));
    setShowDatePicker(true);
  };


  const openPickerTime = () => {
    setSelectedTime(selectedTime || new Date(2000, 0, 1, 12, 0)); // Default time set to 12:00 PM
    setShowTimePicker(true);
  };

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };



  const createEvent = () => {
    const userId = user?.uid;
    //const { latitude, longitude } = getRandomCoordinatesInCatalonia();

    const newEvent = {
      idUser: userId,
      title: title || 'Sin título',
      description: description || '',
      address: selectedAddress,      // <-- Use 'address' consistently
      latitude: selectedLat,
      longitude: selectedLon,
      date: selectedDate.toDateString(),
      hour: selectedTime.toTimeString().slice(0, 5),
      userId: userId,
    };

    addDoc(collection(db, 'events'), newEvent)
      .then((docRef) => {
        setEvents((prevEvents) => [
          ...prevEvents,
          {
            id: docRef.id,
            idUser: userId || '',
            title: newEvent.title,
            description: newEvent.description,
            address: newEvent.address,           // <-- Add address here
            latitude: Number(newEvent.latitude),
            longitude: Number(newEvent.longitude),
            date: newEvent.date,
            hour: newEvent.hour,
          },
        ]);
        setTitle('');
        setDescription('');
        setSelectedDate(new Date());
        setSelectedTime(new Date());
        setSelectedAddress('');
        setSelectedLat(0);
        setSelectedLon(0);
        toggleModal();
      })
      .catch((error) => {
        console.error('Create Event Error: ', error);
      });
  };

  function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }


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
                <View className='w-28 p-5 bg-tertiary-300 rounded-md'
                >
                  <Text className='text-center font-bold'>{event.title}</Text>
                  {/* <Text className='text-center'>{event.description}</Text> */}
                  <View className='rounded-full  bg-tertiary-400 p-2 mx-auto'>
                    <Volleyball size={16} color="white" />
                  </View>
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
                  <Text className="font-semibold text-lg">{selectedEvent?.title}</Text>
                  <View className='flex flex-row gap-x-2'>
                    <MapPinned size={20} color="black" />
                    <Text className="text-sm text-neutral-400 w-fit text-ellipsis">{selectedEvent?.address}</Text>
                  </View>
                  <View className='flex flex-row gap-x-2'>
                    <CalendarDays size={20} color="black" />
                    <Text className="text-sm text-neutral-400">{selectedEvent?.date
                      ? capitalize(
                        new Date(selectedEvent.date).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })
                      )
                      : ''} {selectedEvent?.hour}</Text>
                  </View>

                  <Text className="text-lg text-neutral-400">{selectedEvent?.description}</Text>

                  <View className='flex flex-row gap-3 items-center'>
                    <TouchableOpacity
                      //onPress={toggleModalEvent}
                      className="flex-1 bg-primary-500 justify-center items-center h-12 rounded-lg"
                      activeOpacity={0.7}
                    >
                      <Text className="text-primary-700 font-semibold">Voy a ir!</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      //onPress={toggleModalEvent}
                      className="flex-1 bg-secondary-100 justify-center items-center h-12 rounded-lg"
                      activeOpacity={0.7}
                    >
                      <Text className="text-secondary-300 font-semibold">Unirme al grupo</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    onPress={toggleModalEvent}
                    className="w-full bg-tertiary-200 justify-center items-center h-12 rounded-lg"
                    activeOpacity={0.7}
                  >
                    <Text className="text-tertiary-700 font-semibold">Cerrar</Text>
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
                <View className="w-[90%] p-5 bg-white rounded-xl gap-y-3">
                  <Text className="font-semibold text-lg mb-3 text-center">Crear evento</Text>

                  <FormControl isRequired>
                    <Text className='font-semibold mb-1'>Título</Text>
                    <Input action='secondary' className="rounded-xl py-2.5 px-3.5" size="xl">
                      <InputField
                        className=" text-base px-0"
                        placeholder="Escribe un título"
                        value={title}
                        onChangeText={setTitle}
                      //accessibilityLabel={t("name_label")}
                      />
                    </Input>
                  </FormControl>
                  <FormControl isRequired>
                    <Text className='font-semibold mb-1'>Descripción</Text>

                    <Input action='secondary' className="rounded-xl py-2.5 px-3.5" size="xl">
                      <InputField
                        className=" text-base px-0"
                        placeholder="Escribe una descripción"
                        value={description}
                        onChangeText={setDescription}
                      //accessibilityLabel={t("name_label")}
                      />
                    </Input>
                  </FormControl>

                  <InputLocation
                    selectedAddress={selectedAddress}
                    setSelectedAddress={setSelectedAddress}
                    onSelect={(address, lat, lon) => {
                      setSelectedAddress(address);
                      setSelectedLat(Number(lat));
                      setSelectedLon(Number(lon));
                    }}
                    label='Dirección'
                    placeholder="Escribe una dirección"
                  />


                  <Text className="font-semibold">Seleccionar fecha</Text>
                  <View className="border border-secondary-200  rounded flex-row items-center">
                    <TouchableOpacity onPress={openPickerDate} activeOpacity={1} className="flex-1 flex-row justify-between px-4 py-3">
                      <Text className={selectedDate ? "text-black" : "text-neutral-400"}>
                        {selectedDate ? formatDate(selectedDate) : "dd/mm/yyyy"}
                      </Text>
                      <Calendar size={20} color={"#98A2B3"} />
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
                            value={selectedDate || new Date()}
                            mode="date"
                            display={Platform.OS === "ios" ? "inline" : "default"}
                            onChange={onChangeDate}
                            minimumDate={new Date()}
                          />
                          <View className="flex flex-row justify-between w-full mt-4 space-x-2">

                            <Button
                              size="md"
                              className="flex-1"
                              onPress={() => setShowDatePicker(false)}
                            >
                              <ButtonText>Aceptar</ButtonText>
                            </Button>
                          </View>
                        </View>
                      </View>
                    </Modal>
                  )}

                  <Text className="font-semibold">Seleccionar hora</Text>
                  <View className="border border-secondary-200  rounded flex-row items-center">
                    <TouchableOpacity onPress={openPickerTime} activeOpacity={1} className="flex-1 flex-row justify-between px-4 py-3">
                      <Text className={selectedTime ? "text-black" : "text-neutral-400"}>
                        {selectedTime ? selectedTime.toTimeString().slice(0, 5) : "HH:mm"}
                      </Text>
                      <Calendar size={20} color={"#98A2B3"} />
                    </TouchableOpacity>
                  </View>

                  {showTimePicker && (
                    <Modal
                      transparent={true}
                      visible={showTimePicker}
                      onRequestClose={() => setShowTimePicker(false)}
                    >
                      <View className="flex-1 justify-center items-center bg-black/50">
                        <View className="bg-white p-4 rounded-lg mx-5 items-center">
                          <DateTimePicker
                            accentColor="#ffa876"
                            themeVariant="light"
                            value={selectedTime} // Default time set to 12:00 PM
                            mode="time"
                            is24Hour={true}
                            display={"spinner"}
                            onChange={onChangeTime}

                          />
                          <View className="flex flex-row justify-between w-full mt-4 space-x-2">

                            <Button
                              size="md"
                              className="flex-1"
                              onPress={() => setShowTimePicker(false)}
                            >
                              <ButtonText>Aceptar</ButtonText>
                            </Button>
                          </View>
                        </View>
                      </View>
                    </Modal>
                  )}

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

export default MapScreen;