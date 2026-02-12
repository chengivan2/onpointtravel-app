import { Plane } from 'lucide-react-native';
import React, { useEffect } from 'react';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

export const BouncingPlane = ({ color, size = 48 }: { color: string; size?: number }) => {
    const translateY = useSharedValue(0);

    useEffect(() => {
        translateY.value = withRepeat(
            withSequence(
                withTiming(-15, { duration: 600, easing: Easing.inOut(Easing.ease) }),
                withTiming(0, { duration: 600, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        };
    });

    return (
        <Animated.View style={animatedStyle}>
            <Plane size={size} color={color} />
        </Animated.View>
    );
};
