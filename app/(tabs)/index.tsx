import { DestinationCard } from '@/components/DestinationCard';
import { TripCard } from '@/components/TripCard';
import { BouncingPlane } from '@/components/ui/BouncingPlane';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { Bell } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
  const [userInfo, setUserInfo] = useState<{ firstName: string | null; avatarUrl: string | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [destRes, tripsRes] = await Promise.all([
        supabase.from('destinations').select('*').limit(6),
        supabase.from('trips').select(`
          id,
          name,
          short_description,
          main_featured_image_url,
          price,
          destination:destinations(name)
        `).order('created_at', { ascending: false }).limit(10)
      ]);

      if (destRes.data) setDestinations(destRes.data);
      if (tripsRes.data) setTrips(tripsRes.data);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userData } = await supabase
          .from('users')
          .select('first_name, logo_url')
          .eq('id', user.id)
          .single();

        if (userData) {
          setUserInfo({
            firstName: userData.first_name,
            avatarUrl: userData.logo_url
          });
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <BouncingPlane color={theme.tint} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={{ uri: userInfo?.avatarUrl || 'https://via.placeholder.com/150' }}
              style={styles.avatar}
            />
            <View style={styles.greetingContainer}>
              <Text style={[styles.greetingText, { color: theme.text }]}>Hello, {userInfo?.firstName || 'Traveler'}</Text>
              <Text style={[styles.titleText, { color: theme.heading }]}>Featured trips</Text>
            </View>
          </View>
          <View style={[styles.notificationButton, { backgroundColor: theme.card }]}>
            <Bell size={24} color={theme.text} />
          </View>
        </View>

        {/* Hero Section */}
        {/* Featured Trips Carousel */}
        <View style={styles.carouselSection}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={trips.slice(0, 5)}
            keyExtractor={(item) => `featured-${item.id}`}
            renderItem={({ item }) => (
              <TripCard
                trip={item}
                onPress={() => router.push(`/trip-details/${item.id}`)}
                style={styles.carouselCard}
              />
            )}
            contentContainerStyle={styles.carouselList}
            snapToInterval={320} // Width + gap approximately
            decelerationRate="fast"
          />
        </View>

        {/* Top Destinations */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.heading }]}>Top Destinations</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={destinations}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <DestinationCard
                destination={item}
                onPress={() => router.push({ pathname: '/(tabs)/trips', params: { destinationId: item.id } })}
              />
            )}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        {/* Featured Trips */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.heading }]}>More Trips</Text>
          {trips.slice(1).reverse().map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onPress={() => router.push(`/trip-details/${trip.id}`)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
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
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  greetingContainer: {
    justifyContent: 'center',
  },
  greetingText: {
    fontSize: 14,
    fontFamily: Fonts.body,
  },
  titleText: {
    fontSize: 18,
    fontFamily: Fonts.heading,
    fontWeight: 'bold',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselSection: {
    paddingVertical: 10,
  },
  carouselList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  carouselCard: {
    width: 300,
  },
  section: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: Fonts.heading,
    marginBottom: 20,
  },
  horizontalList: {
    paddingRight: 16,
  },
  featuredHeroCard: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});
