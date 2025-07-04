import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import StoreButton from './storebutton';

export default function LabeledFlatList({ label, data, onPress }) {

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      {data !== null ?
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <StoreButton store={item} onPress={onPress} />
          )}
          contentContainerStyle={styles.listContent}
        />
        :
        <Text style={{alignSelf: 'center', marginVertical: 20}}>No nearby wholesellers yet, be one if you want!</Text>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 0,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    marginLeft: 12,
  },
  listContent: {
    paddingHorizontal: 12,
  },
});
