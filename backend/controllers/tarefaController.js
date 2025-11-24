const Tarefa = require('../models/Tarefa');
const path = require('path');

// Criar nova tarefa associada à empresa logada (usando o token JWT)
exports.criar = async (req, res) => {
    try {

        if (req.user.tipo !== 'empresa') {
            return res.status(403).json({ message: 'Apenas empresas podem criar tarefas' });
        }

        const { descricao, link, desconto } = req.body;
        const id_empresa = req.user.id;

        const tarefa = new Tarefa({ descricao, link, desconto, id_empresa });
        await tarefa.save();

        res.status(201).json(tarefa);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao criar tarefa' });
    }
};

// Buscar tarefas da empresa logada
exports.minhas = async (req, res) => {
    try {
        if (req.user.tipo !== 'empresa') {
            return res.status(403).json({ message: 'Acesso negado' });
        }

        const tarefas = await Tarefa.find({ id_empresa: req.user.id });
        res.json(tarefas);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao buscar tarefas' });
    }
};

// Listar todas as tarefas (com dados da empresa populados)
exports.listar = async (req, res) => {
    try {
        const tarefas = await Tarefa.find().populate('id_empresa');
        res.json(tarefas);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao listar tarefas' });
    }
};

// Buscar tarefas de uma empresa específica pelo ID (usado no painel)
exports.daEmpresa = async (req, res) => {
    try {
        const tarefas = await Tarefa.find({ id_empresa: req.params.id });
        res.json(tarefas);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao buscar tarefas da empresa' });
    }
};

exports.excluir = async (req, res) => {
    try {
        const tarefa = await Tarefa.findById(req.params.id);
        if (!tarefa) return res.status(404).json({ message: 'Tarefa não encontrada' });

        // Só a empresa dona da tarefa pode excluir
        if (tarefa.id_empresa.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Acesso negado' });
        }

        await Tarefa.findByIdAndDelete(req.params.id);
        res.json({ message: 'Tarefa excluída com sucesso' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao excluir tarefa' });
    }
};

// Atualizar tarefa
exports.atualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const { descricao, link, desconto } = req.body;

        const tarefa = await Tarefa.findById(id);
        if (!tarefa) return res.status(404).json({ message: 'Tarefa não encontrada' });

        if (tarefa.id_empresa.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Acesso negado' });
        }

        tarefa.descricao = descricao;
        tarefa.link = link;
        tarefa.desconto = desconto;

        await tarefa.save();
        res.json(tarefa);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao atualizar tarefa' });
    }
};

// Upload do print para comprovar realização da tarefa
exports.uploadPrint = async (req, res) => {
    try {
        const tarefaId = req.params.id;

        if (!req.file) {
            return res.status(400).json({ message: 'Nenhum arquivo enviado' });
        }

        const tarefa = await Tarefa.findById(tarefaId);
        if (!tarefa) {
            return res.status(404).json({ message: 'Tarefa não encontrada' });
        }

        tarefa.printUrl = `/uploads/prints/${req.file.filename}`;

        await tarefa.save();
        res.json({ 
            message: 'Print enviado com sucesso', 
            printUrl: tarefa.printUrl, 
            desconto: tarefa.desconto 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao enviar print' });
    }
};