import React from 'react';
import { FlatList, View, StyleSheet, Image, Text } from 'react-native';
import { List, Divider } from 'react-native-paper';

export default function LabeledList({
  label,
  data,
  noTitle = "No Deliveries Yet",
  noDescription = "Previous deliveries will be shown here. Start ordering now!",
  icon,
  image,
  showLeft = true,
  customComponent: CustomComponent,
  onQuantityChange,
}) {
  const renderLeft = (item) => {
    if (!showLeft) return null;
    if (item.photo_url) {
      return <Image source={{ uri: item.photo_url }} style={styles.image} />;
    } else if (icon) {
      return <List.Icon icon={icon} />;
    } else {
      return <List.Icon icon="truck-delivery-outline" />;
    }
  };

  const renderItem = ({ item }) => {
    if (CustomComponent) {
      return (
        <CustomComponent
          id={item.id}
          title={item.title}
          description={item.description}
          imageUrl={item.photo_url}
          price={item.price}
          onQuantityChange={onQuantityChange}
        />
      );
    }

    return (
      <>
        <List.Item
          title={item.title}
          description={item.description}
          left={() => renderLeft(item)}
        />
        <Divider />
      </>
    );
  };

  const renderEmpty = () => (
    <View>
      <List.Item title={noTitle} description={noDescription} left={renderLeft} />
      <Divider />
    </View>
  );

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <FlatList
        style={styles.list}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  list: {
    width: '100%',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    marginLeft: 4,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginRight: 10,
  },
});
