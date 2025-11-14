import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CustomConfirmListItem({ name, quantity, price }) {
	const total = quantity * price;

	return (
		<View style={styles.container}>
			<View style={styles.left}>
				<Text style={styles.name} numberOfLines={1}>
					{name}
				</Text>
				<Text style={styles.details}>
					₱{price.toFixed(2)} × {quantity}
				</Text>
			</View>

			<View style={styles.right}>
				<Text style={styles.total}>₱{total.toFixed(2)}</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 10,
		paddingHorizontal: 16,
		backgroundColor: '#fff',
		borderRadius: 10,
		marginVertical: 6,
		marginHorizontal: 12,
		shadowColor: '#000',
		shadowOpacity: 0.08,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 3,
		elevation: 2,
	},
	left: {
		flex: 1,
	},
	name: {
		fontSize: 16,
		fontWeight: '600',
		color: '#333',
	},
	details: {
		fontSize: 14,
		color: '#777',
		marginTop: 2,
	},
	right: {
		marginLeft: 10,
		alignItems: 'flex-end',
	},
	total: {
		fontSize: 16,
		fontWeight: '700',
		color: '#00a3e5',
	},
});
