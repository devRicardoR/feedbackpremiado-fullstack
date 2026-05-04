import React, { useState, useEffect } from 'react';
import api, { setToken } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function EmpresaPainel() {
    const navigate = useNavigate();

    const [empresa, setEmpresa] = useState(null);
    const [tarefas, setTarefas] = useState([]);
    const [prints, setPrints] = useState([]);

    const [novaTarefa, setNovaTarefa] = useState({
        descricao: '',
        link: '',
        desconto: ''
    });

    const [mensagem, setMensagem] = useState('');
    const [erro, setErro] = useState('');

    const [editandoTarefaId, setEditandoTarefaId] = useState(null);
    const [tarefaEditada, setTarefaEditada] = useState({
        descricao: '',
        link: '',
        desconto: ''
    });

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
        setErro('');
        setMensagem('');

        try {
            const res = await api.post('/tarefas', {
                ...novaTarefa,
                desconto: Number(novaTarefa.desconto)
            });

            setMensagem('Tarefa criada com sucesso');
            setNovaTarefa({ descricao: '', link: '', desconto: '' });
            setTarefas([...tarefas, res.data]);
        } catch (e) {
            console.error(e);
            setErro('Erro ao criar tarefa');
        }
    }

    function iniciarEdicao(tarefa) {
        setEditandoTarefaId(tarefa._id);
        setTarefaEditada({
            descricao: tarefa.descricao,
            link: tarefa.link,
            desconto: tarefa.desconto
        });
    }

    function cancelarEdicao() {
        setEditandoTarefaId(null);
        setTarefaEditada({ descricao: '', link: '', desconto: '' });
    }

    async function salvarEdicao(e) {
        e.preventDefault();
        setErro('');
        setMensagem('');

        try {
            const res = await api.put(`/tarefas/${editandoTarefaId}`, {
                ...tarefaEditada,
                desconto: Number(tarefaEditada.desconto)
            });

            setTarefas(
                tarefas.map((t) =>
                    t._id === editandoTarefaId ? res.data : t
                )
            );

            setMensagem('Tarefa atualizada com sucesso');
            cancelarEdicao();
        } catch (e) {
            console.error(e);
            setErro('Erro ao editar tarefa');
        }
    }

    async function excluirTarefa(id) {
        if (!window.confirm('Deseja excluir esta tarefa?')) return;

        try {
            await api.delete(`/tarefas/${id}`);
            setTarefas(tarefas.filter((t) => t._id !== id));
            setMensagem('Tarefa removida com sucesso');
        } catch (e) {
            console.error(e);
            setErro('Erro ao excluir tarefa');
        }
    }

    async function excluirPrint(id) {
        if (!window.confirm('Deseja excluir este print?')) return;

        try {
            await api.delete(`/prints/${id}`);
            setPrints(prints.filter((p) => p._id !== id));
        } catch (e) {
            console.error(e);
            setErro('Erro ao excluir print');
        }
    }

    const cardClass =
        'bg-black/55 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl';

    const inputClass =
        'w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-400 outline-none focus:border-primary';

    if (!empresa) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                Carregando...
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white font-poppins p-4 space-y-6">

            {/* TOPO */}
            <div className="text-center">
                <div className="flex justify-center mb-4">
                    {empresa.fachada ? (
                        <img
                            src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/prints/${empresa.fachada}`}
                            alt="Empresa"
                            className="w-24 h-24 object-cover rounded-full border-2 border-primary shadow-lg"
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-black/40 border border-white/10 flex items-center justify-center">
                            <span className="text-3xl font-bold">
                                {empresa.nome?.charAt(0)}
                            </span>
                        </div>
                    )}
                </div>

                <h1 className="text-2xl font-bold">{empresa.nome}</h1>
                <p className="text-gray-300 text-sm">Painel empresarial</p>
            </div>

            {/* ALERTAS */}
            {erro && (
                <div className="bg-red-500/20 border border-red-500/30 p-3 rounded-xl text-red-300 text-sm">
                    {erro}
                </div>
            )}

            {mensagem && (
                <div className="bg-green-500/20 border border-green-500/30 p-3 rounded-xl text-green-300 text-sm">
                    {mensagem}
                </div>
            )}

            {/* DADOS */}
            <div className={cardClass}>
                <h2 className="text-lg font-semibold mb-3">
                    Dados da empresa
                </h2>

                <div className="space-y-2 text-gray-300 text-sm">
                    <p><span className="text-white">Email:</span> {empresa.email}</p>
                    <p><span className="text-white">CNPJ/CPF:</span> {empresa.cnpj_cpf}</p>
                </div>
            </div>

            {/* FIDELIDADE */}
            <div className={`${cardClass} border border-primary/20`}>
                <h2 className="text-lg font-semibold mb-2">
                    Programa de Fidelidade
                </h2>

                <p className="text-gray-400 text-sm mb-4">
                    Crie recompensas e aumente o retorno dos seus clientes.
                </p>

                <button
                    onClick={() => navigate('/empresa/fidelidade')}
                    className="w-full bg-primary hover:bg-secondary py-3 rounded-xl font-semibold transition"
                >
                    Gerenciar programa
                </button>
            </div>

            {/* NOVA TAREFA */}
            <div className={cardClass}>
                <h2 className="text-lg font-semibold mb-4">
                    Nova tarefa
                </h2>

                <form onSubmit={criarTarefa} className="space-y-3">
                    <input
                        type="text"
                        placeholder="Descrição"
                        value={novaTarefa.descricao}
                        onChange={(e) =>
                            setNovaTarefa({ ...novaTarefa, descricao: e.target.value })
                        }
                        className={inputClass}
                        required
                    />

                    <input
                        type="url"
                        placeholder="Link"
                        value={novaTarefa.link}
                        onChange={(e) =>
                            setNovaTarefa({ ...novaTarefa, link: e.target.value })
                        }
                        className={inputClass}
                        required
                    />

                    <input
                        type="number"
                        placeholder="Desconto"
                        value={novaTarefa.desconto}
                        onChange={(e) =>
                            setNovaTarefa({ ...novaTarefa, desconto: e.target.value })
                        }
                        className={inputClass}
                        required
                    />

                    <button className="w-full bg-primary hover:bg-secondary py-3 rounded-xl font-semibold">
                        Criar tarefa
                    </button>
                </form>
            </div>

            {/* LISTA DE TAREFAS */}
            <div>
                <h2 className="text-lg font-semibold mb-4">
                    Minhas tarefas
                </h2>

                <div className="space-y-3">
                    {tarefas.map((tarefa) => (
                        <div key={tarefa._id} className={cardClass}>
                            {editandoTarefaId === tarefa._id ? (
                                <form onSubmit={salvarEdicao} className="space-y-3">

                                    <input
                                        type="text"
                                        value={tarefaEditada.descricao}
                                        onChange={(e) =>
                                            setTarefaEditada({
                                                ...tarefaEditada,
                                                descricao: e.target.value
                                            })
                                        }
                                        className={inputClass}
                                    />

                                    <input
                                        type="url"
                                        value={tarefaEditada.link}
                                        onChange={(e) =>
                                            setTarefaEditada({
                                                ...tarefaEditada,
                                                link: e.target.value
                                            })
                                        }
                                        className={inputClass}
                                    />

                                    <input
                                        type="number"
                                        value={tarefaEditada.desconto}
                                        onChange={(e) =>
                                            setTarefaEditada({
                                                ...tarefaEditada,
                                                desconto: e.target.value
                                            })
                                        }
                                        className={inputClass}
                                    />

                                    <div className="flex gap-2">
                                        <button className="bg-primary px-4 py-2 rounded-lg text-sm">
                                            Salvar
                                        </button>

                                        <button
                                            type="button"
                                            onClick={cancelarEdicao}
                                            className="bg-gray-700 px-4 py-2 rounded-lg text-sm"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <p className="font-semibold">
                                        {tarefa.descricao}
                                    </p>

                                    <p className="text-sm text-gray-400 mt-1">
                                        Desconto: {tarefa.desconto}%
                                    </p>

                                    <div className="flex gap-2 mt-4">
                                        <button
                                            onClick={() => iniciarEdicao(tarefa)}
                                            className="bg-primary px-4 py-2 rounded-lg text-sm"
                                        >
                                            Editar
                                        </button>

                                        <button
                                            onClick={() => excluirTarefa(tarefa._id)}
                                            className="bg-red-500 px-4 py-2 rounded-lg text-sm"
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* PRINTS */}
            <div>
                <h2 className="text-lg font-semibold mb-4">
                    Prints recebidos
                </h2>

                <div className="space-y-3">
                    {prints.map((print) => (
                        <div
                            key={print._id}
                            className={`${cardClass} flex gap-4 items-center`}
                        >
                            <img
                                src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/prints/${print.imagem}`}
                                className="w-16 h-16 rounded-xl object-cover"
                            />

                            <div className="flex-1">
                                <p>{print.id_cliente?.nome}</p>
                                <p className="text-sm text-gray-400">
                                    {print.id_cliente?.email}
                                </p>
                            </div>

                            <button
                                onClick={() => excluirPrint(print._id)}
                                className="bg-red-500 px-3 py-2 rounded-lg text-sm"
                            >
                                Excluir
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* RANKING */}
            <div className={cardClass}>
                <h2 className="text-lg font-semibold mb-3">
                    Ranking
                </h2>

                <p className="text-gray-400 text-sm mb-4">
                    Veja sua posição entre outras empresas
                </p>

                <button
                    onClick={() => navigate('/empresa/ranking')}
                    className="w-full bg-primary hover:bg-secondary py-3 rounded-xl font-semibold transition"
                >
                    Ver ranking geral
                </button>
            </div>

        </div>
    );
}