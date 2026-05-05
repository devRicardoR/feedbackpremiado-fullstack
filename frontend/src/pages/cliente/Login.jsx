import React, { useState } from 'react';
import api, { setToken } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import bgCliente from '../../assets/fundolaranja.jpg';

export default function ClienteLogin() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setErro('');
        try {
            const response = await api.post('/login', { email, senha, tipo: 'cliente' });
            const { token } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('tipo', 'cliente');
            setToken(token);

            navigate('/cliente/painel');
        } catch (error) {
            setErro(error.response?.data?.message || 'Erro ao fazer login');
        }
    }

    function handleVoltar() {
        navigate('/');
    }

    function handleCadastro(e) {
        e.preventDefault();
        navigate('/cliente/cadastro');
    }

    return (
        <div
            className="min-h-screen font-poppins flex items-center justify-center p-6 bg-cover bg-center"
            style={{ backgroundImage: `url(${bgCliente})` }}
        >
            <div className="min-h-screen w-full flex items-center justify-center bg-black/60">

                <div className="max-w-md w-full bg-black/40 backdrop-blur-xl rounded-3xl border border-orange-300/30 shadow-neonClient p-8">

                    <h1 className="text-3xl font-extrabold mb-8 text-white text-center uppercase tracking-wide">
                        Login Cliente
                    </h1>

                    {erro && (
                        <p className="mb-6 text-red-400 font-semibold text-center">
                            {erro}
                        </p>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">

                        <input
                            type="email"
                            placeholder="E-mail"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className="w-full px-5 py-3 rounded-2xl bg-white/20 placeholder-white/70 text-white outline-none focus:ring-2 focus:ring-clientAccent"
                        />

                        <input
                            type="password"
                            placeholder="Senha"
                            value={senha}
                            onChange={e => setSenha(e.target.value)}
                            required
                            className="w-full px-5 py-3 rounded-2xl bg-white/20 placeholder-white/70 text-white outline-none focus:ring-2 focus:ring-clientAccent"
                        />

                        <button
                            type="submit"
                            className="w-full bg-clientPrimary hover:bg-clientSecondary text-white py-3 rounded-2xl font-bold tracking-wide shadow-neonClient transition"
                        >
                            Entrar
                        </button>

                    </form>

                    <p className="mt-6 text-center text-white/80">
                        Não tem conta?{' '}
                        <button
                            onClick={handleCadastro}
                            type="button"
                            className="text-white font-semibold hover:underline"
                        >
                            Cadastre-se
                        </button>
                    </p>

                    <div className="mt-8 text-center">
                        <button
                            onClick={handleVoltar}
                            type="button"
                            className="bg-white/10 hover:bg-white/20 text-white py-2 px-6 rounded-xl font-medium transition"
                        >
                            Voltar
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}