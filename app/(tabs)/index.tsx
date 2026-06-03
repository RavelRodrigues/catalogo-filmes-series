import React, { useState, useCallback } from "react";
import {
	View,
	Text,
	FlatList,
	Image,
	TouchableOpacity,
	StyleSheet,
	ActivityIndicator,
	TextInput,
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

export default function CatalogoScreen() {
	const [filmes, setFilmes] = useState<Filme[]>([]);
	const [busca, setBusca] = useState("");
	const [generoAtivo, setGeneroAtivo] = useState("Todos");
	const [carregando, setCarregando] = useState(true);
	const router = useRouter();

	useFocusEffect(
		useCallback(() => {
			buscarFilmes();
		}, []),
	);

	async function buscarFilmes() {
		try {
			const resposta = await api.get("/filmes");
			setFilmes(resposta.data);
		} catch (erro) {
			console.log("Erro ao buscar filmes:", erro);
		} finally {
			setCarregando(false);
		}
	}

	async function toggleFavorito(filme: Filme) {
		try {
			const atualizado = { ...filme, favorito: !filme.favorito };
			await api.put(`/filmes/${filme.id}`, atualizado);
			setFilmes((prev) =>
				prev.map((f) => (f.id === filme.id ? atualizado : f)),
			);
		} catch (erro) {
			console.log("Erro ao favoritar:", erro);
		}
	}

	const generos = [
		"Todos",
		...Array.from(new Set(filmes.map((f) => f.genero))),
	];

	const filmesFiltrados = filmes.filter((f) => {
		const buscaOk = f.titulo.toLowerCase().includes(busca.toLowerCase());
		const generoOk = generoAtivo === "Todos" || f.genero === generoAtivo;
		return buscaOk && generoOk;
	});

	if (carregando) {
		return (
			<View style={styles.loading}>
				<ActivityIndicator size="large" color="#e50914" />
			</View>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<FlatList
				data={filmesFiltrados}
				keyExtractor={(item) => String(item.id)}
				contentContainerStyle={styles.lista}
				ListHeaderComponent={
					<>
						{/* HEADER */}
						<View style={styles.header}>
							<Text style={styles.headerTitle}>Catálogo</Text>
							<Text style={styles.contador}>
								{filmesFiltrados.length}{" "}
								{filmesFiltrados.length === 1 ? "filme/série" : "filmes/séries"}
							</Text>
						</View>

						{/* BUSCA */}
						<View style={styles.buscaContainer}>
							<Ionicons
								name="search-outline"
								size={18}
								color="#555"
								style={styles.buscaIcone}
							/>
							<TextInput
								style={styles.buscaInput}
								value={busca}
								onChangeText={setBusca}
								placeholder="Buscar por título..."
								placeholderTextColor="#555"
							/>
							{busca.length > 0 && (
								<TouchableOpacity onPress={() => setBusca("")}>
									<Ionicons name="close-circle" size={18} color="#555" />
								</TouchableOpacity>
							)}
						</View>

						{/* FILTRO POR GÊNERO */}
						<FlatList
							data={generos}
							horizontal
							keyExtractor={(item) => item}
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={styles.filtroLista}
							renderItem={({ item }) => (
								<TouchableOpacity
									style={[
										styles.filtroBotao,
										generoAtivo === item && styles.filtroBotaoAtivo,
									]}
									onPress={() => setGeneroAtivo(item)}
								>
									<Text
										style={[
											styles.filtroTexto,
											generoAtivo === item && styles.filtroTextoAtivo,
										]}
									>
										{item}
									</Text>
								</TouchableOpacity>
							)}
						/>
					</>
				}
				ListEmptyComponent={
					<View style={styles.vazio}>
						<Ionicons name="film-outline" size={48} color="#333" />
						<Text style={styles.vazioTexto}>Nenhum filme encontrado.</Text>
					</View>
				}
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
						<TouchableOpacity
							style={styles.estrelaBotao}
							onPress={() => toggleFavorito(item)}
						>
							<Ionicons
								name={item.favorito ? "star" : "star-outline"}
								size={22}
								color="#f5a623"
							/>
						</TouchableOpacity>
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
	header: {
		paddingHorizontal: 20,
		paddingTop: 16,
		paddingBottom: 12,
	},
	headerTitle: { color: "#fff", fontSize: 22, fontWeight: "bold" },
	contador: { color: "#555", fontSize: 13, marginTop: 2 },
	buscaContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#1a1a1a",
		borderRadius: 14,
		marginHorizontal: 20,
		marginBottom: 12,
		paddingHorizontal: 12,
		borderWidth: 1,
		borderColor: "#2a2a2a",
	},
	buscaIcone: { marginRight: 8 },
	buscaInput: {
		flex: 1,
		color: "#fff",
		paddingVertical: 12,
		fontSize: 15,
	},
	filtroLista: {
		paddingHorizontal: 20,
		marginBottom: 12,
		gap: 8,
		alignItems: "center",
	},
	filtroBotao: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 20,
		backgroundColor: "#1a1a1a",
		borderWidth: 1,
		borderColor: "#2a2a2a",
		height: 36,
		justifyContent: "center",
		alignItems: "center",
	},
	filtroBotaoAtivo: {
		backgroundColor: "#e50914",
		borderColor: "#e50914",
	},
	filtroTexto: { color: "#666", fontSize: 13, fontWeight: "600" },
	filtroTextoAtivo: { color: "#fff" },
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

	estrelaBotao: {
		alignSelf: "center",
		padding: 10,
		marginRight: 4,
	},
});
