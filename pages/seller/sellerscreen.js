import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ScrollView, Modal, StyleSheet, Pressable} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { AuthContext } from '../../context/authcontext';

import { Appbar, TextInput, Checkbox, Button } from "react-native-paper";


import CustomManageStoreListItem from '../../components/control/custommanagestorelistitem';

export default function SellerScreen() {
    
    const navigation = useNavigation();

    const { userToken } = useContext(AuthContext);

    const [store, setStore] = useState({});
    const [storeMenu, setStoreMenu] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [open, setOpen] = useState(false);
    const [available, setAvailable] = useState(false);
    
    const handleBackPress = () => {
        navigation.goBack();
    };

    const handleEditPress = (item) => {
        setSelectedItem(item);
        setOpen(true);
    };

    const fetchStoreData = async () => {
        try {
          const res = await fetch(`http://192.168.1.10:3000/users/${userToken.id}/store`);
          const data = await res.json();
          setStore(data);
        } catch (err) {
          console.error('Fetch error (store):', err);
        }
      };
      
    const fetchStoreMenu = async (storeId) => {
        try {
            const res = await fetch(`http://192.168.1.10:3000/stores/${storeId}/menu-items`);
            const data = await res.json();
            setStoreMenu(data);
        } catch (err) {
            console.error('Fetch error (menu):', err);
        };
    };
      
    useEffect(() => {
        if (userToken?.id) {
          fetchStoreData();
        }
    }, [userToken]);
      
    useEffect(() => {
        if (store.id) {
          fetchStoreMenu(store.id);
        }
    }, [store.id]);

    useEffect(() => {
        console.log(selectedItem);
        if (selectedItem) {
            setAvailable(selectedItem.isAvailable);
        }
    },[selectedItem]);
      
    return (
        <View>
            <Appbar.Header style={{ backgroundColor: 'transparent', elevation: 0 }}>
                <Appbar.BackAction onPress={handleBackPress} />
                <Appbar.Content title={store?.name || "Loading..."} />
            </Appbar.Header>
            {storeMenu && storeMenu.length > 0 ? (
                <ScrollView contentContainerStyle={{ paddingBottom: 200 }}>
                    {storeMenu.map((item) => (
                        <CustomManageStoreListItem
                            key={item.id}
                            title={item.title}
                            price={item.price}
                            description={item.description}
                            onPress={() => handleEditPress(item)}
                            available={item.isAvailable}
                        />
                    ))}
                </ScrollView>
              
            ) : (
                <Text style={{ padding: 20, textAlign: 'center' }}>No menu items found.</Text>
            )}

            <Modal
                visible={open}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setOpen(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{selectedItem ? selectedItem.title : "Loading..."}</Text>
                        <View style={{paddingBottom: 10}}>
                            <Button
                                mode="outlined"
                                onPress={() => setAvailable(!available)}
                                icon={available ? 'check' : 'close'}
                                textColor={available ? 'green' : 'red'}
                                style={{
                                    borderColor: available ? 'green' : 'red', marginTop: 10,
                                }}
                            >
                                {available ? 'Available' : 'Not Available'}
                            </Button>

                        </View>
                        <View>
                            <Text>Item Name: </Text>
                            <TextInput placeholder={selectedItem ? selectedItem.title : "Loading"} ></TextInput>
                        </View>
                        <View>
                            <Text>Price: </Text>
                            <TextInput placeholder={selectedItem ? selectedItem.price : "Loading"}></TextInput>
                        </View>
                        <View>
                            <Text>Description: </Text>
                            <TextInput
                                placeholder={selectedItem ? selectedItem.description : "Loading"}>                             
                            </TextInput>
                        </View>
                        
                        <View style={styles.modalButtonRow}>
                            <Pressable
                                style={[styles.modalButton, { backgroundColor: '#4CAF50' }]}
                                onPress={() => {
                                    setOpen(false);
                                }}
                            >
                                <Text style={styles.modalButtonText}>Save</Text>
                            </Pressable>

                            <Pressable
                                style={[styles.modalButton, { backgroundColor: '#f44336' }]}
                                onPress={() => {
                                    setOpen(false);
                                }}
                            >
                                <Text style={styles.modalButtonText}>Close</Text>
                            </Pressable>
                        </View>

                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 50,
      },
    modalContent: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
      },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalItemTitle: {
        fontSize: 16,
        marginBottom: 5,
    },
    modalItemDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    modalItemPrice: {
        fontSize: 16,
        ontWeight: '600',
        marginBottom: 20,
    },
    modalButtonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
      },
      
      modalButton: {
        flex: 1,
        paddingVertical: 10,
        marginHorizontal: 5,
        borderRadius: 6,
        alignItems: 'center',
      },
      
      modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
      },
      
  });
  