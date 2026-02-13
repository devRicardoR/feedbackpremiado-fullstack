# App Feedback Premiado

Projeto pessoal idealizado e desenvolvido por Ricardo Cesar Ramos.

## Visão Geral

Este projeto é resultado de uma ideia original, desenvolvida como projeto próprio. Trata-se de uma solução que integra funcionalidades de fidelização, tarefas, recompensas e feedbacks entre empresas e clientes, de forma prática e visualmente padronizada.

Atualmente, o projeto conta com três aplicações:

- Backend: API REST com Node.js e Express  
- Frontend Web: interface web desenvolvida em React.js  
- Frontend Mobile: aplicativo mobile desenvolvido em React Native utilizando Expo Router  

---

## Tecnologias Utilizadas

### Backend
- Node.js  
- Express  
- MongoDB Atlas  
- Mongoose  
- JSON Web Token (jsonwebtoken)  
- Bcrypt.js  
- Multer (upload de arquivos)  
- Cors  
- Dotenv  
- Nodemon (dependência de desenvolvimento)  

### Frontend Web
- React.js  
- Tailwind CSS  

### Frontend Mobile
- React Native  
- Expo Router  
- TypeScript  
- React Navigation  
- Axios  

---

## Funcionalidades

- Cadastro e autenticação de empresas e clientes  
- Painel personalizado conforme o perfil do usuário  
- Upload e gerenciamento de imagens e arquivos  
- Sistema de fidelização com regras e benefícios configuráveis  
- Sistema de tarefas e ranking para engajamento dos clientes  
- Registro de carimbos e prints ao concluir tarefas  

---

## Estrutura do Projeto

app-feedback-premiado/
├─ backend/ # API REST
├─ frontend/ # Aplicação web em React.js
└─ feedback-premiado-mobile/ # Aplicação mobile em React Native


---

## Instruções de Uso

### 1. Clonar o repositório

```bash
git clone https://github.com/devRicardoR/app-feedback-premiado.git
cd app-feedback-premiado
2. Backend
cd backend
npm install
npm run dev
3. Frontend Mobile (React Native)
cd feedback-premiado-mobile
npm install
npx expo start
4. Frontend Web
cd frontend
npm install
npm run dev
5. Variáveis de Ambiente
Configure as variáveis de ambiente necessárias, como:

MONGO_URI

JWT_SECRET

API URL

Observações
Projeto desenvolvido e entregue ao professor Douglas, nas disciplinas de React e React Native da faculdade Estácio.
O projeto encontra-se em desenvolvimento contínuo e sugestões ou contribuições são bem-vindas.

Desenvolvido por Ricardo Cesar Ramos.
