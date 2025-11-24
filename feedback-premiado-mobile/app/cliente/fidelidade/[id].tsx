import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import api, { setToken } from '../../services/api';

export default function Fidelidade() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const id = params.id as string;

    const [programa, setPrograma] = useState<any>(null);
    const [carimbos, setCarimbos] = useState(0);
    const [regras, setRegras] = useState('');
    const [beneficios, setBeneficios] = useState('');
    const [meta, setMeta] = useState(0);
    const [erro, setErro] = useState('');
    const [loading, setLoading] = useState(true);
    const [participando, setParticipando] = useState(false);
    const [mensagem, setMensagem] = useState('');

    useEffect(() => {
        const carregarPrograma = async () => {
        setLoading(true);
        try {
            const token = await setToken();
            const response = await api.get(`/fidelidade/progresso/${id}`);
            const data = response.data;

            setPrograma(data);
            setRegras(data.regras);
            setBeneficios(data.beneficios);
            setMeta(data.meta);
            setCarimbos(data.carimbos);
            setParticipando(true);
            setMensagem('');
            setErro('');
        } catch (error: any) {
            if (error.response?.status === 401) {
            setErro('Sessão expirada. Faça login novamente.');
            router.replace('/cliente/login');
            } else if (error.response?.status === 404) {
            setParticipando(false);
            setMensagem('');
            setErro('');
            } else {
            setErro('Erro ao carregar programa de fidelidade.');
            }
        } finally {
            setLoading(false);
        }
        };

        carregarPrograma();
    }, [id]);

    const participarPrograma = async () => {
        setMensagem('');
        setErro('');
        try {
        await api.post(`/fidelidade/participar/${id}`);
        setParticipando(true);
        setCarimbos(0);
        setMensagem('Cadastro realizado com sucesso!');
        } catch (error: any) {
        if (error.response?.status === 400) {
            setMensagem('Você já está participando do programa!');
        } else {
            setErro('Erro ao participar do programa.');
        }
        }
    };

    const renderCarimbos = () => {
        return (
        <View style={styles.carimbosContainer}>
            {Array.from({ length: meta }).map((_, index) => (
            <View
                key={index}
                style={[
                styles.carimbo,
                index < carimbos ? styles.carimboAtivo : styles.carimboInativo,
                ]}
            >
                {index < carimbos && <Text style={styles.carimboText}>✔</Text>}
            </View>
            ))}
        </View>
        );
    };

    if (loading) return <View style={styles.center}><ActivityIndicator size="large" /><Text>Carregando programa...</Text></View>;
    if (erro) return <View style={styles.center}><Text style={styles.erro}>{erro}</Text></View>;
    if (!programa && !participando) return <View style={styles.center}><Text>Nenhum programa de fidelidade encontrado.</Text></View>;

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
        <View style={styles.card}>
            <Text style={styles.titulo}>🎉 Programa de Fidelidade</Text>
            <Text style={styles.subtitulo}>Ganhe carimbos e desbloqueie recompensas exclusivas!</Text>

            {programa && (
            <>
                <View style={styles.section}>
                <Text style={styles.sectionTitle}>📜 Regras:</Text>
                <Text style={styles.sectionText}>{regras}</Text>
                </View>

                <View style={styles.section}>
                <Text style={styles.sectionTitle}>🎁 Benefícios:</Text>
                <Text style={styles.sectionText}>{beneficios}</Text>
                </View>

                <View style={styles.section}>
                <Text style={styles.sectionTitle}>🎯 Meta de Carimbos:</Text>
                <Text style={styles.sectionText}>{meta}</Text>
                </View>

                <View style={styles.section}>
                <Text style={styles.sectionTitle}>🔘 Seus Carimbos:</Text>
                {renderCarimbos()}
                </View>
            </>
            )}

            {!participando && (
            <TouchableOpacity style={styles.botao} onPress={participarPrograma}>
                <Text style={styles.botaoText}>Participar do Programa</Text>
            </TouchableOpacity>
            )}

            {mensagem ? (
            <View style={styles.mensagemContainer}>
                <Text style={styles.mensagemText}>{mensagem}</Text>
            </View>
            ) : null}

            <TouchableOpacity
            style={[styles.botao, { marginTop: 16, backgroundColor: '#5B1B29' }]}
            onPress={() => router.push(`/cliente/loja/${id}`)}
            >
            <Text style={styles.botaoText}>← Voltar para Loja</Text>
            </TouchableOpacity>
        </View>
        </ScrollView>
    );
    }

    const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f2f2f2' },
    card: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: 20, alignItems: 'center', marginBottom: 20 },
    titulo: { fontSize: 24, fontWeight: 'bold', color: '#5B1B29', marginBottom: 8, textAlign: 'center' },
    subtitulo: { fontSize: 16, color: '#fff', marginBottom: 16, textAlign: 'center' },
    section: { marginBottom: 16, width: '100%' },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#5B1B29', marginBottom: 4 },
    sectionText: { color: '#fff', fontSize: 16 },
    botao: { backgroundColor: '#28a745', padding: 12, borderRadius: 12, marginTop: 8, width: '100%', alignItems: 'center' },
    botaoText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    carimbosContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 },
    carimbo: { width: 40, height: 40, margin: 4, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    carimboAtivo: { backgroundColor: 'white' },
    carimboInativo: { backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
    carimboText: { color: 'black', fontWeight: 'bold' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    erro: { color: 'red', fontWeight: 'bold', fontSize: 16 },
    mensagemContainer: { marginTop: 16, backgroundColor: 'rgba(0,200,0,0.8)', padding: 12, borderRadius: 12 },
    mensagemText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
});