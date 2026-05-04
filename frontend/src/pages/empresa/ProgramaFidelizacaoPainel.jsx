import React, { useEffect, useState } from "react";
import api, { setToken } from "../../services/api";
import fundo from "../../assets/fundo.jpg";

export default function ProgramaFidelizacaoPainel() {
    const [empresa, setEmpresa] = useState(null);
    const [programa, setPrograma] = useState(null);
    const [regras, setRegras] = useState("");
    const [beneficios, setBeneficios] = useState("");
    const [meta, setMeta] = useState(10);
    const [clientes, setClientes] = useState([]);
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");

    useEffect(() => {
        async function init() {
            const token = localStorage.getItem("token");
            if (!token) {
                setErro("Usuário não autenticado.");
                return;
            }

            setToken(token);

            try {
                const resEmpresa = await api.get("/empresas/me");
                if (!resEmpresa.data?._id) {
                    setErro("Erro ao carregar dados da empresa");
                    return;
                }
                setEmpresa(resEmpresa.data);
                await carregarPrograma(resEmpresa.data._id);
            } catch (err) {
                console.error(err);
                setErro("Erro ao carregar empresa");
            }
        }

        init();
    }, []);

    async function carregarPrograma(id_empresa) {
        try {
            const response = await api.get(`/fidelidade/${id_empresa}`);
            setPrograma(response.data);
            setRegras(response.data.regras || "");
            setBeneficios(response.data.beneficios || "");
            setMeta(response.data.meta || 10);

            if (response.data.clientes?.length > 0) {
                const clientesComDados = await Promise.all(
                    response.data.clientes.map(async (cliente) => {
                        if (cliente.id_cliente) {
                            try {
                                const resCliente = await api.get(`/clientes/${cliente.id_cliente}`);
                                return {
                                    ...cliente,
                                    nome: resCliente.data.nome,
                                    email: resCliente.data.email,
                                };
                            } catch {
                                return cliente;
                            }
                        }
                        return cliente;
                    })
                );
                setClientes(clientesComDados);
            } else {
                setClientes([]);
            }

            setErro("");
            setMensagem("");
        } catch (err) {
            if (err.response?.status === 404) {
                setPrograma(null);
                setRegras("");
                setBeneficios("");
                setMeta(10);
                setClientes([]);
            } else {
                setErro("Erro ao carregar programa");
            }
        }
    }

    async function criarPrograma() {
        setErro("");
        setMensagem("");
        try {
            const response = await api.post("/fidelidade", {
                regras,
                beneficios,
                meta,
            });
            setMensagem("Programa criado com sucesso!");
            setPrograma(response.data);
            await carregarPrograma(empresa._id);
        } catch {
            setErro("Erro ao criar programa");
        }
    }

    async function atualizarPrograma() {
        setErro("");
        setMensagem("");
        try {
            const response = await api.put("/fidelidade", {
                regras,
                beneficios,
                meta,
            });
            setMensagem("Programa atualizado com sucesso!");
            setPrograma(response.data);
        } catch {
            setErro("Erro ao atualizar programa");
        }
    }

    async function darCarimbo(id_cliente) {
        setErro("");
        setMensagem("");
        try {
            await api.post("/fidelidade/carimbar", {
                id_empresa: empresa._id,
                id_cliente,
            });
            setMensagem("Carimbo adicionado!");
            await carregarPrograma(empresa._id);
        } catch {
            setErro("Erro ao adicionar carimbo");
        }
    }

    const renderCarimbos = (carimbosRecebidos) => {
        return (
            <div className="grid grid-cols-5 gap-2 mt-2">
                {Array.from({ length: meta }).map((_, index) => (
                    <div
                        key={index}
                        className="w-12 h-12 rounded-xl flex items-center justify-center border border-white/10 bg-white/5"
                    >
                        {index < carimbosRecebidos && (
                            <img
                                src="/dar-carimbo.png"
                                alt="Carimbo"
                                className="w-8 h-8"
                            />
                        )}
                    </div>
                ))}
            </div>
        );
    };

    if (erro) {
        return (
            <div
                className="min-h-screen bg-cover bg-center flex items-center justify-center"
                style={{ backgroundImage: `url(${fundo})` }}
            >
                <div className="bg-black/80 p-6 rounded-2xl text-white">
                    {erro}
                </div>
            </div>
        );
    }

    if (!empresa) {
        return (
            <div
                className="min-h-screen bg-cover bg-center flex items-center justify-center text-white"
                style={{ backgroundImage: `url(${fundo})` }}
            >
                Carregando...
            </div>
        );
    }

    return (
        <div
            className="min-h-screen bg-cover bg-center p-6"
            style={{ backgroundImage: `url(${fundo})` }}
        >
            <div className="max-w-3xl mx-auto bg-black/70 backdrop-blur-xl p-8 rounded-3xl border border-white/10 text-white">

                <h1 className="text-2xl font-bold text-center mb-6">
                    Painel de Fidelidade
                </h1>

                {mensagem && (
                    <p className="text-green-400 text-center mb-4">
                        {mensagem}
                    </p>
                )}

                <div className="space-y-4">
                    <textarea
                        value={regras}
                        onChange={(e) => setRegras(e.target.value)}
                        placeholder="Regras"
                        className="w-full p-3 rounded-xl bg-white/5 border border-white/10"
                    />

                    <textarea
                        value={beneficios}
                        onChange={(e) => setBeneficios(e.target.value)}
                        placeholder="Benefícios"
                        className="w-full p-3 rounded-xl bg-white/5 border border-white/10"
                    />

                    <input
                        type="number"
                        value={meta}
                        onChange={(e) => setMeta(Number(e.target.value))}
                        className="w-full p-3 rounded-xl bg-white/5 border border-white/10"
                    />

                    {!programa ? (
                        <button
                            onClick={criarPrograma}
                            className="w-full bg-white text-black py-3 rounded-xl font-bold"
                        >
                            Criar Programa
                        </button>
                    ) : (
                        <button
                            onClick={atualizarPrograma}
                            className="w-full bg-white text-black py-3 rounded-xl font-bold"
                        >
                            Atualizar Programa
                        </button>
                    )}
                </div>

                {programa && (
                    <div className="mt-8">
                        <h2 className="text-lg font-semibold mb-4">
                            Clientes
                        </h2>

                        {clientes.length === 0 ? (
                            <p className="text-gray-400">
                                Nenhum cliente ainda.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {clientes.map((c) => (
                                    <div
                                        key={c.id_cliente || c._id}
                                        className="bg-white/5 p-4 rounded-xl border border-white/10"
                                    >
                                        <p className="font-semibold">
                                            {c.nome}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            {c.email}
                                        </p>

                                        {renderCarimbos(c.carimbos)}

                                        <button
                                            onClick={() =>
                                                darCarimbo(
                                                    c.id_cliente || c._id
                                                )
                                            }
                                            className="mt-3 bg-white text-black px-4 py-2 rounded-lg text-sm"
                                        >
                                            Dar Carimbo
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}