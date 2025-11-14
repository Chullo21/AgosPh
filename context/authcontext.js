import React, { createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import Constants from 'expo-constants';

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [userToken, setUserToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { API_BASE_URL } = Constants.expoConfig.extra;

    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/Auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Login failed: ${response.status} ${errorText}`);
            }

            const { user, token } = await response.json();

            await SecureStore.setItemAsync("user", JSON.stringify(user));
            await SecureStore.setItemAsync("token", token);

            setUser(user);
            setUserToken(token);
            return user;

        } catch (err) {
            console.error("Login error:", err);
            throw err;
        }
    };

    const register = async (name, email, password, contactNumber, address) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/Auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, contactNumber, address }),
            });

            if (!response.ok) throw new Error("Registration failed");

            const user = await response.json();

            setUser(null);
            setUserToken(null);
            await SecureStore.deleteItemAsync("token");
            await SecureStore.deleteItemAsync("user");

            return user;
        } catch (error) {
            console.error("Register failed:", error.message);
            throw error;
        }
    };

    const logout = async () => {
        setUser(null);
        setUserToken(null);
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("user");
    };

    const checkLogin = async () => {
        try {
            const storedToken = await SecureStore.getItemAsync("token");
            const storedUser = await SecureStore.getItemAsync("user");

            if (storedToken && storedUser) {
                setUser(JSON.parse(storedUser));
                setUserToken(storedToken);
            }
        } catch (error) {
            console.error("Failed to restore session:", error.message);
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async (updatedData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/Auth/${user.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json", 
                    "Authorization": `Bearer ${userToken}`
                },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Update failed: ${response.status} ${errorText}`);
            }

            const updatedUser = await response.json();
            setUser(updatedUser);
            await SecureStore.setItemAsync("user", JSON.stringify(updatedUser));
            return updatedUser;
        } catch (error) {
            console.error("Update user failed:", error.message);
            throw error;
        }
    }

    const handleTryConnection = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/Auth/users`);
            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Failed: ${response.status} ${text}`);
            }

            const data = await response.json();
            console.log("✅ Connected successfully:", data);
            alert("Connected to backend successfully!");
        } catch (error) {
            console.error("❌ Connection failed:", error.message);
            alert(`Connection failed: ${error.message}`);
        }
    };

    useEffect(() => {
        checkLogin();
    }, []);

    return (
        <AuthContext.Provider value={{ userToken, login, register, logout, loading, user, handleTryConnection }}>
            {children}
        </AuthContext.Provider>
    );
}
