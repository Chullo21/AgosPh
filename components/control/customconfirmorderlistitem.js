import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CustomConfirmListItem({ name, quantity, price }) {
  const total = quantity * price;

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.details}>
          ₱{price.toFixed(2)} x {quantity}
        </Text>
      </View>
      <Text style={styles.total}>₱{total.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  left: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  details: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  total: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});
