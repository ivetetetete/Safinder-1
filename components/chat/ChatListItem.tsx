import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { formatDistanceToNow } from '../../utils/dateUtils';

type ChatListItemProps = {
    chat: {
        userId: string;
        name: string;
        surname: string;
        photoURL?: string;
        lastMessage?: {
            text: string;
            timestamp: any;
        };
        unread: boolean;
        online: boolean;
    };
    onPress: () => void;
};

export default function ChatListItem({ chat, onPress }: ChatListItemProps) {
    const lastMessageTime = chat.lastMessage?.timestamp?.toDate();
    const timeAgo = lastMessageTime ? formatDistanceToNow(lastMessageTime) : '';

    return (
        <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-100" onPress={onPress}>
            <View className="relative mr-3">
                <Image
                    source={{
                        uri: chat.photoURL || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
                    }}
                    className="w-[60px] h-[60px] rounded-full"
                />
                {chat.online && (
                    <View className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-success border-2 border-white" />
                )}
            </View>

            <View className="flex-1 justify-center">
                <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-base font-bold text-text">{chat.name} {chat.surname}</Text>
                    <Text className="text-xs text-gray-500">{timeAgo}</Text>
                </View>

                <View className="flex-row justify-between items-center">
                    <Text
                        className={`text-sm flex-1 mr-2 ${chat.unread ? 'font-bold text-text' : 'text-gray-600'}`}
                        numberOfLines={1}
                    >
                        {chat.lastMessage?.text || 'Start a conversation'}
                    </Text>

                    {chat.unread && (
                        <View className="bg-primary rounded-full w-5 h-5 justify-center items-center">
                            <Text className="text-white text-xs font-bold">1</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}