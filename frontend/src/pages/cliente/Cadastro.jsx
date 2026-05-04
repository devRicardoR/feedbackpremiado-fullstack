import React, { useState, useEffect } from 'react';
import api, { setToken } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import bgCliente from '../../assets/fundolaranja.jpg';

export default function ClienteCadastro({ isEdit = false }) {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function carregarDados() {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/cliente/login');
                    return;
                }

                setToken(token);
                const response = await api.get('/clientes/me');
                const { nome, email } = response.data;

                setNome(nome);
                setEmail(email);
            } catch (error) {
                console.error(error);
                setErro('Erro ao carregar dados do perfil');
            }
        }

        if (isEdit) carregarDados();
    }, [isEdit, navigate]);

    async function handleSubmit(e) {
        e.preventDefault();
        setErro('');

        try {
            if (isEdit) {
                await api.put('/clientes/editar', { nome, email, senha });
                navigate('/cliente/painel');
            } else {
                await api.post('/clientes/cadastro', { nome, email, senha });
                navigate('/');
            }
        } catch (error) {
            setErro(error.response?.data?.message || 'Erro ao processar requisição');
        }
    }

    const cardClass =
        'w-full max-w-md bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-neonClient';

    const inputClass =
        'w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/60 outline-none focus:border-clientPrimary';

    return (
        <div
            className="min-h-screen font-poppins flex items-center justify-center text-white"
            style={{
                backgroundImage: `url(${bgCliente})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            {/* overlay */}
            <div className="w-full min-h-screen bg-black/40 flex items-center justify-center p-6">
                <div className={cardClass}>
                    <h1 className="text-2xl font-semibold mb-6 text-center">
                        {isEdit ? 'Editar perfil' : 'Cadastro'}
                    </h1>

                    {erro && (
                        <div className="bg-red-500/20 border border-red-500/30 p-3 rounded-xl text-sm mb-4">
                            {erro}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Nome completo"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                            className={inputClass}
                        />

                        <input
                            type="email"
                            placeholder="E-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className={inputClass}
                        />

                        <input
                            type="password"
                            placeholder={
                                isEdit
                                    ? 'Nova senha (opcional)'
                                    : 'Senha'
                            }
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            className={inputClass}
                            {...(!isEdit && { required: true })}
                        />

                        <button
                            type="submit"
                            className="w-full bg-clientPrimary hover:bg-clientSecondary py-3 rounded-xl font-semibold transition"
                        >
                            {isEdit ? 'Salvar alterações' : 'Cadastrar'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}