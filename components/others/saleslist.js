import React from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Assuming you use Expo

const OrderItem = ({ order, items }) => {
    const dateStr = new Date(order.orderDate).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
    });

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.customerName}>{order.customerName}</Text>
                    {/* <Text style={styles.orderId}>Order #{order.id}</Text> */}
                </View>
                <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.itemContainer}>
                {items.filter(i => i.orderId === order.id).map((product, index) => (
                    <Text key={index} style={styles.productText}>
                        • {product.quantity}x {product.productName}
                    </Text>
                ))}
            </View>

            <View style={styles.footer}>
                <View style={styles.timeContainer}>
                    <MaterialCommunityIcons name="clock-outline" size={14} color="#666" />
                    <Text style={styles.timeText}> {dateStr}</Text>
                </View>
                <Text style={styles.totalAmount}>₱{order.totalAmount.toFixed(2)}</Text>
            </View>
        </View>
    );
};

export default function SalesList({ data }) {
    if (!data?.orders || data.orders.length === 0) {
        return (
            <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No sales found for this period.</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={data.orders}
            renderItem={({ item }) => <OrderItem order={item} items={data.items} />}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listPadding}
        />
    );
}

const styles = StyleSheet.create({
    listPadding: {
        padding: 16,
        paddingBottom: 100,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        borderLeftWidth: 4,
        borderLeftColor: '#00a3e5', // Matches your theme
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    customerName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    orderId: {
        fontSize: 12,
        color: '#888',
    },
    statusBadge: {
        backgroundColor: '#e1f5fe',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusText: {
        fontSize: 10,
        color: '#00a3e5',
        fontWeight: '700',
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginVertical: 12,
    },
    itemContainer: {
        marginBottom: 12,
    },
    productText: {
        fontSize: 14,
        color: '#555',
        marginBottom: 2,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeText: {
        fontSize: 12,
        color: '#666',
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#00a3e5',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        color: 'black',
        fontSize: 16,
    }
});