import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ImageBackground,
    RefreshControl,
} from 'react-native';
import { Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/authcontext';
import AppBar from '../../components/control/appbar';
import Constants from 'expo-constants';
import CustomLoading from '../../components/control/customloading';
import BackgroundPhoto from "../../assets/Beige Blue Modern Abstract Line Shape Bookmark.png";

export default function MonitorOrderScreen() {
    const navigation = useNavigation();
    const { API_BASE_URL} = Constants.expoConfig.extra;
    const { userToken, user } = useContext(AuthContext);

    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [mergedData, setMergedData] = useState([]);

    const handleBackPress = () => {
        navigation.navigate('Home');
    };

    const fetchData = async () => {
        try {
            const headers = {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${userToken}`,
            };

            if (userToken == null || user == null) return;

            setIsLoading(true);

            const ordersRes = await fetch(
                `${API_BASE_URL}/api/Order/getordersbycustomerid?customerId=${user.id}`,
                { headers }
            );
            // console.log("🧾 Orders response:", ordersRes.status, await ordersRes.text());
            const orders = await ordersRes.json();

            if (!orders.length) {
                setMergedData([]);
                setIsLoading(false);
                return;
            }

            const storeIdsQuery = orders.map(o => `storeIds=${o.storeId}`).join("&");
            const orderIdsQuery = orders.map(o => `orderIds=${o.id}`).join("&");

            const [storesRes, orderItemsRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/Store/getstorebystoreids?${storeIdsQuery}`),
                fetch(`${API_BASE_URL}/api/Order/getorderitembyorderids?${orderIdsQuery}`, { headers })
            ]);

            const [stores, orderItems] = await Promise.all([
                storesRes.json(),
                orderItemsRes.json()
            ]);

            const merged = orders.map(order => ({
                ...order,
                store: stores.find(store => store.id === order.storeId) || null,
                items: orderItems.filter(i => i.orderId === order.id)
            }));

            setMergedData(merged);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, []);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return '#f5a623'; // amber
            case 'completed':
                return '#4caf50'; // green
            case 'cancelled':
            case 'canceled':
                return '#f44336'; // red
            case 'delivery':
                return '#00a3e5'; // blue
            default:
                return '#9e9e9e'; // gray
        }
    };

    const renderOrder = ({ item: order }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.storeName}>{order.store?.name || 'Unknown Store'}</Text>

                <View style={[styles.badge, { backgroundColor: getStatusColor(order.status) }]}>
                    <Text style={styles.badgeText}>{order.status}</Text>
                </View>
            </View>

            <Divider style={{ marginVertical: 8 }} />

            <View style={styles.detailsRow}>
                <Text style={styles.label}>Address:</Text>
                <Text style={styles.value}>{user.address}</Text>
            </View>

            <View style={styles.detailsRow}>
                <Text style={styles.label}>Total:</Text>
                <Text style={styles.value}>₱{(order.totalAmount ?? 0).toLocaleString()}</Text>
            </View>

            {order.items && order.items.length > 0 ? (
                <View style={{ marginTop: 8 }}>
                    <Text style={styles.itemsTitle}>Items:</Text>
                    {order.items.map((item, idx) => (
                        <Text key={idx} style={styles.item}>
                            • {item.productName} x {item.quantity} = ₱{item.totalPrice.toLocaleString()}
                        </Text>
                    ))}
                </View>
            ) : (
                <Text style={styles.noItems}>No items found</Text>
            )}

            {order.status === "rejected" &&
                <View style={{ marginTop: 8 }}>
                    <Text style={styles.label}>Reason:</Text>
                    <Text style={styles.value}>{order.sellerNote}</Text>
                </View>
            }
        </View>
    );

    return (
        <ImageBackground
            source={BackgroundPhoto}
            style={{ flex: 1 }}
            resizeMode="stretch"
        >
            <View style={{ flex: 1 }}>
                <AppBar title={"Your Orders"} onBackPress={handleBackPress} />

                {isLoading ? (
                    <CustomLoading />
                ) : (
                    <FlatList
                        data={mergedData}
                        keyExtractor={(order) => order.id.toString()}
                        renderItem={renderOrder}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No orders found.</Text>
                                <Text style={styles.subText}>Pull down to refresh your orders.</Text>
                            </View>
                        }
                        contentContainerStyle={{ padding: 16 }}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={['#00a3e5']}
                                tintColor="#00a3e5"
                            />
                        }
                    />
                )}
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 10,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    storeName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2b2b2b',
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        minWidth: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 12,
        textTransform: 'capitalize',
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    label: {
        fontWeight: '600',
        fontSize: 14,
        color: 'black',
    },
    value: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#555',
    },
    itemsTitle: {
        fontWeight: '600',
        fontSize: 14,
        color: '#333',
        marginBottom: 4,
    },
    item: {
        fontSize: 13,
        color: '#555',
        paddingLeft: 8,
        lineHeight: 20,
    },
    noItems: {
        fontSize: 13,
        color: '#999',
        fontStyle: 'italic',
        paddingLeft: 8,
        marginTop: 4,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 80,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    subText: {
        fontSize: 14,
        color: '#333',
        marginTop: 4,
    },
});
