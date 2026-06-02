import React, { useState, useCallback } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
	Alert,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dropdown } from "react-native-element-dropdown";
import api from "@/src/services/api";

const listaGeneros = [
	{ label: "Ação", value: "Ação" },
	{ label: "Comédia", value: "Comédia" },
	{ label: "Drama", value: "Drama" },
	{ label: "Ficção Científica", value: "Ficção Científica" },
	{ label: "Terror", value: "Terror" },
	{ label: "Romance", value: "Romance" },
	{ label: "Animação", value: "Animação" },
	{ label: "Documentário", value: "Documentário" },
];

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
			Alert.alert("Campos Vazios", "Por favor, preencha todos os campos.");
			return;
		}

		if (!/^\d{4}$/.test(ano)) {
			Alert.alert(
				"Formato Inválido",
				"O campo Ano deve conter exatamente 4 números.",
			);
			return;
		}

		const anoNumero = Number(ano);
		const anoAtual = new Date().getFullYear();

		if (anoNumero < 1888 || anoNumero > anoAtual) {
			Alert.alert("Ano Inválido", `O ano deve ser entre 1888 e ${anoAtual}.`);
			return;
		}

		try {
			await api.post("/filmes", {
				titulo,
				genero,
				ano: anoNumero,
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
			Alert.alert("Erro", "Não foi possível salvar o filme.");
		}
	}

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView contentContainerStyle={styles.scroll}>
				<Text style={styles.headerTitle}>Adicionar Filme</Text>

				{sucesso && (
					<View style={styles.sucessoBox}>
						<Text style={styles.sucessoTexto}>
							Filme adicionado com sucesso!
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
				<Dropdown
					style={styles.dropdown}
					placeholderStyle={styles.placeholderStyle}
					selectedTextStyle={styles.selectedTextStyle}
					containerStyle={styles.dropdownContainer}
					itemContainerStyle={styles.dropdownItem}
					itemTextStyle={styles.dropdownItemText}
					activeColor="#2a2a2a"
					data={listaGeneros}
					maxHeight={300}
					labelField="label"
					valueField="value"
					placeholder="Selecione um gênero"
					value={genero}
					onChange={(item: { label: string; value: string }) => {
						setGenero(item.value);
					}}
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
	dropdown: {
		backgroundColor: "#1a1a1a",
		borderRadius: 14,
		padding: 16,
		marginBottom: 16,
		borderWidth: 1,
		borderColor: "#2a2a2a",
		height: 58,
	},
	placeholderStyle: {
		color: "#555",
		fontSize: 15,
	},
	selectedTextStyle: {
		color: "#fff",
		fontSize: 15,
	},
	dropdownContainer: {
		backgroundColor: "#1a1a1a",
		borderRadius: 14,
		borderWidth: 1,
		borderColor: "#2a2a2a",
	},
	dropdownItem: {
		padding: 16,
	},
	dropdownItemText: {
		color: "#fff",
		fontSize: 15,
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
