import { Colors, Fonts } from '@/constants/theme';
import { useAuth } from '@/context/AuthProvider';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { supabase } from '@/lib/supabase';
import { Stack, useRouter } from 'expo-router';
import { ChevronLeft, Save, User as UserIcon } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditProfileScreen() {
    const { user } = useAuth();
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');

    useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('users')
                .select('first_name, last_name, logo_url')
                .eq('id', user?.id)
                .single();

            if (error) throw error;

            if (data) {
                setFirstName(data.first_name || '');
                setLastName(data.last_name || '');
                setAvatarUrl(data.logo_url || '');
            }
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!firstName.trim() || !lastName.trim()) {
            Alert.alert('Validation Error', 'First name and last name are required');
            return;
        }

        try {
            setSaving(true);
            const { error } = await supabase
                .from('users')
                .update({
                    first_name: firstName.trim(),
                    last_name: lastName.trim(),
                    logo_url: avatarUrl.trim() || null,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', user?.id);

            if (error) throw error;

            Alert.alert('Success', 'Profile updated successfully', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.centered, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.tint} />
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.header}>
                <TouchableOpacity
                    style={[styles.backButton, { backgroundColor: theme.card }]}
                    onPress={() => router.back()}
                >
                    <ChevronLeft size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.heading }]}>Edit Profile</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.avatarSection}>
                        <View style={[styles.avatarPlaceholder, { backgroundColor: theme.card, borderColor: theme.tint }]}>
                            <UserIcon size={40} color={theme.tint} />
                        </View>
                        <Text style={[styles.avatarHint, { color: theme.secondaryText }]}>
                            Paste an image URL below to update your avatar
                        </Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.secondaryText }]}>First Name</Text>
                            <TextInput
                                style={[styles.input, {
                                    backgroundColor: theme.card,
                                    color: theme.text,
                                    borderColor: theme.border
                                }]}
                                value={firstName}
                                onChangeText={setFirstName}
                                placeholder="Enter first name"
                                placeholderTextColor={theme.secondaryText}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.secondaryText }]}>Last Name</Text>
                            <TextInput
                                style={[styles.input, {
                                    backgroundColor: theme.card,
                                    color: theme.text,
                                    borderColor: theme.border
                                }]}
                                value={lastName}
                                onChangeText={setLastName}
                                placeholder="Enter last name"
                                placeholderTextColor={theme.secondaryText}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.secondaryText }]}>Avatar URL</Text>
                            <TextInput
                                style={[styles.input, {
                                    backgroundColor: theme.card,
                                    color: theme.text,
                                    borderColor: theme.border
                                }]}
                                value={avatarUrl}
                                onChangeText={setAvatarUrl}
                                placeholder="https://example.com/image.jpg"
                                placeholderTextColor={theme.secondaryText}
                                autoCapitalize="none"
                                keyboardType="url"
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.saveButton, { backgroundColor: theme.tint }]}
                            onPress={handleSave}
                            disabled={saving}
                        >
                            {saving ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <>
                                    <Save size={20} color="#fff" />
                                    <Text style={styles.saveButtonText}>Save Changes</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
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
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: Fonts.heading,
    },
    scrollContent: {
        padding: 20,
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatarPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatarHint: {
        fontSize: 12,
        textAlign: 'center',
        fontFamily: Fonts.body,
        paddingHorizontal: 40,
    },
    form: {
        gap: 20,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        fontFamily: Fonts.body,
        marginLeft: 4,
    },
    input: {
        height: 56,
        borderRadius: 16,
        borderWidth: 1,
        paddingHorizontal: 16,
        fontSize: 16,
        fontFamily: Fonts.body,
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        height: 56,
        borderRadius: 28,
        marginTop: 10,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: Fonts.body,
    },
});
