import { Heart } from "lucide-react-native";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
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
  const windowHeight = Dimensions.get('window').height;
  const maxDropdownHeight = Math.min(windowHeight * 0.4, 300);

  const filteredOptions = options.filter((item) =>
    item[labelKey].toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSelect = (item: { [key: string]: any }) => {
    const updated = selected.some((s) => s[valueKey] === item[valueKey])
      ? selected.filter((s) => s[valueKey] !== item[valueKey])
      : [...selected, item];
    setSelected(updated);
    onChange?.(updated);
  };

  const removeTag = (item: { [key: string]: any }) => {
    const updated = selected.filter((s) => s[valueKey] !== item[valueKey]);
    setSelected(updated);
    onChange?.(updated);
  };

  useEffect(() => {
    if (!open) setSearchText("");
  }, [open]);

  return (
    <View className={`w-full z-10 ${style}`}>
      {/* Trigger */}
      <TouchableOpacity
        className="border border-secondary-200 rounded px-4 py-3 bg-yellow-50 min-h-[48px] flex-row flex-wrap items-center"
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
      >
        {selected.length === 0 ? (
          <Text className="text-gray-400">{placeholder}</Text>
        ) : (
          <View className="flex-row flex-wrap gap-2">
            {selected.map((item) => (
              <View
                key={item[valueKey]}
                className="bg-secondary-100 rounded-full px-3 py-1 flex-row items-center mr-2 mb-1"
              >
                <Text className="text-white font-semibold mr-2 text-sm">{item[labelKey]}</Text>
                <TouchableOpacity onPress={() => removeTag(item)}>
                  <Text className="text-white text-lg">×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </TouchableOpacity>

      {/* Modal Dropdown */}
      <Modal
        visible={open}
        animationType="fade"
        transparent
        onRequestClose={() => setOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View className="flex-1 bg-black/50" />
        </TouchableWithoutFeedback>
        <View className="absolute top-1/4 left-0 right-0 items-center z-50">
          <View
            className="bg-white rounded-2xl w-11/12 max-w-lg overflow-hidden"
            style={{ maxHeight: maxDropdownHeight }}
          >
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
            <FlatList
              data={filteredOptions}
              keyExtractor={(item, idx) => String(item[valueKey]) + idx}
              keyboardShouldPersistTaps="handled"
              style={{ flexGrow: 0 }}
              contentContainerStyle={{ paddingBottom: 8 }}
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
                      {isSelected && <Heart color="#fff" size={16} />}
                    </View>
                    <Text className="text-black ml-2">{item[labelKey]}</Text>
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <View className="px-4 py-3">
                  <Text className="text-gray-500 italic">No results found</Text>
                </View>
              }
            />
            <TouchableOpacity
              className="p-3"
              onPress={() => setOpen(false)}
            >
              <Text className="text-[#FFA876] font-bold text-center">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
