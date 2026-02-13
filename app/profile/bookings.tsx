import { BouncingPlane } from '@/components/ui/BouncingPlane';
import { Colors, Fonts } from '@/constants/theme';
import { useAuth } from '@/context/AuthProvider';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { supabase } from '@/lib/supabase';
import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import { Calendar, ChevronLeft } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { PleaseSignIn } from '@/components/ui/PleaseSignIn';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 60) / 2;

export default function BookingsScreen() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const router = useRouter();

    const fetchBookings = useCallback(async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select(`
                    *,
                    trip:trips(
                        *,
                        destination:destinations(*)
                    )
                `)
                .eq('user_id', user.id)
                .order('booked_at', { ascending: false });

            if (error) throw error;
            setBookings(data || []);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        if (user) fetchBookings();
    }, [user, fetchBookings]);

    const renderBookingItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={[styles.bookingCard, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => router.push(`/profile/booking-details/${item.id}`)}
        >
            <Image
                source={{ uri: item.trip.main_featured_image_url }}
                style={styles.tripImage}
                contentFit="cover"
            />
            <View style={styles.cardContent}>
                <Text style={[styles.tripName, { color: theme.heading }]} numberOfLines={1}>
                    {item.trip.name}
                </Text>

                <View style={[styles.statusBadge, { backgroundColor: item.status === 'confirmed' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(0, 0, 0, 0.05)' }]}>
                    <Text style={[styles.statusText, { color: item.status === 'confirmed' ? '#27ae60' : '#666' }]}>
                        {item.status.toUpperCase()}
                    </Text>
                </View>

                <View style={styles.detailRow}>
                    <Calendar size={12} color={theme.tint} />
                    <Text style={[styles.detailText, { color: theme.secondaryText }]}>
                        {new Date(item.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </Text>
                </View>

                <Text style={[styles.price, { color: theme.tint }]}>${item.total_price}</Text>
            </View>
        </TouchableOpacity>
    );

    if (!user) {
        return (
            <PleaseSignIn
                message="Please sign in to view your bookings"
                onSignIn={() => router.push('/(auth)/signin')}
            />
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Stack.Screen options={{
                headerShown: true,
                title: 'My Bookings',
                headerTransparent: true,
                headerLeft: () => (
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <ChevronLeft color={theme.heading} size={28} />
                    </TouchableOpacity>
                ),
                headerTitleStyle: {
                    fontFamily: Fonts.heading,
                    fontSize: 20,
                    color: theme.heading,
                }
            }} />

            {loading ? (
                <View style={styles.centered}>
                    <BouncingPlane color={theme.tint} />
                </View>
            ) : bookings.length === 0 ? (
                <View style={styles.centered}>
                    <Text style={[styles.message, { color: theme.secondaryText }]}>No bookings found. Start exploring!</Text>
                    <TouchableOpacity
                        style={[styles.exploreBtn, { backgroundColor: theme.btnBackground }]}
                        onPress={() => router.push('/(tabs)/trips')}
                    >
                        <Text style={[styles.exploreBtnText, { color: theme.btnText }]}>Book a Trip</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={bookings}
                    keyExtractor={(item) => item.id}
                    renderItem={renderBookingItem}
                    numColumns={2}
                    contentContainerStyle={styles.listContent}
                    columnWrapperStyle={styles.columnWrapper}
                    refreshing={loading}
                    onRefresh={fetchBookings}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 100, // Space for transparent header
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    backButton: {
        marginLeft: 10,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    bookingCard: {
        width: COLUMN_WIDTH,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 20,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    tripImage: {
        width: '100%',
        height: 120,
    },
    cardContent: {
        padding: 12,
    },
    tripName: {
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: Fonts.heading,
        marginBottom: 6,
    },
    statusBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    statusText: {
        fontSize: 9,
        fontWeight: '800',
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 4,
    },
    detailText: {
        fontSize: 11,
        fontFamily: Fonts.body,
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: Fonts.heading,
        marginTop: 4,
    },
    message: {
        fontSize: 16,
        fontFamily: Fonts.body,
        textAlign: 'center',
        marginBottom: 24,
    },
    exploreBtn: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 99,
    },
    exploreBtnText: {
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: Fonts.body,
    },
});
