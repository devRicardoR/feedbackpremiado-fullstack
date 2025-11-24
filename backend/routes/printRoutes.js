const express = require('express');
const router = express.Router();
const printController = require('../controllers/printController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/prints/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

router.post('/enviar', authMiddleware, upload.single('imagem'), printController.enviarPrint);
router.get('/empresa/:id', authMiddleware, printController.listarPrintsPorEmpresa);
router.delete('/:id', authMiddleware, printController.excluirPrint);

module.exports = router;