const Empresa = require('../models/Empresa');
const Print = require('../models/Print');
const bcrypt = require('bcryptjs');
const axios = require('axios');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function obterCoordenadas(endereco) {
  try {
    await delay(1000);
    const enderecoFormatado = `${endereco.rua}, ${endereco.numero}, ${endereco.cidade}, ${endereco.estado}`;
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(enderecoFormatado)}`,
      { headers: { 'User-Agent': 'YourAppName' } }
    );
    return response.data[0] ? [parseFloat(response.data[0].lon), parseFloat(response.data[0].lat)] : null;
  } catch (error) {
    console.error('Erro ao obter coordenadas:', error);
    return null;
  }
}

exports.cadastro = async (req, res) => {
  try {
    const endereco = JSON.parse(req.body.endereco);
    const { nome, email, senha, cnpj_cpf } = req.body;

    if (!nome || !email || !senha || !cnpj_cpf) {
      return res.status(400).json({ message: 'Por favor, preencha todos os campos obrigatórios.' });
    }

    const empresaExistente = await Empresa.findOne({ email });
    if (empresaExistente) {
      return res.status(400).json({ message: 'Empresa já cadastrada com este email.' });
    }

    const coordenadas = await obterCoordenadas(endereco);
    if (!coordenadas) {
      return res.status(400).json({ message: 'Não foi possível geolocalizar o endereço.' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const novaEmpresa = new Empresa({
      nome,
      email,
      senha: senhaHash,
      cnpj_cpf,
      endereco: {
        ...endereco,
        localizacao: {
          type: 'Point',
          coordinates: coordenadas
        }
      },
      fachada: req.file?.filename
    });

    await novaEmpresa.save();
    return res.status(201).json({ message: 'Empresa cadastrada com sucesso!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao cadastrar empresa.' });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const empresa = await Empresa.findById(req.user.id);
    if (!empresa) return res.status(404).json({ message: 'Empresa não encontrada' });

    const { nome, email, senha, cnpj_cpf } = req.body;
    const endereco = req.body.endereco ? JSON.parse(req.body.endereco) : null;

    if (nome) empresa.nome = nome;
    if (email) empresa.email = email;
    if (cnpj_cpf) empresa.cnpj_cpf = cnpj_cpf;

    if (endereco) {
      const coordenadas = await obterCoordenadas(endereco);
      if (!coordenadas) {
        return res.status(400).json({ message: 'Não foi possível geolocalizar o novo endereço.' });
      }
      empresa.endereco = {
        ...endereco,
        localizacao: {
          type: 'Point',
          coordinates: coordenadas
        }
      };
    }

    if (senha?.trim()) {
      empresa.senha = await bcrypt.hash(senha, 10);
    }

    if (req.file) {
      empresa.fachada = req.file.filename;
    }

    await empresa.save();
    res.json({ message: 'Empresa atualizada com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar empresa.' });
  }
};

exports.listarEmpresas = async (req, res) => {
  try {
    const { nome = '', cidade = '' } = req.query;
    const filtro = {
      nome: { $regex: nome, $options: 'i' },
      'endereco.cidade': { $regex: cidade, $options: 'i' }
    };

    const empresas = await Empresa.find(filtro)
      .select('nome endereco printsCount')
      .lean();

    res.json(empresas.map(empresa => ({
      _id: empresa._id,
      nome: empresa.nome,
      endereco: empresa.endereco,
      printsConcluidos: empresa.printsCount || 0
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar empresas' });
  }
};

exports.rankingEmpresas = async (req, res) => {
  try {
    const ranking = await Empresa.find()
      .sort({ printsCount: -1 })
      .select('nome endereco printsCount')
      .lean();

    res.json(ranking.map((empresa, index) => ({
      empresaId: empresa._id,
      posicao: index + 1,
      nome: empresa.nome,
      cidade: empresa.endereco?.cidade || '',
      totalPrints: empresa.printsCount || 0 
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar ranking' });
  }
};

exports.detalharEmpresa = async (req, res) => {
  try {
    const empresa = await Empresa.findById(req.params.id)
      .select('-senha')
      .lean();
    if (!empresa) return res.status(404).json({ message: 'Empresa não encontrada' });
    res.json(empresa);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar empresa' });
  }
};

exports.me = async (req, res) => {
  try {
    const empresa = await Empresa.findById(req.user.id)
      .select('-senha')
      .lean();
    if (!empresa) return res.status(404).json({ message: 'Empresa não encontrada' });
    res.json(empresa);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar empresa' });
  }
};