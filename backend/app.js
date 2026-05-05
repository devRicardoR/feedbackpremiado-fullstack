require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

// 🔥 CORS LIBERADO (importante pro frontend online)
app.use(cors({
    origin: '*',
    credentials: true
}));

app.use(express.json());

// 🔥 arquivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 🔥 conexão Mongo
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB conectado'))
    .catch(err => console.error('Erro ao conectar MongoDB:', err));

// 🔥 middleware extra
function setUserId(req, res, next) {
    if (req.user && req.user.id) {
        req.userId = req.user.id;
    }
    next();
}

// 🔥 rotas
app.use('/api/clientes', require('./routes/clienteRoutes'));
app.use('/api/empresas', require('./routes/empresaRoutes'));
app.use('/api/tarefas', require('./routes/tarefaRoutes'));
app.use('/api/prints', require('./routes/printRoutes'));
app.use(
    '/api/fidelidade',
    require('./middleware/authMiddleware'),
    setUserId,
    require('./routes/fidelidadeRoutes')
);
app.use('/api', require('./routes/authRoutes'));

// 🔥 rota teste (IMPORTANTE pro Render)
app.get('/', (req, res) => {
    res.send('API rodando 🚀');
});

module.exports = app;