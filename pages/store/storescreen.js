import React, { useEffect, useState } from 'react';
import Constants from 'expo-constants';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import CustomImage from '../../components/control/customimage/customimage';
import LabeledList from '../../components/control/labeledlist';
import CustomStoreListItem from '../../components/control/customstorelistitem';
import PlaceOrderButton from '../../components/control/placeorderbutton';
import BackgroundPhoto from "../../assets/Beige Blue Modern Abstract Line Shape Bookmark.png";
import AppBar from '../../components/control/appbar';

export default function StoreScreen() {
	const navigation = useNavigation();
	const route = useRoute();
	const { store } = route.params;
	const { API_BASE_URL } = Constants.expoConfig.extra;

	const [menuItems, setMenuItems] = useState([]);
	const [menuIsLoading, setMenuIsLoading] = useState(false);
	const [cart, setCart] = useState({});
	const [orders, setOrders] = useState([]);

	const handleOrderPress = () => {
		navigation.navigate('ConfirmOrder', { orders, store, total });
	};

	const handleQuantityChange = (id, quantity, price, pName) => {
		setCart(prev => {
			const updated = { ...prev };

			if (quantity > 0) {
				updated[id] = { quantity, price: parseFloat(price), pName };
			} else {
				delete updated[id];
			}

			const newOrders = Object.entries(updated).map(([key, item]) => ({
				id: key,
				quantity: item.quantity,
				price: item.price,
				name: item.pName
			}));

			setOrders(newOrders);

			return updated;
		});
	};

	const total = Object.values(cart).reduce(
		(sum, item) => sum + item.quantity * item.price,
		0
	);

	const handleBackPress = () => {
		navigation.navigate('Home');
	};

	useEffect(() => {
		if (store?.id) {
			setMenuIsLoading(true);
			fetch(`${API_BASE_URL}/api/Menu?storeId=${store.id}`)
				.then(res => res.json())
				.then(data => setMenuItems(data))
				.catch(err => console.error('Fetch error (menuitems):', err))
				.finally(() => setMenuIsLoading(false));
		}
	}, [store?.id]);

	if (!store) {
		return (
			<View style={styles.centered}>
				<Text>No store data available.</Text>
			</View>
		);
	}

	return (
		<ImageBackground
			source={BackgroundPhoto}
			style={styles.wrapper}
			resizeMode="stretch"
		>
			<AppBar title={store.name} onBackPress={handleBackPress} />

			{total ? (
				<PlaceOrderButton
					label="Checkout Order"
					total={total}
					onPress={handleOrderPress}
				/>
			) : null}

			<LabeledList
				isLoading={menuIsLoading}
				label="Available products"
				data={menuItems}
				noTitle="Unavailable"
				noDescription="Shop has not updated its menu yet."
				showLeft={true}
				renderItem={({ item }) => (
					<CustomStoreListItem
						id={item.id}
						title={item.title}
						description={item.description}
						imageUrl={item.photoUrl}
						price={item.price}
						isAvailable={item.isAvailable}
						onQuantityChange={handleQuantityChange}
					/>
				)}
			/>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		backgroundColor: '#fff',
	},
	logoContainer: {
		width: '100%',
		height: 120,
		borderRadius: 12,
		overflow: 'hidden',
		marginBottom: 16,
	},
	logo: {
		width: '100%',
		height: '100%',
	},
	centered: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
});
