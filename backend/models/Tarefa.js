const mongoose = require('mongoose');

const TarefaSchema = new mongoose.Schema({
    id_empresa: { type: mongoose.Schema.Types.ObjectId, ref: 'Empresa', required: true },
    descricao: { type: String, required: true },
    link: { type: String, required: true },
    desconto: { type: Number, required: true },
    printUrl: { type: String, default: '' }
}, {
    timestamps: true
});

module.exports = mongoose.model('Tarefa', TarefaSchema);