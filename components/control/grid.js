import React, { useState, useMemo, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    RefreshControl,
} from 'react-native';
import { List, Searchbar } from 'react-native-paper';
import CustomLoading from './customloading';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 36) / 2;

export default function Grid({
    label,
    data,
    onPress,
    onRefresh,          // ✅ add refresh handler
    isloading = false,
    refreshing = false, // ✅ add refreshing state
    noTitle = '',
    noDescription = '',
}) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredData = useMemo(() => {
        if (!searchQuery.trim()) return data;
        return data.filter((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, data]);

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <List.Item title={noTitle} description={noDescription} />
        </View>
    );

    const renderItem = useCallback(
        ({ item }) => (
            <TouchableOpacity
                style={styles.card}
                onPress={() => onPress && onPress(item)}
                activeOpacity={0.8}
            >
                <Image
                    source={{
                        uri: item.photoUrl
                            ? item.photoUrl
                            : 'https://res.cloudinary.com/dmoggblzj/image/upload/v1760425147/agos/store/lbyzlczkizvtgeabxicd.png',
                    }}
                    style={styles.image}
                />
                <View style={styles.info}>
                    <Text style={styles.name} numberOfLines={1}>
                        {item.name}
                    </Text>
                    <Text
                        style={[
                            styles.status,
                            {
                                color:
                                    item.status?.toLowerCase() === 'open'
                                        ? '#28a745'
                                        : '#dc3545',
                            },
                        ]}
                    >
                        {item.status?.toLowerCase() === 'open'
                            ? 'Open'
                            : 'Closed'}
                    </Text>
                </View>
            </TouchableOpacity>
        ),
        [onPress]
    );

    return (
        <View style={styles.container}>
            {label ? <Text style={styles.title}>{label}</Text> : null}

            <Searchbar
                placeholder="Search store..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchbar}
                inputStyle={{ fontSize: 14 }}
            />

            {isloading ? (
                <CustomLoading />
            ) : (
                <FlatList
                    data={filteredData}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[
                        styles.contentContainer,
                        !filteredData?.length && { flex: 1 },
                    ]}
                    ListEmptyComponent={renderEmpty}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor="#007AFF"
                            colors={['#007AFF']}
                        />
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        paddingHorizontal: 12,
        paddingTop: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 10,
        marginLeft: 4,
    },
    searchbar: {
        marginBottom: 10,
        borderRadius: 25,
        elevation: 2,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    contentContainer: {
        paddingBottom: 20,
    },
    card: {
        width: ITEM_WIDTH,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    image: {
        width: '100%',
        height: 120,
        resizeMode: 'cover',
    },
    info: {
        padding: 8,
    },
    name: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    status: {
        fontSize: 12,
        marginTop: 4,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 200,
    },
});
