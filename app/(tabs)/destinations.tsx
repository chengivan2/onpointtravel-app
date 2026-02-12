import { DestinationCard } from '@/components/DestinationCard';
import { BouncingPlane } from '@/components/ui/BouncingPlane';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { Search } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';

export default function DestinationsScreen() {
    const [destinations, setDestinations] = useState<any[]>([]);
    const [filteredDestinations, setFilteredDestinations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const router = useRouter();

    useEffect(() => {
        fetchDestinations();
    }, []);

    const fetchDestinations = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('destinations')
                .select('*')
                .order('name', { ascending: true });

            if (error) throw error;
            setDestinations(data || []);
            setFilteredDestinations(data || []);
        } catch (error) {
            console.error('Error fetching destinations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setFilteredDestinations(destinations);
            return;
        }
        const filtered = destinations.filter(dest =>
            dest.name.toLowerCase().includes(query.toLowerCase()) ||
            dest.location.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredDestinations(filtered);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.heading }]}>Destinations</Text>
                <View style={[styles.searchContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <Search size={20} color={theme.secondaryText} />
                    <TextInput
                        style={[styles.searchInput, { color: theme.text }]}
                        placeholder="Where do you want to go?"
                        placeholderTextColor={theme.secondaryText}
                        value={searchQuery}
                        onChangeText={handleSearch}
                    />
                </View>
            </View>



            {loading ? (
                <View style={styles.centered}>
                    <BouncingPlane color={theme.tint} />
                </View>
            ) : (
                <FlatList
                    data={filteredDestinations}
                    numColumns={2}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <DestinationCard
                            destination={item}
                            onPress={() => router.push({ pathname: '/(tabs)/trips', params: { destinationId: item.id } })}
                            style={styles.card}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    columnWrapperStyle={styles.row}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={[styles.emptyText, { color: theme.secondaryText }]}>No destinations found matching your search.</Text>
                        </View>
                    }
                    refreshing={loading}
                    onRefresh={fetchDestinations}
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
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 10,
    },
    row: {
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    card: {
        width: '48%',
        marginBottom: 16,
        marginRight: 0, // Override default margin
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
