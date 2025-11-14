import React, { useState, useEffect } from "react";
import { View, Image, Button, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function PhotoUploader({ value = "", onPick }) {
    const [image, setImage] = useState(value || null);

    useEffect(() => {
        setImage(value);
    }, [value]);

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert("Permission to access gallery is required!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            allowsEditing: true,
            quality: 0.8,
        });

        if (!result.canceled && result.assets?.length > 0) {
            const uri = result.assets[0].uri;
            setImage(uri);
            if (onPick) onPick(uri);
        }
    };

    return (
        <View
            style={[
                styles.container,
                { height: image ? "35%" : "auto" }
            ]}
        >
            {image ? (
                <>
                    <Image source={{ uri: image }} style={styles.image} />
                    <Button title="Change Image" onPress={pickImage} />
                </>
            ) : (
                <Button title="Pick an Image" onPress={pickImage} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 10,
        backgroundColor: "#f9f9f9",
        padding: 10,
        width: "100%",
    },
    image: {
        width: "80%",
        height: "80%",
        borderRadius: 8,
        resizeMode: "cover",
    },
});
