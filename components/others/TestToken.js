import React, { useContext } from "react";
import { View, Button, Alert } from "react-native";
import Constants from 'expo-constants';
import { AuthContext } from "../../context/authcontext";
import * as SecureStore from "expo-secure-store";   

export default function TestToken() {
    const { userToken } = useContext(AuthContext);
    const { API_IP, API_PORT } = Constants.expoConfig.extra;

    const getToken = async () => {
        try {
            const token = await SecureStore.getItemAsync("token");
            // console.log("Token:", token);
            return token;
        } catch (error) {
            console.error("Error retrieving token:", error);
        }
    };

    const testProtectedRoute = async (withToken = false) => {
        try {
            let headers = {};

            if (withToken) {
                const token = userToken || await getToken();
                if (token) {
                    headers["Authorization"] = `Bearer ${userToken}`;
                }
                console.log("🔑 Token used:", token);
            }

            const response = await fetch(`http://${API_IP}:${API_PORT}/api/User/profile`, {
                headers,
            });

            const text = await response.text();
            Alert.alert(
                `Response (${response.status})`,
                text
            );
            // console.log("Response:", response);
            
            console.log("📦 Headers sent:", headers);

        } catch (error) {
            console.error("❌ Access failed:", error.message);
        }
    };

    return (
        <View style={{ margin: 20 }}>
            <Button title="Test without token" onPress={() => testProtectedRoute(false)} />
            <Button title="Test with token" onPress={() => testProtectedRoute(true)} />
        </View>
    );
}
