import React, { useState } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function CustomeStoreListItem({ id, title, description, imageUrl, price, onQuantityChange }) {
  const [quantity, setQuantity] = useState(0);

  const increase = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
    onQuantityChange?.(id, newQty, price, title);
  };

  const decrease = () => {
    const newQty = quantity > 0 ? quantity - 1 : 0;
    setQuantity(newQty);
    onQuantityChange?.(id, newQty, price, title);
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.price}>₱{Number(price).toFixed(2)}</Text>
        <Text style={styles.description}>{description}</Text>

        <View style={styles.stepper}>
          <TouchableOpacity onPress={decrease} style={styles.stepperButton}>
            <Text style={styles.stepperText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{quantity}</Text>
          <TouchableOpacity onPress={increase} style={styles.stepperButton}>
            <Text style={styles.stepperText}>＋</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    alignItems: 'center',
    gap: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  content: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: '500',
    color: '#444',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  stepperButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  stepperText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 16,
    minWidth: 24,
    textAlign: 'center',
  },
});
