import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function PlaceOrderButton({ label, total = '0.00', onPress }) {
  
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <View>
          <Text style={styles.labelHeader}>{label}</Text>
          <Text>{'Total: ₱' + total.toFixed(2) }</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    zIndex: 1000,
  },
  button: {
    backgroundColor: '#00a3e5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    elevation: 4,
    width: '90%',
    alignSelf: 'center'
  },
  labelHeader: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
