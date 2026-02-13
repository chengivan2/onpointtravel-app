import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { LayoutAnimation, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from './ui/icon-symbol';

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingBottom: insets.bottom + 10 }]}>
            <View style={[
                styles.tabBar,
                {
                    backgroundColor: colorScheme === 'dark' ? 'rgba(20, 30, 20, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                    borderColor: theme.border,
                }
            ]}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                                ? options.title
                                : route.name;

                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            // Animate layout changes
                            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                            navigation.navigate(route.name);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };

                    // Get icon name based on route name and focus state
                    let iconName: any = 'house.fill';
                    if (route.name === 'index') iconName = 'house.fill';
                    else if (route.name === 'trips') iconName = 'briefcase.fill';
                    else if (route.name === 'destinations') iconName = 'map.fill';
                    else if (route.name === 'favorites') iconName = 'heart.fill';
                    else if (route.name === 'profile') iconName = 'person.fill';

                    return (
                        <TouchableOpacity
                            key={route.key}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            style={[
                                styles.tabItem,
                                isFocused && {
                                    backgroundColor: colorScheme === 'dark' ? 'rgba(100, 255, 150, 0.2)' : 'rgba(0, 0, 0, 0.05)'
                                }
                            ]}
                        >
                            <IconSymbol
                                size={24}
                                name={iconName}
                                color={isFocused ? theme.tint : theme.secondaryText}
                            />
                            {isFocused && (
                                <Text style={[styles.label, { color: theme.tint }]}>
                                    {label as string}
                                </Text>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    tabBar: {
        flexDirection: 'row',
        borderRadius: 35,
        padding: 5,
        borderWidth: 1, // subtle border
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 5,
        width: '100%',
        maxWidth: 400, // Limit width on large screens
        justifyContent: 'space-between',
    },
    tabItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 30,
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
    },
});
