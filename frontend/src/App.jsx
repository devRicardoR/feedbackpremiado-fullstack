import React from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import bgEmpresa from './assets/fundo.jpg';
import bgCliente from './assets/fundolaranja.jpg';

// Escolha usuario login
import EscolhaUsuario from './pages/EscolhaUsuario';

// Cliente
import ClienteCadastro from './pages/cliente/Cadastro';
import ClienteLogin from './pages/cliente/Login';
import ClientePainel from './pages/cliente/Painel';
import LojaDetalhes from './pages/cliente/LojaDetalhes';
import ProgramaFidelizacao from './pages/cliente/ProgramaFidelizacao';

// Empresa
import EmpresaCadastro from './pages/empresa/Cadastro';
import EmpresaLogin from './pages/empresa/Login';
import EmpresaPainel from './pages/empresa/Painel';
import EmpresaRanking from './pages/empresa/Ranking';
import TarefasDaEmpresa from './pages/empresa/TarefasDaEmpresa';
import ProgramaFidelizacaoPainel from './pages/empresa/ProgramaFidelizacaoPainel';

// Proteção
import RotaProtegida from './components/RotaProtegida';

// Logout
import Logout from './components/Logout';

function IconHome() {
    return (
        <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4H9v4a2 2 0 0 1-2 2H3z" />
        </svg>
    );
}

function IconUser() {
    return (
        <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="12" cy="7" r="4" />
            <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
        </svg>
    );
}

function IconLogout() {
    return (
        <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1" />
        </svg>
    );
}

function Layout({ children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const tipo = localStorage.getItem('tipo');

    const isCliente = location.pathname.startsWith('/cliente');

    function handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('tipo');
        navigate('/');
    }

    function handleEditarPerfil() {
        if (tipo === 'empresa') navigate('/empresa/editar');
        else if (tipo === 'cliente') navigate('/cliente/editar');
    }

    function handleHome() {
        if (tipo === 'empresa') navigate('/empresa/painel');
        else if (tipo === 'cliente') navigate('/cliente/painel');
    }

    const glassClass = isCliente
        ? 'bg-black/40 backdrop-blur-xl border border-orange-400/30 text-white'
        : 'bg-black/40 backdrop-blur-xl border border-purple-400/30 text-white';

    const accentLine = isCliente
        ? 'bg-clientPrimary shadow-neonClient'
        : 'bg-primary shadow-neon';

    const bgOverlay = isCliente
        ? 'bg-gradient-to-br from-orange-900/70 via-orange-800/60 to-black/80'
        : 'bg-gradient-to-br from-purple-900/70 via-indigo-900/60 to-black/80';

    return (
        <div
            className="flex flex-col h-screen bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: `url(${isCliente ? bgCliente : bgEmpresa})`
            }}
        >
            <div className={`flex flex-col h-full ${bgOverlay}`}>

                <header className={`${glassClass} border-b shadow-lg p-4 text-center`}>
                    <h1 className="text-xl font-bold text-white">Feedback Premiado</h1>
                    <div className={`w-16 h-[2px] mx-auto mt-2 rounded-full ${accentLine}`}></div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 mb-24">
                    {children}
                </main>

                <footer className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md">
                    <div className={`${glassClass} rounded-2xl flex justify-around py-3 px-2 ${isCliente ? 'shadow-neonClient' : 'shadow-neon'}`}>
                        <button
                            onClick={handleHome}
                            className={`flex flex-col items-center text-gray-200 ${isCliente ? 'hover:text-clientAccent' : 'hover:text-accent'} transition`}
                        >
                            <IconHome />
                            <span className="text-xs">Home</span>
                        </button>

                        <button
                            onClick={handleEditarPerfil}
                            className={`flex flex-col items-center text-gray-200 ${isCliente ? 'hover:text-clientAccent' : 'hover:text-accent'} transition`}
                        >
                            <IconUser />
                            <span className="text-xs">Perfil</span>
                        </button>

                        <button
                            onClick={handleLogout}
                            className="flex flex-col items-center text-red-400 hover:text-red-300 transition"
                        >
                            <IconLogout />
                            <span className="text-xs">Sair</span>
                        </button>
                    </div>
                </footer>

            </div>
        </div>
    );
}

function App() {
    return (
        <Routes>

            {/* PAGINA NEUTRA */}
            <Route path="/" element={<EscolhaUsuario />} />

            {/* RESTO COM LAYOUT */}
            <Route
                path="/*"
                element={
                    <Layout>
                        <Routes>

                            <Route path="/cliente/cadastro" element={<ClienteCadastro />} />
                            <Route path="/cliente/login" element={<ClienteLogin />} />

                            <Route
                                path="/cliente/painel"
                                element={
                                    <RotaProtegida tipo="cliente">
                                        <ClientePainel />
                                    </RotaProtegida>
                                }
                            />

                            <Route
                                path="/cliente/loja/:id"
                                element={
                                    <RotaProtegida tipo="cliente">
                                        <LojaDetalhes />
                                    </RotaProtegida>
                                }
                            />

                            <Route
                                path="/cliente/fidelidade/:id_empresa"
                                element={
                                    <RotaProtegida tipo="cliente">
                                        <ProgramaFidelizacao />
                                    </RotaProtegida>
                                }
                            />

                            <Route
                                path="/cliente/editar"
                                element={
                                    <RotaProtegida tipo="cliente">
                                        <ClienteCadastro isEdit={true} />
                                    </RotaProtegida>
                                }
                            />

                            <Route path="/empresa/cadastro" element={<EmpresaCadastro />} />
                            <Route path="/empresa/login" element={<EmpresaLogin />} />

                            <Route
                                path="/empresa/painel"
                                element={
                                    <RotaProtegida tipo="empresa">
                                        <EmpresaPainel />
                                    </RotaProtegida>
                                }
                            />

                            <Route
                                path="/empresa/ranking"
                                element={
                                    <RotaProtegida tipo="empresa">
                                        <EmpresaRanking />
                                    </RotaProtegida>
                                }
                            />

                            <Route
                                path="/empresa/fidelidade"
                                element={
                                    <RotaProtegida tipo="empresa">
                                        <ProgramaFidelizacaoPainel />
                                    </RotaProtegida>
                                }
                            />

                            <Route
                                path="/empresa/editar"
                                element={
                                    <RotaProtegida tipo="empresa">
                                        <EmpresaCadastro isEdit={true} />
                                    </RotaProtegida>
                                }
                            />

                            <Route path="/empresa/:id/tarefas" element={<TarefasDaEmpresa />} />

                            <Route path="/logout" element={<Logout />} />

                        </Routes>
                    </Layout>
                }
            />

        </Routes>
    );
}

export default App;