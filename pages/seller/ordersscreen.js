import React, { useEffect, useState, useContext } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Modal,
    Pressable,
    ImageBackground,
    RefreshControl,
    Alert
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import { AuthContext } from '../../context/authcontext';
import CustomLoading from '../../components/control/customloading';
import AppBar from '../../components/control/appbar';
import BackgroundPhoto from '../../assets/Beige Blue Modern Abstract Line Shape Bookmark.png';
import { Button, TextInput } from 'react-native-paper';

export default function OrdersScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { storeId, storeName } = route.params || {};
    const { API_BASE_URL} = Constants.expoConfig.extra;
    const { userToken } = useContext(AuthContext);

    const [isLoading, setIsLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [sellerNote, setSellerNote] = useState("")
    const [refreshing, setRefreshing] = useState(false);

    const handleOpenModal = (order) => {
        if (order.status === "Completed" || order.status === "Canceled") return;

        const date = new Date(order.orderDate);
        const formatted = date.toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });

        setSelectedItem({ ...order, orderDate: formatted });
        setOpen(true);
    };

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(
                `${API_BASE_URL}/api/Order/getstoreorders?storeId=${storeId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${userToken}`,
                    },
                }
            );

            const data = await response.json();

            const mergedOrders = data.orders.map((order) => ({
                ...order,
                items: data.items.filter((item) => item.orderId === order.id),
            }));

            setOrders(mergedOrders);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePressUpdate = async (status) => { 
        try {

            if (status === "rejected" && sellerNote === "")
            {
                Alert.alert("Reminder", "Please leave a reason or message why the customer's order has been declined.")
                return;
            }

            const payload = {
                status: status,
                message: sellerNote
            };

            await fetch(`${API_BASE_URL}/api/Order/${selectedItem.id}/status`,
                {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${userToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );
            setOpen(false);

        } catch (err){
            console.log(err)
        } finally {

        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchOrders();
        setRefreshing(false);
    };

    const handleBackPress = () => {
        navigation.goBack();
    };

    const renderItem = ({ item: order }) => (
        <Pressable
            onPress={() => handleOpenModal(order)}
            style={({ pressed }) => [
                styles.orderContainer,
                pressed && { opacity: 0.85 },
            ]}
        >
            <View style={styles.headerRow}>
                <Text style={styles.customerName}>
                    {order.customerName || "Unknown Customer"}
                </Text>
                <View
                    style={[
                        styles.statusBadge,
                        order.status.toLowerCase() === "pending"
                            ? styles.statusPending
                            : order.status.toLowerCase() === "delivery"
                            ? styles.statusDelivery
                            : styles.statusCompleted,
                    ]}
                >
                    <Text style={styles.statusText}>{order.status}</Text>
                </View>
            </View>

            <View>
                <Text>Address:</Text>
                <Text>{order.address || "No address"}</Text>
            </View>

            <View style={styles.itemsContainer}>
                {order.items.map((item, index) => (
                    <Text key={index} style={styles.itemText}>
                        • {item.productName} × {item.quantity} — ₱{item.totalPrice}
                    </Text>
                ))}
            </View>

            <View style={styles.footerRow}>
                <Text style={styles.dateText}>
                    {new Date(order.orderDate).toLocaleString()}
                </Text>
                <Text style={styles.totalText}>₱{order.totalAmount}</Text>
            </View>
        </Pressable>
    );

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <ImageBackground source={BackgroundPhoto} style={{ flex: 1 }} resizeMode="stretch">
            <View style={{ flex: 1 }}>
                <AppBar title={`${storeName}'s Orders`} onBackPress={handleBackPress} />

                {!isLoading ? (
                    <FlatList
                        data={orders}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                        ListEmptyComponent={<Text style={styles.emptyText}>No orders found.</Text>}
                        contentContainerStyle={{ padding: 16 }}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    />
                ) : (
                    <CustomLoading />
                )}

                <Modal visible={open} animationType="fade" transparent onRequestClose={() => setOpen(false)}>
                    <Pressable style={styles.modalOverlay} onPress={() => setOpen(false)}>
                        <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
                            {selectedItem && (
                                <>
                                    <View style={styles.modalHeader}>
                                        <Text style={styles.modalTitle}>
                                            {selectedItem.customerName || "Unknown Customer"}
                                        </Text>
                                        <View
                                            style={[
                                                styles.statusBadge,
                                                selectedItem.status.toLowerCase() === "pending"
                                                    ? styles.statusPending
                                                    : selectedItem.status.toLowerCase() === "delivery"
                                                    ? styles.statusDelivery
                                                    : styles.statusCompleted,
                                            ]}
                                        >
                                            <Text style={styles.statusText}>{selectedItem.status}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.modalSection}>
                                        <Text style={styles.modalLabel}>Order Date</Text>
                                        <Text style={styles.modalValue}>{selectedItem.orderDate}</Text>
                                    </View>

                                    <View style={styles.modalSection}>
                                        <Text style={styles.modalLabel}>Total Amount</Text>
                                        <Text style={[styles.modalValue]}>
                                            ₱{selectedItem.totalAmount}
                                        </Text>
                                    </View>

                                    <View style={styles.modalItems}>
                                        <Text style={styles.modalLabel}>Items</Text>
                                        {selectedItem.items?.map((item, index) => (
                                            <Text key={index} style={styles.modalItemText}>
                                                • {item.productName} × {item.quantity} — ₱{item.totalPrice}
                                            </Text>
                                        ))}
                                    </View>

                                    <View>
                                        <Text style={styles.modalLabel}>Customer Note:</Text>
                                        <Text style={styles.modalValue}>{selectedItem.customerNote}</Text>
                                    </View>

                                    <View style={styles.note}>
                                        <TextInput
                                            label="Message/Reason"
                                            placeholder="Enter message here..."
                                            mode="outlined"
                                            multiline
                                            numberOfLines={4}
                                            value={sellerNote}
                                            onChangeText={setSellerNote}
                                            style={styles.input}
                                        />
                                    </View>

                                    <View style={styles.modalActions}>
                                        {selectedItem.status.toLowerCase() === "pending" ? (
                                            <>
                                                <Button
                                                    mode="contained"
                                                    buttonColor="#00a3e5"
                                                    textColor="#fff"
                                                    style={styles.modalButton}
                                                    onPress={() => handlePressUpdate("delivery")}
                                                >
                                                    Accept
                                                </Button>
                                                <Button
                                                    mode="contained"
                                                    buttonColor="#f44336"
                                                    textColor="#fff"
                                                    style={styles.modalButton}
                                                    onPress={() => handlePressUpdate("rejected")}
                                                >
                                                    Decline
                                                </Button>
                                            </>
                                        ) : (
                                            <Button
                                                mode="contained"
                                                buttonColor="#00a3e5"
                                                textColor="#fff"
                                                style={styles.modalButton}
                                                onPress={() => handlePressUpdate("completed")}
                                            >
                                                Delivered
                                            </Button>
                                        )}
                                        {/* <Button
                                            mode="outlined"
                                            textColor="#333"
                                            style={[styles.modalButton, { borderColor: '#ccc' }]}
                                            onPress={() => setOpen(false)}
                                        >
                                            Close
                                        </Button> */}
                                    </View>
                                </>
                            )}
                        </Pressable>
                    </Pressable>
                </Modal>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    orderContainer: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        marginHorizontal: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    customerName: { fontSize: 16, fontWeight: '600', color: '#333' },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: { color: '#fff', fontSize: 12, fontWeight: '500' },
    statusPending: { backgroundColor: '#f5a623' },
    statusDelivery: { backgroundColor: '#00a3e5' },
    statusCompleted: { backgroundColor: '#4caf50' },
    itemsContainer: { marginTop: 8, marginBottom: 10 },
    itemText: { fontSize: 14, color: '#555', marginVertical: 2 },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 8,
    },
    dateText: { fontSize: 12, color: '#888' },
    totalText: { fontSize: 16, fontWeight: '700', color: '#00a3e5' },
    emptyText: { textAlign: 'center', marginTop: 20, color: '#555' },

    note: {
        marginTop: 20,
    },
    input: {
        backgroundColor: '#fff',
        fontSize: 16,
        padding: 10,
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modalCard: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    modalTitle: { fontSize: 18, fontWeight: '700', color: '#222' },
    modalSection: { marginBottom: 10 },
    modalLabel: { fontSize: 13, color: '#777', marginBottom: 2 },
    modalValue: { fontSize: 15, color: '#333' },
    modalTotal: { fontWeight: 'bold', color: '#00a3e5', fontSize: 16 },
    modalItems: { marginVertical: 10 },
    modalItemText: { fontSize: 14, color: '#555', marginVertical: 2 },
    modalActions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 16,
        gap: 10,
    },
    modalButton: { marginHorizontal: 4, borderRadius: 8, borderRadius: 30 },
});
