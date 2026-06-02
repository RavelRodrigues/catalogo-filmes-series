import React, { useState, useCallback } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "@/src/services/api";

export default function AdicionarScreen() {
	const [titulo, setTitulo] = useState("");
	const [genero, setGenero] = useState("");
	const [ano, setAno] = useState("");
	const [capa, setCapa] = useState("");
	const [sucesso, setSucesso] = useState(false);
	const router = useRouter();

	useFocusEffect(
		useCallback(() => {
			setTitulo("");
			setGenero("");
			setAno("");
			setCapa("");
			setSucesso(false);
		}, []),
	);

	async function salvarFilme() {
		if (!titulo || !genero || !ano || !capa) {
			window.alert("Preencha todos os campos.");
			return;
		}

		try {
			await api.post("/filmes", {
				titulo,
				genero,
				ano: Number(ano),
				capa,
				favorito: false,
			});

			setSucesso(true);
			setTimeout(() => {
				setSucesso(false);
				router.push("/");
			}, 1500);
		} catch (erro) {
			console.log("Erro ao salvar:", erro);
		}
	}

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView contentContainerStyle={styles.scroll}>
				<Text style={styles.headerTitle}>🎬 Adicionar Filme</Text>

				{sucesso && (
					<View style={styles.sucessoBox}>
						<Text style={styles.sucessoTexto}>
							✅ Filme adicionado com sucesso!
						</Text>
					</View>
				)}

				<Text style={styles.label}>Título</Text>
				<TextInput
					style={styles.input}
					value={titulo}
					onChangeText={setTitulo}
					placeholder="Ex: Interestelar"
					placeholderTextColor="#555"
				/>

				<Text style={styles.label}>Gênero</Text>
				<TextInput
					style={styles.input}
					value={genero}
					onChangeText={setGenero}
					placeholder="Ex: Ficção Científica"
					placeholderTextColor="#555"
				/>

				<Text style={styles.label}>Ano</Text>
				<TextInput
					style={styles.input}
					value={ano}
					onChangeText={setAno}
					placeholder="Ex: 2014"
					placeholderTextColor="#555"
					keyboardType="numeric"
				/>

				<Text style={styles.label}>URL da Capa</Text>
				<TextInput
					style={styles.input}
					value={capa}
					onChangeText={setCapa}
					placeholder="https://..."
					placeholderTextColor="#555"
				/>

				<TouchableOpacity style={styles.botao} onPress={salvarFilme}>
					<Text style={styles.botaoTexto}>Salvar Filme</Text>
				</TouchableOpacity>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#0a0a0a" },
	scroll: { padding: 20, paddingBottom: 100 },
	headerTitle: {
		color: "#fff",
		fontSize: 22,
		fontWeight: "bold",
		marginBottom: 24,
	},
	sucessoBox: {
		backgroundColor: "rgba(34, 197, 94, 0.1)",
		borderWidth: 1,
		borderColor: "rgba(34, 197, 94, 0.3)",
		borderRadius: 12,
		padding: 14,
		marginBottom: 20,
		alignItems: "center",
	},
	sucessoTexto: { color: "#22c55e", fontWeight: "600", fontSize: 15 },
	label: { color: "#fff", fontSize: 15, fontWeight: "600", marginBottom: 6 },
	input: {
		backgroundColor: "#1a1a1a",
		color: "#fff",
		borderRadius: 14,
		padding: 16,
		marginBottom: 16,
		fontSize: 15,
		borderWidth: 1,
		borderColor: "#2a2a2a",
	},
	botao: {
		backgroundColor: "#e50914",
		padding: 16,
		borderRadius: 14,
		alignItems: "center",
		marginTop: 8,
	},
	botaoTexto: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
