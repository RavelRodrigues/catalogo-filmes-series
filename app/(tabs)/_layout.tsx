import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { HapticTab } from "@/components/haptic-tab";

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: "#ffffff",
				tabBarInactiveTintColor: "#666666",
				headerShown: false,
				tabBarButton: HapticTab,
				tabBarStyle: {
					backgroundColor: "#0a0a0a",
					borderTopColor: "#1a1a1a",
					height: Platform.OS === "ios" ? 88 : 65,
					paddingBottom: Platform.OS === "ios" ? 30 : 10,
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Catálogo",
					tabBarIcon: ({ color, focused }) => (
						<Ionicons
							name={focused ? "film" : "film-outline"}
							size={24}
							color={color}
						/>
					),
				}}
			/>

			<Tabs.Screen
				name="adicionar"
				options={{
					title: "Adicionar",
					tabBarIcon: ({ color, focused }) => (
						<Ionicons
							name={focused ? "add-circle" : "add-outline"}
							size={28}
							color={color}
						/>
					),
				}}
			/>

			<Tabs.Screen
				name="favoritos"
				options={{
					title: "Favoritos",
					tabBarIcon: ({ color, focused }) => (
						<Ionicons
							name={focused ? "star" : "star-outline"}
							size={24}
							color={color}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
