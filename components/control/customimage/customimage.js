import React from 'react';
import { Image, StyleSheet } from 'react-native';

export default function CustomImage({ source, style, resizeMode = 'contain' }) {
  return (
    <Image
      source={source}
      style={[styles.image, style]}
      resizeMode={resizeMode}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
});
