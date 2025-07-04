import React from "react";
import { PaperProvider } from "react-native-paper";
import AppNavigator from "./navigation/AppNavigator";
import AuthProvider from "./context/authcontext";
import LocationProvider from './context/LocationProvider';

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <LocationProvider>
          <AppNavigator />
        </LocationProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
