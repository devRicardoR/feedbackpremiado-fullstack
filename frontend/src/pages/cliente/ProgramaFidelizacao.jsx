import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { setToken } from '../../services/api';
import bgCliente from '../../assets/fundolaranja.jpg';

export default function ProgramaFidelizacao() {
    const { id_empresa } = useParams();
    const navigate = useNavigate();

    const [programa, setPrograma] = useState(null);
    const [carimbos, setCarimbos] = useState(0);
    const [regras, setRegras] = useState('');
    const [beneficios, setBeneficios] = useState('');
    const [meta, setMeta] = useState(0);
    const [erro, setErro] = useState('');
    const [loading, setLoading] = useState(true);
    const [participando, setParticipando] = useState(false);
    const [mensagem, setMensagem] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/cliente/login');
            return;
        }

        setToken(token);

        async function carregarPrograma() {
            try {
                const response = await api.get(`/fidelidade/progresso/${id_empresa}`);
                const data = response.data;

                setPrograma(data);
                setRegras(data.regras);
                setBeneficios(data.beneficios);
                setMeta(data.meta);
                setCarimbos(data.carimbos);
                setParticipando(true);
            } catch (error) {
                if (error.response?.status === 401) {
                    localStorage.clear();
                    navigate('/cliente/login');
                } else if (error.response?.status === 404) {
                    setParticipando(false);
                } else {
                    setErro('Erro ao carregar programa.');
                }
            } finally {
                setLoading(false);
            }
        }

        carregarPrograma();
    }, [id_empresa, navigate]);

    async function participarPrograma() {
        setMensagem('');
        setErro('');

        try {
            await api.post(`/fidelidade/participar/${id_empresa}`);
            setParticipando(true);
            setCarimbos(0);
            setMensagem('Cadastro realizado com sucesso!');
        } catch (error) {
            if (error.response?.status === 400) {
                setMensagem('Você já está participando.');
            } else {
                setErro('Erro ao participar.');
            }
        }
    }

    const renderCarimbos = (carimbos, meta) => {
        return (
            <div className="grid grid-cols-5 gap-4 mt-6">
                {Array.from({ length: meta }).map((_, index) => (
                    <div
                        key={index}
                        className={`w-16 h-16 rounded-xl flex items-center justify-center transition
                        ${
                            index < carimbos
                                ? 'bg-white text-black shadow-lg'
                                : 'bg-white/20 text-white/30 border border-white/30'
                        }`}
                    >
                        {index < carimbos && (
                            <div className="w-6 h-6 rounded-full bg-clientPrimary"></div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    if (loading)
        return <div className="text-white p-6">Carregando...</div>;

    if (erro)
        return <div className="text-red-300 p-6">{erro}</div>;

    return (
        <div
            className="min-h-screen font-poppins bg-cover bg-center bg-no-repeat text-white p-6 flex justify-center"
            style={{ backgroundImage: `url(${bgCliente})` }}
        >
            {/* overlay pra não ficar estourado */}
            <div className="w-full flex justify-center bg-black/40 backdrop-blur-sm min-h-screen p-6">
                <div className="w-full max-w-3xl bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-neonClient">

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold">Programa de Fidelidade</h1>
                        <p className="text-white/80 mt-2">
                            Ganhe recompensas acumulando carimbos
                        </p>
                    </div>

                    {programa && (
                        <>
                            <div className="mb-6">
                                <p className="font-semibold text-white/80 mb-1">Regras</p>
                                <p className="text-white">{regras}</p>
                            </div>

                            <div className="mb-6">
                                <p className="font-semibold text-white/80 mb-1">Benefícios</p>
                                <p className="text-white">{beneficios}</p>
                            </div>

                            <div className="mb-6">
                                <p className="font-semibold text-white/80 mb-1">Meta</p>
                                <p className="text-white">{meta} carimbos</p>
                            </div>

                            <div className="mb-8">
                                <p className="font-semibold text-white/80 mb-2">Seu progresso</p>
                                {renderCarimbos(carimbos, meta)}
                            </div>
                        </>
                    )}

                    {!participando && (
                        <div className="text-center">
                            <button
                                onClick={participarPrograma}
                                className="bg-white text-orange-600 font-semibold px-6 py-3 rounded-full hover:scale-105 transition"
                            >
                                Participar
                            </button>
                        </div>
                    )}

                    {mensagem && (
                        <div className="mt-6 text-center bg-green-500/80 py-3 rounded-xl font-semibold">
                            {mensagem}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}