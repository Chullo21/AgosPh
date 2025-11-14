import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function FloatingOrderButton({ onPress, itemCount = 0, totalAmount = 0 })
{
    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
          <MaterialCommunityIcons name="truck-delivery" size={24} color="#001f3f" />
            <View style={styles.details}>
              <Text style={styles.text}>{itemCount} Items</Text>
              {/* <Text style={styles.text}>₱{totalAmount.toFixed(2)}</Text> */}
            </View>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: '#00a3e5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    zIndex: 100,
    width: 'auto',
  },
  details: {
    marginLeft: 10,
  },
  text: {
    color: '#001f3f',
    fontWeight: 'bold',
    fontSize: 12,
    width: "100%",
  },
});
