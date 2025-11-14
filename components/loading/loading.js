import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

export default function Loading({ message = "Loading" }) {
  return (
    <View style={styles.container}>
      {/* <ActivityIndicator size="large" color="#007AFF" /> */}
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', // optional
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    color: '#555',
  },
});
