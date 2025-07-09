import React, { useContext, useState, useEffect } from "react";
import { View, StyleSheet, Image, ImageBackground, ScrollView, FlatList } from "react-native";
import { Divider, Menu, Appbar, Searchbar, List } from "react-native-paper";
import { AuthContext } from "../../context/authcontext";
import { LocationContext } from "../../context/LocationProvider";
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Button from '../../components/control/button';
import LargeAppBar from "../../components/control/largeappbar";
import LabeledList from "../../components/control/labeledlist";
import LabeledFlatList from "../../components/control/labeledflatlist";

export default function HomeScreen() {
  const { logout } = useContext(AuthContext);
  const [visible, setVisible] = useState(false);
  const { location: userLocation, refreshLocation } = useContext(LocationContext);
  const navigation = useNavigation();
  const [stores, setStores] = useState([]);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleStorePress = (store) => {
    navigation.navigate('Store', { store });
  };

  useEffect(() => {
    if (!userLocation) return;
  
    if (userLocation.latitude && userLocation.longitude) {
      fetch(`http://192.168.1.10:3000/stores/nearby?lat=${userLocation.latitude}&lng=${userLocation.longitude}`)
        .then(res => res.json())
        .then(data => {
          setStores(data);
          
        })
        .catch(err => console.error('Fetch error:', err));
    }
  }, [userLocation]);
  

  return (
    <>
      <ImageBackground
        // source={{
        //   uri: "https://c8.alamy.com/comp/2H71KP1/philippines-map-administrative-division-separate-regions-color-map-isolated-on-white-background-blank-2H71KP1.jpg",
        // }}
        style={styles.background}
        resizeMode="cover"
        blurRadius={1}
      >       
        <LargeAppBar onMenuPress={openMenu} />    

        <Searchbar
          placeholder="Let's order!"
          style={styles.searchbar}
          // onChangeText={}
          // value={searchQuery}
    />
        <View style={styles.container}>
          <View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.menu}
            >
              <Button
                label='Delivery'
                onPress={() => console.log("Pressed")}
                children={<MaterialCommunityIcons name="car" size={20} color="white" />}
              />
              <Button
                label='Sari Note'
                onPress={() => console.log("Pressed")}
                children={<MaterialCommunityIcons name="notebook-edit" size={20} color="white" />}
              />
              <Button
                label='History'
                onPress={() => console.log("Pressed")}
                children={<MaterialCommunityIcons name="history" size={20} color="white" />}
              />
            </ScrollView>
          </View>
                  
          <LabeledFlatList  
            label="Nearby Wholesellers"
            data={stores}
            onPress={handleStorePress}
          />

          <LabeledList label="Previous Orders"/>
          

          <View style={styles.adContainer}>
            <Image
              source={{
                uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEO1oMEV1yGVQz6l8J8RS0_zyL8wq8QlVrwIZVDezbT9MT8Uu0xvW-4TL_qNGDs6HAIUI",
              }}
              style={styles.adImage}
              resizeMode="stretch"
            />
          </View>
        </View>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 12,
  },   
  background: {
    flex: 1,
    justifyContent: "center",
    lignItems: "center",
  },
  menu: {
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    gap: 12,
  },  
  title: {
    fontSize: 26,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    color: "#888",
  },
  logoutBtn: {
    marginTop: 20,
    padding: 6,
  },
  adContainer: {
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ccc",
  },  
  adImage: {
    width: "80%",
    height: 60,
  },
  searchbar: {
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 100,
  },
  list: {
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  
  
  
  
});
