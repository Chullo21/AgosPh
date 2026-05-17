import React, { useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Easing,
} from "react-native";

export default function Loading({ message = "Loading..." }) {
    const dot1 = useRef(new Animated.Value(0)).current;
    const dot2 = useRef(new Animated.Value(0)).current;
    const dot3 = useRef(new Animated.Value(0)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const createDotAnimation = (dot, delay) => {
            return Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(dot, {
                        toValue: 1,
                        duration: 450,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(dot, {
                        toValue: 0,
                        duration: 450,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ])
            );
        };

        const rotateAnimation = Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 1200,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        );

        Animated.parallel([
            createDotAnimation(dot1, 0),
            createDotAnimation(dot2, 150),
            createDotAnimation(dot3, 300),
            rotateAnimation,
        ]).start();
    }, []);

    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
    });

    const getDotStyle = (dot) => ({
        opacity: dot.interpolate({
            inputRange: [0, 1],
            outputRange: [0.35, 1],
        }),
        transform: [
            {
                scale: dot.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1.35],
                }),
            },
        ],
    });

    return (
        <View style={styles.overlay}>
            <View style={styles.card}>
                <Animated.View
                    style={[
                        styles.spinner,
                        {
                            transform: [{ rotate }],
                        },
                    ]}
                />

                <Text style={styles.text}>{message}</Text>

                <View style={styles.dotsContainer}>
                    <Animated.View style={[styles.dot, getDotStyle(dot1)]} />
                    <Animated.View style={[styles.dot, getDotStyle(dot2)]} />
                    <Animated.View style={[styles.dot, getDotStyle(dot3)]} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 9999,
        elevation: 9999,
        backgroundColor: "rgba(0, 0, 0, 0.35)",
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        width: 170,
        minHeight: 150,
        backgroundColor: "#ffffff",
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 24,
        paddingHorizontal: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.18,
        shadowRadius: 14,
        elevation: 8,
    },
    spinner: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 5,
        borderColor: "#d8f1fb",
        borderTopColor: "#00a3e5",
        marginBottom: 16,
    },
    text: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 12,
    },
    dotsContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#00a3e5",
    },
});