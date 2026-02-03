import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Image } from 'expo-image';
import { MapPin } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

interface TripCardProps {
    trip: any;
    onPress?: () => void;
    style?: ViewStyle | ViewStyle[];
}

export const TripCard = ({ trip, onPress, style }: TripCardProps) => {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }, style]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <Image
                source={{ uri: trip.main_featured_image_url }}
                style={styles.image}
                contentFit="cover"
                transition={300}
            />
            <View style={styles.content}>
                <Text style={[styles.name, { color: theme.heading }]} numberOfLines={1}>
                    {trip.name}
                </Text>

                <View style={styles.locationContainer}>
                    <MapPin size={14} color={theme.tint} />
                    <Text style={[styles.location, { color: theme.text }]}>
                        {trip.destination?.name || 'Various'}
                    </Text>
                </View>

                <Text style={[styles.description, { color: theme.secondaryText }]} numberOfLines={2}>
                    {trip.short_description}
                </Text>

                <View style={styles.footer}>
                    <View>
                        <Text style={[styles.priceTag, { color: theme.tint }]}>
                            {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                                maximumFractionDigits: 0,
                            }).format(trip.price)}
                        </Text>
                        <Text style={[styles.perPerson, { color: theme.secondaryText }]}>per person</Text>
                    </View>
                    <View style={[styles.bookBtn, { backgroundColor: theme.btnBackground }]}>
                        <Text style={[styles.bookBtnText, { color: theme.btnText }]}>Book</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        borderWidth: 1,
        overflow: 'hidden',
        marginBottom: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    image: {
        width: '100%',
        height: 180,
    },
    content: {
        padding: 16,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: Fonts.heading,
        marginBottom: 6,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 4,
    },
    location: {
        fontSize: 14,
        fontFamily: Fonts.body,
    },
    description: {
        fontSize: 14,
        fontFamily: Fonts.body,
        marginBottom: 16,
        lineHeight: 20,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    priceTag: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: Fonts.heading,
    },
    perPerson: {
        fontSize: 12,
        fontFamily: Fonts.body,
    },
    bookBtn: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 8,
    },
    bookBtnText: {
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: Fonts.body,
    },
});
