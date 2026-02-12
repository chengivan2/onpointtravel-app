import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { supabase } from '@/lib/supabase';
import { Link, useRouter } from 'expo-router';
import { Eye, EyeOff } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];

    const lightLogo = require('../../assets/images/logos/onpointhflightmodelogo.png');
    const darkLogo = require('../../assets/images/logos/onpointhfdarkmodelogo.png');
    const logoSource = colorScheme === 'dark' ? darkLogo : lightLogo;

    const handleSignIn = async () => {
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            router.replace('/(tabs)');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: theme.background }]}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Image source={logoSource} style={styles.logo} resizeMode="contain" />
                    <Text style={[styles.title, { color: theme.heading }]}>OnPoint Travel</Text>
                    <Text style={[styles.subtitle, { color: theme.text }]}>Sign In to continue</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: theme.text }]}>Email</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email"
                            placeholderTextColor={theme.secondaryText}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: theme.text }]}>Password</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={[styles.input, styles.passwordInput, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Enter your password"
                                placeholderTextColor={theme.secondaryText}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.eyeIcon}
                            >
                                {showPassword ? (
                                    <EyeOff size={20} color={theme.secondaryText} />
                                ) : (
                                    <Eye size={20} color={theme.secondaryText} />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    {error && <Text style={styles.errorText}>{error}</Text>}

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: theme.btnBackground }]}
                        onPress={handleSignIn}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={theme.btnText} />
                        ) : (
                            <Text style={[styles.buttonText, { color: theme.btnText }]}>Sign In</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={[styles.footerText, { color: theme.secondaryText }]}>
                            Don&apos;t have an account?{' '}
                        </Text>
                        <Link href="/(auth)/signup" asChild>
                            <TouchableOpacity>
                                <Text style={[styles.linkText, { color: theme.tint }]}>Create account</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: 200,
        height: 80,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        fontFamily: Fonts.heading,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: Fonts.body,
    },
    form: {
        width: '100%',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontFamily: Fonts.body,
        marginBottom: 8,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        fontFamily: Fonts.body,
    },
    passwordContainer: {
        position: 'relative',
        justifyContent: 'center',
    },
    passwordInput: {
        paddingRight: 50,
    },
    eyeIcon: {
        position: 'absolute',
        right: 15,
        height: 50,
        justifyContent: 'center',
    },
    button: {
        height: 50,
        borderRadius: 99,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: Fonts.body,
    },
    errorText: {
        color: '#ff4444',
        marginBottom: 20,
        fontFamily: Fonts.body,
        textAlign: 'center',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
    },
    footerText: {
        fontSize: 14,
        fontFamily: Fonts.body,
    },
    linkText: {
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: Fonts.body,
    },
});
