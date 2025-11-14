import React, { useState } from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function CustomStoreListItem({
  id,
  title,
  description,
  imageUrl,
  price,
  onQuantityChange,
  isAvailable,
}) {
  const [quantity, setQuantity] = useState(0);

  const increase = () => {
    if (!isAvailable) return;
    const newQty = quantity + 1;
    setQuantity(newQty);
    onQuantityChange?.(id, newQty, price, title);
  };

  const decrease = () => {
    if (!isAvailable) return;
    const newQty = quantity > 0 ? quantity - 1 : 0;
    setQuantity(newQty);
    onQuantityChange?.(id, newQty, price, title);
  };

  return (
    <View
      style={[
        styles.container,
        !isAvailable && styles.unavailableContainer,
      ]}
    >
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : (
        <View style={[styles.image, { backgroundColor: "#ddd" }]} />
      )}

      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            !isAvailable && styles.unavailableText,
          ]}
        >
          {title}
        </Text>
        <Text
          style={[
            styles.price,
            !isAvailable && styles.unavailableText,
          ]}
        >
          ₱{Number(price).toFixed(2)}
        </Text>
        <Text
          style={[
            styles.description,
            !isAvailable && styles.unavailableText,
          ]}
        >
          {description}
        </Text>

        {isAvailable ? (
          <View style={styles.stepper}>
            <TouchableOpacity
              onPress={decrease}
              style={styles.stepperButton}
            >
              <Text style={styles.stepperText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.quantity}>{quantity}</Text>
            <TouchableOpacity
              onPress={increase}
              style={styles.stepperButton}
            >
              <Text style={styles.stepperText}>＋</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.unavailableLabel}>Unavailable</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 2,
    alignItems: "center",
    gap: 10,
  },
  unavailableContainer: {
    opacity: 0.5,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  content: {
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
    width: "100%",
  },
  price: {
    fontSize: 15,
    fontWeight: "500",
    color: "#444",
    width: "100%",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    width: "100%",
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
    width: "100%",
  },
  stepperButton: {
    backgroundColor: "#e0e0e0",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  stepperText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  quantity: {
    fontSize: 16,
    minWidth: 24,
    textAlign: "center",
    width: "20%",
  },
  unavailableText: {
    color: "#999",
  },
  unavailableLabel: {
    marginTop: 8,
    color: "#b00",
    fontWeight: "600",
  },
});
