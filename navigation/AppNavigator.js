import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../context/authcontext";
import LoginScreen from "../pages/login/loginscreen";
import HomeScreen from "../pages/home/homescreen";
import StoreScreen from "../pages/store/storescreen";
import ConfirmOrderScreen from "../pages/confirmorder/confirmorderscreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { userToken } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userToken === null ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
            <>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Store" component={StoreScreen} />
              <Stack.Screen name="ConfirmOrder" component={ConfirmOrderScreen} />
            </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
