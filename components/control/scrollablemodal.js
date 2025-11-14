import React from "react";
import { View, ScrollView, StyleSheet, Dimensions } from "react-native";
import { Modal, Portal, Button, Text } from "react-native-paper";

const { height } = Dimensions.get("window");

export default function ScrollableModal({
    visible,
    onDismiss,
    onAccept,
    title = "Terms and Conditions",
    content = "",
}) {
    return (
        <Portal>
            <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContainer}>
                <View style={styles.innerContainer}>
                    <Text style={styles.title}>{title}</Text>

                    <ScrollView
                        showsVerticalScrollIndicator
                        contentContainerStyle={styles.scrollContent}
                        style={styles.scrollView}
                    >
                        <Text style={styles.text}>{content}</Text>
                    </ScrollView>

                    <View style={styles.footer}>
                        <Button
                            mode="outlined"
                            onPress={onDismiss}
                            style={styles.cancelButton}
                            textColor="#00a3e5"
                        >
                            Cancel
                        </Button>
                        <Button
                            mode="contained"
                            onPress={onAccept}
                            buttonColor="#00a3e5"
                        >
                            Accept
                        </Button>
                    </View>
                </View>
            </Modal>
        </Portal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    innerContainer: {
        width: "95%",
        height: height * 0.9,
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        overflow: "hidden",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    text: {
        fontSize: 14,
        lineHeight: 20,
        color: "#333",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 10,
        borderTopWidth: 1,
        borderTopColor: "#eee",
        paddingTop: 12,
        marginTop: 10,
    },
    cancelButton: {
        borderColor: "#00a3e5",
    },
});
