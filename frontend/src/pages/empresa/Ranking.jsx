import React, { useEffect, useState } from "react";
import api, { setToken } from "../../services/api";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

export default function EmpresaRanking() {
    const [ranking, setRanking] = useState([]);
    const [erro, setErro] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setErro("Usuário não autenticado");
            return;
        }

        setToken(token);
        carregarRanking();
    }, []);

    async function carregarRanking() {
        try {
            const res = await api.get("/empresas/ranking");
            setRanking(res.data);
        } catch (e) {
            console.error(e);
            setErro("Erro ao carregar ranking");
        }
    }

    const maiorPontuacao = Math.max(
        ...ranking.map((e) => e.totalPrints || 0),
        1
    );

    const cardClass =
        "bg-black/55 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl";

    return (
        <div className="min-h-screen text-white font-poppins p-4">

            <div className="max-w-4xl mx-auto space-y-6">

                {/* HEADER */}
                <div className="text-center">
                    <h1 className="text-2xl font-bold">
                        Ranking de Empresas
                    </h1>
                    <p className="text-gray-400 text-sm">
                        Empresas mais avaliadas pelos clientes
                    </p>
                </div>

                {/* ERRO */}
                {erro && (
                    <div className="bg-red-500/20 border border-red-500/30 p-3 rounded-xl text-red-300 text-sm text-center">
                        {erro}
                    </div>
                )}

                {/* VAZIO */}
                {ranking.length === 0 && !erro ? (
                    <div className={cardClass}>
                        <p className="text-gray-400 text-center">
                            Nenhuma avaliação encontrada.
                        </p>
                    </div>
                ) : (
                    <div className={cardClass}>

                        {/* GRÁFICO */}
                        <div className="w-full h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={ranking}
                                    margin={{
                                        top: 20,
                                        right: 20,
                                        left: 0,
                                        bottom: 80,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="rgba(255,255,255,0.08)"
                                    />

                                    <XAxis
                                        dataKey="nome"
                                        interval={0}
                                        angle={-25}
                                        textAnchor="end"
                                        height={100}
                                        tick={{
                                            fill: "#9CA3AF",
                                            fontSize: 12,
                                        }}
                                    />

                                    <YAxis
                                        tick={{
                                            fill: "#9CA3AF",
                                            fontSize: 12,
                                        }}
                                        domain={[
                                            0,
                                            Math.ceil(maiorPontuacao * 1.1),
                                        ]}
                                    />

                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#0f172a",
                                            borderRadius: "10px",
                                            border: "1px solid rgba(255,255,255,0.1)",
                                        }}
                                        itemStyle={{
                                            color: "#6366f1",
                                            fontWeight: "600",
                                        }}
                                        labelStyle={{
                                            color: "#fff",
                                            fontWeight: "700",
                                        }}
                                    />

                                    <Bar
                                        dataKey="totalPrints"
                                        fill="#6366f1"
                                        radius={[6, 6, 0, 0]}
                                        maxBarSize={50}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* LISTA */}
                        <div className="mt-6 space-y-2">
                            {ranking.map((empresa, index) => (
                                <div
                                    key={empresa._id || index}
                                    className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-2"
                                >
                                    <span
                                        className={`text-sm font-bold w-6 text-center ${
                                            index === 0
                                                ? "text-yellow-400"
                                                : index === 1
                                                ? "text-gray-300"
                                                : index === 2
                                                ? "text-amber-600"
                                                : "text-gray-400"
                                        }`}
                                    >
                                        {index + 1}
                                    </span>

                                    <span className="flex-1 text-white text-sm font-semibold">
                                        {empresa.nome}
                                    </span>

                                    <span className="text-gray-400 text-sm">
                                        {empresa.totalPrints} avaliações
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}