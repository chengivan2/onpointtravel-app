import { Colors, Fonts } from '@/constants/theme';
import { useAuth } from '@/context/AuthProvider';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { supabase } from '@/lib/supabase';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { CheckCircle2, ChevronRight, Circle, Users } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function BookingScreen() {
    const { tripId } = useLocalSearchParams();
    const { user } = useAuth();
    const [trip, setTrip] = useState<any>(null);
    const [addons, setAddons] = useState<any[]>([]);
    const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [peopleCount, setPeopleCount] = useState(1);

    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const router = useRouter();

    const fetchData = useCallback(async () => {
        if (!tripId) return;
        setLoading(true);
        try {
            const id = Array.isArray(tripId) ? tripId[0] : tripId;
            const [tripRes, addonsRes] = await Promise.all([
                supabase.from('trips').select('*').eq('id', id).single(),
                supabase.from('addons').select('*')
            ]);

            if (tripRes.error) throw tripRes.error;
            if (addonsRes.error) throw addonsRes.error;

            setTrip(tripRes.data);
            setAddons(addonsRes.data || []);
        } catch (error) {
            console.error('Error fetching booking data:', error);
        } finally {
            setLoading(false);
        }
    }, [tripId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const toggleAddon = (addonId: string) => {
        setSelectedAddons(prev =>
            prev.includes(addonId)
                ? prev.filter(id => id !== addonId)
                : [...prev, addonId]
        );
    };

    const calculateAddonsTotal = () => {
        return addons
            .filter(a => selectedAddons.includes(a.id))
            .reduce((sum, a) => sum + (a.price || 0), 0);
    };

    const handleBooking = async () => {
        if (!user) {
            router.push('/(auth)/signin');
            return;
        }

        if (!selectedDate) {
            Alert.alert('Selection Required', 'Please select a travel date.');
            return;
        }

        setBookingLoading(true);
        try {
            const id = Array.isArray(tripId) ? tripId[0] : tripId;
            const addonsTotal = calculateAddonsTotal();
            const totalPrice = ((trip.price || 0) * peopleCount) + (addonsTotal * peopleCount);

            // 1. Create Booking
            const { data: bookingData, error: bookingError } = await supabase
                .from('bookings')
                .insert({
                    user_id: user.id,
                    trip_id: id,
                    start_date: selectedDate,
                    end_date: selectedDate,
                    number_of_people: peopleCount,
                    total_price: totalPrice,
                    status: 'pending',
                    payment_status: 'unpaid'
                })
                .select()
                .single();

            if (bookingError) throw bookingError;

            // 2. Add Selected Addons
            if (selectedAddons.length > 0) {
                const addonsToInsert = addons
                    .filter(a => selectedAddons.includes(a.id))
                    .map(a => ({
                        booking_id: bookingData.id,
                        addon_type: a.type,
                        description: a.description,
                        price: a.price,
                        quantity: peopleCount
                    }));

                const { error: addonsError } = await supabase
                    .from('booking_addons')
                    .insert(addonsToInsert);

                if (addonsError) throw addonsError;
            }

            Alert.alert('Booking Successful', 'Your trip has been booked! Redirecting to your bookings...', [
                { text: 'OK', onPress: () => router.replace('/(tabs)/explore') }
            ]);
        } catch (error: any) {
            Alert.alert('Booking Failed', error.message);
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.tint} />
            </View>
        );
    }

    const addonsTotal = calculateAddonsTotal();
    const subtotal = (trip.price || 0) * peopleCount;
    const finalTotal = subtotal + (addonsTotal * peopleCount);

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            <Stack.Screen options={{ title: 'Book Your Trip', headerTintColor: theme.tint }} />

            <View style={styles.header}>
                <Text style={[styles.tripTitle, { color: theme.heading }]}>{trip.name}</Text>
                <Text style={[styles.tripPrice, { color: theme.tint }]}>${trip.price} per person</Text>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.heading }]}>1. Select Date</Text>
                <Calendar
                    onDayPress={(day: any) => setSelectedDate(day.dateString)}
                    markedDates={{
                        [selectedDate]: { selected: true, selectedColor: theme.tint },
                    }}
                    theme={{
                        backgroundColor: theme.background,
                        calendarBackground: theme.card,
                        textSectionTitleColor: theme.tint,
                        selectedDayBackgroundColor: theme.tint,
                        selectedDayTextColor: '#ffffff',
                        todayTextColor: theme.tint,
                        dayTextColor: theme.text,
                        textDisabledColor: theme.secondaryText,
                        monthTextColor: theme.heading,
                        indicatorColor: theme.tint,
                    }}
                />
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.heading }]}>2. Number of People</Text>
                <View style={[styles.counterContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <Users color={theme.tint} size={20} />
                    <TouchableOpacity
                        onPress={() => setPeopleCount(Math.max(1, peopleCount - 1))}
                        style={styles.counterBtn}
                    >
                        <Text style={[styles.counterBtnText, { color: theme.text }]}>-</Text>
                    </TouchableOpacity>
                    <Text style={[styles.countText, { color: theme.text }]}>{peopleCount}</Text>
                    <TouchableOpacity
                        onPress={() => setPeopleCount(peopleCount + 1)}
                        style={styles.counterBtn}
                    >
                        <Text style={[styles.counterBtnText, { color: theme.text }]}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.heading }]}>3. Add-ons (Optional)</Text>
                {addons.map((addon) => (
                    <TouchableOpacity
                        key={addon.id}
                        style={[
                            styles.addonCard,
                            {
                                backgroundColor: theme.card,
                                borderColor: selectedAddons.includes(addon.id) ? theme.tint : theme.border
                            }
                        ]}
                        onPress={() => toggleAddon(addon.id)}
                    >
                        <View style={styles.addonInfo}>
                            <Text style={[styles.addonType, { color: theme.heading }]}>{addon.type}</Text>
                            <Text style={[styles.addonDesc, { color: theme.secondaryText }]}>{addon.description}</Text>
                        </View>
                        <View style={styles.addonAction}>
                            <Text style={[styles.addonPrice, { color: theme.tint }]}>+${addon.price}</Text>
                            {selectedAddons.includes(addon.id) ? (
                                <CheckCircle2 size={24} color={theme.tint} fill={theme.tint + '20'} />
                            ) : (
                                <Circle size={24} color={theme.border} />
                            )}
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={[styles.summary, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Text style={[styles.sectionTitle, { color: theme.heading }]}>Price Summary</Text>
                <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, { color: theme.text }]}>Base Price (${trip.price} x {peopleCount})</Text>
                    <Text style={[styles.summaryValue, { color: theme.text }]}>${subtotal}</Text>
                </View>
                {addonsTotal > 0 && (
                    <View style={styles.summaryRow}>
                        <Text style={[styles.summaryLabel, { color: theme.text }]}>Add-ons (${addonsTotal} x {peopleCount})</Text>
                        <Text style={[styles.summaryValue, { color: theme.text }]}>${addonsTotal * peopleCount}</Text>
                    </View>
                )}
                <View style={styles.divider} />
                <View style={styles.summaryRow}>
                    <Text style={[styles.totalLabel, { color: theme.heading }]}>Total Amount</Text>
                    <Text style={[styles.totalValue, { color: theme.tint }]}>${finalTotal}</Text>
                </View>
            </View>

            <TouchableOpacity
                style={[styles.bookingBtn, { backgroundColor: theme.btnBackground }]}
                onPress={handleBooking}
                disabled={bookingLoading}
            >
                {bookingLoading ? (
                    <ActivityIndicator color={theme.btnText} />
                ) : (
                    <View style={styles.btnContent}>
                        <Text style={[styles.bookingBtnText, { color: theme.btnText }]}>Confirm Booking</Text>
                        <ChevronRight color={theme.btnText} size={20} />
                    </View>
                )}
            </TouchableOpacity>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        marginBottom: 24,
    },
    tripTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: Fonts.heading,
    },
    tripPrice: {
        fontSize: 16,
        fontFamily: Fonts.body,
        marginTop: 4,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: Fonts.heading,
        marginBottom: 12,
    },
    counterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
    },
    counterBtn: {
        paddingHorizontal: 20,
    },
    counterBtnText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    countText: {
        fontSize: 20,
        fontWeight: 'bold',
        minWidth: 40,
        textAlign: 'center',
    },
    addonCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 12,
    },
    addonInfo: {
        flex: 1,
        marginRight: 10,
    },
    addonType: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: Fonts.heading,
        marginBottom: 4,
    },
    addonDesc: {
        fontSize: 14,
        fontFamily: Fonts.body,
    },
    addonAction: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: 8,
    },
    addonPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: Fonts.heading,
    },
    summary: {
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 24,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    summaryLabel: {
        fontSize: 16,
        fontFamily: Fonts.body,
    },
    summaryValue: {
        fontSize: 16,
        fontFamily: Fonts.body,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.1)',
        marginVertical: 8,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    totalValue: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    bookingBtn: {
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    bookingBtnText: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: Fonts.body,
    },
});
