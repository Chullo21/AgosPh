import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import CustomImage from '../../components/control/customimage/customimage';
import LabeledList from '../../components/control/labeledlist';
import CustomListItem from '../../components/control/customlistitem';
import Button from '../../components/control/button';

export default function StoreScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { store } = route.params;

  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState({});

  useEffect(() => {
    if (store?.id) {
      fetch(`http://192.168.1.10:3000/stores/${store.id}/menu-items`)
        .then(res => res.json())
        .then(data => setMenuItems(data))
        .catch(err => console.error('Fetch error:', err));
    }
  }, [store?.id]);

  const handleQuantityChange = (id, quantity, price) => {
    setCart(prev => {
      const updated = { ...prev };
      if (quantity > 0) {
        updated[id] = { quantity, price: parseFloat(price) };
      } else {
        delete updated[id];
      }
      return updated;
    });
  };

  const total = Object.values(cart).reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const handleBackPress = () => {
    navigation.navigate('Home');
  };

  if (!store) {
    return (
      <View style={styles.centered}>
        <Text>No store data available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <Appbar.Header style={{ backgroundColor: 'transparent', elevation: 0 }}>
        <Appbar.BackAction onPress={handleBackPress} />
        <Appbar.Content title={store.name} />
      </Appbar.Header>

      <View style={styles.logoContainer}>
        <CustomImage
          source={{ uri: store.logo_url }}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.orderContainer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>₱{total.toFixed(2)}</Text>
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            mode="contained"
            style={styles.orderButton}
            label="Confirm Order"
          />
        </View>
      </View>

      <LabeledList
        label="Their products"
        data={menuItems}
        noTitle="Unavailable"
        noDescription="Shop has not updated its menu yet."
        showLeft={false}
        customComponent={CustomListItem}
        onQuantityChange={handleQuantityChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  logoContainer: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  orderContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonWrapper: {
    alignItems: 'center',
  },
  orderButton: {
    width: '80%',
    borderRadius: 6,
  },
});
