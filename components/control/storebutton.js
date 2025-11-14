import React from "react";
import { TouchableOpacity, Image, Text, StyleSheet } from "react-native";
import Loading from "../loading/loading";

export default function StoreButton({ store, onPress }) {

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(store)}>
      {store.logo_url ? (
        <Image
          source={{ uri: store.logo_url }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : <Loading message="Photo here"/>}
      <Text style={styles.text} numberOfLines={1}>{store.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: 12,
    alignItems: "center",
    width: 100,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
  text: {
    marginTop: 6,
    fontSize: 14,
    textAlign: 'center',
    width: "100%",
    color: '#001f3f',
    fontWeight: 'bold',
  },
});
