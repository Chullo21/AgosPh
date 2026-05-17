// components/store/ManageStoreList.js
import React, { useState, useEffect, useContext } from "react";
import {
    View,
    ImageBackground,
    StyleSheet,
    FlatList,
    ScrollView
} from "react-native";
import {
    Modal,
    Portal,
    Text,
    TextInput,
    Button,
    Card
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import Constants from "expo-constants";
import { AuthContext } from "../../../context/authcontext";

import AppBar from "../../../components/control/appbar";
import PhotoUploader from "../../../components/control/photouploader";
import BackgroundPhoto from "../../../assets/Beige Blue Modern Abstract Line Shape Bookmark.png";
import CustomLoading from "../../../components/loading/loading";

const termsAndConditions = `
1. Acknowledgment of Fees
By proceeding to register a shop within this application, you acknowledge and agree that certain fees may apply. These fees may include registration fees, transaction fees, or service charges associated with maintaining your shop on the platform. The rates and structures of such fees are subject to change, and you agree to review the latest information before proceeding.

2. Shop Registration Approval
All shop registration requests are subject to review and approval by the platform administrators. Submission of a registration form does not guarantee acceptance. The platform reserves the right to reject, suspend, or revoke any shop registration request at its sole discretion and without the obligation to provide detailed justification.

3. Accuracy of Information
You agree to provide accurate, complete, and up-to-date information during the shop registration process. Any false, misleading, or incomplete information may result in immediate rejection or suspension of your shop.

4. Compliance with Laws
All shops must comply with applicable local and national laws, including but not limited to business registration, product authenticity, safety, and consumer protection standards. The platform shall not be held liable for any violations committed by shop owners.

5. Platform Conduct
As a shop owner, you are expected to conduct yourself and operate your store in a professional and ethical manner. Abusive behavior, fraudulent activity, or any attempt to manipulate the system may result in termination of your account and legal action where appropriate.

6. Data and Privacy
By registering a shop, you consent to the collection and processing of your data for the purposes of account management, verification, and service operation. The platform commits to handling your data responsibly in accordance with its Privacy Policy.

7. Updates and Modifications
These Terms and Conditions may be updated from time to time to reflect changes in policies, fees, or regulations. Continued use of the platform after such updates constitutes your acceptance of the revised terms.

8. Acceptance of Terms
By selecting "Accept," you confirm that you have read, understood, and agreed to all the above Terms and Conditions. If you do not agree, please select "Cancel" and refrain from registering your shop.
`;

export default function ManageStoreListScreen() {
    const nav = useNavigation();
    const { userToken, user } = useContext(AuthContext);
    console.log(user, userToken);
    const { API_BASE_URL } = Constants.expoConfig.extra;

    const [openModal, setOpenModal] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [stores, setStores] = useState([]);

    const [storeName, setStoreName] = useState("");
    const [description, setDescription] = useState("");
    const [maxDistance, setMaxDistance] = useState("");
    const [longitude, setLongitude] = useState("");
    const [latitude, setLatitude] = useState("");
    const [photoUrl, setPhotoUrl] = useState("");

    const handleBackPress = () => nav.goBack("Home");
    const handleAddStore = () => setShowTerms(true);

    const handleGetLocation = async () => {
        setIsLoading(true);
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert("Location permission is required.");
                setIsLoading(false);
                return;
            }

            let lastLocation = await Location.getLastKnownPositionAsync({});
            if (lastLocation) {
                setLongitude(lastLocation.coords.longitude.toString());
                setLatitude(lastLocation.coords.latitude.toString());
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });

            setLongitude(location.coords.longitude.toString());
            setLatitude(location.coords.latitude.toString());
        } catch (error) {
            console.error(error);
            alert("Failed to fetch location.");
        }
        setIsLoading(false);
    };


    const uploadPhoto = async (uri) => {
        if (!uri || uri.startsWith("http")) return uri;

        const formData = new FormData();

        formData.append("file", {
            uri,
            type: "image/jpeg",
            name: `${storeName || "store"}.jpg`,
        });

        const res = await fetch(
            `${API_BASE_URL}/api/Upload/upload?folderName=store`,
            {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${userToken}`,
                    Roles: `${user.role}`,
                },
            }
        );

        const text = await res.text();

        if (!res.ok) {
            console.log("Upload failed:", res.status, text);
            throw new Error(text || "Photo upload failed.");
        }

        return text;
    };

    const handleSaveStore = async () => {
        setIsLoading(true);

        try {
            if (!storeName.trim()) {
                alert("Please enter a store name.");
                return;
            }

            let uploadedPhotoUrl = photoUrl;

            if (uploadedPhotoUrl && !uploadedPhotoUrl.startsWith("http")) {
                uploadedPhotoUrl = await uploadPhoto(uploadedPhotoUrl);
            }

            const body = {
                name: storeName,
                description,
                maxDeliveryDistance: Number(maxDistance),
                longitude: Number(longitude),
                latitude: Number(latitude),
                photoUrl: uploadedPhotoUrl,
                ownerId: user?.id,
            };

            const url = `${API_BASE_URL}/api/store/create`;

            console.log("Create store URL:", url);
            console.log("Create store body:", body);

            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userToken}`,
                },
                body: JSON.stringify(body),
            });

            const text = await res.text();

            console.log("Create store status:", res.status);
            console.log("Create store response:", text);

            if (!res.ok) {
                throw new Error(text || "Store create failed.");
            }

            setOpenModal(false);
            setStoreName("");
            setDescription("");
            setMaxDistance("");
            setLongitude("");
            setLatitude("");
            setPhotoUrl("");
            setRefreshKey((prev) => prev + 1);

            alert("Store registered successfully!");
        } catch (err) {
            console.error("Error saving store:", err);
            alert(err.message || "Error saving store.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAcceptTerms = async () => {
        setShowTerms(false);
        setIsLoading(true);

        try {
            await handleGetLocation();
            setOpenModal(true);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchStores = async () => {
        setIsLoading(true);

        try {
            const res = await fetch(
                `${API_BASE_URL}/api/Store/getmystores?id=${user?.id}`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${userToken}`,
                    }
                }
            );

            const data = await res.json();
            setStores(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStores();
    }, [refreshKey]);

    return (
        <ImageBackground
            source={BackgroundPhoto}
            style={{ flex: 1 }}
            resizeMode="stretch"
        >
            <View style={{ flex: 1 }}>
                <AppBar
                    title="My Stores"
                    onBackPress={handleBackPress}
                    actions={[{ icon: "plus", onPress: handleAddStore }]}
                />
                {isLoading && (
                    <CustomLoading />
                ) }
                <FlatList
                    data={stores}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <Card
                            style={styles.card}
                            onPress={() =>
                                nav.navigate("ManageStoreItems", { storeId: item.id, storeName: item.name })
                            }
                        >
                            <Card.Cover source={{ uri: item.photoUrl ? item.photoUrl : `https://res.cloudinary.com/dmoggblzj/image/upload/v1760425147/agos/store/lbyzlczkizvtgeabxicd.png`}} />
                            <Card.Content>
                                <Text style={styles.storeName}>{item.name}</Text>
                                <Text style={styles.storeDescription}>
                                    {item.status}
                                </Text>
                            </Card.Content>
                        </Card>
                    )}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>You have no store yet...</Text>
                    }
                />
            </View>

            {/* Terms and Conditions Modal */}
            <Portal>
                <Modal
                    visible={showTerms}
                    onDismiss={() => setShowTerms(false)}
                    contentContainerStyle={styles.termsModalContent}
                >
                    <Text style={styles.modalTitle}>Terms and Conditions</Text>
                    <ScrollView style={{ maxHeight: 400, marginBottom: 20 }}>
                        <Text style={styles.termsText}>{termsAndConditions}</Text>
                    </ScrollView>
                    <View style={styles.buttonRow}>
                        <Button
                            mode="contained"
                            onPress={handleAcceptTerms}
                            style={styles.saveButton}
                        >
                            Accept
                        </Button>
                        <Button
                            mode="outlined"
                            onPress={() => setShowTerms(false)}
                            style={{ borderColor: "#00a3e5" }}
                            textColor="#00a3e5"
                        >
                            Cancel
                        </Button>
                    </View>
                </Modal>
            </Portal>

            {/* Register Store Modal */}
            <Portal>
                <Modal
                    visible={openModal}
                    onDismiss={() => setOpenModal(false)}
                    contentContainerStyle={styles.modalContent}
                >
                    <Text style={styles.modalTitle}>Register New Store</Text>
                    <PhotoUploader value={photoUrl} onPick={setPhotoUrl} />
                    <TextInput
                        label="Store Name"
                        mode="outlined"
                        value={storeName}
                        onChangeText={setStoreName}
                        style={styles.input}
                        type='text'
                    />
                    <TextInput
                        label="Description"
                        mode="outlined"
                        value={description}
                        onChangeText={setDescription}
                        style={styles.input}
                        type='text'
                    />
                    <TextInput
                        label="Max Delivery Distance (km)"
                        mode="outlined"
                        value={maxDistance}
                        onChangeText={setMaxDistance}
                        keyboardType="numeric"
                        style={styles.input}
                    />

                    <View style={styles.locationRow}>
                        <TextInput
                            label="Longitude"
                            mode="outlined"
                            value={longitude}
                            style={{ flex: 1, marginRight: 8 }}
                            editable={false}
                        />
                        <TextInput
                            label="Latitude"
                            mode="outlined"
                            value={latitude}
                            style={{ flex: 1 }}
                            editable={false}
                        />
                    </View>

                    <View style={styles.buttonRow}>
                        <Button
                            mode="contained"
                            onPress={handleSaveStore}
                            style={styles.saveButton}
                            loading={isLoading}
                            disabled={isLoading}
                        >
                            Save
                        </Button>
                        <Button
                            mode="outlined"
                            onPress={() => setOpenModal(false)}
                            style={{ borderColor: "#00a3e5" }}
                            textColor="#00a3e5"
                        >
                            Cancel
                        </Button>
                    </View>
                </Modal>
            </Portal>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    card: {
        margin: 10,
        borderRadius: 10
    },
    storeName: {
        fontSize: 16,
        fontWeight: "600",
        marginTop: 5
    },
    storeDescription: {
        fontSize: 14,
        color: "#666"
    },
    modalContent: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        margin: 20
    },
    termsModalContent: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        margin: 20
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12
    },
    input: {
        marginBottom: 16
    },
    locationRow: {
        flexDirection: "row",
        marginBottom: 8
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 10,
        marginTop: 10
    },
    saveButton: {
        marginRight: 10,
        backgroundColor: "#00a3e5"
    },
    emptyText: {
        textAlign: "center",
        marginTop: 50,
        fontSize: 16,
        color: "black"
    },
    termsText: {
        fontSize: 14,
        color: "#333",
        lineHeight: 20
    }
});
