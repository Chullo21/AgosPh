import React, { createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

export const AuthContext = createContext();

export default function AuthProvider ({ children }) {
  const [userToken, setUserToken] = useState(null);

  const login = async (token) => {
    setUserToken(token);
    await SecureStore.setItemAsync("userToken", token); // save securely
  };

  const logout = async () => {
    setUserToken(null);
    await SecureStore.deleteItemAsync("userToken");
  };

  const checkLogin = async () => {
    const token = await SecureStore.getItemAsync("userToken");
    setUserToken(token);
  };

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider value={{ userToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
