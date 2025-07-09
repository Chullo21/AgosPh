import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import CustomImage from '../../components/control/customimage/customimage';
import LabeledList from '../../components/control/labeledlist';
import CustomStoreListItem from '../../components/control/customstorelistitem';
import PlaceOrderButton from '../../components/control/placeorderbutton';

export default function StoreScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { store } = route.params;

  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState({});
  const [orders, setOrders] = useState([]);

  const handleOrderPress = () => {
    console.log('Navigating with orders:', orders);
    navigation.navigate('ConfirmOrder', { orders, store, total });
  };

  const handleQuantityChange = (id, quantity, price, pName) => {
    setCart(prev => {
      const updated = { ...prev };
  
      if (quantity > 0) {
        updated[id] = { quantity, price: parseFloat(price), pName };
      } else {
        delete updated[id];
      }
  
      const newOrders = Object.entries(updated).map(([key, item]) => ({
        id: key,
        quantity: item.quantity,
        price: item.price,
        name: item.pName
      }));
  
      setOrders(newOrders);
  
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

  useEffect(() => {
    if (store?.id) {
      fetch(`http://192.168.1.10:3000/stores/${store.id}/menu-items`)
        .then(res => res.json())
        .then(data => setMenuItems(data))
        .catch(err => console.error('Fetch error:', err));
    }
  }, [store?.id]);

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

      {total ? 
        <PlaceOrderButton
          label="Place Order"
          total={total}
          onPress={handleOrderPress}
        />
        :
        null
      }

<LabeledList
  label="Available products"
  data={menuItems}
  noTitle="Unavailable"
  noDescription="Shop has not updated its menu yet."
  showLeft={true}
  renderItem={({ item }) => (
    <CustomStoreListItem
      id={item.id}
      title={item.title}
      description={item.description}
      imageUrl={item.photo_url}
      price={item.price}
      onQuantityChange={handleQuantityChange}
    />
  )}
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
});
