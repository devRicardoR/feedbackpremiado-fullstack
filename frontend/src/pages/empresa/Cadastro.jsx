import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import fundo from "../../assets/fundo.jpg";

export default function EmpresaCadastro({ isEdit = false }) {
    const [nome, setNome] = useState("");
    const [cnpjCpf, setCnpjCpf] = useState("");
    const [endereco, setEndereco] = useState({
        rua: "",
        numero: "",
        bairro: "",
        cidade: "",
        estado: "",
        cep: "",
    });
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [fotoFachada, setFotoFachada] = useState(null);
    const [erro, setErro] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (isEdit) carregarDados();
    }, [isEdit]);

    async function carregarDados() {
        try {
            const res = await api.get("/empresas/me");
            const e = res.data;
            setNome(e.nome || "");
            setCnpjCpf(e.cnpj_cpf || "");
            setEmail(e.email || "");
            setEndereco(
                e.endereco || {
                    rua: "",
                    numero: "",
                    bairro: "",
                    cidade: "",
                    estado: "",
                    cep: "",
                }
            );
        } catch (error) {
            setErro("Erro ao carregar dados da empresa");
            console.error(error);
        }
    }

    const handleEnderecoChange = (field, value) => {
        setEndereco((prev) => ({ ...prev, [field]: value }));
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setErro("");
        try {
            const formData = new FormData();
            formData.append("nome", nome);
            formData.append("cnpj_cpf", cnpjCpf);
            formData.append("email", email);
            if (senha) formData.append("senha", senha);
            formData.append("endereco", JSON.stringify(endereco));
            if (fotoFachada) formData.append("fachada", fotoFachada);

            if (isEdit) {
                await api.put("/empresas/me", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                alert("Perfil atualizado com sucesso!");
                navigate("/empresa/painel");
            } else {
                await api.post("/empresas/cadastro", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                alert("Cadastro realizado com sucesso! Faça login.");
                navigate("/empresa/login");
            }
        } catch (error) {
            setErro(error.response?.data?.message || "Erro ao salvar");
            console.error(error);
        }
    }

    const inputClass =
        "w-full px-4 py-3 rounded-xl bg-white/5 placeholder-white/30 text-white outline-none border border-white/10 focus:border-white/30 focus:ring-2 focus:ring-white/20 transition";

    const labelClass =
        "text-gray-300 text-xs font-semibold mb-1 block uppercase tracking-wider";

    return (
        <div
            className="min-h-screen font-poppins flex flex-col bg-cover bg-center"
            style={{ backgroundImage: `url(${fundo})` }}
        >
            {/* overlay escuro */}
            <div className="min-h-screen bg-black/80 flex flex-col">

                {!isEdit && (
                    <header className="bg-black/70 backdrop-blur-md p-4 text-center text-white shadow-md">
                        <h1 className="text-lg font-bold tracking-wide">
                            Feedback Premiado
                        </h1>
                    </header>
                )}

                <main className="flex-1 flex items-center justify-center p-6">
                    <div className="w-full max-w-md">
                        <div className="bg-black/60 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8">

                            <h1 className="text-2xl font-bold text-white text-center mb-1">
                                {isEdit ? "Editar Perfil" : "Cadastro Empresa"}
                            </h1>

                            <p className="text-gray-400 text-sm text-center mb-8">
                                {isEdit
                                    ? "Atualize os dados da sua empresa"
                                    : "Preencha os dados para criar sua conta"}
                            </p>

                            {erro && (
                                <div className="mb-6 bg-red-500/20 border border-red-400/40 rounded-xl px-4 py-3 text-red-300 text-sm text-center">
                                    {erro}
                                </div>
                            )}

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-4"
                                encType="multipart/form-data"
                            >
                                <div>
                                    <label className={labelClass}>
                                        Nome do estabelecimento
                                    </label>
                                    <input
                                        type="text"
                                        value={nome}
                                        onChange={(e) =>
                                            setNome(e.target.value)
                                        }
                                        required
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        CNPJ ou CPF
                                    </label>
                                    <input
                                        type="text"
                                        value={cnpjCpf}
                                        onChange={(e) =>
                                            setCnpjCpf(e.target.value)
                                        }
                                        required
                                        disabled={isEdit}
                                        className={`${inputClass} disabled:opacity-40`}
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="col-span-2">
                                        <label className={labelClass}>Rua</label>
                                        <input
                                            type="text"
                                            value={endereco.rua}
                                            onChange={(e) =>
                                                handleEnderecoChange(
                                                    "rua",
                                                    e.target.value
                                                )
                                            }
                                            required
                                            className={inputClass}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>
                                            Número
                                        </label>
                                        <input
                                            type="text"
                                            value={endereco.numero}
                                            onChange={(e) =>
                                                handleEnderecoChange(
                                                    "numero",
                                                    e.target.value
                                                )
                                            }
                                            required
                                            className={inputClass}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Bairro
                                    </label>
                                    <input
                                        type="text"
                                        value={endereco.bairro}
                                        onChange={(e) =>
                                            handleEnderecoChange(
                                                "bairro",
                                                e.target.value
                                            )
                                        }
                                        required
                                        className={inputClass}
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="col-span-2">
                                        <label className={labelClass}>
                                            Cidade
                                        </label>
                                        <input
                                            type="text"
                                            value={endereco.cidade}
                                            onChange={(e) =>
                                                handleEnderecoChange(
                                                    "cidade",
                                                    e.target.value
                                                )
                                            }
                                            required
                                            className={inputClass}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>UF</label>
                                        <input
                                            type="text"
                                            value={endereco.estado}
                                            onChange={(e) =>
                                                handleEnderecoChange(
                                                    "estado",
                                                    e.target.value
                                                )
                                            }
                                            maxLength={2}
                                            required
                                            className={inputClass}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={labelClass}>CEP</label>
                                    <input
                                        type="text"
                                        value={endereco.cep}
                                        onChange={(e) =>
                                            handleEnderecoChange(
                                                "cep",
                                                e.target.value
                                            )
                                        }
                                        required
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        E-mail
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        required
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>Senha</label>
                                    <input
                                        type="password"
                                        value={senha}
                                        onChange={(e) =>
                                            setSenha(e.target.value)
                                        }
                                        placeholder={
                                            isEdit
                                                ? "Deixe vazio para não alterar"
                                                : "••••••••"
                                        }
                                        className={inputClass}
                                        {...(!isEdit && { required: true })}
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Foto da Fachada
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            setFotoFachada(
                                                e.target.files[0]
                                            )
                                        }
                                        className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-white/10 file:text-white file:font-semibold hover:file:bg-white/20 cursor-pointer transition"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-white text-black py-3 rounded-xl font-bold hover:bg-gray-200 transition"
                                >
                                    {isEdit
                                        ? "Salvar Alterações"
                                        : "Criar Conta"}
                                </button>
                            </form>

                            {!isEdit && (
                                <p className="mt-6 text-center text-gray-400 text-sm">
                                    Já tem conta?{" "}
                                    <a
                                        href="/empresa/login"
                                        className="text-white font-semibold hover:underline"
                                    >
                                        Fazer login
                                    </a>
                                </p>
                            )}
                        </div>

                        {!isEdit && (
                            <button
                                onClick={() => navigate("/")}
                                className="mt-6 w-full text-gray-400 hover:text-white text-sm font-semibold text-center transition"
                            >
                                Voltar para a página inicial
                            </button>
                        )}
                    </div>
                </main>

                {!isEdit && (
                    <footer className="bg-black/70 backdrop-blur-md border-t border-white/10 py-3 text-center text-xs text-gray-400">
                        Feedback Premiado &copy; {new Date().getFullYear()}
                    </footer>
                )}
            </div>
        </div>
    );
}