const Cliente = require('../models/Cliente');
const bcrypt = require('bcryptjs');

exports.cadastrar = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
        return res.status(400).json({ message: 'Por favor, preencha todos os campos obrigatórios.' });
        }

        
        const clienteExistente = await Cliente.findOne({ email });
        if (clienteExistente) {
        return res.status(400).json({ message: 'Cliente já cadastrado com este email.' });
        }


        const senhaHash = await bcrypt.hash(senha, 10);


        const novoCliente = new Cliente({
        nome,
        email,
        senha: senhaHash,
        });

        await novoCliente.save();

        res.status(201).json({ message: 'Cliente cadastrado com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao cadastrar cliente.' });
    }
};

exports.me = async (req, res) => {
    try {
        const clienteId = req.user.id; 

        const cliente = await Cliente.findById(clienteId).select('-senha'); 

        if (!cliente) {
            return res.status(404).json({ message: 'Cliente não encontrado' });
        }

        res.json(cliente);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar dados do cliente' });
    }
};

exports.editar = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        const clienteId = req.user.id;

        const dadosAtualizados = { nome, email };

        if (senha) {
            const bcrypt = require('bcryptjs');
            dadosAtualizados.senha = await bcrypt.hash(senha, 10);
        }

        const clienteAtualizado = await Cliente.findByIdAndUpdate(
            clienteId,
            dadosAtualizados,
            { new: true }
        );

        if (!clienteAtualizado) {
            return res.status(404).json({ message: 'Cliente não encontrado' });
        }

        res.json({ message: 'Perfil atualizado com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar perfil' });
    }
};