import React from 'react';
import { View, Text } from 'react-native';

type EmptyStateProps = {
    title: string;
    message: string;
};

export default function EmptyState({ title, message }: EmptyStateProps) {
    return (
        <View className="flex-1 justify-center items-center p-5">
            <Text className="text-lg font-bold text-text mb-2">{title}</Text>
            <Text className="text-base text-gray-600 text-center px-5">{message}</Text>
        </View>
    );
}