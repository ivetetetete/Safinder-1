import React from 'react';
import { View, Text } from 'react-native';
import { formatMessageTime } from '../../utils/dateUtils';

type ChatBubbleProps = {
    message: {
        text: string;
        timestamp: any;
        senderId: string;
    };
    isCurrentUser: boolean;
};

export default function ChatBubble({ message, isCurrentUser }: ChatBubbleProps) {
    return (
        <View className={`mb-4 flex-row ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
            <View
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${isCurrentUser
                        ? 'bg-primary rounded-br-sm'
                        : 'bg-white rounded-bl-sm'
                    }`}
            >
                <Text
                    className={isCurrentUser ? 'text-white text-base' : 'text-text text-base'}
                >
                    {message.text}
                </Text>
                <Text
                    className={`text-xs mt-1 self-end ${isCurrentUser ? 'text-white/70' : 'text-gray-500'
                        }`}
                >
                    {formatMessageTime(message.timestamp?.toDate())}
                </Text>
            </View>
        </View>
    );
}