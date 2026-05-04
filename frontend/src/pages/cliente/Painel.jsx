import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

// ICONES
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

function IconGift() {
    return (
        <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7" />
            <path d="M2 7h20v5H2z" />
            <path d="M12 22V7" />
        </svg>
    );
}

export default function ClientePainel() {
    const navigate = useNavigate();

    const [lojas, setLojas] = useState([]);
    const [ranking, setRanking] = useState([]);
    const [busca, setBusca] = useState('');
    const [filtroCidade, setFiltroCidade] = useState('');
    const [localizacao, setLocalizacao] = useState([-25.4284, -49.2733]);

    useEffect(() => {
        async function carregarDados() {
            try {
                const [resLojas, resRanking] = await Promise.all([
                    api.get('/empresas'),
                    api.get('/empresas/ranking'),
                ]);
                setLojas(resLojas.data);
                setRanking(resRanking.data);
            } catch (e) {
                console.error(e);
            }
        }

        carregarDados();

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLocalizacao([pos.coords.latitude, pos.coords.longitude]);
            },
            () => {}
        );
    }, []);

    const lojasFiltradas = lojas.filter(
        (loja) =>
            loja.nome?.toLowerCase().includes(busca.toLowerCase()) &&
            (filtroCidade === '' ||
                loja.endereco?.cidade?.toLowerCase() === filtroCidade.toLowerCase())
    );

    return (
        <div
            className="min-h-screen font-poppins text-white bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: "url('/src/assets/fundolaranja.jpg')",
            }}
        >
            <div className="min-h-screen bg-black/50 backdrop-blur-[2px]">

                {/* HEADER */}
                <header className="p-5 text-center bg-black/40 backdrop-blur-xl border-b border-white/10">
                    <h1 className="text-xl font-semibold">Painel do Cliente</h1>
                </header>

                {/* FILTROS */}
                <section className="p-6 max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-4 mb-8">
                        <input
                            type="text"
                            placeholder="Buscar loja"
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            className="flex-1 px-5 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/60 backdrop-blur-md outline-none focus:border-clientPrimary"
                        />

                        <input
                            type="text"
                            placeholder="Filtrar por cidade"
                            value={filtroCidade}
                            onChange={(e) => setFiltroCidade(e.target.value)}
                            className="flex-1 px-5 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/60 backdrop-blur-md outline-none focus:border-clientPrimary"
                        />
                    </div>

                    {/* LOJAS */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
                        {lojasFiltradas.map((loja) => (
                            <div
                                key={loja._id}
                                className="p-5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 hover:border-clientPrimary transition"
                            >
                                <Link
                                    to={`/cliente/loja/${loja._id}`}
                                    className="text-lg font-semibold"
                                >
                                    {loja.nome}
                                </Link>

                                <p className="mt-2 text-sm text-white/70">
                                    {loja.endereco?.cidade}
                                </p>

                                {/* AÇÃO COM ÍCONE */}
                                <div className="flex justify-end mt-4">
                                    <button
                                        onClick={() => navigate(`/cliente/fidelidade/${loja._id}`)}
                                        className="flex flex-col items-center text-gray-200 hover:text-clientAccent transition"
                                    >
                                        <IconGift />
                                        <span className="text-xs">Fidelidade</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* MAPA */}
                <div className="h-[350px] max-w-7xl mx-auto mb-10 rounded-2xl overflow-hidden border border-white/10">
                    <MapContainer center={localizacao} zoom={13} className="h-full w-full">
                        <TileLayer
                            attribution="&copy; OpenStreetMap contributors"
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    </MapContainer>
                </div>

                {/* RANKING */}
                <main className="max-w-6xl mx-auto px-4 pb-24">
                    <h2 className="text-xl font-semibold mb-4 text-center">
                        Ranking
                    </h2>

                    <div className="h-[350px] bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ranking}>
                                <CartesianGrid stroke="rgba(255 255 255 / 0.1)" />
                                <XAxis dataKey="nome" tick={{ fill: 'white', fontSize: 12 }} />
                                <YAxis tick={{ fill: 'white' }} />
                                <Tooltip />
                                <Bar dataKey="totalPrints" fill="#F97316" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </main>

            </div>
        </div>
    );
}