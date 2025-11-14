import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Divider } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function CustomManageStoreListItem({ title, price, description, onPress, available }) {
  return (
    <>
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <View style={styles.container}>
          <View style={styles.left}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.name}>{title}</Text>
              <MaterialCommunityIcons
                  name={available ? 'check-circle' : 'close-circle'}
                  size={18}
                  color={available ? 'green' : 'red'}
                  style={styles.icon}
              />
            </View>
            <Text style={styles.details}>{description}</Text>
          </View>
          <Text style={styles.total}>₱{price.toString()}</Text>
        </View>
      </TouchableOpacity>
      <Divider />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  left: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    width: "100%",
  },
  details: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
    width: "100%",
  },
  total: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 10,
    width: "100%",
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 6,
    marginTop: 2,
  },
  
});
