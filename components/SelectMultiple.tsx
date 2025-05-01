import { Heart } from "lucide-react-native";
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Animated,
  Easing,
  TextInput,
} from "react-native";

interface SelectMultipleProps {
  options: Array<{ [key: string]: any }>;
  labelKey?: string;
  valueKey?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  onChange?: (selected: Array<{ [key: string]: any }>) => void;
  style?: string;
}

export default function SelectMultiple({
  options = [],
  labelKey = "label",
  valueKey = "value",
  placeholder = "Select options",
  searchPlaceholder = "Search...",
  onChange,
  style = "",
}: SelectMultipleProps) {
  const [selected, setSelected] = useState<Array<{ [key: string]: any }>>([]);
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const animatedHeight = useRef(new Animated.Value(0)).current;

  // Filter options based on search text
  const filteredOptions = options.filter((item) =>
    item[labelKey].toLowerCase().includes(searchText.toLowerCase())
  );

  const toggleDropdown = () => {
    if (open) {
      Animated.timing(animatedHeight, {
        toValue: 0,
        duration: 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }).start(() => setOpen(false));
    } else {
      setOpen(true);
      Animated.timing(animatedHeight, {
        toValue: Math.min(filteredOptions.length, 5) * 48 + 50, // 48 per item + 50 for search input
        duration: 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }).start();
    }
  };

  const handleSelect = (item: { [key: string]: any }) => {
    let updated;
    if (selected.some((s) => s[valueKey] === item[valueKey])) {
      updated = selected.filter((s) => s[valueKey] !== item[valueKey]);
    } else {
      updated = [...selected, item];
    }
    setSelected(updated);
    if (onChange) onChange(updated);
  };

  const removeTag = (item: { [key: string]: any }) => {
    const updated = selected.filter((s) => s[valueKey] !== item[valueKey]);
    setSelected(updated);
    if (onChange) onChange(updated);
  };

  // Close dropdown if options change and no results
  useEffect(() => {
    if (open && filteredOptions.length === 0) {
      Animated.timing(animatedHeight, {
        toValue: 50, // only search input height
        duration: 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }).start();
    }
  }, [filteredOptions.length]);

  return (
    <View className={`w-full ${style}`}>
      {/* Trigger */}
      <TouchableOpacity
        className="border border-secondary-200 rounded px-4 py-3 bg-white min-h-[48px] flex-row flex-wrap items-center"
        onPress={toggleDropdown}
        activeOpacity={0.7}
      >
        {selected.length === 0 ? (
          <Text className="text-gray-400">{placeholder}</Text>
        ) : (
          <View className="flex-row flex-wrap gap-2">
            {selected.map((item) => (
              <View
                key={item[valueKey]}
                className="bg-secondary-100 rounded-full px-3 py-1 flex-row items-center mr-2"
              >
                <Text className="text-neutral-500 mr-2 text-sm">{item[labelKey]}</Text>
                <TouchableOpacity onPress={() => removeTag(item)}>
                  <Text className="text-neutral-500 text-lg ml-2">×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </TouchableOpacity>

      {/* Animated Dropdown */}
      <Animated.View
        className="overflow-hidden bg-white rounded shadow border border-secondary-200"
        style={{
          height: animatedHeight,
          marginTop: open ? 4 : 0,
          opacity: animatedHeight.interpolate({
            inputRange: [0, Math.min(filteredOptions.length, 5) * 48 + 50],
            outputRange: [0, 1],
          }),
        }}
      >
        {open && (
          <>
            {/* Search Input */}
            <View className="px-4 py-2 border-b border-gray-200">
              <TextInput
                className="bg-gray-100 rounded px-3 py-2 text-black"
                placeholder={searchPlaceholder}
                placeholderTextColor="#999"
                value={searchText}
                onChangeText={setSearchText}
                autoCorrect={false}
                autoCapitalize="none"
              />
            </View>

            {/* Options List */}
            {filteredOptions.length > 0 ? (
              <FlatList
                data={filteredOptions}
                keyExtractor={(item, idx) => String(item[valueKey]) + idx}
                scrollEnabled={filteredOptions.length > 5}
                style={{ maxHeight: 48 * 5 }}
                renderItem={({ item }) => {
                  const isSelected = selected.some(
                    (s) => s[valueKey] === item[valueKey]
                  );
                  return (
                    <TouchableOpacity
                      className={`px-4 py-3 border-b border-gray-100 flex-row items-center ${
                        isSelected ? "bg-blue-50" : ""
                      }`}
                      onPress={() => handleSelect(item)}
                    >
                      <View
                        className={`w-5 h-5 mr-2 border rounded ${
                          isSelected
                            ? "bg-secondary-300 border-secondary-200"
                            : "border-gray-400"
                        }`}
                      >
                        {isSelected && (
                          <Heart color="#fff" size={16} className="" />
                        )}
                      </View>
                      <Text className="text-black ml-2">{item[labelKey]}</Text>
                    </TouchableOpacity>
                  );
                }}
              />
            ) : (
              <View className="px-4 py-3">
                <Text className="text-gray-500 italic">No results found</Text>
              </View>
            )}
          </>
        )}
      </Animated.View>
    </View>
  );
}
