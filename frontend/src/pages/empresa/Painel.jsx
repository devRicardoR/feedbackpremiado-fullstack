import React, { useState, useEffect } from 'react';
import api, { setToken } from '../../services/api';

export default function EmpresaPainel() {
    const [empresa, setEmpresa] = useState(null);
    const [tarefas, setTarefas] = useState([]);
    const [prints, setPrints] = useState([]);
    const [novaTarefa, setNovaTarefa] = useState({ descricao: '', link: '', desconto: '' });
    const [mensagem, setMensagem] = useState('');
    const [erro, setErro] = useState('');
    const [editandoTarefaId, setEditandoTarefaId] = useState(null);
    const [tarefaEditada, setTarefaEditada] = useState({ descricao: '', link: '', desconto: '' });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;
        setToken(token);
        carregarDados();
    }, []);

    async function carregarDados() {
        try {
            const resEmpresa = await api.get('/empresas/me');
            setEmpresa(resEmpresa.data);
            const resTarefas = await api.get('/tarefas/minhas');
            setTarefas(resTarefas.data);
            const resPrints = await api.get(`/prints/empresa/${resEmpresa.data._id}`);
            setPrints(resPrints.data);
        } catch (e) {
            console.error(e);
            setErro('Erro ao carregar dados');
        }
    }

    async function criarTarefa(e) {
        e.preventDefault();
        setErro(''); setMensagem('');
        try {
            const res = await api.post('/tarefas', { ...novaTarefa, desconto: Number(novaTarefa.desconto) });
            setMensagem('Tarefa criada com sucesso!');
            setNovaTarefa({ descricao: '', link: '', desconto: '' });
            setTarefas([...tarefas, res.data]);
        } catch (e) {
            console.error(e);
            setErro('Erro ao criar tarefa');
        }
    }

    function iniciarEdicao(tarefa) {
        setEditandoTarefaId(tarefa._id);
        setTarefaEditada({ descricao: tarefa.descricao, link: tarefa.link, desconto: tarefa.desconto });
        setMensagem(''); setErro('');
    }

    function cancelarEdicao() {
        setEditandoTarefaId(null);
        setTarefaEditada({ descricao: '', link: '', desconto: '' });
    }

    async function salvarEdicao(e) {
        e.preventDefault();
        setErro(''); setMensagem('');
        try {
            const res = await api.put(`/tarefas/${editandoTarefaId}`, { ...tarefaEditada, desconto: Number(tarefaEditada.desconto) });
            setMensagem('Tarefa editada com sucesso!');
            setTarefas(tarefas.map(t => (t._id === editandoTarefaId ? res.data : t)));
            cancelarEdicao();
        } catch (e) {
            console.error(e);
            setErro('Erro ao editar tarefa');
        }
    }

    async function excluirTarefa(id) {
        if (!window.confirm('Tem certeza que quer excluir esta tarefa?')) return;
        try {
            await api.delete(`/tarefas/${id}`);
            setTarefas(tarefas.filter(t => t._id !== id));
            setMensagem('Tarefa excluída com sucesso!');
        } catch (e) {
            console.error(e);
            setErro('Erro ao excluir tarefa');
        }
    }

    async function excluirPrint(id) {
        if (!window.confirm('Confirma exclusão do print?')) return;
        try {
            await api.delete(`/prints/${id}`);
            setPrints(prints.filter(p => p._id !== id));
        } catch (e) {
            console.error(e);
            setErro('Erro ao excluir print');
        }
    }

    const inputClass = "w-full px-4 py-3 rounded-xl bg-white/10 placeholder-white/30 text-white outline-none border border-white/20 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40 transition";
    const cardClass = "bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg";

    if (!empresa) return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 flex items-center justify-center">
            <p className="text-purple-300 font-poppins">Carregando...</p>
        </div>
    );

    return (
        <div className="min-h-screen font-poppins bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white p-6 space-y-6">

            {/* Fachada + Nome */}
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        {empresa.fachada ? (
                            <img
                                src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/prints/${empresa.fachada}`}
                                alt="Fachada da empresa"
                                className="w-24 h-24 object-cover rounded-full border-4 border-indigo-400/50 shadow-lg"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-indigo-500/30 border-4 border-indigo-400/50 flex items-center justify-center">
                                <svg className="w-10 h-10 text-indigo-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0H5m14 0h2M5 21H3M9 7h1m-1 4h1m4-4h1m-1 4h1M9 21v-4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4" />
                                </svg>
                            </div>
                        )}
                    </div>
                    <h1 className="text-3xl font-extrabold text-white">{empresa.nome}</h1>
                    <p className="text-purple-300 text-sm mt-1">Painel da Empresa</p>
                </div>

            {/* Dados da Empresa */}
            <div className={cardClass}>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-indigo-400 rounded-full inline-block"></span>
                    Dados da Empresa
                </h3>
                <div className="space-y-1 text-sm text-purple-200">
                    <p><span className="text-white font-semibold">CNPJ/CPF:</span> {empresa.cnpj_cpf}</p>
                    <p><span className="text-white font-semibold">Email:</span> {empresa.email}</p>
                    <p><span className="text-white font-semibold">Endereço:</span> {empresa.endereco?.rua}, {empresa.endereco?.numero} - {empresa.endereco?.cidade}</p>
                </div>
            </div>

            {/* Nova Tarefa */}
            <div className={cardClass}>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-indigo-400 rounded-full inline-block"></span>
                    Nova Tarefa
                </h3>
                {erro && <div className="mb-4 bg-red-500/20 border border-red-400/40 rounded-xl px-4 py-2 text-red-300 text-sm">{erro}</div>}
                {mensagem && <div className="mb-4 bg-green-500/20 border border-green-400/40 rounded-xl px-4 py-2 text-green-300 text-sm">{mensagem}</div>}
                <form onSubmit={criarTarefa} className="space-y-3">
                    <input type="text" placeholder="Descrição" value={novaTarefa.descricao} onChange={e => setNovaTarefa({ ...novaTarefa, descricao: e.target.value })} className={inputClass} required />
                    <input type="url" placeholder="Link" value={novaTarefa.link} onChange={e => setNovaTarefa({ ...novaTarefa, link: e.target.value })} className={inputClass} required />
                    <input type="number" placeholder="Desconto (%)" value={novaTarefa.desconto} onChange={e => setNovaTarefa({ ...novaTarefa, desconto: e.target.value })} className={inputClass} min="1" max="100" required />
                    <button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-400 text-white py-3 rounded-xl font-bold transition focus:ring-4 focus:ring-indigo-300">
                        Criar Tarefa
                    </button>
                </form>
            </div>

            {/* Minhas Tarefas */}
            <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-purple-400 rounded-full inline-block"></span>
                    Minhas Tarefas
                </h3>
                {tarefas.length === 0 ? (
                    <p className="text-purple-300 text-sm">Nenhuma tarefa cadastrada.</p>
                ) : (
                    <ul className="space-y-3">
                        {tarefas.map(tarefa => (
                            <li key={tarefa._id} className={`${cardClass} flex justify-between items-start`}>
                                <div className="flex-1 pr-4">
                                    {editandoTarefaId === tarefa._id ? (
                                        <form onSubmit={salvarEdicao} className="space-y-3">
                                            <input type="text" value={tarefaEditada.descricao} onChange={e => setTarefaEditada({ ...tarefaEditada, descricao: e.target.value })} className={inputClass} />
                                            <input type="url" value={tarefaEditada.link} onChange={e => setTarefaEditada({ ...tarefaEditada, link: e.target.value })} className={inputClass} />
                                            <input type="number" value={tarefaEditada.desconto} onChange={e => setTarefaEditada({ ...tarefaEditada, desconto: e.target.value })} className={inputClass} min="1" max="100" />
                                            <div className="flex gap-2">
                                                <button type="submit" className="bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-xl text-sm font-semibold transition">Salvar</button>
                                                <button type="button" onClick={cancelarEdicao} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm font-semibold transition">Cancelar</button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="space-y-1 text-sm text-purple-200">
                                            <p><span className="text-white font-semibold">Descrição:</span> {tarefa.descricao}</p>
                                            <a href={tarefa.link} target="_blank" rel="noreferrer" className="inline-block mt-1 bg-indigo-500/30 hover:bg-indigo-500/50 text-indigo-300 px-3 py-1 rounded-lg text-xs font-semibold transition">
                                                Acessar Link
                                            </a>
                                            <p className="mt-1"><span className="text-white font-semibold">Desconto:</span> {tarefa.desconto}%</p>
                                        </div>
                                    )}
                                </div>
                                {editandoTarefaId !== tarefa._id && (
                                    <div className="flex flex-col gap-2">
                                        <button onClick={() => iniciarEdicao(tarefa)} className="bg-indigo-500/30 hover:bg-indigo-500/50 text-indigo-300 px-3 py-1 rounded-lg text-xs font-semibold transition">Editar</button>
                                        <button onClick={() => excluirTarefa(tarefa._id)} className="bg-red-500/20 hover:bg-red-500/40 text-red-300 px-3 py-1 rounded-lg text-xs font-semibold transition">Excluir</button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Programa de Fidelidade */}
            <div className={cardClass}>
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <span className="w-1 h-5 bg-purple-400 rounded-full inline-block"></span>
                    Programa de Fidelidade
                </h3>
                <p className="text-purple-300 text-sm mb-4">Engaje seus clientes oferecendo recompensas ao completar ações.</p>
                <a href="/empresa/fidelidade" className="inline-block bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition">
                    Criar ou Gerenciar Programa
                </a>
            </div>

            {/* Prints Recebidos */}
            <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-purple-400 rounded-full inline-block"></span>
                    Prints Recebidos
                </h3>
                {prints.length === 0 ? (
                    <p className="text-purple-300 text-sm">Nenhum print recebido ainda.</p>
                ) : (
                    <ul className="space-y-3 max-h-96 overflow-y-auto">
                        {prints.map(print => (
                            <li key={print._id} className={`${cardClass} flex gap-4 items-center`}>
                                <img
                                    src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/prints/${print.imagem}`}
                                    alt="Print"
                                    className="w-16 h-16 object-cover rounded-xl flex-shrink-0"
                                />
                                <div className="flex-1 text-sm text-purple-200">
                                    <p><span className="text-white font-semibold">Cliente:</span> {print.id_cliente?.nome || 'Desconhecido'}</p>
                                    <p className="text-xs mt-1">{print.id_cliente?.email || 'sem e-mail'}</p>
                                    <p className="text-xs mt-1 text-white/40">{new Date(print.data_upload).toLocaleString()}</p>
                                </div>
                                <button onClick={() => excluirPrint(print._id)} className="bg-red-500/20 hover:bg-red-500/40 text-red-300 px-3 py-1 rounded-lg text-xs font-semibold transition flex-shrink-0">
                                    Excluir
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Ranking */}
            <div className="text-center pb-4">
                <a href="/empresa/ranking" className="inline-block bg-purple-500 hover:bg-purple-400 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition">
                    Ver Ranking Geral
                </a>
            </div>
        </div>
    );
}