import React from 'react';
import { FlatList, View, StyleSheet, Image, Text } from 'react-native';
import { List, Divider } from 'react-native-paper';
import CustomLoading from './customloading';

export default function LabeledList({
    label,
    data,
    noTitle = "",
    noDescription = "",
    icon,
    image,
    showLeft = true,
    renderItem = null,
    isLoading = false
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
    
    const renderEmpty = () => (
        <View>
            <List.Item title={noTitle} description={noDescription} left={renderLeft} />
            <Divider />
        </View>
    );

    return isLoading ? (
        <CustomLoading />
    ) : (
        <View style={styles.container}>
            {label ? <Text style={styles.label}>{label}</Text> : null}
            <FlatList
                style={styles.list}
                contentContainerStyle={styles.listContent}
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
        marginTop: 8,
    },
    listContent: {
        paddingBottom: 200,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        marginLeft: 4,
        width: "100%",
        color: 'black'
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 6,
        marginRight: 10,
    },
});
