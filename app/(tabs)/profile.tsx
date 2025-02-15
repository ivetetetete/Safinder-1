import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { getAuth, signOut } from 'firebase/auth';
import 'tailwindcss/tailwind.css';
import Svg, { G, Path } from "react-native-svg";
import { doc, getDoc } from 'firebase/firestore';
import { db } from "../../library/firebaseConfig";
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';


const Profile = () => {
  const router = useRouter();
  const auth = getAuth();
  const [user, setUser] = useState(auth.currentUser);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [dob, setDob] = useState(new Date());
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [gender, setGender] = useState('');
  const [bio, setBio] = useState('');

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    if (user) {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setSurname(userData.surname || "");
        setName(userData.name || "");
        setDob(userData.dateOfBirth || "");
        setCountry(userData.country || "");
        setCity(userData.city || "");
        setGender(userData.gender || "");
        setBio(userData.bio || "");
      }
    }
  };

  const goSettings = () => {
    router.push('../(profile)/settings');
  }

  const goEditProfile = () => {
    router.push('../(profile)/editProfile');
  }

  return (
    <SafeAreaView className="bg-[#FF7DB0] h-screen ">
      <ScrollView className=''>
        <View className='mx-3'>
          {/* <View className='flex flex-row pt-10 px-3 h-24 w-full justify-between items-center'>
          <Text className="text-xl font-bold text-[white]">Profile</Text>
          <View className='flex flex-row gap-4'>
            <TouchableOpacity onPress={goEditProfile}>
              <Ionicons name="pencil-outline" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={goSettings}>
              <Svg
                viewBox="0 0 28 28"
                fill="none"
                width={20}
                height={20}
              //xmlns="http://www.w3.org/2000/svg"
              >
                <G clipRule="evenodd" fill="#fff" fillRule="evenodd">
                  <Path d="M14 20a6 6 0 100-12 6 6 0 000 12zm4-6a4 4 0 11-8 0 4 4 0 018 0z" />
                  <Path d="M0 13v2a3 3 0 002.678 2.983c.128.363.273.718.433 1.064a3 3 0 00.182 4.045l1.414 1.414a3 3 0 003.963.247c.434.216.884.406 1.346.569A3 3 0 0013 28h2a3 3 0 002.983-2.677c.42-.148.83-.318 1.227-.51a3 3 0 003.884-.307l1.414-1.414a3 3 0 00.307-3.884c.191-.397.362-.806.51-1.226A3 3 0 0028 15v-2a3 3 0 00-2.677-2.983 11.927 11.927 0 00-.569-1.348 3 3 0 00-.248-3.962l-1.414-1.414a3 3 0 00-4.043-.183 11.943 11.943 0 00-1.067-.434A3 3 0 0014.999 0h-2a3 3 0 00-2.983 2.678 11.94 11.94 0 00-1.193.494 3 3 0 00-4.115.12L3.294 4.708a3 3 0 00-.121 4.115c-.186.387-.351.786-.495 1.195A3 3 0 000 13zM16 3a1 1 0 00-1-1h-2a1 1 0 00-1 1v.383c0 .475-.337.88-.794 1.012a9.94 9.94 0 00-2.021.838c-.417.23-.94.182-1.277-.154l-.372-.372a1 1 0 00-1.414 0L4.708 6.12a1 1 0 000 1.414l.372.372c.336.336.384.86.155 1.277a9.938 9.938 0 00-.839 2.022c-.133.457-.537.794-1.013.794H3a1 1 0 00-1 1v2a1 1 0 001 1h.383c.476 0 .88.336 1.013.793.194.666.454 1.304.775 1.905.221.415.17.931-.162 1.264l-.302.301a1 1 0 000 1.414l1.414 1.415a1 1 0 001.415 0l.243-.244c.34-.34.872-.385 1.29-.147.668.38 1.384.684 2.137.903.457.133.793.537.793 1.013V25a1 1 0 001 1h2a1 1 0 001-1v-.383c0-.475.337-.88.794-1.012a9.934 9.934 0 002.023-.84c.417-.229.941-.18 1.277.156l.171.17a1 1 0 001.414 0l1.415-1.414a1 1 0 000-1.414l-.171-.17c-.337-.337-.384-.861-.155-1.278.35-.635.632-1.312.838-2.022.133-.457.537-.793 1.013-.793H25a1 1 0 001-1v-2a1 1 0 00-1-1h-.382c-.476 0-.88-.337-1.013-.794a9.939 9.939 0 00-.903-2.138c-.238-.419-.193-.95.147-1.29l.243-.243a1 1 0 000-1.414l-1.414-1.414a1 1 0 00-1.415 0l-.3.3c-.333.333-.85.384-1.264.163a9.935 9.935 0 00-1.906-.775c-.457-.133-.794-.537-.794-1.013V3z" />
                </G>
              </Svg>
            </TouchableOpacity>
          </View>

        </View> */}
          <View className='size-40 flex justify-center items-end m-auto relative'>
            <Image
              className='size-32 rounded-full border-4 border-white m-auto'
              source={require('../../assets/images/blank-profile.png')} />
            <View className='bg-pink-500 rounded-full size-10 flex justify-center items-center absolute bottom-5 right-5'>
              <Text className='font-bold text-2xl text-white m-0 p-0'>+</Text>
            </View>
          </View>

          <View className='flex flex-col items-center '>
            {/* <Text className='py-3 font-bold text-2xl'>{name}</Text>
              <Text>{bio}</Text> */}
            <Text className='py-1 font-bold text-2xl text-white'>Ivette</Text>
            <Text className='text-white'>asi soy yo :)</Text>

            {/* <View className='flex flex-row gap-x-2 mt-5'>
                <TouchableOpacity className='flex flex-row justify-center items-center gap-x-1 bg-[#FFA876] rounded-xl p-3 w-32 '>
                  <Text className='text-white font-semibold'>+</Text>
                  <Text className='text-white font-semibold'>Follow</Text>
                </TouchableOpacity>
                <TouchableOpacity className='bg-[#FFA876] rounded-xl p-3 w-28'>
                  <Text className='text-center text-white font-semibold'>SM</Text>
                </TouchableOpacity>
              </View> */}
          </View>

          <View className=' border-2 border-pink-500 rounded-lg p-2 mt-5'>
            <View className='flex flex-row gap-2 mb-2'>
              <View className='bg-pink-500 bg-opacity-50 rounded-full p-3 w-fit'>
                <Text className='text-lg text-white'>Programar</Text>
              </View>
              <View className='bg-pink-500 bg-opacity-50 rounded-full p-3 w-fit'>
                <Text className='text-lg text-white'>Cocinar</Text>
              </View>
              <View className='bg-pink-500 bg-opacity-50 rounded-full p-3 w-fit'>
                <Text className='text-lg text-white'>Cantar</Text>
              </View>
            </View>
            <View className='flex flex-row gap-2 mb-2'>
              <View className='bg-pink-500 bg-opacity-50 rounded-full p-3 w-fit'>
                <Text className='text-lg text-white'>Juegos de mesa</Text>
              </View>
              <View className='bg-pink-500 bg-opacity-50 rounded-full p-3 w-fit'>
                <Text className='text-lg text-white'>Música</Text>
              </View>
              <View className='bg-pink-500 bg-opacity-50 rounded-full p-3 w-fit'>
                <Text className='text-lg text-white'>Reality shows</Text>
              </View>
            </View>
          </View>

          <View className='mt-6'>
            <Text className='font-bold mb-3 text-lg text-white'>Photo gallery</Text>
            <View className='flex flex-row gap-x-3 px-2'>
              <Image
                className='w-32 h-48'
                source={require('../../assets/images/fake-images/back.jpg')} />
              <Image
                className='w-32 h-48'
                source={require('../../assets/images/fake-images/friends.jpg')} />
              <Image
                className='w-32 h-48'
                source={require('../../assets/images/fake-images/mirror.jpg')} />
            </View>
          </View>

          <View className='mt-6'>
            <Text className='font-bold mb-3 text-lg text-white'>Social media</Text>
            <View className='flex flex-row gap-x-3 px-4'>
              <View className='size-14'>
                <Svg
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <G fill="#ffff">
                    <Path
                      fillRule="evenodd"
                      d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                      clipRule="evenodd"
                    />
                    <Path d="M18 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" />
                    <Path
                      fillRule="evenodd"
                      d="M1.654 4.276C1 5.56 1 7.24 1 10.6v2.8c0 3.36 0 5.04.654 6.324a6 6 0 0 0 2.622 2.622C5.56 23 7.24 23 10.6 23h2.8c3.36 0 5.04 0 6.324-.654a6 6 0 0 0 2.622-2.622C23 18.44 23 16.76 23 13.4v-2.8c0-3.36 0-5.04-.654-6.324a6 6 0 0 0-2.622-2.622C18.44 1 16.76 1 13.4 1h-2.8c-3.36 0-5.04 0-6.324.654a6 6 0 0 0-2.622 2.622ZM13.4 3h-2.8c-1.713 0-2.878.002-3.778.075-.877.072-1.325.202-1.638.361a4 4 0 0 0-1.748 1.748c-.16.313-.29.761-.36 1.638C3.001 7.722 3 8.887 3 10.6v2.8c0 1.713.002 2.878.075 3.778.072.877.202 1.325.361 1.638a4 4 0 0 0 1.748 1.748c.313.16.761.29 1.638.36.9.074 2.065.076 3.778.076h2.8c1.713 0 2.878-.002 3.778-.075.877-.072 1.325-.202 1.638-.361a4 4 0 0 0 1.748-1.748c.16-.313.29-.761.36-1.638.074-.9.076-2.065.076-3.778v-2.8c0-1.713-.002-2.878-.075-3.778-.072-.877-.202-1.325-.361-1.638a4 4 0 0 0-1.748-1.748c-.313-.16-.761-.29-1.638-.36C16.278 3.001 15.113 3 13.4 3Z"
                      clipRule="evenodd"
                    />
                  </G>
                </Svg>
              </View>
              <View className='size-14'>
                <Svg viewBox="0 0 24 24" fill="none"><G id="SVGRepo_bgCarrier" stroke-width="0"></G><G id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></G><G id="SVGRepo_iconCarrier"> <Path fill-rule="evenodd" clip-rule="evenodd" d="M19.7828 3.91825C20.1313 3.83565 20.3743 3.75444 20.5734 3.66915C20.8524 3.54961 21.0837 3.40641 21.4492 3.16524C21.7563 2.96255 22.1499 2.9449 22.4739 3.11928C22.7979 3.29366 23 3.6319 23 3.99986C23 5.08079 22.8653 5.96673 22.5535 6.7464C22.2911 7.40221 21.9225 7.93487 21.4816 8.41968C21.2954 11.7828 20.3219 14.4239 18.8336 16.4248C17.291 18.4987 15.2386 19.8268 13.0751 20.5706C10.9179 21.3121 8.63863 21.4778 6.5967 21.2267C4.56816 20.9773 2.69304 20.3057 1.38605 19.2892C1.02813 19.0108 0.902313 18.5264 1.07951 18.109C1.25671 17.6916 1.69256 17.4457 2.14144 17.5099C3.42741 17.6936 4.6653 17.4012 5.6832 16.9832C5.48282 16.8742 5.29389 16.7562 5.11828 16.6346C4.19075 15.9925 3.4424 15.1208 3.10557 14.4471C2.96618 14.1684 2.96474 13.8405 3.10168 13.5606C3.17232 13.4161 3.27562 13.293 3.40104 13.1991C2.04677 12.0814 1.49999 10.5355 1.49999 9.49986C1.49999 9.19192 1.64187 8.90115 1.88459 8.71165C1.98665 8.63197 2.10175 8.57392 2.22308 8.53896C2.12174 8.24222 2.0431 7.94241 1.98316 7.65216C1.71739 6.3653 1.74098 4.91284 2.02985 3.75733C2.1287 3.36191 2.45764 3.06606 2.86129 3.00952C3.26493 2.95299 3.6625 3.14709 3.86618 3.50014C4.94369 5.36782 6.93116 6.50943 8.78086 7.18568C9.6505 7.50362 10.4559 7.70622 11.0596 7.83078C11.1899 6.61019 11.5307 5.6036 12.0538 4.80411C12.7439 3.74932 13.7064 3.12525 14.74 2.84698C16.5227 2.36708 18.5008 2.91382 19.7828 3.91825ZM10.7484 9.80845C10.0633 9.67087 9.12171 9.43976 8.09412 9.06408C6.7369 8.56789 5.16088 7.79418 3.84072 6.59571C3.86435 6.81625 3.89789 7.03492 3.94183 7.24766C4.16308 8.31899 4.5742 8.91899 4.94721 9.10549C5.40342 9.3336 5.61484 9.8685 5.43787 10.3469C5.19827 10.9946 4.56809 11.0477 3.99551 10.9046C4.45603 11.595 5.28377 12.2834 6.66439 12.5135C7.14057 12.5929 7.49208 13.0011 7.49986 13.4838C7.50765 13.9665 7.16949 14.3858 6.69611 14.4805L5.82565 14.6546C5.95881 14.7703 6.103 14.8838 6.2567 14.9902C6.95362 15.4727 7.65336 15.6808 8.25746 15.5298C8.70991 15.4167 9.18047 15.6313 9.39163 16.0472C9.60278 16.463 9.49846 16.9696 9.14018 17.2681C8.49626 17.8041 7.74425 18.2342 6.99057 18.5911C6.63675 18.7587 6.24134 18.9241 5.8119 19.0697C6.14218 19.1402 6.48586 19.198 6.84078 19.2417C8.61136 19.4594 10.5821 19.3126 12.4249 18.6792C14.2614 18.0479 15.9589 16.9385 17.2289 15.2312C18.497 13.5262 19.382 11.1667 19.5007 7.96291C19.51 7.71067 19.6144 7.47129 19.7929 7.29281C20.2425 6.84316 20.6141 6.32777 20.7969 5.7143C20.477 5.81403 20.1168 5.90035 19.6878 5.98237C19.3623 6.04459 19.0272 5.94156 18.7929 5.70727C18.0284 4.94274 16.5164 4.43998 15.2599 4.77822C14.6686 4.93741 14.1311 5.28203 13.7274 5.89906C13.3153 6.52904 13 7.51045 13 8.9999C13 9.28288 12.8801 9.5526 12.6701 9.74221C12.1721 10.1917 11.334 9.92603 10.7484 9.80845Z" fill="#fff"></Path> </G></Svg>
              </View>
            </View>
          </View>

          <View className='my-5'>
            <TouchableOpacity
              onPress={handleLogout}
              className="bg-red-400 py-3 rounded-2xl"
            >
              <Text className="text-white text-center font-bold px-6 py-2">Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

//you're the best
