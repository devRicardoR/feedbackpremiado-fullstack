# App Feedback Premiado

Projeto pessoal idealizado e desenvolvido por **Ricardo Cesar Ramos**.

---

# Visão Geral

Este projeto é resultado de uma ideia original, desenvolvida como projeto próprio. Trata-se de uma solução que integra funcionalidades de **fidelização, tarefas, recompensas e feedbacks entre empresas e clientes**, de forma prática e visualmente padronizada.

A proposta é digitalizar o modelo de **cartões de fidelidade**, permitindo que empresas criem tarefas e ações que geram engajamento com os clientes, enquanto os usuários recebem benefícios ou recompensas ao concluir essas ações.

Atualmente, o projeto conta com duas aplicações:

- **Backend:** API REST com Node.js e Express  
- **Frontend Web:** interface web desenvolvida em React.js  

---

# Tecnologias Utilizadas

## Backend

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

## Frontend Web

- React.js  
- Tailwind CSS  

---

# Funcionalidades

- Cadastro e autenticação de **empresas e clientes**  
- Painel personalizado conforme o **perfil do usuário**  
- Upload e gerenciamento de **imagens e arquivos**  
- Sistema de **fidelização configurável**  
- Sistema de **tarefas e ranking para engajamento de clientes**  
- Registro de **carimbos e comprovação de tarefas por imagem (print)**  

---

# Estrutura do Projeto


app-feedback-premiado/
├─ backend/ # API REST
└─ frontend/ # Aplicação web em React.js


---

# Instruções de Uso

## 1. Clonar o repositório

```bash
git clone https://github.com/devRicardoR/feedbackpremiado-fullstack.git
cd feedbackpremiado-fullstack
2. Backend
cd backend
npm install
npm run dev
3. Frontend Web
cd frontend
npm install
npm run dev
Variáveis de Ambiente

Configure as variáveis de ambiente necessárias, como:

MONGO_URI
JWT_SECRET
API_URL
Observações

Projeto desenvolvido como trabalho acadêmico nas disciplinas de React da faculdade Estácio, sob orientação do professor Douglas.

A ideia, arquitetura e desenvolvimento foram totalmente construídos por mim.

O projeto continua em evolução e melhorias futuras podem incluir novas funcionalidades e otimizações de arquitetura.