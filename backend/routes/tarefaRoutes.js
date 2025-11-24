const express = require('express');
const router = express.Router();
const tarefaController = require('../controllers/tarefaController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// Rotas protegidas
router.post('/', authMiddleware, tarefaController.criar);
router.get('/minhas', authMiddleware, tarefaController.minhas);
router.put('/:id', authMiddleware, tarefaController.atualizar);
router.delete('/:id', authMiddleware, tarefaController.excluir);

// Rota para upload de print da tarefa (cliente faz)
router.post('/:id/upload', authMiddleware, upload.single('print'), tarefaController.uploadPrint);

// Rotas públicas
router.get('/', tarefaController.listar);
router.get('/empresa/:id', tarefaController.daEmpresa);

module.exports = router;