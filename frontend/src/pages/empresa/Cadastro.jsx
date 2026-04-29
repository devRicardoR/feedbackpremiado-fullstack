import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

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
            setEndereco(e.endereco || { rua: "", numero: "", bairro: "", cidade: "", estado: "", cep: "" });
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
                await api.put("/empresas/me", formData, { headers: { "Content-Type": "multipart/form-data" } });
                alert("Perfil atualizado com sucesso!");
                navigate("/empresa/painel");
            } else {
                await api.post("/empresas/cadastro", formData, { headers: { "Content-Type": "multipart/form-data" } });
                alert("Cadastro realizado com sucesso! Faça login.");
                navigate("/empresa/login");
            }
        } catch (error) {
            setErro(error.response?.data?.message || "Erro ao salvar");
            console.error(error);
        }
    }

    const inputClass = "w-full px-4 py-3 rounded-xl bg-white/10 placeholder-white/30 text-white outline-none border border-white/20 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40 transition";
    const labelClass = "text-purple-300 text-xs font-semibold mb-1 block uppercase tracking-wider";

    return (
        <div className="min-h-screen font-poppins bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 flex flex-col">
            {!isEdit && (
                <header className="bg-black/30 backdrop-blur-sm p-4 text-center font-extrabold text-lg text-white shadow-md">
                    Feedback Premiado
                </header>
            )}

            <main className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-md">
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
                            {isEdit ? "Editar Perfil" : "Cadastro Empresa"}
                        </h1>
                        <p className="text-purple-300 text-sm text-center mb-8">
                            {isEdit ? "Atualize os dados da sua empresa" : "Preencha os dados para criar sua conta"}
                        </p>

                        {erro && (
                            <div className="mb-6 bg-red-500/20 border border-red-400/40 rounded-xl px-4 py-3 text-red-300 text-sm text-center">
                                {erro}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">

                            <div>
                                <label className={labelClass}>Nome do estabelecimento</label>
                                <input type="text" placeholder="Nome do estabelecimento" value={nome} onChange={(e) => setNome(e.target.value)} required className={inputClass} />
                            </div>

                            <div>
                                <label className={labelClass}>CNPJ ou CPF</label>
                                <input type="text" placeholder="CNPJ ou CPF" value={cnpjCpf} onChange={(e) => setCnpjCpf(e.target.value)} required disabled={isEdit} className={`${inputClass} disabled:opacity-40 disabled:cursor-not-allowed`} />
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div className="col-span-2">
                                    <label className={labelClass}>Rua</label>
                                    <input type="text" placeholder="Rua" value={endereco.rua} onChange={(e) => handleEnderecoChange("rua", e.target.value)} required className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Número</label>
                                    <input type="text" placeholder="Nº" value={endereco.numero} onChange={(e) => handleEnderecoChange("numero", e.target.value)} required className={inputClass} />
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>Bairro</label>
                                <input type="text" placeholder="Bairro" value={endereco.bairro} onChange={(e) => handleEnderecoChange("bairro", e.target.value)} required className={inputClass} />
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div className="col-span-2">
                                    <label className={labelClass}>Cidade</label>
                                    <input type="text" placeholder="Cidade" value={endereco.cidade} onChange={(e) => handleEnderecoChange("cidade", e.target.value)} required className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>UF</label>
                                    <input type="text" placeholder="UF" value={endereco.estado} onChange={(e) => handleEnderecoChange("estado", e.target.value)} required maxLength={2} className={inputClass} />
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>CEP</label>
                                <input type="text" placeholder="00000-000" value={endereco.cep} onChange={(e) => handleEnderecoChange("cep", e.target.value)} required className={inputClass} />
                            </div>

                            <div>
                                <label className={labelClass}>E-mail</label>
                                <input type="email" placeholder="empresa@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} />
                            </div>

                            <div>
                                <label className={labelClass}>Senha</label>
                                <input type="password" placeholder={isEdit ? "Deixe vazio para não alterar" : "••••••••"} value={senha} onChange={(e) => setSenha(e.target.value)} className={inputClass} {...(!isEdit && { required: true })} />
                            </div>

                            <div>
                                <label className={labelClass}>Foto da Fachada (opcional)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setFotoFachada(e.target.files[0])}
                                    className="w-full text-sm text-purple-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-indigo-500/30 file:text-indigo-300 file:font-semibold hover:file:bg-indigo-500/50 cursor-pointer transition"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-indigo-500 hover:bg-indigo-400 text-white py-3 rounded-xl font-bold tracking-wide shadow-lg transition focus:ring-4 focus:ring-indigo-300 mt-2"
                            >
                                {isEdit ? "Salvar Alterações" : "Criar Conta"}
                            </button>
                        </form>

                        {!isEdit && (
                            <p className="mt-6 text-center text-white/50 text-sm">
                                Já tem conta?{' '}
                                <a href="/empresa/login" className="text-indigo-300 hover:text-indigo-200 font-semibold transition">
                                    Fazer login
                                </a>
                            </p>
                        )}
                    </div>

                    {!isEdit && (
                        <button
                            onClick={() => navigate('/')}
                            className="mt-6 w-full text-purple-300 hover:text-white text-sm font-semibold text-center transition"
                        >
                            Voltar para a pagina inicial
                        </button>
                    )}
                </div>
            </main>

            {!isEdit && (
                <footer className="bg-black/20 backdrop-blur-sm border-t border-white/10 py-3 text-center text-xs text-purple-300">
                    Feedback Premiado &copy; {new Date().getFullYear()}
                </footer>
            )}
        </div>
    );
}