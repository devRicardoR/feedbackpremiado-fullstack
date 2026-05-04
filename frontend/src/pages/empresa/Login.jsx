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

    const inputClass =
        "w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-400 outline-none focus:border-primary transition";

    return (
        <div className="min-h-screen font-poppins bg-[url('/src/assets/fundo.jpg')] bg-cover bg-center flex flex-col">

            {/* overlay */}
            <div className="min-h-screen bg-black/70 flex flex-col">

                <main className="flex-1 flex items-center justify-center p-6">
                    <div className="w-full max-w-sm">

                        <div className="bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-8">

                            <div className="text-center mb-6">
                                <h1 className="text-2xl font-bold text-white">
                                    Acesso Empresa
                                </h1>
                                <p className="text-gray-400 text-sm mt-1">
                                    Entre com suas credenciais
                                </p>
                            </div>

                            {erro && (
                                <div className="mb-4 bg-red-500/20 border border-red-500/30 rounded-xl px-4 py-3 text-red-300 text-sm text-center">
                                    {erro}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">

                                <input
                                    type="email"
                                    placeholder="E-mail"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    className={inputClass}
                                />

                                <input
                                    type="password"
                                    placeholder="Senha"
                                    value={senha}
                                    onChange={e => setSenha(e.target.value)}
                                    required
                                    className={inputClass}
                                />

                                <button
                                    type="submit"
                                    className="w-full bg-primary hover:bg-secondary py-3 rounded-xl font-semibold transition"
                                >
                                    Entrar
                                </button>
                            </form>

                            <p className="mt-6 text-center text-gray-400 text-sm">
                                Não tem conta?{' '}
                                <a href="/empresa/cadastro" className="text-primary hover:text-accent transition">
                                    Cadastre-se
                                </a>
                            </p>
                        </div>

                        <button
                            onClick={() => navigate('/')}
                            className="mt-6 w-full text-gray-400 hover:text-white text-sm transition"
                        >
                            Voltar
                        </button>
                    </div>
                </main>

                <footer className="bg-black/80 backdrop-blur-md border-t border-white/10 py-3 text-center text-xs text-gray-400">
                    Feedback Premiado © {new Date().getFullYear()}
                </footer>
            </div>
        </div>
    );
}