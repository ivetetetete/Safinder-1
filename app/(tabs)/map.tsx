import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import "tailwindcss/tailwind.css";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import {
  updateDoc,
  doc,
  arrayUnion,
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../../library/firebaseConfig";
import InputLocation from "@/components/InputLocation";
import {
  Calendar,
  CalendarDays,
  Clock,
  MapPinned,
  PartyPopper,
  Utensils,
  Volleyball,
} from "lucide-react-native";
import { FormControl } from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import Toast from 'react-native-toast-message';

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

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [eventType, setEventType] = useState<React.ReactElement | string>();


  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedLat, setSelectedLat] = useState<number>(0);
  const [selectedLon, setSelectedLon] = useState<number>(0);

  const [events, setEvents] = useState<Event[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  //temporales fecha y hora
  const [tempDate, setTempDate] = useState<Date | null>(null);
  const [tempTime, setTempTime] = useState<Date | null>(null);

  const [loading, setLoading] = useState(true);

  const toggleModal = () => setIsModalVisible(!isModalVisible);

  const toggleModalEvent = () => {
    setIsModalEventVisible(!isModalEventVisible);
  };

  //modal evento
  const [isModalEventVisible, setIsModalEventVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);

        const eventsCollection = collection(db, "events");
        const querySnapshot = await getDocs(eventsCollection);

        const fetchedEvents: Event[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          //console.log('Data:', data);
          fetchedEvents.push({
            id: doc.id,
            idUser: data.userId,
            title: data.title || "Sin título",
            description: data.description || "",
            address: data.address || "", // <-- Read address
            latitude: data.latitude, // <-- Use latitude
            longitude: data.longitude,
            date: data.date || new Date().toDateString(),
            hour: data.hour || new Date().toTimeString().slice(0, 5),
          });
        });

        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Error fetching events: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleMarkerPress = (event: Event) => {
    setSelectedEvent(event);
    setIsModalEventVisible(!isModalEventVisible);
  };

  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    console.log('entras aqui? selectedDate:', selectedDate);
    if (selectedDate) {
      setTempDate(selectedDate);
    }
  };

  const handleAcceptDate = () => {
    if (tempDate) setDate(tempDate);
    setShowDatePicker(false);
  };

  const onChangeTime = (event: DateTimePickerEvent, selectedTime?: Date) => {
    if (selectedTime) {
      setTempTime(selectedTime);
    }
  };

  const handleAcceptTime = () => {
    if (tempTime) setTime(tempTime);
    setShowTimePicker(false);
  };

  const openPickerDate = () => {
    setShowTimePicker(false);

    setTempDate(date || new Date());
    setShowDatePicker(true);
  };

  const openPickerTime = () => {
    setShowDatePicker(false);
    setTempTime(time || new Date());
    setShowTimePicker(true);
  };


  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleJoinGroup = async () => {
    if (!user || !selectedEvent) return;
    try {
      const eventRef = doc(db, "events", selectedEvent.id);
      await updateDoc(eventRef, {
        joiners_id: arrayUnion(user.uid),
      });
      alert("¡Te has unido al grupo!");
    } catch (error) {
      console.error("Error joining group:", error);
      alert("Hubo un error al unirte al grupo.");
    }
  };

  const createEvent = async () => {
    const userId = user?.uid;

    const newEvent = {
      idUser: userId,
      title: title || "Sin título",
      description: description || "",
      address: selectedAddress,
      latitude: selectedLat,
      longitude: selectedLon,
      date: date.toDateString(),
      hour: time.toTimeString().slice(0, 5),
      userId: userId,
      joiners_id: [userId],
    };

    try {
      const docRef = await addDoc(collection(db, "events"), newEvent);

      await addDoc(collection(db, "events", docRef.id, "groupChat"), {
        text: "¡Bienvenida al chat del evento!",
        senderId: userId,
        timestamp: serverTimestamp(),
        system: true,
      });

      setEvents((prevEvents) => [
        ...prevEvents,
        {
          id: docRef.id,
          idUser: userId || "",
          title: newEvent.title,
          description: newEvent.description,
          address: newEvent.address,
          latitude: Number(newEvent.latitude),
          longitude: Number(newEvent.longitude),
          date: newEvent.date,
          hour: newEvent.hour,
        },
      ]);
      setTitle("");
      setDescription("");
      setDate(new Date());
      setTime(new Date());
      setSelectedAddress("");
      setSelectedLat(0);
      setSelectedLon(0);
      console.log("GRUPO DE CHAT CREADO ");
      Toast.show({
        type: 'success',
        text1: 'Tu evento se ha creado correctamente',
        text2: 'Se ha creado un grupo en el chat para tu evento',
        position: 'bottom',
        visibilityTime: 2000,
      });
      toggleModal();

    } catch (error) {
      console.error("Create Event Error: ", error);
    }
  };

  function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const typeEvents = [
    {
      icon: <Volleyball size={20} color="black" />,
      label: "Deporte",
    },
    {
      icon: <PartyPopper size={20} color="black" />,
      label: "Fiesta",
    },
    {
      icon: <Utensils size={20} color="black" />,
      label: "Restaurante",
    },
  ];

  return (
    <>
      {loading ? (
        <Text>Loading events...</Text>
      ) : (
        <View className="flex-1">
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: 41.82046,
              longitude: 1.86768,
              latitudeDelta: 2.5,
              longitudeDelta: 2.5,
            }}
          >
            {events.map((event) => (
              <Marker
                key={event.id}
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
                <View className="w-28 p-5 bg-tertiary-300 rounded-md">
                  <Text className="text-center font-bold">{event.title}</Text>
                  {/* <Text className='text-center'>{event.description}</Text> */}
                  <View className="rounded-full  bg-tertiary-400 p-2 mx-auto">
                    {eventType}
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
                  <Text className="font-semibold text-lg">
                    {selectedEvent?.title}
                  </Text>
                  <View className="flex flex-row gap-x-2">
                    <MapPinned size={20} color="black" />
                    <Text className="text-sm text-neutral-400 w-fit text-ellipsis">
                      {selectedEvent?.address}
                    </Text>
                  </View>
                  <View className="flex flex-row gap-x-2">
                    <CalendarDays size={20} color="black" />
                    <Text className="text-sm text-neutral-400">
                      {selectedEvent?.date
                        ? capitalize(
                          new Date(selectedEvent.date).toLocaleDateString(
                            "es-ES",
                            {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )
                        )
                        : ""}{" "}
                      {selectedEvent?.hour}
                    </Text>
                  </View>

                  <Text className="text-lg text-neutral-400">
                    {selectedEvent?.description}
                  </Text>

                  <View className="flex flex-row gap-3 items-center">
                    <TouchableOpacity
                      //onPress={toggleModalEvent}
                      className="flex-1 bg-primary-500 justify-center items-center h-12 rounded-lg"
                      activeOpacity={0.7}
                    >
                      <Text className="text-primary-700 font-semibold">
                        Voy a ir!
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleJoinGroup}
                      className="flex-1 bg-secondary-100 justify-center items-center h-12 rounded-lg"
                      activeOpacity={0.7}
                    >
                      <Text className="text-secondary-300 font-semibold">
                        Unirme al grupo
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    onPress={toggleModalEvent}
                    className="w-full bg-tertiary-200 justify-center items-center h-12 rounded-lg"
                    activeOpacity={0.7}
                  >
                    <Text className="text-tertiary-700 font-semibold">
                      Cerrar
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          {/* Botón crear evento */}
          <View className="absolute z-30 right-8 top-12">
            <TouchableOpacity onPress={toggleModal}>
              <Ionicons name={"add-circle-outline"} size={36} color="white" />
            </TouchableOpacity>
          </View>

          {/* Modal Form */}
          <Modal
            transparent={true}
            visible={isModalVisible}
            onRequestClose={toggleModal}
          >
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <View className="flex-1 justify-center items-center bg-[rgba(0,0,0,0.5)]">
                <View className="w-[90%] p-5 bg-white rounded-xl gap-y-3">
                  <Text className="font-semibold text-lg mb-3 text-center">
                    Crear evento
                  </Text>

                  <FormControl isRequired>
                    <Text className="font-semibold mb-1">Título</Text>
                    <Input
                      action="secondary"
                      className="rounded-xl py-2.5 px-3.5"
                      size="xl"
                    >
                      <InputField
                        className=" text-base px-0"
                        value={title}
                        onChangeText={setTitle}
                      //accessibilityLabel={t("name_label")}
                      />
                    </Input>
                  </FormControl>
                  <FormControl isRequired>
                    <Text className="font-semibold mb-1">Descripción</Text>
                    <Input action="secondary" className="rounded-xl py-2.5 px-3.5 h-40 items-start" size="xl">
                      <InputField
                        multiline
                        className="text-base px-0 h-full" // h-full to fill the parent Input height
                        value={description}
                        onChangeText={setDescription}
                      // accessibilityLabel={t("name_label")}
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
                    label="Dirección"
                    placeholder="Escribe una dirección"
                  />

                  <Text className="font-semibold">Seleccionar fecha</Text>
                  <View className="border border-secondary-200 flex-row items-center rounded-xl">
                    <TouchableOpacity
                      onPress={openPickerDate}
                      activeOpacity={1}
                      className="flex-1 flex-row justify-between px-4 py-3 "
                    >
                      <Text
                        className={
                          date ? "text-black" : "text-neutral-400"
                        }
                      >
                        {date ? formatDate(date) : "dd/mm/yyyy"}
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
                            value={tempDate || new Date()}
                            mode="date"
                            display={
                              Platform.OS === "ios" ? "inline" : "default"
                            }
                            onChange={onChangeDate}
                            minimumDate={new Date()}
                          />
                          <View className="flex flex-row justify-between w-full mt-4 gap-x-2">
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
                              className="flex-1 "
                              onPress={handleAcceptDate}
                            >
                              <ButtonText className='text-white'>Aceptar</ButtonText>
                            </Button>
                          </View>
                        </View>
                      </View>
                    </Modal>
                  )}

                  <Text className="font-semibold">Seleccionar hora</Text>
                  <View className="border border-secondary-200 flex-row items-center rounded-xl">
                    <TouchableOpacity
                      onPress={openPickerTime}
                      activeOpacity={1}
                      className="flex-1 flex-row justify-between px-4 py-3"
                    >
                      <Text
                        className={
                          time ? "text-black" : "text-neutral-400"
                        }
                      >
                        {time
                          ? time.toTimeString().slice(0, 5)
                          : "HH:mm"}
                      </Text>
                      <Clock size={20} color={"#98A2B3"} />
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
                            value={tempTime instanceof Date ? tempTime : new Date()}
                            mode="time"
                            is24Hour={true}
                            display={"spinner"}
                            onChange={onChangeTime}
                          />
                          <View className="flex flex-row justify-between w-full mt-4 gap-x-2">
                            <Button
                              variant="outline"
                              size="md"
                              onPress={() => setShowTimePicker(false)}
                              className="flex-1"
                            >
                              <ButtonText>Cerrar</ButtonText>
                            </Button>
                            <Button
                              size="md"
                              className="flex-1 "
                              onPress={handleAcceptTime}
                            >
                              <ButtonText className='text-white'>Aceptar</ButtonText>
                            </Button>
                          </View>
                        </View>
                      </View>
                    </Modal>
                  )}

                  <Text>Tipo de evento</Text>
                  <View className="flex flex-row flex-wrap gap-3 mt-2">
                    {typeEvents.map((type, index) => {
                      const isSelected = eventType === type.label;

                      return (
                        <TouchableOpacity
                          key={index}
                          className={`flex flex-row items-center gap-x-2 border border-secondary-200 rounded-xl px-4 py-2 ${isSelected ? 'bg-secondary-100' : 'bg-white'}`}
                          onPress={() => {
                            setEventType(type.label);
                          }}
                        >
                          {type.icon}
                          <Text className="text-sm">{type.label}</Text>
                        </TouchableOpacity>
                      )
                    })}
                  </View>

                  <TouchableOpacity
                    className="w-full mt-6 bg-black justify-center items-center h-12 rounded-lg"
                    onPress={createEvent}
                  >
                    <Text className="text-white font-semibold">
                      Crear evento
                    </Text>
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
2000