import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

interface DestinationCardProps {
    destination: {
        id: string;
        name: string;
        location: string;
        description: string;
        main_image_url?: string | null;
    };
    onPress?: () => void;
    style?: ViewStyle | ViewStyle[];
}

export const DestinationCard = ({ destination, onPress, style }: DestinationCardProps) => {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }, style]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <View style={styles.imageContainer}>
                {destination.main_image_url ? (
                    <Image
                        source={{ uri: destination.main_image_url }}
                        style={styles.image}
                        contentFit="cover"
                        transition={300}
                    />
                ) : (
                    <View style={[styles.placeholder, { backgroundColor: theme.tint }]} />
                )}
                <View style={styles.overlay} />
            </View>

            <View style={styles.content}>
                <Text style={[styles.name, { color: theme.heading }]} numberOfLines={1}>
                    {destination.name}
                </Text>
                <Text style={[styles.location, { color: theme.tint }]} numberOfLines={1}>
                    {destination.location}
                </Text>
                <Text style={[styles.description, { color: theme.text }]} numberOfLines={2}>
                    {destination.description}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 260,
        borderRadius: 16,
        borderWidth: 1,
        overflow: 'hidden',
        marginRight: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    imageContainer: {
        position: 'relative',
        height: 140,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        width: '100%',
        height: '100%',
        opacity: 0.2,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    content: {
        padding: 12,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: Fonts.heading,
        marginBottom: 2,
    },
    location: {
        fontSize: 12,
        fontFamily: Fonts.body,
        marginBottom: 6,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    description: {
        fontSize: 13,
        fontFamily: Fonts.body,
        lineHeight: 18,
    },
});
