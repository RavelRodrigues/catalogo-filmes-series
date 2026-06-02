import React, { useCallback, useState } from "react";
import {
	View,
	Text,
	FlatList,
	Image,
	TouchableOpacity,
	StyleSheet,
	ActivityIndicator,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import api from "@/src/services/api";

interface Filme {
	id: number;
	titulo: string;
	genero: string;
	ano: number;
	capa: string;
	favorito: boolean;
}

export default function FavoritosScreen() {
	const [favoritos, setFavoritos] = useState<Filme[]>([]);
	const [carregando, setCarregando] = useState(true);
	const router = useRouter();

	useFocusEffect(
		useCallback(() => {
			buscarFavoritos();
		}, []),
	);

	async function buscarFavoritos() {
		try {
			const resposta = await api.get("/filmes?favorito=true");
			setFavoritos(resposta.data);
		} catch (erro) {
			console.log("Erro ao buscar favoritos:", erro);
		} finally {
			setCarregando(false);
		}
	}

	if (carregando) {
		return (
			<View style={styles.loading}>
				<ActivityIndicator size="large" color="#f5a623" />
			</View>
		);
	}

	if (favoritos.length === 0) {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.headerTitle}>⭐ Favoritos</Text>
				</View>
				<View style={styles.vazio}>
					<Ionicons name="star-outline" size={48} color="#333" />
					<Text style={styles.vazioTexto}>Nenhum favorito ainda.</Text>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>⭐ Favoritos</Text>
			</View>
			<FlatList
				data={favoritos}
				keyExtractor={(item) => String(item.id)}
				contentContainerStyle={styles.lista}
				renderItem={({ item }) => (
					<TouchableOpacity
						style={styles.card}
						onPress={() =>
							router.push({ pathname: "/detalhes", params: { id: item.id } })
						}
					>
						<Image source={{ uri: item.capa }} style={styles.capa} />
						<View style={styles.info}>
							<Text style={styles.titulo}>{item.titulo}</Text>
							<Text style={styles.genero}>{item.genero}</Text>
							<Text style={styles.ano}>{item.ano}</Text>
						</View>
						<Ionicons
							name="star"
							size={18}
							color="#f5a623"
							style={styles.estrela}
						/>
					</TouchableOpacity>
				)}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#0a0a0a" },
	loading: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#0a0a0a",
	},
	header: { padding: 20 },
	headerTitle: { color: "#fff", fontSize: 22, fontWeight: "bold" },
	vazio: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
	vazioTexto: { color: "#555", fontSize: 16 },
	lista: { padding: 16, paddingBottom: 100 },
	card: {
		flexDirection: "row",
		backgroundColor: "#1a1a1a",
		borderRadius: 16,
		marginBottom: 12,
		overflow: "hidden",
		borderWidth: 1,
		borderColor: "#2a2a2a",
	},
	capa: { width: 80, height: 110 },
	info: { flex: 1, padding: 12, justifyContent: "center" },
	titulo: { color: "#fff", fontSize: 16, fontWeight: "bold" },
	genero: { color: "#888", marginTop: 4, fontSize: 13 },
	ano: { color: "#555", marginTop: 2, fontSize: 12 },
	estrela: { alignSelf: "center", marginRight: 12 },
});
