import { Colors, Fonts } from '@/constants/theme';
import { useTheme } from '@/context/ThemeProvider';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { Check, ChevronLeft, Moon, Smartphone, Sun } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
    const { themePreference, setThemePreference } = useTheme();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme];
    const router = useRouter();

    const themeOptions = [
        { id: 'light', label: 'Light Mode', icon: <Sun size={20} color={theme.text} /> },
        { id: 'dark', label: 'Dark Mode', icon: <Moon size={20} color={theme.text} /> },
        { id: 'system', label: 'Follow System', icon: <Smartphone size={20} color={theme.text} /> },
    ] as const;

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ChevronLeft size={28} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: theme.heading }]}>Settings</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={[styles.sectionTitle, { color: theme.secondaryText }]}>Appearance</Text>
                <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    {themeOptions.map((option, index) => (
                        <TouchableOpacity
                            key={option.id}
                            style={[
                                styles.option,
                                index < themeOptions.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border }
                            ]}
                            onPress={() => setThemePreference(option.id)}
                        >
                            <View style={styles.optionLeft}>
                                <View style={[styles.iconContainer, { backgroundColor: theme.background }]}>
                                    {option.icon}
                                </View>
                                <Text style={[styles.optionLabel, { color: theme.text }]}>{option.label}</Text>
                            </View>
                            {themePreference === option.id && (
                                <Check size={20} color={theme.tint} />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.footer}>
                    <Text style={[styles.version, { color: theme.secondaryText }]}>Version 1.0.0</Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    backBtn: {
        marginRight: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: Fonts.heading,
    },
    content: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 10,
        marginLeft: 4,
    },
    card: {
        borderRadius: 16,
        borderWidth: 1,
        overflow: 'hidden',
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionLabel: {
        fontSize: 16,
        fontFamily: Fonts.body,
    },
    footer: {
        marginTop: 40,
        alignItems: 'center',
    },
    version: {
        fontSize: 14,
        fontFamily: Fonts.body,
    },
});
