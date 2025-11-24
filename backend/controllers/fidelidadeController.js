const Fidelidade = require('../models/Fidelidade');
const Cliente = require('../models/Cliente');
const mongoose = require('mongoose');

module.exports = {
    async criarPrograma(req, res) {
        try {
            const { regras, beneficios, meta } = req.body;
            const id_empresa = req.user.id;

            if (!id_empresa) {
                return res.status(401).json({ message: 'Usuário não autenticado.' });
            }

            if (!regras || !beneficios || !meta) {
                return res.status(400).json({ message: 'Campos regras, benefícios e meta são obrigatórios.' });
            }

            if (typeof meta !== 'number' || meta <= 0) {
                return res.status(400).json({ message: 'Meta deve ser um número positivo.' });
            }

            const existente = await Fidelidade.findOne({ id_empresa });
            if (existente) {
                return res.status(400).json({ message: 'Programa de fidelidade já cadastrado para esta empresa.' });
            }

            const novoPrograma = await Fidelidade.create({
                id_empresa,
                regras,
                beneficios,
                meta,
            });

            res.status(201).json(novoPrograma);
        } catch (error) {
            console.error('Erro criarPrograma:', error);
            res.status(500).json({ message: 'Erro ao criar programa de fidelidade.' });
        }
    },

    async atualizarPrograma(req, res) {
        try {
            const id_empresa = req.user.id;
            const { regras, beneficios, meta } = req.body;

            if (!id_empresa) {
                return res.status(401).json({ message: 'Usuário não autenticado.' });
            }

            if (!regras || !beneficios || !meta) {
                return res.status(400).json({ message: 'Campos regras, benefícios e meta são obrigatórios.' });
            }

            if (typeof meta !== 'number' || meta <= 0) {
                return res.status(400).json({ message: 'Meta deve ser um número positivo.' });
            }

            const atualizado = await Fidelidade.findOneAndUpdate(
                { id_empresa },
                { regras, beneficios, meta },
                { new: true }
            );

            if (!atualizado) {
                return res.status(404).json({ message: 'Programa não encontrado.' });
            }

            res.json(atualizado);
        } catch (error) {
            console.error('Erro atualizarPrograma:', error);
            res.status(500).json({ message: 'Erro ao atualizar programa.' });
        }
    },

    async obterPrograma(req, res) {
        try {
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'ID da empresa inválido.' });
            }

            const programa = await Fidelidade.findOne({ id_empresa: id });
            if (!programa) {
                return res.status(404).json({ message: 'Programa de fidelidade não encontrado.' });
            }

            // Para cada cliente no programa, buscar nome e email
            const clientesComDados = await Promise.all(programa.clientes.map(async (cliente) => {
                if (!cliente.id_cliente) return cliente;
                const usuario = await Cliente.findById(cliente.id_cliente).select('nome email');
                return {
                    id_cliente: cliente.id_cliente,
                    carimbos: cliente.carimbos,
                    nome: usuario?.nome || null,
                    email: usuario?.email || null,
                };
            }));

            const programaComClientes = {
                ...programa.toObject(),
                clientes: clientesComDados,
            };

            res.json(programaComClientes);
        } catch (error) {
            console.error('Erro obterPrograma:', error);
            res.status(500).json({ message: 'Erro ao buscar programa de fidelidade.' });
        }
    },

    async progressoCliente(req, res) {
        try {
            const id_cliente = req.user.id;
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'ID da empresa inválido.' });
            }

            const programa = await Fidelidade.findOne({ id_empresa: id });
            if (!programa) {
                return res.status(404).json({ message: 'Programa não encontrado.' });
            }

            const cliente = programa.clientes.find(c => String(c.id_cliente) === String(id_cliente));
            const carimbos = cliente ? cliente.carimbos : 0;

            return res.json({
                meta: programa.meta,
                regras: programa.regras,
                beneficios: programa.beneficios,
                carimbos,
            });
        } catch (error) {
            console.error('Erro progressoCliente:', error);
            return res.status(500).json({ message: 'Erro ao carregar progresso.' });
        }
    },

    async participarPrograma(req, res) {
        try {
            const id_cliente = req.user.id;
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'ID da empresa inválido.' });
            }

            const programa = await Fidelidade.findOne({ id_empresa: id });
            if (!programa) {
                return res.status(404).json({ message: 'Programa de fidelidade não encontrado.' });
            }


            const jaParticipa = programa.clientes.some(
                (c) => String(c.id_cliente) === String(id_cliente)
            );

            if (jaParticipa) {
                return res.status(400).json({ message: 'Você já está participando deste programa.' });
            }


            programa.clientes.push({ id_cliente, carimbos: 0 });
            await programa.save();

            return res.status(200).json({ message: 'Participação registrada com sucesso.' });
        } catch (error) {
            console.error('Erro participarPrograma:', error);
            return res.status(500).json({ message: 'Erro ao registrar participação.' });
        }
    },

    async carimbarCliente(req, res) {
        try {
            const id_empresa = req.user.id;
            const { id_cliente } = req.body;

            if (!mongoose.Types.ObjectId.isValid(id_cliente)) {
                return res.status(400).json({ message: 'ID do cliente inválido.' });
            }

            const programa = await Fidelidade.findOne({ id_empresa });
            if (!programa) {
                return res.status(404).json({ message: 'Programa não encontrado.' });
            }

            const cliente = programa.clientes.find(c => String(c.id_cliente) === String(id_cliente));
            if (!cliente) {
                return res.status(404).json({ message: 'Cliente não participa do programa.' });
            }

            cliente.carimbos += 1;
            await programa.save();

            const usuario = await Cliente.findById(id_cliente).select('nome email');
            if (!usuario) {
                return res.status(404).json({ message: 'Usuário não encontrado.' });
            }

            return res.json({
                nome: usuario.nome,
                email: usuario.email,
                carimbos: cliente.carimbos
            });
        } catch (error) {
            console.error('Erro carimbarCliente:', error);
            return res.status(500).json({ message: 'Erro ao dar carimbo.' });
        }
    }
};