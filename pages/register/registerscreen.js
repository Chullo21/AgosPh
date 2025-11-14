import * as React from "react";
import {
    View,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
} from "react-native";
import {
    Provider as PaperProvider,
    TextInput,
    Button,
    Text,
} from "react-native-paper";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authcontext";
import { useNavigation } from "@react-navigation/native";
import BackgroundPhoto from "../../assets/Beige Blue Modern Abstract Line Shape Bookmark.png";

export default function RegisterScreen() {
    const navigation = useNavigation();
    const [name, setName] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [address, setAddress] = useState("");
    const [errors, setErrors] = useState({});

    const { register } = useContext(AuthContext);

    const handleRegister = async () => {
        let newErrors = {};

        if (!name.trim()) newErrors.name = "Full Name is required";
        if (!contactNumber.trim()) newErrors.contactNumber = "Contact Number is required";
        if (!email.trim()) newErrors.email = "Email is required";
        if (!password.trim()) newErrors.password = "Password is required";
        if (password.length < 8) newErrors.password = "Password must be at least 8 characters";
        if (!confirmPassword.trim()) newErrors.confirmPassword = "Confirm your password";
        if (password && confirmPassword && password !== confirmPassword)
            newErrors.confirmPassword = "Passwords do not match";

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        try {
            await register(name, email, password, contactNumber, address);
            alert("Account created successfully!");
            navigation.goBack();
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <PaperProvider>
            <ImageBackground
                source={BackgroundPhoto}
                style={styles.background}
                resizeMode="stretch"
            >
                <View style={styles.safeArea}>
                    <View style={styles.overlay}>
                        <Text style={styles.title}>Create Account</Text>

                        <TextInput
                            label={<Text>Full Name <Text style={{ color: "red" }}>*</Text></Text>}
                            value={name}
                            onChangeText={setName}
                            style={styles.input}
                            autoCapitalize="words"
                            error={!!errors.name}
                        />
                        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

                        <TextInput
                            label={<Text>Contact Number <Text style={{ color: "red" }}>*</Text></Text>}
                            value={contactNumber}
                            onChangeText={setContactNumber}
                            style={styles.input}
                            keyboardType="phone-pad"
                            error={!!errors.contactNumber}
                        />
                        {errors.contactNumber && <Text style={styles.errorText}>{errors.contactNumber}</Text>}

                        <TextInput
                            label={<Text>Email <Text style={{ color: "red" }}>*</Text></Text>}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            style={styles.input}
                            autoCapitalize="none"
                            error={!!errors.email}
                        />
                        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

                        <TextInput
                            label={<Text>Address <Text style={{ color: "red" }}>*</Text></Text>}
                            value={address}
                            onChangeText={setAddress}
                            keyboardType="default"
                            style={styles.input}
                            autoCapitalize="words"
                            error={!!errors.address}
                        />
                        {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}

                        <TextInput
                            label={<Text>Password <Text style={{ color: "red" }}>*</Text></Text>}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            style={styles.input}
                            error={!!errors.password}
                        />
                        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

                        <TextInput
                            label={<Text>Confirm Password <Text style={{ color: "red" }}>*</Text></Text>}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            style={styles.input}
                            error={!!errors.confirmPassword}
                        />
                        {errors.confirmPassword && (
                            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                        )}

                        <Button
                            mode="contained"
                            onPress={handleRegister}
                            style={styles.button}
                        >
                            Register
                        </Button>

                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text style={styles.loginLink}>
                                Already have an account?{" "}
                                <Text style={styles.linkText}>Login</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </PaperProvider>
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
        width: "100%",
    },
    input: { marginBottom: 5, backgroundColor: "transparent" },
    button: { marginTop: 15, padding: 5, backgroundColor: "#00a3e5" },
    loginLink: { textAlign: "center", marginTop: 20, color: "#555" },
    linkText: { color: "#00a3e5", fontWeight: "bold" },
    errorText: { color: "red", fontSize: 12, marginBottom: 10, marginLeft: 5 },
});
