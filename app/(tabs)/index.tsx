import { DestinationCard } from '@/components/DestinationCard';
import { TripCard } from '@/components/TripCard';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
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
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.tint} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Hero Section */}
      <ImageBackground
        source={{ uri: 'https://res.cloudinary.com/dzev36m6m/image/upload/v1700000000/herobgimage.jpg' }}
        style={styles.hero}
      >
        <View style={styles.heroOverlay}>
          {trips.length > 0 ? (
            <View style={styles.featuredHeroCard}>
              <Text style={[styles.heroSubtitle, { color: '#fff', marginBottom: 12, fontWeight: 'bold', textTransform: 'uppercase' }]}>Featured Adventure</Text>
              <TripCard
                trip={trips[0]}
                onPress={() => router.push(`/trip-details/${trips[0].id}`)}
                style={{ width: '100%', maxWidth: 350 }}
              />
            </View>
          ) : (
            <>
              <Text style={[styles.heroTitle, { color: '#fff' }]}>Discover More Travel Time</Text>
              <Text style={[styles.heroSubtitle, { color: '#fff' }]}>Straight To the Point</Text>
            </>
          )}
        </View>
      </ImageBackground>

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
              onPress={() => router.push({ pathname: '/(tabs)/destinations', params: { destinationId: item.id } })}
            />
          )}
          contentContainerStyle={styles.horizontalList}
        />
      </View>

      {/* Featured Trips */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.heading }]}>More Trips</Text>
        {trips.slice(1).map((trip) => (
          <TripCard
            key={trip.id}
            trip={trip}
            onPress={() => router.push(`/trip-details/${trip.id}`)}
          />
        ))}
      </View>
    </ScrollView>
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
  hero: {
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heroTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: Fonts.heading,
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 18,
    textAlign: 'center',
    fontFamily: Fonts.body,
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
