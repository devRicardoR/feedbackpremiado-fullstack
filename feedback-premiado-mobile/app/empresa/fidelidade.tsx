import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Alert,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import api, { setToken } from '../services/api';

interface Cliente {
    _id: string;
    id_cliente?: string;
    nome?: string;
    email?: string;
    carimbos: number;
}

export default function EmpresaFidelidade() {
    const router = useRouter();

    const [empresa, setEmpresa] = useState<any>(null);
    const [programa, setPrograma] = useState<any>(null);
    const [regras, setRegras] = useState('');
    const [beneficios, setBeneficios] = useState('');
    const [meta, setMeta] = useState(10);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [mensagem, setMensagem] = useState('');
    const [erro, setErro] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        init();
    }, []);

    async function init() {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                Alert.alert('Erro', 'Usuário não autenticado.');
                router.replace('/empresa/login');
                return;
            }

            await setToken(token);

            const resEmpresa = await api.get('/empresas/me');
            setEmpresa(resEmpresa.data);
            await carregarPrograma(resEmpresa.data._id);
        } catch (err) {
            console.error(err);
            setErro('Erro ao carregar dados da empresa');
        } finally {
            setLoading(false);
        }
    }

    async function carregarPrograma(id_empresa: string) {
        try {
            setLoading(true);
            const res = await api.get(`/fidelidade/${id_empresa}`);
            setPrograma(res.data);
            setRegras(res.data.regras || '');
            setBeneficios(res.data.beneficios || '');
            setMeta(res.data.meta || 10);

            if (res.data.clientes && res.data.clientes.length > 0) {
                const clientesComDados = await Promise.all(
                    res.data.clientes.map(async (cliente: any) => {
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

            setErro('');
            setMensagem('');
        } catch (err: any) {
            if (err.response?.status === 404) {
                setPrograma(null);
                setRegras('');
                setBeneficios('');
                setMeta(10);
                setClientes([]);
                setErro('');
                setMensagem('');
            } else {
                console.error(err);
                setErro('Erro ao carregar programa');
            }
        } finally {
            setLoading(false);
        }
    }

    async function criarPrograma() {
        if (!empresa?._id) return setErro('Empresa não carregada');
        try {
            setErro('');
            setMensagem('');
            const res = await api.post('/fidelidade', { regras, beneficios, meta });
            setPrograma(res.data);
            setMensagem('Programa criado com sucesso!');
            await carregarPrograma(empresa._id);
        } catch (err) {
            console.error(err);
            setErro('Erro ao criar programa');
        }
    }

    async function atualizarPrograma() {
        if (!empresa?._id) return setErro('Empresa não carregada');
        try {
            setErro('');
            setMensagem('');
            const res = await api.put('/fidelidade', { regras, beneficios, meta });
            setPrograma(res.data);
            setMensagem('Programa atualizado com sucesso!');
        } catch (err) {
            console.error(err);
            setErro('Erro ao atualizar programa');
        }
    }

    async function darCarimbo(id_cliente: string) {
        if (!empresa?._id) return setErro('Empresa não carregada');
        try {
            setErro('');
            setMensagem('');
            await api.post('/fidelidade/carimbar', { id_empresa: empresa._id, id_cliente });
            setMensagem('Carimbo adicionado!');
            await carregarPrograma(empresa._id);
        } catch (err) {
            console.error(err);
            setErro('Erro ao adicionar carimbo');
        }
    }

    const renderCarimbos = (carimbosRecebidos: number) => {
        return (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 }}>
                {Array.from({ length: meta }).map((_, i) => (
                    <View
                        key={i}
                        style={{
                            width: 36,
                            height: 36,
                            margin: 4,
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: '#ccc',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: i < carimbosRecebidos ? '#34D399' : '#E5E7EB',
                        }}
                    />
                ))}
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#00875F" />
                <Text>Carregando...</Text>
            </View>
        );
    }

    if (erro) {
        return (
            <View style={styles.center}>
                <Text style={{ color: 'red', fontWeight: 'bold' }}>{erro}</Text>
            </View>
        );
    }

    if (!empresa) {
        return (
            <View style={styles.center}>
                <Text>Empresa não carregada</Text>
            </View>
        );
    }

    // Usando FlatList para todo conteúdo
    const ListHeader = () => (
        <View>
            <Text style={styles.title}>🎯 Programa de Fidelidade</Text>
            {mensagem ? <Text style={styles.success}>{mensagem}</Text> : null}

            {!programa ? (
                <>
                    <Text style={styles.subtitle}>🆕 Criar Programa</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Regras"
                        value={regras}
                        onChangeText={setRegras}
                        multiline
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Benefícios"
                        value={beneficios}
                        onChangeText={setBeneficios}
                        multiline
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Meta de Carimbos"
                        keyboardType="numeric"
                        value={String(meta)}
                        onChangeText={(t) => setMeta(Number(t))}
                    />
                    <TouchableOpacity style={styles.button} onPress={criarPrograma}>
                        <Text style={styles.buttonText}>Criar Programa</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <Text style={styles.subtitle}>✏️ Editar Programa</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Regras"
                        value={regras}
                        onChangeText={setRegras}
                        multiline
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Benefícios"
                        value={beneficios}
                        onChangeText={setBeneficios}
                        multiline
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Meta de Carimbos"
                        keyboardType="numeric"
                        value={String(meta)}
                        onChangeText={(t) => setMeta(Number(t))}
                    />
                    <TouchableOpacity style={styles.button} onPress={atualizarPrograma}>
                        <Text style={styles.buttonText}>Atualizar Programa</Text>
                    </TouchableOpacity>

                    <Text style={styles.subtitle}>👥 Clientes Participantes</Text>
                    {clientes.length === 0 && <Text>Nenhum cliente participa ainda.</Text>}
                </>
            )}
        </View>
    );

    return (
        <FlatList
            data={programa ? clientes : []}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
                <View style={styles.card}>
                    <Text style={{ fontWeight: 'bold' }}>{item.nome || 'Cliente'}</Text>
                    <Text>Email: {item.email || 'Não disponível'}</Text>
                    <Text>Carimbos:</Text>
                    {renderCarimbos(item.carimbos)}
                    <TouchableOpacity
                        style={[styles.button, { marginTop: 8, backgroundColor: '#34D399' }]}
                        onPress={() => darCarimbo(item.id_cliente || item._id)}
                    >
                        <Text style={styles.buttonText}>Dar Carimbo</Text>
                    </TouchableOpacity>
                </View>
            )}
            ListHeaderComponent={<ListHeader />}
            contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        />
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
    subtitle: { fontSize: 20, fontWeight: 'bold', marginVertical: 12 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        backgroundColor: 'white',
        textAlignVertical: 'top',
    },
    button: {
        backgroundColor: '#00875F',
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
        marginVertical: 6,
    },
    buttonText: { color: 'white', fontWeight: 'bold' },
    card: {
        backgroundColor: '#F3F4F6',
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
    },
    success: { color: 'green', fontWeight: 'bold', marginBottom: 12 },
});