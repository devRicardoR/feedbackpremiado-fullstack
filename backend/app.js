require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');


app.use(cors({
    origin: '*',
    credentials: true
}));

app.use(express.json());


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB conectado'))
    .catch(err => console.error('Erro ao conectar MongoDB:', err));


function setUserId(req, res, next) {
    if (req.user && req.user.id) {
        req.userId = req.user.id;
    }
    next();
}


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


app.get('/', (req, res) => {
    res.send('API rodando 🚀');
});

module.exports = app;