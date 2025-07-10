import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import LabeledList from '../../components/control/labeledlist';
import CustomConfirmListItem from '../../components/control/customconfirmorderlistitem';
import PlaceOrderButton from '../../components/control/placeorderbutton';

export default function ConfirmOrderScreen() {
    const navigation = useNavigation();
    const route = useRoute();
  
    const params = route.params || {};
    const { store, orders, total } = params;
  
    if (!store || !orders) {
      return (
        <View style={styles.wrapper}>
          <Text>Loading order details...</Text>
        </View>
      );
    }
  
    const handleBackPress = () => {
      navigation.goBack();
    };
  
    return (
      <View style={styles.wrapper}>
        <Appbar.Header style={{ backgroundColor: 'transparent', elevation: 0 }}>
          <Appbar.BackAction onPress={handleBackPress} />
          <Appbar.Content title={store.name} />
        </Appbar.Header>
            
        <LabeledList
            label="Your Order:"
            data={orders}
            noTitle="Unavailable"
            noDescription="Shop has not updated its menu yet."
            renderItem={({ item }) => (
                <CustomConfirmListItem
                    name={item.name}
                    quantity={item.quantity}
                    price={item.price}
                />
            )}
            />
        
        <PlaceOrderButton
                  label="Checkout Order"
                  total={total}
                //   onPress={handleOrderPress}
                />
      </View>
    );
  }
  

const styles = StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: '#fff',
    }, 
});