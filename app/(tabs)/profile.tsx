import { Colors, Fonts } from '@/constants/theme';
import { useAuth } from '@/context/AuthProvider';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { supabase } from '@/lib/supabase';
import { Image } from 'expo-image';
import { useFocusEffect, useRouter } from 'expo-router';
import { Bell, Compass, CreditCard, Edit2, LogOut, Shield, User } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { PleaseSignIn } from '@/components/ui/PleaseSignIn';

export default function ProfileScreen() {
    const { user, signOut } = useAuth();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const router = useRouter();

    const [profileData, setProfileData] = useState<{
        firstName: string;
        lastName: string;
        avatarUrl: string | null;
    } | null>(null);
    const [bookingsCount, setBookingsCount] = useState(0);

    const fetchUserProfile = useCallback(async () => {
        if (!user?.id) return;
        try {
            // Fetch profile data
            const { data, error } = await supabase
                .from('users')
                .select('first_name, last_name, logo_url')
                .eq('id', user.id)
                .single();

            if (error) throw error;

            if (data) {
                setProfileData({
                    firstName: data.first_name || '',
                    lastName: data.last_name || '',
                    avatarUrl: data.logo_url
                });
            }

            // Fetch recent bookings count (last 30 days)
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const { count, error: countError } = await supabase
                .from('bookings')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .gte('booked_at', thirtyDaysAgo.toISOString());

            if (countError) throw countError;
            setBookingsCount(count || 0);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    }, [user?.id]);

    useFocusEffect(
        useCallback(() => {
            if (user) {
                fetchUserProfile();
            }
        }, [user, fetchUserProfile])
    );

    const handleSignOut = async () => {
        try {
            await signOut();
            router.replace('/(auth)/signin');
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    if (!user) {
        return (
            <PleaseSignIn
                message="Please sign in to view your profile and manage your travel journey"
                onSignIn={() => router.push('/(auth)/signin')}
            />
        );
    }

    const menuItems = [
        { icon: <Compass size={22} color={theme.tint} />, label: 'My Bookings', route: '/profile/bookings' },
        { icon: <Bell size={22} color={theme.tint} />, label: 'Notifications' },
        { icon: <CreditCard size={22} color={theme.tint} />, label: 'Payment Methods' },
        { icon: <Shield size={22} color={theme.tint} />, label: 'Privacy & Security' },
    ];

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { backgroundColor: theme.card }]}>
                <View style={[styles.avatarContainer, { backgroundColor: theme.background, borderColor: theme.tint }]}>
                    {profileData?.avatarUrl ? (
                        <Image
                            source={{ uri: profileData.avatarUrl }}
                            style={styles.avatar}
                        />
                    ) : (
                        <User size={50} color={theme.tint} />
                    )}
                </View>
                <Text style={[styles.userName, { color: theme.heading }]}>
                    {profileData?.firstName || user.user_metadata?.first_name} {profileData?.lastName || user.user_metadata?.last_name}
                </Text>
                <Text style={[styles.userEmail, { color: theme.secondaryText }]}>{user.email}</Text>

                <TouchableOpacity
                    style={[styles.editBtn, { backgroundColor: theme.tint + '20' }]}
                    onPress={() => router.push('/profile/edit')}
                >
                    <Edit2 size={16} color={theme.tint} />
                    <Text style={[styles.editBtnText, { color: theme.tint }]}>Edit Profile</Text>
                </TouchableOpacity>
            </View>

            {/* Reward Banner */}
            <View style={styles.bannerContainer}>
                <View style={styles.bannerBox}>
                    <View style={styles.bannerTextContainer}>
                        <Text style={styles.bannerTitle}>Book More, Save More.</Text>
                        <Text style={styles.bannerSubtitle}>You have booked {bookingsCount} trips in the last 30 days.</Text>

                        <View style={styles.progressContainer}>
                            <View style={[styles.progressBar, { width: `${Math.min((bookingsCount / 3) * 100, 100)}%` }]} />
                        </View>
                        <Text style={styles.progressText}>{bookingsCount}/3</Text>

                        <TouchableOpacity
                            style={styles.bannerButton}
                            onPress={() => router.push('/(tabs)/trips')}
                        >
                            <Text style={styles.bannerButtonText}>Book a Trip</Text>
                        </TouchableOpacity>
                    </View>
                    <Image
                        source={require('@/assets/images/hand-drawn-lemonade-cartoon-pointing-left-illustration.png')}
                        style={styles.bannerImage}
                        contentFit="contain"
                    />
                </View>
            </View>

            <View style={styles.section}>
                {menuItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.menuItem, { borderBottomColor: theme.border }]}
                        onPress={() => {
                            if (item.route) {
                                router.push(item.route as any);
                            }
                        }}
                    >
                        <View style={styles.menuLeft}>
                            {item.icon}
                            <Text style={[styles.menuLabel, { color: theme.text }]}>{item.label}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity
                style={[styles.signOutBtn, { borderColor: theme.tint }]}
                onPress={handleSignOut}
            >
                <LogOut size={20} color={theme.tint} />
                <Text style={[styles.signOutText, { color: theme.tint }]}>Sign Out</Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
        </ScrollView>
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
        padding: 20,
    },
    header: {
        alignItems: 'center',
        paddingVertical: 40,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        marginBottom: 16,
        overflow: 'hidden',
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: Fonts.heading,
    },
    userEmail: {
        fontSize: 16,
        fontFamily: Fonts.body,
        marginTop: 4,
        marginBottom: 16,
    },
    editBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    editBtnText: {
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: Fonts.body,
    },
    section: {
        marginTop: 30,
        paddingHorizontal: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        borderBottomWidth: 1,
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    menuLabel: {
        fontSize: 16,
        fontWeight: '500',
        fontFamily: Fonts.body,
    },
    signOutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginTop: 40,
        marginHorizontal: 30,
        height: 56,
        borderRadius: 99,
        borderWidth: 1,
    },
    signOutText: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: Fonts.body,
    },
    loginBtn: {
        marginTop: 20,
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 99,
    },
    btnText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    message: {
        fontSize: 16,
        fontFamily: Fonts.body,
        textAlign: 'center',
    },
    bannerContainer: {
        paddingHorizontal: 20,
        marginTop: 24,
    },
    bannerBox: {
        backgroundColor: '#51c246',
        borderRadius: 24,
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 140,
        position: 'relative',
        overflow: 'visible',
    },
    bannerTextContainer: {
        flex: 1,
        paddingRight: 110,
    },
    bannerTitle: {
        color: '#ffffff',
        fontSize: 24,
        fontFamily: Fonts.heading,
        fontWeight: '900',
        marginBottom: 8,
        lineHeight: 28,
    },
    bannerSubtitle: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 14,
        fontFamily: Fonts.body,
        lineHeight: 18,
        marginBottom: 12,
    },
    progressContainer: {
        height: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 4,
        marginBottom: 4,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 4,
    },
    progressText: {
        color: '#ffffff',
        fontSize: 12,
        fontFamily: Fonts.body,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    bannerButton: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    bannerButtonText: {
        color: '#51c246',
        fontSize: 14,
        fontFamily: Fonts.heading,
        fontWeight: 'bold',
    },
    bannerImage: {
        position: 'absolute',
        right: -5,
        bottom: -10,
        top: -10,
        aspectRatio: 1,
        transform: [{ rotate: '5deg' }],
    },
});
