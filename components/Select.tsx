import { ChevronDown } from "lucide-react-native";
import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, FlatList, Animated, Easing } from "react-native";

interface AnimatedDropdownProps {
  options: Array<{ [key: string]: any }>;
  labelKey?: string;
  valueKey?: string;
  placeholder?: string;
  onSelect?: (item: { [key: string]: any }) => void;
  style?: string;
}

export default function Select({
  options = [],
  labelKey = "label",
  valueKey = "value",
  placeholder = "Select an option",
  onSelect,
  style = "",
}: AnimatedDropdownProps) {
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;

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
        toValue: options.length * 48, // 48 = item height (py-3)
        duration: 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }).start();
    }
  };

  const handleSelect = (item: { [key: string]: any }) => {
    setSelected(item[valueKey]);
    if (onSelect) onSelect(item);
    Animated.timing(animatedHeight, {
      toValue: 0,
      duration: 200,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start(() => setOpen(false));
  };

  const selectedLabel = selected
    ? options.find((o) => o[valueKey] === selected)?.[labelKey]
    : null;

  return (
    <View className={`w-full ${style}`}>
      {/* Trigger */}
      <TouchableOpacity
        className="flex flex-row justify-between border border-secondary-200 rounded px-4 py-3 bg-yellow-50"
        onPress={toggleDropdown}
        activeOpacity={0.7}
      >
        <Text className={selected ? "text-black" : "text-neutral-400"}>
          {selectedLabel || placeholder}
        </Text>
        <ChevronDown color='#ffa876' size={20} />

      </TouchableOpacity>

      {/* Animated Dropdown */}
      <Animated.View
        className="overflow-hidden bg-yellow-50 rounded shadow border border-secondary-200"
        style={{
          height: animatedHeight,
          marginTop: open ? 4 : 0,
          opacity: animatedHeight.interpolate({
            inputRange: [0, options.length * 48],
            outputRange: [0, 1],
          }),
        }}
      >
        {open && (
          <FlatList
            data={options}
            keyExtractor={(item, idx) => String(item[valueKey]) + idx}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="px-4 py-3"
                onPress={() => handleSelect(item)}
              >
                <Text className="text-black">{item[labelKey]}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </Animated.View>
    </View>
  );
}
