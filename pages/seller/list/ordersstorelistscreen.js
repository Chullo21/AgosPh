import React, { useEffect, useState, useContext, useCallback, useRef } from 'react';
import {
	View,
	Text,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	RefreshControl,
    ImageBackground
} from 'react-native';
import { Badge } from 'react-native-paper';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../../context/authcontext';
import CustomLoading from '../../../components/control/customloading';
import AppBar from '../../../components/control/appbar';
import BackgroundPhoto from '../../../assets/Beige Blue Modern Abstract Line Shape Bookmark.png';

export default function OrdersStoreListScreen({props}) {
    const navigation = useNavigation();
	const { API_BASE_URL } = Constants.expoConfig.extra;
	const { userToken, user } = useContext(AuthContext);

	const [stores, setStores] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [orderCount, setOrderCount] = useState({});
	const scrollViewRef = useRef(null);

	const headers = {
		"Content-Type": "application/json",
		"Authorization": `Bearer ${userToken}`,
	};

	const fetchMyStores = async () => {
		try {
			if (!user) return;

			setIsLoading(true);
			const url = user.role === 'seller'
				? `${API_BASE_URL}/api/Store/getmystores?id=${user.id}`
				: `${API_BASE_URL}/api/Store`;

            const res = await fetch(url, { headers });
            
            const orderCountRes = await fetch(`${API_BASE_URL}/api/Order/getstoreordercount?userId=${user.id}`, { headers })
            if (!res.ok) throw new Error('Failed to fetch stores');
            if (!orderCountRes.ok) throw new Error('Failed to fetch store order count');

            const data = await res.json();
			const orderRes = await orderCountRes.json();
            setOrderCount(orderRes);
			setStores(data);

			setTimeout(() => {
				scrollViewRef.current?.scrollTo({ y: 0, animated: true });
			}, 100);

		} catch (err) {
			console.error('Fetch error:', err);
		} finally {
			setIsLoading(false);
		}
	};

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await fetchMyStores();
		setRefreshing(false);
	}, []);

	useEffect(() => {
		fetchMyStores();
	}, []);

    const renderStore = (store) => (
		<React.Fragment key={store.id}>
			{(store.status?.toLowerCase() === 'rejected'  || store.status?.toLowerCase() === 'pending') ? (
				<View style={[styles.storeContainer, styles.disabledStore]}>
					<Text style={styles.storeName}>{store?.name || 'Unknown Store'}</Text>
				</View>
			) : (
				<TouchableOpacity
					onPress={() => navigation.navigate('SellerOrders', {
						storeId: store.id,
						storeName: store.name
					})}
					activeOpacity={0.7}
					style={styles.storeContainer}
                > 
                    <View style={styles.storeHeader}>      
                        <Text style={styles.storeName}>{store?.name || 'Unknown Store'}</Text>
                        <Badge style={[styles.badge, styles.badgeActive]}>
                            {orderCount.find(item => item.name === store.name)?.count ?? 0}
                        </Badge>
                    </View>
                    
				</TouchableOpacity>
			)}
		</React.Fragment>
	);

	return (
		<ImageBackground
			source={BackgroundPhoto}
			style={{ flex: 1 }}
			resizeMode="stretch"
		>
			<AppBar title="Select a Store" onBackPress={() => navigation.goBack()} />
			{!isLoading ? (
				<ScrollView
					ref={scrollViewRef}
					contentContainerStyle={{
						padding: 16,
						paddingBottom: 100,
						flexGrow: 1,
					}}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={onRefresh}
							colors={['#00a3e5']}
							tintColor="#00a3e5"
						/>
					}
				>
					{stores && stores.length > 0 ? (
						stores.map((store) => renderStore(store))
					) : (
						<View style={styles.emptyContainer}>
							<Text style={styles.emptyText}>No store found.</Text>
							<Text style={styles.subText}>
								Pull down to refresh or register a store.
							</Text>
						</View>
					)}
				</ScrollView>
			) : (
				<CustomLoading />
			)}
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	storeContainer: {
		backgroundColor: '#fff',
		padding: 16,
		borderRadius: 8,
		marginBottom: 12,
		elevation: 2,
	},
	storeName: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#2b2b2b',
	},
	storeStatus: {
		fontSize: 14,
		marginTop: 4,
		color: '#555',
	},
	storeDetails: {
		fontSize: 12,
		marginTop: 4,
		color: '#777',
	},
	emptyContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 100,
	},
	emptyText: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#333',
		marginBottom: 4,
	},
	subText: {
		fontSize: 14,
		color: '#333',
	},
	disabledStore: {
		backgroundColor: '#ddd',
		opacity: 0.7,
    },
    badge: {
	    fontSize: 12,
	    paddingHorizontal: 8,
        color: '#fff',
        backgroundColor: '#00a3e5'
    },
    storeHeader: {
	    flexDirection: 'row',
	    alignItems: 'center',
	    justifyContent: 'space-between',
    },
});
