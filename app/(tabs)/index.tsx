import { DestinationCard } from '@/components/DestinationCard';
import { TripCard } from '@/components/TripCard';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { Bell } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';
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
        <ActivityIndicator size="large" color={theme.tint} />
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
              <Text style={[styles.titleText, { color: theme.heading }]}>Find Best Hotel</Text>
            </View>
          </View>
          <View style={[styles.notificationButton, { backgroundColor: theme.card }]}>
            <Bell size={24} color={theme.text} />
          </View>
        </View>

        {/* Hero Section */}
        <ImageBackground
          source={{ uri: 'https://res.cloudinary.com/dzev36m6m/image/upload/v1700000000/herobgimage.jpg' }}
          style={styles.hero}
          imageStyle={{ borderRadius: 20 }}
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
  hero: {
    height: 400,
    marginHorizontal: 20,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 20,
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
