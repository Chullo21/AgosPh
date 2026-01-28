import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../context/authcontext";
import LoginScreen from "../pages/login/loginscreen";
import RegisterScreen from "../pages/register/registerscreen";
import ProfileScreen from "../pages/profile/profilescreen";
import HomeScreen from "../pages/home/homescreen";
import StoreScreen from "../pages/store/storescreen";
import ConfirmOrderScreen from "../pages/confirmorder/confirmorderscreen";
import MonitorOrderScreen from "../pages/monitororderscreen/monitororderscreen";
import OrdersScreen from "../pages/seller/ordersscreen";
import ManageStoreItemsScreen from "../pages/seller/managestoreitemsscreen";
import ManageStoreListScreen from "../pages/seller/list/managestorelistscreen";
import OrdersStoreListScreen from "../pages/seller/list/ordersstorelistscreen";
import StoreHistoryScreen from "../pages/seller/storehistoryscreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { userToken } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userToken === null ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
            <>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="Store" component={StoreScreen} />
              <Stack.Screen name="ConfirmOrder" component={ConfirmOrderScreen} />
              <Stack.Screen name="MonitorOrder" component={MonitorOrderScreen} />
              <Stack.Screen name="ManageStoreItems" component={ManageStoreItemsScreen} />  
              <Stack.Screen name="SellerOrders" component={OrdersScreen} />   
              <Stack.Screen name="StoreHistory" component={StoreHistoryScreen} />
              <Stack.Screen name="ManageStoreList" component={ManageStoreListScreen} />   
              <Stack.Screen name="OrdersStoreList" component={OrdersStoreListScreen} />
            </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
