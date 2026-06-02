import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	Image,
	TouchableOpacity,
	StyleSheet,
	ActivityIndicator,
	Alert,
	ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
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

export default function DetalhesScreen() {
	const { id } = useLocalSearchParams();
	const [filme, setFilme] = useState<Filme | null>(null);
	const router = useRouter();

	useEffect(() => {
		buscarFilme();
	}, []);

	async function buscarFilme() {
		try {
			const resposta = await api.get(`/filmes/${id}`);
			setFilme(resposta.data);
		} catch (erro) {
			console.log("Erro ao buscar filme:", erro);
		}
	}

	async function excluirFilme() {
		const confirmado = window.confirm(
			"Tem certeza que deseja excluir este filme?",
		);
		if (!confirmado) return;

		try {
			await api.delete(`/filmes/${id}`);
			router.back();
		} catch (erro) {
			console.log("Erro ao excluir:", erro);
		}
	}
	async function toggleFavorito() {
		if (!filme) return;
		try {
			const atualizado = { ...filme, favorito: !filme.favorito };
			await api.put(`/filmes/${id}`, atualizado);
			setFilme(atualizado);
		} catch (erro) {
			console.log("Erro ao favoritar:", erro);
		}
	}

	if (!filme) {
		return (
			<View style={styles.loading}>
				<ActivityIndicator size="large" color="#e50914" />
			</View>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<TouchableOpacity style={styles.voltar} onPress={() => router.back()}>
				<Ionicons name="chevron-back" size={24} color="#fff" />
				<Text style={styles.voltarTexto}>Voltar</Text>
			</TouchableOpacity>

			<ScrollView contentContainerStyle={styles.scroll}>
				<Image source={{ uri: filme.capa }} style={styles.capa} />

				<View style={styles.infos}>
					<Text style={styles.titulo}>{filme.titulo}</Text>
					<Text style={styles.detalhe}>Gênero: {filme.genero}</Text>
					<Text style={styles.detalhe}>Ano: {filme.ano}</Text>
				</View>

				<TouchableOpacity style={styles.botaoFavorito} onPress={toggleFavorito}>
					<Ionicons
						name={filme.favorito ? "star" : "star-outline"}
						size={20}
						color="#f5a623"
					/>
					<Text style={styles.botaoFavoritoTexto}>
						{filme.favorito
							? "Remover dos Favoritos"
							: "Adicionar aos Favoritos"}
					</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.botaoExcluir} onPress={excluirFilme}>
					<Ionicons name="trash-outline" size={20} color="#ef4444" />
					<Text style={styles.botaoExcluirTexto}>Excluir Filme</Text>
				</TouchableOpacity>
			</ScrollView>
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
	voltar: { flexDirection: "row", alignItems: "center", padding: 16, gap: 4 },
	voltarTexto: { color: "#fff", fontSize: 16 },
	scroll: { alignItems: "center", padding: 20, paddingBottom: 100 },
	capa: { width: 220, height: 320, borderRadius: 16, marginBottom: 24 },
	infos: { width: "100%", marginBottom: 24 },
	titulo: { color: "#fff", fontSize: 22, fontWeight: "bold", marginBottom: 8 },
	detalhe: { color: "#888", fontSize: 16, marginBottom: 4 },
	botaoFavorito: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 10,
		width: "100%",
		padding: 16,
		borderRadius: 14,
		borderWidth: 1,
		borderColor: "rgba(245, 166, 35, 0.3)",
		backgroundColor: "rgba(245, 166, 35, 0.05)",
		marginBottom: 12,
	},
	botaoFavoritoTexto: { color: "#f5a623", fontWeight: "600", fontSize: 16 },
	botaoExcluir: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 10,
		width: "100%",
		padding: 16,
		borderRadius: 14,
		borderWidth: 1,
		borderColor: "rgba(239, 68, 68, 0.3)",
		backgroundColor: "rgba(239, 68, 68, 0.05)",
	},
	botaoExcluirTexto: { color: "#ef4444", fontWeight: "600", fontSize: 16 },
});
