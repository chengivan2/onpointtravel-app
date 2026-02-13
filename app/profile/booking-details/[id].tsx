import { BouncingPlane } from '@/components/ui/BouncingPlane';
import { Colors, Fonts } from '@/constants/theme';
import { useAuth } from '@/context/AuthProvider';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { supabase } from '@/lib/supabase';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar, ChevronLeft, Clock, Info, MapPin, Users } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BookingDetailsScreen() {
    const { id } = useLocalSearchParams();
    const { user } = useAuth();
    const [booking, setBooking] = useState<any>(null);
    const [addons, setAddons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const router = useRouter();

    useEffect(() => {
        if (id && user) {
            fetchBookingDetails();
        }
    }, [id, user]);

    const fetchBookingDetails = async () => {
        setLoading(true);
        try {
            // Fetch booking with trip details
            const { data: bookingData, error: bookingError } = await supabase
                .from('bookings')
                .select(`
                    *,
                    trip:trips(
                        *,
                        destination:destinations(*)
                    )
                `)
                .eq('id', id)
                .single();

            if (bookingError) throw bookingError;
            setBooking(bookingData);

            // Fetch booking addons
            const { data: addonsData, error: addonsError } = await supabase
                .from('booking_addons')
                .select('*')
                .eq('booking_id', id);

            if (addonsError) throw addonsError;
            setAddons(addonsData || []);

        } catch (error) {
            console.error('Error fetching booking details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.centered, { backgroundColor: theme.background }]}>
                <BouncingPlane color={theme.tint} />
            </View>
        );
    }

    if (!booking) {
        return (
            <View style={[styles.centered, { backgroundColor: theme.background }]}>
                <Text style={{ color: theme.secondaryText, fontFamily: Fonts.body }}>Booking not found</Text>
            </View>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            weekday: 'short',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <Stack.Screen options={{
                headerShown: true,
                title: 'Reservation Details',
                headerTransparent: true,
                headerLeft: () => (
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <ChevronLeft color="#ffffff" size={28} />
                    </TouchableOpacity>
                ),
                headerTitleStyle: {
                    fontFamily: Fonts.heading,
                    fontSize: 20,
                    color: '#ffffff',
                }
            }} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header Image Section */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: booking.trip.main_featured_image_url }}
                        style={styles.headerImage}
                        contentFit="cover"
                    />
                    <View style={styles.imageOverlay} />
                    <View style={styles.headerInfo}>
                        <View style={[styles.statusBadge, { backgroundColor: booking.status === 'confirmed' ? '#2ecc71' : '#f39c12' }]}>
                            <Text style={styles.statusText}>{booking.status.toUpperCase()}</Text>
                        </View>
                        <Text style={styles.tripName}>{booking.trip.name}</Text>
                        <View style={styles.locationRow}>
                            <MapPin size={16} color="#ffffff" />
                            <Text style={styles.locationText}>{booking.trip.destination.name}</Text>
                        </View>
                    </View>
                </View>

                {/* Content Section */}
                <View style={[styles.contentCard, { backgroundColor: theme.card }]}>
                    {/* Dates Section */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.heading }]}>Itinerary</Text>
                        <View style={styles.infoRow}>
                            <Calendar size={20} color={theme.tint} />
                            <View style={styles.infoCol}>
                                <Text style={[styles.infoLabel, { color: theme.secondaryText }]}>Start Date</Text>
                                <Text style={[styles.infoValue, { color: theme.text }]}>{formatDate(booking.start_date)}</Text>
                            </View>
                        </View>
                        <View style={[styles.infoRow, { marginTop: 16 }]}>
                            <Clock size={20} color={theme.tint} />
                            <View style={styles.infoCol}>
                                <Text style={[styles.infoLabel, { color: theme.secondaryText }]}>End Date</Text>
                                <Text style={[styles.infoValue, { color: theme.text }]}>{formatDate(booking.end_date)}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={[styles.divider, { backgroundColor: theme.border }]} />

                    {/* Travelers Section */}
                    <View style={styles.section}>
                        <View style={styles.infoRow}>
                            <Users size={20} color={theme.tint} />
                            <View style={styles.infoCol}>
                                <Text style={[styles.sectionTitle, { color: theme.heading, marginBottom: 0 }]}>Travelers</Text>
                                <Text style={[styles.infoValue, { color: theme.text }]}>{booking.number_of_people} {booking.number_of_people > 1 ? 'People' : 'Person'}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={[styles.divider, { backgroundColor: theme.border }]} />

                    {/* Add-ons Section */}
                    {addons.length > 0 && (
                        <>
                            <View style={styles.section}>
                                <Text style={[styles.sectionTitle, { color: theme.heading }]}>Selected Add-ons</Text>
                                {addons.map((addon) => (
                                    <View key={addon.id} style={styles.addonItem}>
                                        <View style={styles.addonInfo}>
                                            <Text style={[styles.addonName, { color: theme.text }]}>{addon.addon_type}</Text>
                                            <Text style={[styles.addonQty, { color: theme.secondaryText }]}>Qty: {addon.quantity}</Text>
                                        </View>
                                        <Text style={[styles.addonPrice, { color: theme.tint }]}>${(addon.price * addon.quantity).toFixed(2)}</Text>
                                    </View>
                                ))}
                            </View>
                            <View style={[styles.divider, { backgroundColor: theme.border }]} />
                        </>
                    )}

                    {/* Special Requests */}
                    {booking.special_requests && (
                        <>
                            <View style={styles.section}>
                                <View style={styles.infoRow}>
                                    <Info size={20} color={theme.tint} />
                                    <View style={styles.infoCol}>
                                        <Text style={[styles.sectionTitle, { color: theme.heading, marginBottom: 4 }]}>Special Requests</Text>
                                        <Text style={[styles.notesText, { color: theme.secondaryText }]}>{booking.special_requests}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={[styles.divider, { backgroundColor: theme.border }]} />
                        </>
                    )}

                    {/* Price Summary */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.heading }]}>Payment Summary</Text>
                        <View style={styles.paymentRow}>
                            <Text style={[styles.paymentLabel, { color: theme.secondaryText }]}>Payment Status</Text>
                            <Text style={[styles.paymentValue, { color: booking.payment_status === 'paid' ? '#2ecc71' : theme.text }]}>
                                {booking.payment_status.toUpperCase()}
                            </Text>
                        </View>
                        <View style={styles.paymentRow}>
                            <Text style={[styles.totalLabel, { color: theme.heading }]}>Total Amount</Text>
                            <Text style={[styles.totalValue, { color: theme.tint }]}>${booking.total_price.toFixed(2)}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 16,
    },
    imageContainer: {
        height: 300,
        width: '100%',
        position: 'relative',
    },
    headerImage: {
        width: '100%',
        height: '100%',
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    headerInfo: {
        position: 'absolute',
        bottom: 24,
        left: 24,
        right: 24,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        marginBottom: 12,
    },
    statusText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: 'bold',
        fontFamily: Fonts.body,
    },
    tripName: {
        color: '#ffffff',
        fontSize: 28,
        fontWeight: 'bold',
        fontFamily: Fonts.heading,
        marginBottom: 4,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    locationText: {
        color: '#ffffff',
        fontSize: 16,
        fontFamily: Fonts.body,
        opacity: 0.9,
    },
    contentCard: {
        marginTop: -30,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        minHeight: 500,
    },
    section: {
        paddingVertical: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: Fonts.heading,
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    infoCol: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        fontFamily: Fonts.body,
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: Fonts.body,
    },
    divider: {
        height: 1,
        width: '100%',
        marginVertical: 16,
    },
    addonItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    addonInfo: {
        flex: 1,
    },
    addonName: {
        fontSize: 15,
        fontWeight: '500',
        fontFamily: Fonts.body,
    },
    addonQty: {
        fontSize: 12,
        fontFamily: Fonts.body,
    },
    addonPrice: {
        fontSize: 15,
        fontWeight: 'bold',
        fontFamily: Fonts.heading,
    },
    notesText: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: Fonts.body,
    },
    paymentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    paymentLabel: {
        fontSize: 14,
        fontFamily: Fonts.body,
    },
    paymentValue: {
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: Fonts.heading,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: Fonts.heading,
    },
    totalValue: {
        fontSize: 22,
        fontWeight: '900',
        fontFamily: Fonts.heading,
    },
});
