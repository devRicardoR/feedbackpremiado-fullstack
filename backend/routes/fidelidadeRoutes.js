const express = require('express');
const router = express.Router();
const fidelidadeController = require('../controllers/fidelidadeController');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/progresso/:id', authMiddleware, fidelidadeController.progressoCliente);


router.post('/participar/:id', authMiddleware, fidelidadeController.participarPrograma);


router.get('/:id', fidelidadeController.obterPrograma);


router.post('/', authMiddleware, (req, res) => {
    req.userId = req.user.id;
    fidelidadeController.criarPrograma(req, res);
});


router.put('/', authMiddleware, (req, res) => {
    req.userId = req.user.id;
    fidelidadeController.atualizarPrograma(req, res);
});


router.post('/carimbar', authMiddleware, fidelidadeController.carimbarCliente);

module.exports = router;