const Print = require('../models/Print');
const Tarefa = require('../models/Tarefa');
const Empresa = require('../models/Empresa');

/**
 * Envia o print do cliente com base na tarefa e empresa
 */
exports.enviarPrint = async (req, res) => {
    try {
        const { id_empresa, id_tarefa } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'Imagem do comprovante é obrigatória' });
        }

        const tarefa = await Tarefa.findById(id_tarefa);
        if (!tarefa) {
            return res.status(404).json({ message: 'Tarefa não encontrada' });
        }

        const novoPrint = new Print({
            id_empresa,
            id_tarefa,
            id_cliente: req.user.id,
            imagem: req.file.filename,
            data_upload: new Date(),
        });

        await novoPrint.save();

        await Empresa.findByIdAndUpdate(id_empresa, { $inc: { printsCount: 1 } });

        res.json({
            message: 'Print enviado com sucesso',
            desconto: tarefa.desconto,
        });
    } catch (err) {
        console.error('Erro ao enviar print:', err);
        res.status(500).json({ message: 'Erro ao enviar print' });
    }
};

/**
 * Lista todos os prints enviados para uma empresa específica
 */
exports.listarPrintsPorEmpresa = async (req, res) => {
    try {
        const prints = await Print.find({ id_empresa: req.params.id })
            .populate('id_cliente', 'nome email')
            .sort({ data_upload: -1 });

        res.json(prints);
    } catch (err) {
        console.error('Erro ao listar prints:', err);
        res.status(500).json({ message: 'Erro ao listar prints' });
    }
};

/**
 * Exclui um print enviado
 */
exports.excluirPrint = async (req, res) => {
    try {
        const print = await Print.findById(req.params.id);

        if (!print) {
            return res.status(404).json({ message: 'Print não encontrado' });
        }


        await Empresa.findByIdAndUpdate(print.id_empresa, { $inc: { printsCount: -1 } });

        await print.deleteOne();

        res.json({ message: 'Print excluído com sucesso' });
    } catch (err) {
        console.error('Erro ao excluir print:', err);
        res.status(500).json({ message: 'Erro ao excluir print' });
    }
};