import React from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

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

// Proteção de rotas
import RotaProtegida from './components/RotaProtegida';

// Logout
import Logout from './components/Logout';

function IconHome() {
    return (
        <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4H9v4a2 2 0 0 1-2 2H3z" />
        </svg>
    );
}

function IconUser() {
    return (
        <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 21a6.5 6.5 0 0 1 13 0" />
        </svg>
    );
}

function IconLogout() {
    return (
        <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1" />
        </svg>
    );
}

const ROTAS_SEM_LAYOUT = ['/', '/empresa/login', '/empresa/cadastro', '/cliente/login', '/cliente/cadastro', '/logout'];

function Layout({ children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const tipo = localStorage.getItem('tipo');

    const exibirLayout = !ROTAS_SEM_LAYOUT.includes(location.pathname);

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

    const headerFooterClass = 'bg-black bg-opacity-70 backdrop-blur-md text-white';

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {exibirLayout && (
                <header className={`${headerFooterClass} shadow p-4 text-center font-semibold text-lg`}>
                    Feedback Premiado
                </header>
            )}

            <main className={`flex-1 overflow-y-auto p-4 ${exibirLayout ? 'mb-20' : ''}`}>
                {children}
            </main>

            {exibirLayout && (
                <footer className={`${headerFooterClass} border-t shadow-md fixed bottom-0 w-full flex justify-around py-2`}>
                    <button onClick={handleHome} className="flex flex-col items-center">
                        <IconHome />
                        <span className="text-sm">Home</span>
                    </button>
                    <button onClick={handleEditarPerfil} className="flex flex-col items-center">
                        <IconUser />
                        <span className="text-sm">Editar Perfil</span>
                    </button>
                    <button onClick={handleLogout} className="flex flex-col items-center">
                        <IconLogout />
                        <span className="text-sm">Sair</span>
                    </button>
                </footer>
            )}
        </div>
    );
}

function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<EscolhaUsuario />} />

                <Route path="/cliente/cadastro" element={<ClienteCadastro />} />
                <Route path="/cliente/login" element={<ClienteLogin />} />

                <Route path="/empresa/cadastro" element={<EmpresaCadastro />} />
                <Route path="/empresa/login" element={<EmpresaLogin />} />

                <Route path="/cliente/painel" element={
                    <RotaProtegida tipo="cliente">
                        <ClientePainel />
                    </RotaProtegida>
                } />
                <Route path="/cliente/loja/:id" element={
                    <RotaProtegida tipo="cliente">
                        <LojaDetalhes />
                    </RotaProtegida>
                } />
                <Route path="/cliente/fidelidade/:id_empresa" element={
                    <RotaProtegida tipo="cliente">
                        <ProgramaFidelizacao />
                    </RotaProtegida>
                } />
                <Route path="/cliente/editar" element={
                    <RotaProtegida tipo="cliente">
                        <ClienteCadastro isEdit={true} />
                    </RotaProtegida>
                } />

                <Route path="/empresa/painel" element={
                    <RotaProtegida tipo="empresa">
                        <EmpresaPainel />
                    </RotaProtegida>
                } />
                <Route path="/empresa/ranking" element={
                    <RotaProtegida tipo="empresa">
                        <EmpresaRanking />
                    </RotaProtegida>
                } />
                <Route path="/empresa/fidelidade" element={
                    <RotaProtegida tipo="empresa">
                        <ProgramaFidelizacaoPainel />
                    </RotaProtegida>
                } />
                <Route path="/empresa/editar" element={
                    <RotaProtegida tipo="empresa">
                        <EmpresaCadastro isEdit={true} />
                    </RotaProtegida>
                } />
                <Route path="/empresa/:id/tarefas" element={<TarefasDaEmpresa />} />

                <Route path="/logout" element={<Logout />} />
            </Routes>
        </Layout>
    );
}

export default App;