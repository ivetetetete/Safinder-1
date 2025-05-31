import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import {
    View,
    TextInput,
    FlatList,
    TouchableOpacity,
    Text,
    StyleSheet,
    Keyboard,
    TouchableWithoutFeedback,
    TextInputProps,
    ActivityIndicator,
    Platform,
} from 'react-native';
import axios, { CancelTokenSource } from 'axios';
import * as Location from 'expo-location';
import { debounce } from 'lodash';

interface LocationPrediction {
    display_name: string;
    lat: string;
    lon: string;
}

interface Props {
    onSelect?: (address: string, latitude?: string, longitude?: string) => void;
    selectedAddress: string;
    setSelectedAddress: (address: string) => void;
    placeholder: string;
    searchDelay?: number;
    maxResults?: number;
    label?: string;
    className?: string;
}

const InputLocation: React.FC<Props> = ({
    selectedAddress,
    setSelectedAddress,
    onSelect,
    placeholder,
    searchDelay = 300,
    maxResults = 5,
    label,
    className,
}) => {
    const [input, setInput] = useState('');
    const [predictions, setPredictions] = useState<LocationPrediction[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const searchCache = useRef<Record<string, LocationPrediction[]>>({});
    const cancelTokenRef = useRef<CancelTokenSource | null>(null);
    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
        if (selectedAddress && selectedAddress !== input) {
            setInput(selectedAddress);
        }
    }, []);

    useEffect(() => {
        const getLocation = async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    console.warn('Permission denied for location access');
                    return;
                }

                const loc = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced,
                });
                setLocation(loc.coords);
            } catch (error) {
                console.error('Error getting location:', error);
            }
        };

        getLocation();
    }, []);

    const fetchPredictions = async (inputText: string) => {
        if (!inputText || inputText.length < 2) {
            setPredictions([]);
            setIsLoading(false);
            return;
        }

        const cacheKey = `${inputText.toLowerCase()}_${location?.latitude || ''}_${location?.longitude || ''}`;
        if (searchCache.current[cacheKey]) {
            setPredictions(searchCache.current[cacheKey]);
            setIsLoading(false);
            return;
        }

        if (cancelTokenRef.current) {
            cancelTokenRef.current.cancel('New search initiated');
        }

        cancelTokenRef.current = axios.CancelToken.source();

        setIsLoading(true);
        try {
            const res = await axios.get('https://nominatim.openstreetmap.org/search', {
                params: {
                    q: inputText,
                    format: 'json',
                    addressdetails: 1,
                    limit: maxResults,
                    ...(location && {
                        lat: location.latitude,
                        lon: location.longitude,
                        bounded: 1,
                    }),
                },
                headers: {
                    'User-Agent': 'Safinder-1/1.0 (ivettes.business@gmail.com)',
                },
                cancelToken: cancelTokenRef.current.token,
            });

            searchCache.current[cacheKey] = res.data;
            setPredictions(res.data);
        } catch (err) {
            if (!axios.isCancel(err)) {
                console.error('Error fetching predictions from Nominatim:', err);
                setPredictions([]);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const debouncedFetch = useMemo(() =>
        debounce(fetchPredictions, searchDelay),
        [location, maxResults, searchDelay]
    );

    const handleChange = (text: string) => {
        setInput(text);
        setShowDropdown(true);
        if (text.length >= 2) {
            setIsLoading(true);
            debouncedFetch(text);
        } else {
            setPredictions([]);
        }
    };

    const handleSelect = (prediction: LocationPrediction) => {
        setInput(prediction.display_name);
        setSelectedAddress(prediction.display_name);
        if (onSelect) onSelect(prediction.display_name, prediction.lat, prediction.lon);
        setShowDropdown(false);
        Keyboard.dismiss();
    };

    const handleCloseDropdown = () => {
        if (input) setSelectedAddress(input);
        setShowDropdown(false);
        Keyboard.dismiss();
    };

    const handleBlur = () => {
        setTimeout(() => {
            if (!predictions.length) setSelectedAddress(input);
            setShowDropdown(false);
        }, 150);
    };

    const handleSubmitEditing = () => {
        if (input) setSelectedAddress(input);
        setShowDropdown(false);
        Keyboard.dismiss();
    };

    const handleFocus = () => {
        setShowDropdown(true);
        if (input.length >= 2 && !predictions.length) {
            debouncedFetch(input);
        }
    };

    const keyExtractor = useCallback(
        (item: LocationPrediction, index: number) => `${item.lat}-${item.lon}-${index}`,
        []
    );

    const renderItem = useCallback(({ item }: { item: LocationPrediction }) => (
        <TouchableOpacity
            style={styles.item}
            onPress={() => handleSelect(item)}
            activeOpacity={0.7}
        >
            <Text numberOfLines={2} style={styles.itemText}>{item.display_name}</Text>
        </TouchableOpacity>
    ), []);



    useEffect(() => {
        return () => {
            debouncedFetch.cancel();
            if (cancelTokenRef.current) {
                cancelTokenRef.current.cancel('Component unmounted');
            }
        };
    }, [debouncedFetch]);

    return (
        <TouchableWithoutFeedback onPress={handleCloseDropdown}>
            <View style={[showDropdown && { zIndex: 20 }]} className='relative w-full'>
                <Text className='font-semibold mb-1'>{label}</Text>

                <View className='flex-row items-center relative'>
                    <TextInput
                        ref={inputRef}
                        placeholder={placeholder}
                        //style={StyleSheet.flatten([styles.input, style])}
                        className="flex-1 py-3 px-3.5 w-full border border-secondary-200 rounded-xl "
                        value={input}
                        onChangeText={handleChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onSubmitEditing={handleSubmitEditing}
                        returnKeyType="search"
                        clearButtonMode="while-editing"
                        autoCorrect={false}
                        spellCheck={false}
                        keyboardType={Platform.OS === 'android' ? 'visible-password' : 'default'}
                    />

                    {isLoading && (
                        <ActivityIndicator
                            //style={styles.loadingIndicator} 
                            className='absolute right-1 top-6 bg-white'
                            size="small"
                            color="#ffa876"
                        />
                    )}
                </View>

                {showDropdown && (predictions.length > 0 || isLoading) && (
                    <View className='absolute top-16 left-0 right-0 border border-secondary-200 w-full rounded-[6px] bg-white shadow- z-50 max-h-[200px]'>
                        {(() => {
                            if (predictions.length > 0) {
                                return (
                                    <FlatList
                                        data={predictions}
                                        keyExtractor={keyExtractor}
                                        renderItem={renderItem}
                                        keyboardShouldPersistTaps="handled"
                                        showsVerticalScrollIndicator={true}
                                        initialNumToRender={5}
                                        maxToRenderPerBatch={10}
                                        windowSize={5}
                                        removeClippedSubviews={true}
                                    />
                                );
                            } else if (isLoading) {
                                return (
                                    <View className='p-4 items-center justify-center flex-row'>
                                        <ActivityIndicator size="small" color="#ffa876" />
                                        <Text className='ml-2.5'>Searching...</Text>
                                    </View>
                                );
                            } else {
                                return null;
                            }
                        })()}
                    </View>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
};

export default InputLocation;

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    input: {
        padding: 10,
        fontSize: 14,
        width: "100%",
        height: 50,
        paddingStart: 30,
        marginTop: 15,
        borderWidth: 1,
        borderColor: "#9DD187",
        borderRadius: 15,
        backgroundColor: "#FFFFFF",
    },
    loadingIndicator: {
        position: 'absolute',
        right: 15,
        top: 30,
    },
    dropdown: {
        position: 'absolute',
        top: 65,
        left: 0,
        right: 0,
        borderWidth: 1,
        borderColor: '#9DD187',
        width: "100%",
        borderTopWidth: 0,
        borderRadius: 6,
        backgroundColor: '#fff',
        elevation: 10,
        zIndex: 9999,
        maxHeight: 200,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    item: {
        padding: 12,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
    },
    itemText: {
        fontSize: 14,
    },
    loadingContainer: {
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    loadingText: {
        marginLeft: 10,
        color: '#666',
    },
});