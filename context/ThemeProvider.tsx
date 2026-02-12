import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';

type ThemePreference = 'light' | 'dark' | 'system';

interface ThemeContextType {
    themePreference: ThemePreference;
    setThemePreference: (preference: ThemePreference) => Promise<void>;
    colorScheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'user-theme-preference';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const deviceColorScheme = useDeviceColorScheme() ?? 'light';
    const [themePreference, setThemePreferenceState] = useState<ThemePreference>('system');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        loadThemePreference();
    }, []);

    const loadThemePreference = async () => {
        try {
            const savedPreference = await AsyncStorage.getItem(THEME_STORAGE_KEY);
            if (savedPreference === 'light' || savedPreference === 'dark' || savedPreference === 'system') {
                setThemePreferenceState(savedPreference);
            }
        } catch (e) {
            console.error('Failed to load theme preference', e);
        } finally {
            setIsLoaded(true);
        }
    };

    const setThemePreference = async (preference: ThemePreference) => {
        try {
            setThemePreferenceState(preference);
            await AsyncStorage.setItem(THEME_STORAGE_KEY, preference);
        } catch (e) {
            console.error('Failed to save theme preference', e);
        }
    };

    const resolvedColorScheme = themePreference === 'system' ? deviceColorScheme : themePreference;

    if (!isLoaded) return null;

    return (
        <ThemeContext.Provider value={{ themePreference, setThemePreference, colorScheme: resolvedColorScheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
