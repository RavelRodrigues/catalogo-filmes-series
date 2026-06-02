# 🎬 Catálogo de Filmes e Séries

Aplicativo mobile de catálogo e recomendação de filmes e séries, desenvolvido com **React Native + Expo** para a disciplina de Desenvolvimento para Dispositivos Móveis — AVP2 2026.1.

---

## 📱 Funcionalidades

- Listagem de filmes em cards com capa, título e gênero
- Busca por título e filtro por gênero
- Tela de detalhes com informações completas
- Adicionar novo filme ao catálogo
- Excluir filme do catálogo
- Favoritar/desfavoritar direto do catálogo ou na tela de detalhes
- Tela exclusiva de favoritos

---

## 🛠 Tecnologias

- [React Native](https://reactnative.dev/) com [Expo](https://expo.dev/)
- [Expo Router](https://expo.github.io/router/) — navegação baseada em arquivos
- [Axios](https://axios-http.com/) — requisições HTTP
- [JSON Server](https://github.com/typicode/json-server) — servidor fake local
- TypeScript

---

## 📁 Estrutura de Pastas

```
app/
  _layout.tsx          # Layout raiz (Stack Navigator)
  detalhes.tsx         # Tela de detalhes do filme
  (tabs)/
    _layout.tsx        # Layout das abas
    index.tsx          # Tela principal — catálogo
    adicionar.tsx      # Formulário para adicionar filme
    favoritos.tsx      # Lista de favoritos
src/
  services/
    api.ts             # Instância configurada do Axios
db.json                # Banco de dados do JSON Server
```

---

## ▶️ Como rodar o projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) v20 ou superior
- [Expo Go](https://expo.dev/go) no celular (opcional)
- JSON Server instalado globalmente:

```bash
npm install -g json-server
```

### Passos

**1. Instalar dependências:**

```bash
npm install
```

**2. Iniciar o servidor fake (Terminal 1):**

```bash
json-server db.json --port 3000
```

**3. Iniciar o app (Terminal 2):**

```bash
npx expo start
```

**4. Abrir o app:**

- Pressione `W` para abrir no navegador
- Escaneie o QR Code com o Expo Go no celular

---

## ⚠️ Atenção

- O JSON Server precisa estar rodando **antes** de abrir o app
- Ao testar no **celular físico**, troque `localhost` pelo IP da sua máquina no arquivo `src/services/api.ts`
- Ao testar no **emulador Android**, use `10.0.2.2` no lugar de `localhost`
- A pasta `node_modules` foi removida antes da entrega — rode `npm install` para reinstalar

---

## 🏫 Informações Acadêmicas

- **Instituição:** Centro Universitário Paraíso — UniFAP
- **Curso:** Sistemas de Informação / ADS
- **Disciplina:** Desenvolvimento para Dispositivos Móveis
- **Professor:** Caetano Vieira Neto Segundo
- **Período:** 2026.1
