import React, { useContext, useState } from "react";
import {
	View,
	Text,
	Image,
	TouchableOpacity,
	StyleSheet,
	ActivityIndicator,
	ImageBackground,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { TextInput, Button } from "react-native-paper";
import { AuthContext } from "../../context/authcontext";
import { useNavigation } from "@react-navigation/native";
import AppBar from "../../components/control/appbar";
import BackgroundPhoto from "../../assets/Beige Blue Modern Abstract Line Shape Bookmark.png";

export default function ProfileScreen() {
	const navigation = useNavigation();
	const { user, updateUser } = useContext(AuthContext);
	const [name, setName] = useState(user?.name || "");
	const [email] = useState(user?.email || "");
	const [photo, setPhoto] = useState(user?.photo || null);
	const [loading, setLoading] = useState(false);

	const pickImage = async () => {
		const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (permissionResult.granted === false) {
			alert("Permission to access camera roll is required!");
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.8,
		});

		if (!result.canceled) {
			const selectedImage = result.assets[0].uri;
			setPhoto(selectedImage);
		}
	};

    const handleSave = async () => {
        alert("Profile update functionality is currently disabled. This feature will be available in future updates.");
		// setLoading(true);
		// try {
		// 	await updateUser({ name, photo });
		// 	alert("Profile updated successfully!");
		// } catch (err) {
		// 	alert("Failed to update profile.");
		// 	console.error(err);
		// } finally {
		// 	setLoading(false);
		// }
	};

	return (
        <ImageBackground source={BackgroundPhoto} style={styles.background} resizeMode="stretch">
            <AppBar title={"My Profile"} onBackPress={() => navigation.goBack()} />
			<View style={styles.overlay}>
				

				<TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
					{photo ? (
						<Image source={{ uri: photo }} style={styles.profileImage} />
					) : (
						<View style={styles.placeholder}>
							<Text style={styles.placeholderText}>Add Photo</Text>
						</View>
					)}
				</TouchableOpacity>

				<TextInput
					label="Full Name"
					value={name}
					onChangeText={setName}
					mode="flat"
					style={styles.input}
				/>

				<TextInput
					label="Email"
					value={email}
					mode="flat"
					style={styles.input}
					disabled
				/>

				<Button
					mode="contained"
					onPress={handleSave}
					style={styles.button}
					disabled={loading}
				>
					{loading ? <ActivityIndicator color="#fff" /> : "Save Changes"}
				</Button>
			</View>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	background: {
		flex: 1,
		justifyContent: "center",
	},
	overlay: {
		flex: 1,
		// backgroundColor: "rgba(255, 255, 255, 0.25)",
		padding: 20,
        alignItems: "center",
        height: "auto",
	},
	imageContainer: {
		marginTop: 40,
		marginBottom: 20,
	},
	profileImage: {
		width: 120,
		height: 120,
		borderRadius: 60,
		borderWidth: 2,
		borderColor: "#00a3e5",
	},
	placeholder: {
		width: 120,
		height: 120,
		borderRadius: 60,
		backgroundColor: "#eee",
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 2,
		borderColor: "#00a3e5",
	},
	placeholderText: {
		color: "#888",
	},
	input: {
		width: "100%",
		marginBottom: 15,
		backgroundColor: "white",
	},
	button: {
		marginTop: 10,
		width: "100%",
		paddingVertical: 5,
        backgroundColor: "#00a3e5",
        borderColor: "#00a3e5",
        borderWidth: 1,
	},
});
