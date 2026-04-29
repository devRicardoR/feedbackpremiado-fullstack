import React, { useState } from 'react';
import api, { setToken } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function EmpresaLogin() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setErro('');
        try {
            const response = await api.post('/login', { email, senha, tipo: 'empresa' });
            const { token } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('tipo', 'empresa');
            setToken(token);

            navigate('/empresa/painel');
        } catch (error) {
            setErro(error.response?.data?.message || 'Erro ao fazer login');
        }
    }

    return (
        <div className="min-h-screen font-poppins bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 flex flex-col">
            <header className="bg-black/30 backdrop-blur-sm p-4 text-center font-extrabold text-lg text-white shadow-md">
                Feedback Premiado
            </header>

            <main className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-sm">

                    {/* Card */}
                    <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-xl p-8">

                        {/* Ícone */}
                        <div className="flex justify-center mb-6">
                            <div className="bg-indigo-500/30 p-4 rounded-2xl">
                                <svg className="w-8 h-8 text-indigo-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0H5m14 0h2M5 21H3M9 7h1m-1 4h1m4-4h1m-1 4h1M9 21v-4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4" />
                                </svg>
                            </div>
                        </div>

                        <h1 className="text-2xl font-extrabold text-white text-center mb-1">
                            Acesso Empresa
                        </h1>
                        <p className="text-purple-300 text-sm text-center mb-8">
                            Entre com suas credenciais
                        </p>

                        {erro && (
                            <div className="mb-6 bg-red-500/20 border border-red-400/40 rounded-xl px-4 py-3 text-red-300 text-sm text-center">
                                {erro}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-purple-300 text-xs font-semibold mb-1 block uppercase tracking-wider">E-mail</label>
                                <input
                                    type="email"
                                    placeholder="empresa@email.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-white/10 placeholder-white/30 text-white outline-none border border-white/20 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40 transition"
                                />
                            </div>
                            <div>
                                <label className="text-purple-300 text-xs font-semibold mb-1 block uppercase tracking-wider">Senha</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={senha}
                                    onChange={e => setSenha(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-white/10 placeholder-white/30 text-white outline-none border border-white/20 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40 transition"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-indigo-500 hover:bg-indigo-400 text-white py-3 rounded-xl font-bold tracking-wide shadow-lg transition focus:ring-4 focus:ring-indigo-300 mt-2"
                            >
                                Entrar
                            </button>
                        </form>

                        <p className="mt-6 text-center text-white/50 text-sm">
                            Não tem conta?{' '}
                            <a href="/empresa/cadastro" className="text-indigo-300 hover:text-indigo-200 font-semibold transition">
                                Cadastre-se
                            </a>
                        </p>
                    </div>

                    {/* Botão voltar fora do card */}
                    <button
                        onClick={() => navigate('/')}
                        className="mt-6 w-full text-purple-300 hover:text-white text-sm font-semibold text-center transition"
                    >
                        Voltar para a pagina inicial
                    </button>
                </div>
            </main>

            <footer className="bg-black/20 backdrop-blur-sm border-t border-white/10 py-3 text-center text-xs text-purple-300">
                Feedback Premiado &copy; {new Date().getFullYear()}
            </footer>
        </div>
    );
}