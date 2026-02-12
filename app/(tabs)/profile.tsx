import { Colors, Fonts } from '@/constants/theme';
import { useAuth } from '@/context/AuthProvider';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { Bell, CreditCard, LogOut, Settings, Shield, User } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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

    const fetchUserProfile = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('first_name, last_name, logo_url')
                .eq('id', user?.id)
                .single();

            if (error) throw error;

            if (data) {
                setProfileData({
                    firstName: data.first_name || '',
                    lastName: data.last_name || '',
                    avatarUrl: data.logo_url
                });
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    }, [user?.id]);

    useEffect(() => {
        if (user) {
            fetchUserProfile();
        }
    }, [user, fetchUserProfile]);

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
        { icon: <Settings size={22} color={theme.tint} />, label: 'Settings' },
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
            </View>

            <View style={styles.section}>
                {menuItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.menuItem, { borderBottomColor: theme.border }]}
                        onPress={() => {
                            if (item.label === 'Settings') {
                                router.push('/settings' as any);
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
});
