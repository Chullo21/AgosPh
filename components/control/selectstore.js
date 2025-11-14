import React, { useEffect, useState, useContext, useCallback, useRef } from 'react';
import Constants from 'expo-constants';
import { AuthContext } from '../../context/authcontext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import CustomLoading from '../../components/control/customloading';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    RefreshControl
} from 'react-native';

export default function SelectStore({ nav, icon = null, disableRejectedStores = false, refreshKey = 0 }) {
    const navigation = useNavigation();
    const { API_IP, API_PORT } = Constants.expoConfig.extra;
    const { userToken, user } = useContext(AuthContext);

    const [stores, setStores] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const scrollViewRef = useRef(null);

    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userToken}`,
    };

    const fetchMyStores = async () => {
        try {
            if (user.role !== 'seller') {
                setStores([]);
                return;
            }

            setIsLoading(true);
            const res = await fetch(
                `http://${API_IP}:${API_PORT}/api/Store/getmystores?id=${user.id}`,
                { headers }
            );
            if (!res.ok) throw new Error('Failed to fetch my stores');
            const data = await res.json();
            console.log('Fetched stores:', data);
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
	}, [refreshKey]);

    const renderStore = (store) => (
        <React.Fragment key={store.id}>
            {disableRejectedStores && store.status?.toLowerCase() === 'rejected' ? (
                <View style={[styles.storeContainer, styles.disabledStore]}>
                    <Text style={styles.storeName}>{store?.name || 'Unknown Store'}</Text>
                    <Text style={styles.storeStatus}>Status: {store?.status || 'N/A'}</Text>
                    <Text style={styles.storeDetails}>
                        Location: {store.latitude?.toFixed(4)}, {store.longitude?.toFixed(4)}
                    </Text>
                </View>
            ) : (
                <TouchableOpacity
                    onPress={() => navigation.navigate(nav, { storeId: store.id, storeName: store.name })}
                    activeOpacity={0.7}
                    style={styles.storeContainer}
                >
                    <Text style={styles.storeName}>{store?.name || 'Unknown Store'}</Text>
                    <Text style={styles.storeStatus}>Status: {store?.status || 'N/A'}</Text>
                    <Text style={styles.storeDetails}>
                        Location: {store.latitude?.toFixed(4)}, {store.longitude?.toFixed(4)}
                    </Text>
                </TouchableOpacity>
            )}
        </React.Fragment>
    );

    return (
        <>
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
        </>
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
});
