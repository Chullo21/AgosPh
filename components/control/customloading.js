import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

export default function CustomLoading() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="black" />
      {/* <Text style={styles.text}>Loading...</Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        marginTop: 0,
        fontSize: 16,
        color: '#666',
        width: "100%",
        
    },
});
