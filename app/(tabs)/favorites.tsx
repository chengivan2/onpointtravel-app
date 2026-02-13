import { TripCard } from '@/components/TripCard';
import { Colors, Fonts } from '@/constants/theme';
import { useAuth } from '@/context/AuthProvider';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { Heart } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { PleaseSignIn } from '@/components/ui/PleaseSignIn';

export default function FavoritesScreen() {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const router = useRouter();

    const fetchFavorites = useCallback(async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            // First fetch the favorite_trips array from the user's profile
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('favorite_trips')
                .eq('id', user.id)
                .single();

            if (userError) throw userError;

            const favoriteIds = userData?.favorite_trips || [];

            if (favoriteIds.length === 0) {
                setFavorites([]);
                return;
            }

            // Fetch the full trip details for those IDs
            const { data: tripsData, error: tripsError } = await supabase
                .from('trips')
                .select(`
                    *,
                    destination:destinations(*)
                `)
                .in('id', favoriteIds);

            if (tripsError) throw tripsError;

            // Map back to maintain potential sorting (tripsData might not follow favoriteIds order)
            const sortedTrips = favoriteIds
                .map((id: string) => tripsData?.find((t: any) => t.id === id))
                .filter((t: any) => t !== undefined);

            setFavorites(sortedTrips);
        } catch (error) {
            console.error('Error fetching favorites:', error);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        if (user) fetchFavorites();
    }, [user, fetchFavorites]);

    if (!user) {
        return (
            <PleaseSignIn
                message="Please sign in to view your favorite trips"
                onSignIn={() => router.push('/(auth)/signin')}
            />
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.heading }]}>My Favorites</Text>
            </View>

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={theme.tint} />
                </View>
            ) : favorites.length === 0 ? (
                <View style={styles.centered}>
                    <View style={[styles.iconContainer, { backgroundColor: theme.card }]}>
                        <Heart size={48} color={theme.tint} fill={theme.tint + '20'} />
                    </View>
                    <Text style={[styles.emptyTitle, { color: theme.heading }]}>No favorites yet</Text>
                    <Text style={[styles.emptySubtitle, { color: theme.secondaryText }]}>
                        Explore trips and tap the heart icon to save your favorites here.
                    </Text>
                    <TouchableOpacity
                        style={[styles.exploreBtn, { backgroundColor: theme.btnBackground }]}
                        onPress={() => router.push('/(tabs)/trips')}
                    >
                        <Text style={[styles.exploreBtnText, { color: theme.btnText }]}>Explore Trips</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={favorites}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TripCard
                            trip={item}
                            onPress={() => router.push(`/trip-details/${item.id}`)}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                    refreshing={loading}
                    onRefresh={fetchFavorites}
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
    header: {
        paddingHorizontal: 24,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        fontFamily: Fonts.heading,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: Fonts.heading,
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 16,
        fontFamily: Fonts.body,
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 22,
    },
    exploreBtn: {
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 99,
        minWidth: 200,
        alignItems: 'center',
    },
    exploreBtnText: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: Fonts.body,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
});
