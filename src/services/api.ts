import axios from "axios";

const api = axios.create({
	baseURL: "http://10.0.2.2:3000", //android studio
	//baseURL: "http://localhost:3000", //web
	timeout: 5000,
	headers: {
		"Content-Type": "application/json",
	},
});

export default api;
