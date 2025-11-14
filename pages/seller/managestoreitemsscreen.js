import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	ScrollView,
	Modal,
	Pressable,
	StyleSheet,
	TouchableOpacity,
	Alert,
	ImageBackground,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { AuthContext } from "../../context/authcontext";
import Constants from "expo-constants";
import CustomLoading from "../../components/control/customloading";
import AppBar from "../../components/control/appbar";
import PhotoUploader from "../../components/control/photouploader";
import BackgroundPhoto from "../../assets/Beige Blue Modern Abstract Line Shape Bookmark.png";

export default function ManageStoreItemsScreen({ route, navigation }) {
	const { API_BASE_URL } = Constants.expoConfig.extra;
	const { storeId, storeName } = route.params; 
	const { userToken, user } = React.useContext(AuthContext);

	const [items, setItems] = useState([]);
	const [selectedItem, setSelectedItem] = useState([]);
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const headers = {
				"method": "GET",
				"Content-Type": "application/json",
				"Authorization": `Bearer ${userToken}`,
			};

	const handleBackPress = () => navigation.goBack();

	const fetchStoreItems = async () => {
		try {
			setIsLoading(true);
			const res = await fetch(`${API_BASE_URL}/api/Menu?storeId=${storeId}`, {headers});
			if (!res.ok) throw new Error("Failed to fetch store items");
			const data = await res.json();
			setItems(Array.isArray(data) ? data : []);
		} catch (err) {
			console.error("Fetch error:", err);
			setItems([]);
		} finally {
			setIsLoading(false);
		}
    };

	const uploadPhoto = async (uri) => {
        if (!uri || uri.startsWith("http")) return uri;
        const formData = new FormData();
        formData.append("file", {
            uri,
            type: "image/jpeg",
            name: `${storeName}.jpg`
        });

        const res = await fetch(
            `${API_BASE_URL}/api/Upload/upload?folderName=menuitem`,
            {
                method: "POST",
                body: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${userToken}`,
                    "Roles": `${user.role}`
                }
            }
        );

        if (!res.ok) throw new Error(`${res.message}`);
        
        return await res.text();
    };

	const handleUpsertMenuPress = async () => {
		if (!selectedItem) return;

		try {
			let photoUrl = selectedItem.photoUrl;
			if (photoUrl && !photoUrl.startsWith("http")) {
				photoUrl = await uploadPhoto(photoUrl);
			}

			const payload = {
				...selectedItem,
				photoUrl,
				storeId,
				price: Number(selectedItem.price) || 0,
				isAvailable: selectedItem.isAvailable ?? true,
			};

			const isUpdate = !!selectedItem.id;
			const url = isUpdate
				? `${API_BASE_URL}/api/Menu/${selectedItem.id}`
				: `${API_BASE_URL}/api/Menu`;
			const method = isUpdate ? "PUT" : "POST";

			const res = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				Authorization: `Bearer ${userToken}`,
				body: JSON.stringify(payload),
			});

			if (!res.ok) throw new Error(`${isUpdate ? "Update" : "Add"} failed`);

			setOpen(false);
			setSelectedItem(null);
			await fetchStoreItems();
		} catch (err) {
			console.error(err);
			Alert.alert("Error", "Failed to save item.");
		}
	};

	const handleDeleteMenuItemPress = () => {
		if (!selectedItem?.id) return;

		Alert.alert(
			"Delete item",
			`Are you sure you want to delete "${selectedItem.title}"?`,
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Delete",
					style: "destructive",
					onPress: async () => {
						try {
							const res = await fetch(
								`${API_BASE_URL}/api/Menu/deletemenuitem/${selectedItem.id}`,
								{ method: "DELETE" }
							);
							if (!res.ok) throw new Error(`Failed to delete (${res.status})`);
							console.log("Menu item deleted successfully");
							setOpen(false);
							setSelectedItem(null);
							await fetchStoreItems();
						} catch (err) {
							console.error("Delete error:", err);
							Alert.alert("Error", "Failed to delete item. See console for details.");
						}
					},
				},
			]
		);
	};

	const handleEditPress = (item) => {
		setSelectedItem({
			...item,
			price: item.price != null ? String(item.price) : "",
			isAvailable: item.isAvailable ?? true,
		});
		setOpen(true);
	};

	const handleAddNew = () => {
		setSelectedItem({
			title: "",
			description: "",
			price: "",
			photoUrl: "",
			isAvailable: true,
		});
		setOpen(true);
	};

	useEffect(() => {
		fetchStoreItems();
	}, []);

	const renderItem = (item) => {
		const price = item.price != null ? Number(item.price) : 0;
		return (
			<TouchableOpacity
				key={item.id}
				style={styles.itemCard}
				onPress={() => handleEditPress(item)}
			>
				<View style={styles.itemHeader}>
					<Text style={styles.itemTitle}>{item.title}</Text>
					<Text
						style={[
							styles.itemStatus,
							{ color: item.isAvailable ? "#4CAF50" : "#f44336" },
						]}
					>
						{item.isAvailable ? "Available" : "Unavailable"}
					</Text>
				</View>

				<Text style={styles.itemDesc}>
					{item.description || "No description provided."}
				</Text>

				<View style={styles.itemFooter}>
					<Text style={styles.itemPrice}>₱{price.toFixed(2)}</Text>
					<Text style={styles.itemSub}>
						Tap to {item.id ? "edit" : "add"}
					</Text>
				</View>
			</TouchableOpacity>
		);
	};

	return (
		<ImageBackground source={BackgroundPhoto} style={{ flex: 1 }}>
			<View style={{ flex: 1 }}>
				<AppBar
					title={storeName}
					onBackPress={handleBackPress}
					// actionIcon="plus"
					// onActionPress={handleAddNew}
					actions={[
						{ icon: "plus", onPress: handleAddNew },
						{ icon: "pencil", onPress: null },
					]}
				/>

				{!isLoading ? (
					items && items.length > 0 ? (
						<ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
							{items.map((item) => renderItem(item))}
						</ScrollView>
					) : (
						<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
							<Text style={{ textAlign: "center", fontWeight: "bold", color: "white" }}>
								No items found.
							</Text>
						</View>
					)
				) : (
					<CustomLoading />
				)}

				<Modal
					visible={open}
					transparent
					animationType="slide"
					onRequestClose={() => setOpen(false)}
				>
					<Pressable
						style={styles.modalBackdrop}
						onPress={() => {
							setOpen(false);
							setSelectedItem(null);
						}}
					>
						<View style={styles.modalContainer}>
							<Pressable onPress={(e) => e.stopPropagation()}>
								<Text style={styles.modalTitle}>
									{selectedItem?.id ? "Edit Item" : "Add New Item"}
								</Text>

								<TextInput
									label="Title"
									mode="outlined"
									value={selectedItem?.title ?? ""}
									onChangeText={(text) =>
										setSelectedItem((prev) => ({ ...prev, title: text }))
									}
									style={styles.input}
								/>

								<TextInput
									label="Description"
									mode="outlined"
									value={selectedItem?.description ?? ""}
									onChangeText={(text) =>
										setSelectedItem((prev) => ({ ...prev, description: text }))
									}
									style={styles.input}
								/>

								<TextInput
									label="Price"
									mode="outlined"
									keyboardType="numeric"
									value={String(selectedItem?.price ?? "")}
									onChangeText={(text) =>
										setSelectedItem((prev) => ({ ...prev, price: text }))
									}
									style={styles.input}
								/>

								<PhotoUploader
									value={selectedItem?.photoUrl}
									onPick={(uri) =>
										setSelectedItem((prev) => ({
											...prev,
											photoUrl: uri,
										}))
									}
								/>

								<Button
									mode="outlined"
									onPress={() =>
										setSelectedItem((prev) => ({
											...prev,
											isAvailable: !prev.isAvailable,
										}))
									}
									style={{ marginTop: 8 }}
									buttonColor="transparent"
									textColor="black"
								>
									{selectedItem?.isAvailable
										? "Set as Not Available"
										: "Set as Available"}
								</Button>

								<View style={{ flexDirection: "row", marginTop: 12 }}>
									<Button
										mode="contained"
										onPress={handleUpsertMenuPress}
										style={{ flex: 1 }}
										buttonColor="#00a3e5"
									>
										{selectedItem?.id ? "Update Item" : "Add Item"}
									</Button>

									{selectedItem?.id && (
										<Button
											mode="contained"
											onPress={handleDeleteMenuItemPress}
											style={{
												marginLeft: 8,
												backgroundColor: "#f44336",
												flex: 1,
											}}
										>
											Delete
										</Button>
									)}
								</View>
							</Pressable>
						</View>
					</Pressable>
				</Modal>
			</View>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	itemCard: {
		backgroundColor: "#fff",
		borderRadius: 12,
		padding: 16,
		marginBottom: 14,
		elevation: 3,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.15,
		shadowRadius: 4,
	},
	itemHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 6,
	},
	itemTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#2b2b2b",
		flexShrink: 1,
	},
	itemDesc: {
		fontSize: 14,
		color: "#555",
		marginVertical: 4,
	},
	itemFooter: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: 6,
	},
	itemPrice: {
		fontSize: 15,
		fontWeight: "bold",
		color: "#00a3e5",
	},
	itemSub: {
		fontSize: 12,
		color: "#777",
		fontStyle: "italic",
	},
	itemStatus: {
		fontSize: 13,
		fontWeight: "bold",
	},
	modalBackdrop: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.3)",
		justifyContent: "flex-start",
		alignItems: "center",
		paddingVertical: 40,
	},
	modalContainer: {
		backgroundColor: "#fff",
		width: "90%",
		borderRadius: 10,
		padding: 20,
		height: "auto",
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 10,
		textAlign: "center",
	},
	input: {
		marginBottom: 8,
	},
});
