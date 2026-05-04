import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api, { setToken } from "../../services/api";

export default function LojaDetalhes() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loja, setLoja] = useState(null);
    const [tarefas, setTarefas] = useState([]);
    const [printsEnviados, setPrintsEnviados] = useState({});
    const [tarefasAbertas, setTarefasAbertas] = useState({});
    const [uploadStatus, setUploadStatus] = useState("");
    const [erro, setErro] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        setToken(token);
        carregarLoja();
        carregarTarefas();
    }, [id]);

    async function carregarLoja() {
        try {
            const response = await api.get(`/empresas/${id}`);
            setLoja(response.data);
        } catch {
            setErro("Erro ao carregar dados da loja");
        }
    }

    async function carregarTarefas() {
        try {
            const response = await api.get(`/tarefas/empresa/${id}`);
            setTarefas(response.data);
        } catch {
            setErro("Erro ao carregar tarefas");
        }
    }

    async function enviarPrint(tarefaId, file) {
        if (!file) return;

        setUploadStatus("");
        setErro("");

        const formData = new FormData();
        formData.append("imagem", file);
        formData.append("id_tarefa", tarefaId);
        formData.append("id_empresa", id);

        try {
            const { data } = await api.post(`/prints/enviar`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setUploadStatus(`Você ganhou ${data.desconto || ""}% de desconto`);
            setPrintsEnviados((prev) => ({ ...prev, [tarefaId]: true }));
        } catch (error) {
            setErro(error.response?.data?.message || "Erro ao enviar comprovante");
        }
    }

    const toggleTarefa = (tarefaId) =>
        setTarefasAbertas((prev) => ({
            ...prev,
            [tarefaId]: !prev[tarefaId],
        }));

    const irParaProgramaFidelidade = () =>
        navigate(`/cliente/fidelidade/${id}`);

    if (!loja) return <p className="p-6 text-white">Carregando...</p>;

    const cardClass =
        "bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6";

    const buttonPrimary =
        "w-full bg-clientPrimary hover:bg-clientSecondary py-3 rounded-xl font-semibold transition";

    const buttonSecondary =
        "px-4 py-2 bg-black/40 border border-white/10 rounded-xl text-sm hover:border-clientPrimary transition";

    return (
        <div className="min-h-screen font-poppins text-white bg-[url('/src/assets/fundolaranja.jpg')] bg-cover bg-center bg-no-repeat p-6">

            {/* HEADER LOJA */}
            <div className={`${cardClass} mb-6 flex items-center gap-6`}>
                {loja.fachada ? (
                    <img
                        src={`http://localhost:5000/uploads/prints/${loja.fachada}`}
                        alt={loja.nome}
                        className="w-20 h-20 object-cover rounded-xl"
                    />
                ) : (
                    <div className="w-20 h-20 bg-white/10 rounded-xl flex items-center justify-center">
                        {loja.nome?.charAt(0)}
                    </div>
                )}

                <div>
                    <h1 className="text-xl font-semibold">{loja.nome}</h1>
                    <p className="text-sm text-white/60">{loja.email}</p>
                    <p className="text-sm text-white/60">{loja.cnpj_cpf}</p>
                </div>
            </div>

            {/* ENDEREÇO */}
            <div className={`${cardClass} mb-6`}>
                <h2 className="text-lg font-semibold mb-2">Endereço</h2>
                <p className="text-sm text-white/70">
                    {loja.endereco?.rua}, {loja.endereco?.numero}
                    {loja.endereco?.complemento && `, ${loja.endereco.complemento}`} <br />
                    {loja.endereco?.bairro} - {loja.endereco?.cidade} / {loja.endereco?.estado}
                </p>
            </div>

            {/* FIDELIDADE */}
            <div className={`${cardClass} mb-6 border border-clientPrimary/30`}>
                <h2 className="text-lg font-semibold mb-2">Programa de fidelidade</h2>
                <p className="text-sm text-white/60 mb-4">
                    Participe e desbloqueie recompensas exclusivas
                </p>

                <button
                    onClick={irParaProgramaFidelidade}
                    className={buttonPrimary}
                >
                    Participar
                </button>
            </div>

            {/* TAREFAS */}
            <div className={cardClass}>
                <h2 className="text-lg font-semibold mb-4">Tarefas</h2>

                {erro && (
                    <div className="bg-red-500/20 border border-red-500/30 p-3 rounded-xl text-sm mb-4">
                        {erro}
                    </div>
                )}

                {uploadStatus && (
                    <div className="bg-green-500/20 border border-green-500/30 p-3 rounded-xl text-sm mb-4">
                        {uploadStatus}
                    </div>
                )}

                <div className="space-y-4">
                    {tarefas.map((tarefa) => (
                        <div
                            key={tarefa._id}
                            className="bg-black/30 p-4 rounded-xl border border-white/10"
                        >
                            <p className="font-medium">{tarefa.titulo || "Tarefa"}</p>

                            {!tarefasAbertas[tarefa._id] ? (
                                <button
                                    onClick={() => toggleTarefa(tarefa._id)}
                                    className={`${buttonSecondary} mt-3`}
                                >
                                    Abrir
                                </button>
                            ) : (
                                <div className="mt-3 space-y-3">
                                    <p className="text-sm text-white/70">
                                        {tarefa.descricao}
                                    </p>

                                    <a
                                        href={tarefa.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block text-sm underline text-clientAccent"
                                    >
                                        Acessar tarefa
                                    </a>

                                    <p className="text-sm">
                                        Desconto:{" "}
                                        <span className="font-semibold">
                                            {tarefa.desconto}%
                                        </span>
                                    </p>

                                    {printsEnviados[tarefa._id] ? (
                                        <div className="text-green-400 text-sm">
                                            Comprovante enviado
                                        </div>
                                    ) : (
                                        <>
                                            <input
                                                id={`file-${tarefa._id}`}
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    enviarPrint(
                                                        tarefa._id,
                                                        e.target.files[0]
                                                    )
                                                }
                                                className="hidden"
                                            />

                                            <label
                                                htmlFor={`file-${tarefa._id}`}
                                                className={buttonSecondary}
                                            >
                                                Enviar comprovante
                                            </label>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}