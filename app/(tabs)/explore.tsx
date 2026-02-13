import { Colors, Fonts } from '@/constants/theme';
import { useAuth } from '@/context/AuthProvider';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { supabase } from '@/lib/supabase';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Calendar, MapPin, ReceiptText } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { PleaseSignIn } from '@/components/ui/PleaseSignIn';

export default function ExploreScreen() {
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
          trip:trips(*)
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
    <View style={[styles.bookingCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={[styles.cardHeader, { paddingRight: 20 }]}>
        <Image
          source={{ uri: item.trip.main_featured_image_url }}
          style={styles.tripImage}
          contentFit="cover"
        />
        <View style={styles.headerInfo}>
          <Text style={[styles.tripName, { color: theme.heading }]}>{item.trip.name}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
          </View>
        </View>
      </View>

      <View style={[styles.cardBody, { paddingRight: 24 }]}>
        <View style={styles.detailRow}>
          <Calendar size={16} color={theme.tint} />
          <Text style={[styles.detailText, { color: theme.text }]}>
            {new Date(item.start_date).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <MapPin size={16} color={theme.tint} />
          <Text
            style={[styles.detailText, { color: theme.text }]}
            numberOfLines={3}
          >
            {item.trip.short_description}
          </Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={[styles.price, { color: theme.tint }]}>${item.total_price}</Text>
        <TouchableOpacity style={styles.invoiceBtn}>
          <ReceiptText size={18} color={theme.tint} />
          <Text style={[styles.invoiceText, { color: theme.tint }]}>Invoice</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!user) {
    return (
      <PleaseSignIn
        message="Please sign in to view your bookings and start your next adventure"
        onSignIn={() => router.push('/(auth)/signin')}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.heading }]}>My Bookings</Text>
      {loading ? (
        <ActivityIndicator size="large" color={theme.tint} />
      ) : bookings.length === 0 ? (
        <View style={styles.centered}>
          <Text style={[styles.message, { color: theme.text }]}>No bookings found. Start exploring!</Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          renderItem={renderBookingItem}
          contentContainerStyle={styles.listContent}
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
    paddingTop: 60,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: Fonts.heading,
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    fontFamily: Fonts.body,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  bookingCard: {
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
  cardHeader: {
    flexDirection: 'row',
    padding: 12,
  },
  tripImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  tripName: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: Fonts.heading,
    marginBottom: 4,
  },
  statusBadge: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#666',
  },
  cardBody: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  detailText: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.body,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: Fonts.heading,
  },
  invoiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  invoiceText: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: Fonts.body,
  },
});
