import { Colors, Fonts } from '@/constants/theme';
import { useAuth } from '@/context/AuthProvider';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { supabase } from '@/lib/supabase';
import { Image } from 'expo-image';
import { Heart, MapPin } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

interface TripCardProps {
    trip: any;
    onPress?: () => void;
    style?: ViewStyle | ViewStyle[];
}

export const TripCard = ({ trip, onPress, style }: TripCardProps) => {
    const { user } = useAuth();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const [isFavorite, setIsFavorite] = useState(false);
    const [isToggling, setIsToggling] = useState(false);

    const checkFavoriteStatus = useCallback(async () => {
        if (!user?.id) return;
        try {
            const { data, error } = await supabase
                .from('users')
                .select('favorite_trips')
                .eq('id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') throw error;

            if (data?.favorite_trips) {
                setIsFavorite(data.favorite_trips.includes(trip.id));
            }
        } catch (error) {
            console.error('Error checking favorite status:', error);
        }
    }, [user?.id, trip.id]);

    useEffect(() => {
        if (user) {
            checkFavoriteStatus();
        }
    }, [user, checkFavoriteStatus]);

    const toggleFavorite = async () => {
        if (!user) return;
        setIsToggling(true);
        try {
            const { data: userData } = await supabase
                .from('users')
                .select('favorite_trips')
                .eq('id', user.id)
                .single();

            let favorites = userData?.favorite_trips || [];
            if (isFavorite) {
                favorites = favorites.filter((id: string) => id !== trip.id);
            } else {
                favorites = [...favorites, trip.id];
            }

            const { error } = await supabase
                .from('users')
                .update({ favorite_trips: favorites })
                .eq('id', user.id);

            if (!error) {
                setIsFavorite(!isFavorite);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        } finally {
            setIsToggling(false);
        }
    };

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }, style]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <View style={styles.imageWrapper}>
                <Image
                    source={{ uri: trip.main_featured_image_url }}
                    style={styles.image}
                    contentFit="cover"
                    transition={300}
                />
                <TouchableOpacity
                    style={styles.heartButton}
                    onPress={toggleFavorite}
                    disabled={isToggling}
                >
                    {isToggling ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Heart
                            size={20}
                            color={isFavorite ? '#ff4b4b' : '#fff'}
                            fill={isFavorite ? '#ff4b4b' : 'transparent'}
                        />
                    )}
                </TouchableOpacity>
            </View>
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
    imageWrapper: {
        position: 'relative',
        width: '100%',
        height: 180,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    heartButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
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
