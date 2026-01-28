import React, { useState, useContext, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, Menu, Text, Badge } from 'react-native-paper';
import { AuthContext } from '../../context/authcontext';
import { useRoute, useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function LargeAppBar({ onLogout }) {
	const navigation = useNavigation();
	const route = useRoute();
	const { API_BASE_URL } = Constants.expoConfig.extra;

	const { userToken, user } = useContext(AuthContext);
	const [menuVisible, setMenuVisible] = useState(false);
	const [orderCount, setOrderCount] = useState(0);
	const [orderCountArr, setOrderCountArr] = useState([]);
	const [cartItems, setCartItems] = useState(0);

	const openMenu = useCallback(() => setMenuVisible(true), []);
	const closeMenu = useCallback(() => setMenuVisible(false), []);

	const getOrdersCount = async () => { 
		try {
			const orderRes = await fetch(
				`${API_BASE_URL}/api/Order/getstoretotalorderscount?userId=${user.id}`,
				{ 
					method: "GET",
					headers: {
                    	"Authorization": `Bearer ${userToken}`,
                },
				}
			);
			const data = await orderRes.json();
			setOrderCount(data);

		} catch (err) {
			console.log(err);
		} finally {

		}
	};

	useEffect(() => {
    	getOrdersCount();

    	const interval = setInterval(() => {
        	getOrdersCount();
    	}, 15000);

    	return () => clearInterval(interval);
	}, []);


	useEffect(() => {
		const unsubscribeBlur = navigation.addListener('blur', () => setMenuVisible(false));
		const unsubscribeBeforeRemove = navigation.addListener('beforeRemove', () => setMenuVisible(false));
		return () => {
			unsubscribeBlur();
			unsubscribeBeforeRemove();
		};
	}, [navigation]);

	const navigateAfterClose = (screenName, params) => {
		closeMenu();
		requestAnimationFrame(() => {
			requestAnimationFrame(() => navigation.navigate(screenName, params));
		});
	};

	return (
		<View style={styles.container}>
			<Appbar.Header style={styles.header}>
				<View style={styles.centerContainer}>
					<Text style={styles.title}>Agos</Text>
				</View>

				<View style={{ flexDirection: 'row', marginLeft: 'auto' }}>
					{user?.role !== 'user' && (
						<View style={{ position: 'relative' }}>
							<Appbar.Action
								icon="ballot"
								color="black"
								onPress={() => navigateAfterClose('OrdersStoreList', {orderCount: orderCountArr})}
							/>
							{orderCount > 0 && (
								<Badge visible size={18} style={styles.badge}>
									{orderCount}
								</Badge>
							)}
						</View>
					)}

					{/* <View style={{ position: 'relative' }}>
						<Appbar.Action icon="cart" color="black" onPress={() => console.log('Cart')} />
						{cartItems > 0 && (
							<Badge visible size={18} style={styles.badge}>
								{cartItems}
							</Badge>
						)}
					</View> */}

					<Menu
						key={menuVisible ? `menu-open-${route.name}` : `menu-closed-${route.name}`}
						visible={menuVisible}
						onDismiss={closeMenu}
						anchor={
							<Appbar.Action
								icon="dots-vertical"
								color="black"
								onPress={openMenu}
							/>
						}
					>
						<Menu.Item
							title="Profile"
							icon={() => <MaterialCommunityIcons name="account" size={20} color="black" />}
							onPress={() => navigateAfterClose('Profile', {})}
						/>
						{/* <Menu.Item
							onPress={() => {
								closeMenu();
								requestAnimationFrame(() => console.log('Register Biz clicked'));
							}}
							title="Register Biz"
							icon={() => <MaterialCommunityIcons name="store" size={20} color="black" />}
						/> */}
						<Menu.Item
							onPress={() => navigateAfterClose('ManageStoreList')}
							title="Manage Store"
							icon={() => <MaterialCommunityIcons name="store" size={20} color="black" />}
						/>
						{/* <Menu.Item
							onPress={() => {
								closeMenu();
								requestAnimationFrame(() => console.log('Settings clicked'));
							}}
							title="Settings"
							icon={() => <MaterialCommunityIcons name="cog" size={20} color="black" />}
						/> */}
						<Menu.Item
							onPress={() => {
								closeMenu();
								requestAnimationFrame(() => onLogout && onLogout());
							}}
							title="Logout"
							icon={() => <MaterialCommunityIcons name="logout" size={20} color="black" />}
						/>
					</Menu>
				</View>
			</Appbar.Header>

			<View style={styles.largeSection}>
				<Text style={styles.welcome}>Welcome, {user?.name?.split(' ')[0] || 'Guest'}!</Text>
				<Text style={styles.subtitle}>Let’s sell something today 🚚</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { zIndex: 1000 },
	header: { backgroundColor: 'transparent', height: 80 },
	centerContainer: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		justifyContent: 'center',
		alignItems: 'center',
	},
	title: {
		fontSize: 50,
		fontWeight: 'bold',
		color: 'black',
		textAlign: 'left',
		alignSelf: 'flex-start',
		paddingLeft: 20,
		width: '100%',
	},
	largeSection: { backgroundColor: 'transparent', paddingHorizontal: 16, paddingBottom: 20 },
	welcome: {
		fontSize: 24,
		fontWeight: 'bold',
		color: 'black',
		width: '100%',
	},
	subtitle: {
		fontSize: 16,
		color: 'black',
		width: '100%',
	},
	badge: {
		position: 'absolute',
		top: 2,
		right: 2,
		backgroundColor: 'red',
	},
});
