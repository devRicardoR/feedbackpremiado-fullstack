import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function EscolhaUsuario() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen font-poppins bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 flex flex-col">
            {/* Cabeçalho */}
            <header className="bg-black/30 backdrop-blur-sm p-4 text-center font-extrabold text-lg text-white shadow-md">
                Feedback Premiado
            </header>

            {/* Conteúdo centralizado */}
            <main className="flex flex-col items-center justify-center flex-1 gap-6 px-6">
                <div className="text-center mb-2">
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">
                        Bem-vindo
                    </h1>
                    <p className="text-purple-300 text-sm mt-1">Selecione como deseja acessar</p>
                </div>

                <div className="flex flex-col gap-4 w-full max-w-xs">
                    <button
                        onClick={() => navigate('/cliente/login')}
                        className="w-full px-8 py-4 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-2xl shadow-lg transition focus:ring-4 focus:ring-indigo-300"
                    >
                        Sou Cliente
                    </button>

                    <button
                        onClick={() => navigate('/empresa/login')}
                        className="w-full px-8 py-4 bg-purple-500 hover:bg-purple-400 text-white font-bold rounded-2xl shadow-lg transition focus:ring-4 focus:ring-purple-300"
                    >
                        Sou Empresa
                    </button>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-black/20 backdrop-blur-sm border-t border-white/10 py-3 text-center text-xs text-purple-300">
                Feedback Premiado &copy; {new Date().getFullYear()}
            </footer>
        </div>
    );
}