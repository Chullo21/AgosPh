import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ImageBackground, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Button, TextInput } from 'react-native-paper';
import { AuthContext } from '../../context/authcontext';
import Constants from 'expo-constants';
import AppBar from '../../components/control/appbar';
import BackgroundPhoto from "../../assets/Beige Blue Modern Abstract Line Shape Bookmark.png";
import LabeledList from '../../components/control/labeledlist';
import CustomConfirmOrderListItem from '../../components/control/customconfirmorderlistitem';

export default function ConfirmOrderScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { API_BASE_URL } = Constants.expoConfig.extra;
    const { userToken, user } = useContext(AuthContext);

    const { store, orders, total } = route.params || {};

    const [customerNote, setCustomerNote] = useState('');
    const [noteModalVisible, setNoteModalVisible] = useState(false);

    if (!store || !orders) {
        return (
            <View style={styles.centered}>
                <Text style={styles.loadingText}>Loading order details...</Text>
            </View>
        );
    }

    const handleBackPress = () => navigation.goBack();

    const handleOrderPress = () => {
        const order = {
            customerId: user.id,
            customerName: user.name,
            storeId: store.id,
            customerNote,
            items: orders.map(item => ({
                menuItemId: item.id,
                quantity: item.quantity,
            })),
        };

        fetch(`${API_BASE_URL}/api/Order/placeorder`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${userToken}`
            },
            body: JSON.stringify(order),
        })
        .then(res => res.json())
        .then(() => navigation.navigate('MonitorOrder', store))
        .catch(err => {
            console.error("Error placing order:", err);
            alert("Failed to place order.");
        });
    };

    return (
        <ImageBackground source={BackgroundPhoto} style={styles.background}>
            <View style={styles.overlay}>
                <AppBar title="Confirm Order" onBackPress={handleBackPress} />

                <View style={styles.addressContainer}>
                    <Text style={styles.addressLabel}>Delivery Address</Text>
                    <Text style={styles.addressText}>{user.address || "No address set"}</Text>
                </View>

                <View style={styles.content}>
                    <LabeledList
                        label="Your Order"
                        data={orders}
                        noTitle="Unavailable"
                        noDescription="Shop has not updated its menu yet."
                        renderItem={({ item }) => (
                            <CustomConfirmOrderListItem
                                name={item.name}
                                quantity={item.quantity}
                                price={item.price}
                            />
                        )}
                    />
                </View>

                {/* Sticky Footer */}
                <View style={styles.footerRow}>
                    <Button
                        mode="outlined"
                        onPress={() => setNoteModalVisible(true)}
                        icon="note-text"
                        style={[styles.noteButton, { borderColor: 'black', borderWidth: 1 }]}
						textColor='black'
                    >
                        Note
                    </Button>

                    <Button
                        mode="contained"
                        onPress={handleOrderPress}
                        style={styles.placeOrderButton}
						buttonColor='white'
						textColor='#00a3e5'
                    >
                        Place Order ₱{total.toFixed(2)}
                    </Button>
                </View>

                <Modal
                    visible={noteModalVisible}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setNoteModalVisible(false)}
                >
                    <KeyboardAvoidingView
                        style={styles.modalOverlay}
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                    >
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add a Note</Text>
                            <TextInput
                                label="Customer Note"
                                value={customerNote}
                                onChangeText={setCustomerNote}
                                mode="outlined"
                                multiline
                                numberOfLines={4}
                                style={styles.noteInput}
								outlineColor="#00a3e5"
    							activeOutlineColor="#00a3e5"
                            />
                            <View style={styles.modalButtons}>
                                <Button onPress={() => setNoteModalVisible(false)} mode="outlined" textColor='black' style={{ marginRight: 10 }}>
                                    Cancel
                                </Button>
                                <Button onPress={() => setNoteModalVisible(false)} mode="contained" buttonColor='#00a3e5'>
                                    Save
                                </Button>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </Modal>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: { flex: 1 },
    overlay: { flex: 1 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
    loadingText: { fontSize: 16, color: '#666' },
    content: { flex: 1, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 100 }, // paddingBottom avoids overlapping with footer
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'absolute',
        bottom: 40,
        width: '90%',
        alignSelf: 'center',
        zIndex: 1000,
    },
    noteButton: { flex: 1, marginRight: 10 },
    placeOrderButton: { flex: 2 },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 20,
    },
    modalContent: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
    },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
    noteInput: { marginBottom: 16 },
    modalButtons: { flexDirection: 'row', justifyContent: 'flex-end' },

    addressContainer: {
        backgroundColor: '#f5f5f5', // light grey card background
        padding: 12,
        borderRadius: 8,
        marginHorizontal: 16,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // Android shadow
    },
    addressLabel: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#333',
        marginBottom: 4,
    },
    addressText: {
        fontSize: 16,
        color: '#555',
        lineHeight: 20,
    },

});
