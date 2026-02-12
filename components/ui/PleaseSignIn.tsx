import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PleaseSignInProps {
    message: string;
    onSignIn: () => void;
}

export const PleaseSignIn = ({ message, onSignIn }: PleaseSignInProps) => {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Image
                source={require('@/assets/images/hand-drawn-coconut-cartoon-illustration.png')}
                style={styles.illustration}
                resizeMode="contain"
            />
            <Text style={[styles.message, { color: theme.text }]}>{message}</Text>
            <TouchableOpacity
                style={[styles.loginBtn, { backgroundColor: theme.btnBackground }]}
                onPress={onSignIn}
            >
                <Text style={[styles.btnText, { color: theme.btnText }]}>Sign In</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    illustration: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    message: {
        fontSize: 18,
        fontFamily: Fonts.body,
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 24,
    },
    loginBtn: {
        paddingHorizontal: 40,
        paddingVertical: 14,
        borderRadius: 99,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    btnText: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: Fonts.body,
    },
});
