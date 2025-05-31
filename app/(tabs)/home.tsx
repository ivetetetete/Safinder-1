import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import SelectMultiple from '@/components/SelectMultiple';
import questions from '../questions.json';
import { FormControl } from '@/components/ui/form-control';


export default function HomeScreen() {
  const router = useRouter();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const [answers, setAnswers] = useState<Record<number, string | undefined>>({});
  const handleSelect = (questionId: any, optionKey: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionKey }));
  };

  return (
    <SafeAreaView className="flex-1 bg-primary-600">
      <View className='p-5'>
        <Text className='font-bold text-xl'>Cuestionario</Text>
      </View>
      <ScrollView className='bg-yellow-50'>
        <View className='px-5 mt-5'>
          {/* <View className="bg-pink-500 p-5 rounded-xl my-3">
            <Text className="text-white text-2xl">Countdown to next test:</Text>
            <Text className="font-bold text-white text-3xl text-right">3 days 2 hours 40 min</Text>
          </View> */}

          <FormControl isRequired>
            <View>
              {questions.map(q => (
                <View key={q.id} className="mb-4 border border-neutral-200 rounded-xl p-4 bg-white">
                  <View className='flex flex-row gap-x-2 items-center mb-3'>
                    <View className='flex-row justify-center items-center rounded-full bg-primary-500 size-7'>
                      <Text className="font-bold ">{q.id}</Text>
                    </View>
                    <Text className="font-bold text-lg mb-2 flex-1 text-wrap">{q.question}</Text>
                  </View>
                  <View className="gap-2">
                    {q.options.map(opt => {
                      const isSelected = answers[q.id] === opt.key;
                      return (
                        <TouchableOpacity
                          key={opt.key}
                          activeOpacity={1}
                          className={`border rounded-xl p-4 mb-2 flex flex-row items-center gap-x-3 ${isSelected
                            ? 'border-primary-700 bg-primary-600'
                            : 'border-neutral-200 bg-neutral-200'
                            }`}
                          onPress={() => handleSelect(q.id, opt.key)}
                        >
                          <View className={`w-7 h-7 rounded-full justify-center items-center ${isSelected ? 'bg-primary-700' : 'bg-white'}`}>
                            <Text className={`font-bold ${isSelected ? 'text-white' : 'text-primary-700'}`}>
                              {opt.key}
                            </Text>
                          </View>

                          <Text className="font-bold">
                            {opt.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              ))}
            </View>
          </FormControl>
          <TouchableOpacity className='w-full' onPress={() => router.push('/match')}>
            <View className="bg-primary-700 p-4 rounded-xl mb-5">
              <Text className="text-white text-center font-bold text-lg">Enviar respuestas</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
