import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function EscolhaUsuario() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen font-poppins flex flex-col bg-gradient-to-br from-[#1e1b4b] via-[#4c1d95] to-[#ea580c]">

            {/* Header mais leve */}
            <header className="bg-white/10 backdrop-blur-xl border-b border-white/20 p-5 text-center">
                <h1 className="text-white text-xl font-bold tracking-wide">
                    Feedback Premiado
                </h1>
                <div className="w-12 h-[2px] bg-white/40 mx-auto mt-2 rounded-full"></div>
            </header>

            {/* Main */}
            <main className="flex flex-col items-center justify-center flex-1 px-6">

                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                        Bem-vindo
                    </h1>
                    <p className="text-white/80 text-sm mt-2">
                        Escolha como deseja acessar
                    </p>
                </div>

                <div className="w-full max-w-xs space-y-5">

                    {/* Cliente */}
                    <button
                        onClick={() => navigate('/cliente/login')}
                        className="w-full py-4 rounded-2xl bg-clientPrimary hover:bg-clientSecondary text-white font-semibold shadow-neonClient transition transform hover:scale-[1.03]"
                    >
                        Cliente
                    </button>

                    {/* Empresa */}
                    <button
                        onClick={() => navigate('/empresa/login')}
                        className="w-full py-4 rounded-2xl bg-primary hover:bg-secondary text-white font-semibold shadow-neon transition transform hover:scale-[1.03]"
                    >
                        Empresa
                    </button>

                </div>

            </main>

            {/* Footer */}
            <footer className="bg-white/10 backdrop-blur-xl border-t border-white/20 py-4 text-center text-xs text-white/70">
                Feedback Premiado © {new Date().getFullYear()}
            </footer>

        </div>
    );
}