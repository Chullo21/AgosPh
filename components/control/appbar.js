import React from 'react';
import { Appbar, Text } from 'react-native-paper';

export default function AppBar({
	title,
	onBackPress,
	actions = [],
	buttonLabel = "",
	onActionPress,
}) {
	return (
		<Appbar.Header style={{ backgroundColor: 'transparent', elevation: 0 }}>
			{onBackPress && <Appbar.BackAction onPress={onBackPress} color="black" />}

			<Appbar.Content
				title={title}
				titleStyle={{ color: 'black', fontWeight: 'bold', fontSize: 20 }}
			/>

			{actions.map((action, index) => (
				<Appbar.Action
					key={index}
					icon={action.icon}
					color={action.color || "black"}
					onPress={action.onPress}
				/>
			))}

			{buttonLabel && (
				<Text
					onPress={onActionPress}
					style={{ color: 'black', marginRight: 15, fontWeight: 'bold' }}
				>
					{buttonLabel}
				</Text>
			)}
		</Appbar.Header>
	);
}
