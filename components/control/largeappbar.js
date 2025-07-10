import React, { useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, Menu, Text } from 'react-native-paper';
import { AuthContext } from '../../context/authcontext';
import { useRoute, useNavigation } from '@react-navigation/native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function LargeAppBar({ onLogout }) {

  const navigation = useNavigation();
  const route = useRoute();

  const { userToken } = useContext(AuthContext);
  const [menuVisible, setMenuVisible] = useState(false);

  const handleManageStorePress = () => {
    navigation.navigate('Seller', { });
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <View style={styles.centerContainer}>
          <Text style={styles.title}>Agos</Text>
        </View>
        <View style={{ flexDirection: 'row', marginLeft: 'auto' }}>
          {userToken.role === "store" ? 
            <Appbar.Action
              icon="store-edit"
              color="white"
              onPress={handleManageStorePress}
            />
            :
            null
          }
          <Appbar.Action
            icon="cart"
            color="white"
            onPress={() => console.log('Cart')}
          />
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Appbar.Action
                icon="dots-vertical"
                color="white"
                onPress={() => setMenuVisible(true)}
              />
            }
          >
            <Menu.Item
              onPress={() => console.log('Profile clicked')}
              title="Profile"
              icon={() => (
                <MaterialCommunityIcons
                  name="account"
                  size={20}
                  color="#000"
                />
              )}
            />
            <Menu.Item
              onPress={() => console.log('Settings clicked')}
              title="Settings"
              icon={() => (
                <MaterialCommunityIcons name="cog" size={20} color="#000" />
              )}
            />
            <Menu.Item
              onPress={onLogout}
              title="Logout"
              icon={() => (
                <MaterialCommunityIcons name="logout" size={20} color="#000" />
              )}
            />
          </Menu>
        </View>
      </Appbar.Header>

      <View style={styles.largeSection}>
        <Text style={styles.welcome}>{"Welcome, " + userToken.name.split(" ")[0] + "!"}</Text>
        <Text style={styles.subtitle}>Let’s sell something today 🚚</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 0,
  },
  header: {
    backgroundColor: '#00a3e5',
    height: 80,
  },
  centerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'left',
    alignSelf: 'flex-start',
    paddingLeft: 20,
  },
  largeSection: {
    backgroundColor: '#00a3e5',
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
  },
});
