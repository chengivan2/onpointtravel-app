import { DestinationCard } from '@/components/DestinationCard';
import { TripCard } from '@/components/TripCard';
import { BouncingPlane } from '@/components/ui/BouncingPlane';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { supabase } from '@/lib/supabase';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Settings } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
            {userInfo?.avatarUrl && (
              <Image
                source={{ uri: userInfo.avatarUrl }}
                style={styles.avatar}
              />
            )}
            <View style={styles.greetingContainer}>
              <Text style={[styles.greetingText, { color: theme.text }]}>
                {userInfo?.firstName ? `Hello, ${userInfo.firstName}` : 'Hello traveler'}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.notificationButton, { backgroundColor: theme.card }]}
            onPress={() => router.push('/settings' as any)}
          >
            <Settings size={22} color={theme.text} />
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        {/* Featured Trips Carousel */}
        <View style={styles.carouselSection}>
          <Text style={[styles.sectionTitle, { color: theme.heading, paddingHorizontal: 20, marginBottom: 10 }]}>Featured trips</Text>
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

        {/* Promo Section */}
        <View style={styles.promoContainer}>
          <View style={[styles.promoBox, colorScheme === 'dark' && { backgroundColor: '#08140f' }]}>
            <View style={styles.promoTextContainer}>
              <Text style={[styles.promoTitle, colorScheme === 'dark' && { color: theme.tint }]}>SUMMER DEAL</Text>
              <Text style={styles.promoSubtitle}>Book a trip this summer and get 15% OFF</Text>
            </View>
            <Image
              source={require('@/assets/images/hand-drawn-lemonade-cartoon-illustration.png')}
              style={styles.promoImage}
              contentFit="contain"
            />
          </View>
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
    paddingVertical: 18,
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
  promoContainer: {
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  promoBox: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 140,
    position: 'relative',
    overflow: 'visible', // Allow image to extend out
  },
  promoTextContainer: {
    flex: 1,
    paddingRight: 80, // Space for the overlapping image
  },
  promoTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontFamily: Fonts.heading,
    fontWeight: '900',
    marginBottom: 8,
    letterSpacing: 1,
  },
  promoSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 15,
    fontFamily: Fonts.body,
    lineHeight: 20,
  },
  promoImage: {
    width: 140,
    height: 140,
    position: 'absolute',
    right: -10,
    bottom: -10,
    transform: [{ rotate: '-5deg' }],
  },
});
