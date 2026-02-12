import { TripCard } from '@/components/TripCard';
import { BouncingPlane } from '@/components/ui/BouncingPlane';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { supabase } from '@/lib/supabase';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Search, SlidersHorizontal, X } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function TripsScreen() {
    const [trips, setTrips] = useState<any[]>([]);
    const [filteredTrips, setFilteredTrips] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [destinationName, setDestinationName] = useState<string | null>(null);
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const router = useRouter();
    const { destinationId: rawId } = useLocalSearchParams();
    const destinationId = Array.isArray(rawId) ? rawId[0] : rawId;

    const fetchTrips = useCallback(async () => {
        setLoading(true);
        try {
            // Fetch destination name if destinationId is present
            if (destinationId) {
                const { data: destData } = await supabase
                    .from('destinations')
                    .select('name')
                    .eq('id', destinationId)
                    .single();
                if (destData) setDestinationName(destData.name);
            } else {
                setDestinationName(null);
            }

            let query = supabase
                .from('trips')
                .select(`
                  id,
                  name,
                  short_description,
                  main_featured_image_url,
                  price,
                  destination_id,
                  destination:destinations(name)
                `)
                .order('name', { ascending: true });

            if (destinationId) {
                query = query.eq('destination_id', destinationId);
            }

            const { data, error } = await query;

            if (error) throw error;

            setTrips(data || []);
            setFilteredTrips(data || []);

            // If filtering by destination, clear any existing search query to avoid confusion
            if (destinationId) {
                setSearchQuery('');
            }

        } catch (error) {
            console.error('Error fetching trips:', error);
        } finally {
            setLoading(false);
        }
    }, [destinationId]);

    useEffect(() => {
        fetchTrips();
    }, [destinationId, fetchTrips]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setFilteredTrips(trips);
            return;
        }
        const filtered = trips.filter(trip =>
            trip.name.toLowerCase().includes(query.toLowerCase()) ||
            trip.destination?.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredTrips(filtered);
    };

    const clearFilter = () => {
        router.setParams({ destinationId: '' });
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.heading }]}>
                    {destinationId && destinationName ? `Trips in ${destinationName}` : 'All Trips'}
                </Text>
                <View style={[styles.searchContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <Search size={20} color={theme.secondaryText} />
                    <TextInput
                        style={[styles.searchInput, { color: theme.text }]}
                        placeholder="Search trips or destinations..."
                        placeholderTextColor={theme.secondaryText}
                        value={searchQuery}
                        onChangeText={handleSearch}
                    />
                    {destinationId ? (
                        <TouchableOpacity onPress={clearFilter} style={styles.filterBtn}>
                            <X size={20} color={theme.tint} />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.filterBtn}>
                            <SlidersHorizontal size={20} color={theme.tint} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>



            {loading ? (
                <View style={styles.centered}>
                    <BouncingPlane color={theme.tint} />
                </View>
            ) : (
                <FlatList
                    data={filteredTrips}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TripCard
                            trip={item}
                            onPress={() => router.push(`/trip-details/${item.id}`)}
                            style={styles.card}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={[styles.emptyText, { color: theme.secondaryText }]}>No trips found matching your search.</Text>
                        </View>
                    }
                    refreshing={loading}
                    onRefresh={fetchTrips}
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
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        fontFamily: Fonts.heading,
        marginBottom: 15,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        height: 50,
        borderRadius: 12,
        borderWidth: 1,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        fontFamily: Fonts.body,
    },
    filterBtn: {
        padding: 8,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 20,
        paddingTop: 10,
    },
    card: {
        marginBottom: 20,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        fontSize: 16,
        fontFamily: Fonts.body,
        textAlign: 'center',
    },
});
