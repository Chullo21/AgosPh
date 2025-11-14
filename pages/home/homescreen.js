import React, { useContext, useState, useEffect, useCallback } from "react";
import Constants from "expo-constants";
import {
	View,
	StyleSheet,
	ImageBackground,
	Keyboard,
	TouchableWithoutFeedback,
} from "react-native";
import { AuthContext } from "../../context/authcontext";
import { LocationContext } from "../../context/LocationProvider";
import { useNavigation } from "@react-navigation/native";
import LargeAppBar from "../../components/control/largeappbar";
import BackgroundPhoto from "../../assets/Beige Blue Modern Abstract Line Shape Bookmark.png";
import Grid from "../../components/control/grid";
import FloatingOrderButton from "../../components/control/floatingorderbutton";
import TestToken from "../../components/others/TestToken";

export default function HomeScreen() {
	const { logout, userToken, user } = useContext(AuthContext);
	const { location: userLocation } = useContext(LocationContext);
	const { API_BASE_URL } = Constants.expoConfig.extra;

	const navigation = useNavigation();

	const [visible, setVisible] = useState(false);
	const [stores, setStores] = useState([]);
	const [storesLoading, setStoresLoading] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const [peekOrders, setPeekOrders] = useState(0);

	const openMenu = () => setVisible(true);
	const closeMenu = () => setVisible(false);

	const handleStorePress = (store) => {
		navigation.navigate("Store", { store });
	};

	const handlePeekOrderPress = () => {
		navigation.navigate("MonitorOrder");
	};

	const fetchStores = useCallback(async () => {
		if (!userToken || !userLocation?.latitude || !userLocation?.longitude) return;

		try {
			setStoresLoading(true);

			const headers = {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${userToken}`,
			};

			const storeRes = await fetch(
				`${API_BASE_URL}/api/Store/nearby?latitude=${userLocation.latitude}&longitude=${userLocation.longitude}`,
				{ headers }
			);

			if (!storeRes.ok) throw new Error(`Store fetch failed: ${storeRes.status}`);

			const storeData = await storeRes.json();
			setStores(storeData);

			const orderRes = await fetch(
				`${API_BASE_URL}/api/Order/peekorders?userId=${user.id}`,
				{ headers }
			);

			if (!orderRes.ok) throw new Error(`Order fetch failed: ${orderRes.status}`);

			const orderData = await orderRes.json();
			setPeekOrders(orderData);

		} catch (err) {
			console.error("Fetch error:", err);
		} finally {
			setStoresLoading(false);
		}
	}, [userLocation, userToken, user]);

	const handleRefresh = async () => {
		setRefreshing(true);
		await fetchStores();
		setRefreshing(false);
	};

	useEffect(() => {
		fetchStores();
	}, [fetchStores]);

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<ImageBackground source={BackgroundPhoto} style={styles.background}>
				<LargeAppBar onMenuPress={openMenu} onLogout={logout}/>

				<View style={styles.container}>
					<Grid
						label="Nearby Wholesellers"
						data={stores}
						onPress={handleStorePress}
						isloading={storesLoading}
						noDescription="No nearby wholesellers, be one!"
						noTitle=""
						onRefresh={handleRefresh}
						refreshing={refreshing}
					/>

					<FloatingOrderButton
						itemCount={peekOrders.toString()}
						totalAmount={0}
						onPress={handlePeekOrderPress}
					/>
				</View>
			</ImageBackground>
		</TouchableWithoutFeedback>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	background: {
		flex: 1,
	},
});
