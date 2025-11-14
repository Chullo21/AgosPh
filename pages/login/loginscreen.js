import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, ImageBackground, TextInput, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../context/authcontext";
import AppBar from "../../components/control/appbar";
import BackgroundPhoto from "../../assets/Beige Blue Modern Abstract Line Shape Bookmark.png";

export default function LoginScreen() {
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, handleTryConnection } = useContext(AuthContext);

    const handleLogin = async () => {
        try {
            if (!email || !password) {
                Alert.alert("Bruh", "You good bruh?");
                return;
            }
            await login(email, password);
        } catch {
            Alert.alert("Login Failed", "Invalid email or password");
        }
    };

    const handleRegister = () => {
        navigation.navigate("Register");
    };

    return (
        <ImageBackground
            source={BackgroundPhoto}
            style={styles.background}
            resizeMode="stretch"
        >
            <AppBar buttonLabel="Register" onActionPress={handleRegister} />

            <View style={styles.safeArea}>
                <View style={styles.overlay}>
                    <Text style={styles.title}>Agos</Text>

                    <TextInput
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={styles.input}
                    />

                    <TextInput
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        style={styles.input}
                    />

                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>

                    <Text
                        onPress={() => Alert.alert("Forgot Password", "Contact the admin if you forgot your password.")}
                        style={styles.forgot}
                    >
                        Forgot password?
                    </Text>

                    <TouchableOpacity style={styles.tryButton} onPress={handleTryConnection}>
                        <Text style={styles.tryText}>Try</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: { flex: 1, justifyContent: "center" },
    safeArea: { flex: 1, justifyContent: "center", padding: 20 },
    overlay: {
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        borderRadius: 10,
        padding: 20,
        width: "100%",
    },
    title: {
        textAlign: "center",
        marginBottom: 30,
        fontSize: 28,
        fontWeight: "bold",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        backgroundColor: "#fff",
    },
    button: {
        backgroundColor: "#00a3e5",
        padding: 12,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
    forgot: { textAlign: "center", marginTop: 20, color: "#888" },
    tryButton: {
        borderWidth: 1,
        borderColor: "#00a3e5",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 15,
    },
    tryText: { color: "#00a3e5", fontWeight: "bold" },
});
