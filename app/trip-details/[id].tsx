import { BouncingPlane } from '@/components/ui/BouncingPlane';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { supabase } from '@/lib/supabase';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar, ChevronLeft, MapPin, Star, Users } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';



export default function TripDetails() {
    const { id: rawId } = useLocalSearchParams();
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    const [trip, setTrip] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const router = useRouter();

    const fetchTripDetails = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('trips')
                .select(`
          *,
          destination:destinations(*)
        `)
                .eq('id', id)
                .single();

            if (error) throw error;
            setTrip(data);
        } catch (error) {
            console.error('Error fetching trip details:', error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) fetchTripDetails();
    }, [id, fetchTripDetails]);



    if (loading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
                <BouncingPlane color={theme.tint} />
            </View>
        );
    }

    if (!trip) {
        return (
            <View style={[styles.errorContainer, { backgroundColor: theme.background }]}>
                <Text style={[styles.errorText, { color: theme.text }]}>Trip not found</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={{ color: theme.tint }}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView>
                {/* Header Image */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: trip.main_featured_image_url }}
                        style={styles.mainImage}
                        contentFit="cover"
                    />
                    <TouchableOpacity
                        style={[styles.backButton, { backgroundColor: 'rgba(0,0,0,0.3)' }]}
                        onPress={() => router.back()}
                    >
                        <ChevronLeft color="#fff" size={24} />
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: theme.heading }]}>{trip.name}</Text>
                        <View style={styles.priceContainer}>
                            <Text style={[styles.price, { color: theme.tint }]}>
                                ${trip.price?.toLocaleString()}
                            </Text>
                            <Text style={[styles.perPerson, { color: theme.secondaryText }]}>/ person</Text>
                        </View>
                    </View>

                    <View style={styles.locationContainer}>
                        <MapPin size={16} color={theme.tint} />
                        <Text style={[styles.location, { color: theme.text }]}>
                            {trip.destination?.name}, {trip.destination?.location}
                        </Text>
                    </View>

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Star size={18} color="#FFD700" fill="#FFD700" />
                            <Text style={[styles.statText, { color: theme.text }]}>{trip.rating || '4.8'}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Calendar size={18} color={theme.tint} />
                            <Text style={[styles.statText, { color: theme.text }]}>7 Days</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Users size={18} color={theme.tint} />
                            <Text style={[styles.statText, { color: theme.text }]}>10+ People</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.heading }]}>Description</Text>
                        <Text style={[styles.description, { color: theme.text }]}>
                            {trip.description}
                        </Text>
                    </View>

                    {trip.extra_featured_images && trip.extra_featured_images.length > 0 && (
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: theme.heading }]}>Gallery</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gallery}>
                                {trip.extra_featured_images.map((img: string, index: number) => (
                                    <Image
                                        key={index}
                                        source={{ uri: img }}
                                        style={styles.galleryImage}
                                        contentFit="cover"
                                    />
                                ))}
                            </ScrollView>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Booking Footer */}
            <BlurView
                intensity={80}
                tint={colorScheme === 'dark' ? 'dark' : 'light'}
                style={[styles.footer, { borderTopColor: theme.border }]}
            >
                <View>
                    <Text style={[styles.totalLabel, { color: theme.secondaryText }]}>Total Price</Text>
                    <Text style={[styles.totalPrice, { color: theme.heading }]}>
                        ${trip.price?.toLocaleString()}
                    </Text>
                </View>
                <TouchableOpacity
                    style={[styles.bookButton, { backgroundColor: theme.btnBackground }]}
                    onPress={() => router.push(`/booking?tripId=${trip.id}`)}
                >
                    <Text style={[styles.bookButtonText, { color: theme.btnText }]}>Book Now</Text>
                </TouchableOpacity>
            </BlurView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 18,
        fontFamily: Fonts.body,
        marginBottom: 10,
    },
    imageContainer: {
        position: 'relative',
        height: 350,
    },
    mainImage: {
        width: '100%',
        height: '100%',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    content: {
        padding: 20,
        paddingBottom: 120,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        fontFamily: Fonts.heading,
        flex: 1,
        marginRight: 10,
    },
    priceContainer: {
        alignItems: 'flex-end',
    },
    price: {
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: Fonts.heading,
    },
    perPerson: {
        fontSize: 12,
        fontFamily: Fonts.body,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 6,
    },
    location: {
        fontSize: 14,
        fontFamily: Fonts.body,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statText: {
        fontSize: 14,
        fontWeight: '600',
        fontFamily: Fonts.body,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.05)',
        marginBottom: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: Fonts.heading,
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        fontFamily: Fonts.body,
    },
    gallery: {
        marginTop: 10,
    },
    galleryImage: {
        width: 150,
        height: 100,
        borderRadius: 12,
        marginRight: 12,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        paddingBottom: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        overflow: 'hidden',
    },
    totalLabel: {
        fontSize: 12,
        fontFamily: Fonts.body,
    },
    totalPrice: {
        fontSize: 22,
        fontWeight: 'bold',
        fontFamily: Fonts.heading,
    },
    bookButton: {
        paddingHorizontal: 40,
        paddingVertical: 14,
        borderRadius: 99,
    },
    bookButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: Fonts.body,
    },
});
