import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
    Alert,
    StyleSheet,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    ScrollView,
    } from 'react-native';
    import AsyncStorage from '@react-native-async-storage/async-storage';
    import { useRouter } from 'expo-router';
    import api, { setToken } from '../services/api';

    export default function EmpresaPainel() {
    const [empresa, setEmpresa] = useState<any>(null);
    const [tarefas, setTarefas] = useState<any[]>([]);
    const [prints, setPrints] = useState<any[]>([]);
    const [novaTarefa, setNovaTarefa] = useState({ descricao: '', link: '', desconto: '' });
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const descricaoRef = useRef<TextInput>(null);
    const linkRef = useRef<TextInput>(null);
    const descontoRef = useRef<TextInput>(null);

    useEffect(() => {
        carregarDados();
    }, []);

    async function carregarDados() {
        try {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            Alert.alert('Erro', 'Você precisa fazer login novamente.');
            router.push('/empresa/login');
            return;
        }

        await setToken(token);

        const resEmpresa = await api.get('/empresas/me');
        setEmpresa(resEmpresa.data);

        const resTarefas = await api.get('/tarefas/minhas');
        setTarefas(resTarefas.data);

        const resPrints = await api.get(`/prints/empresa/${resEmpresa.data._id}`);
        setPrints(resPrints.data);
        } catch (e) {
        console.error(e);
        Alert.alert('Erro', 'Erro ao carregar dados da empresa.');
        } finally {
        setLoading(false);
        }
    }

    async function criarTarefa() {
        if (!novaTarefa.descricao || !novaTarefa.link || !novaTarefa.desconto) {
        Alert.alert('Erro', 'Preencha todos os campos.');
        return;
        }

        try {
        const res = await api.post('/tarefas', {
            ...novaTarefa,
            desconto: Number(novaTarefa.desconto),
        });
        setTarefas([...tarefas, res.data]);
        setNovaTarefa({ descricao: '', link: '', desconto: '' });
        descricaoRef.current?.focus();
        Alert.alert('Sucesso', 'Tarefa criada com sucesso!');
        } catch (e) {
        console.error(e);
        Alert.alert('Erro', 'Erro ao criar tarefa.');
        }
    }

    async function excluirTarefa(id: string) {
        Alert.alert('Confirmar', 'Deseja realmente excluir esta tarefa?', [
        { text: 'Cancelar', style: 'cancel' },
        {
            text: 'Excluir',
            style: 'destructive',
            onPress: async () => {
            try {
                await api.delete(`/tarefas/${id}`);
                setTarefas(tarefas.filter(t => t._id !== id));
                Alert.alert('Sucesso', 'Tarefa excluída.');
            } catch {
                Alert.alert('Erro', 'Falha ao excluir tarefa.');
            }
            },
        },
        ]);
    }

    async function excluirPrint(id: string) {
        Alert.alert('Confirmar', 'Excluir este print?', [
        { text: 'Cancelar', style: 'cancel' },
        {
            text: 'Excluir',
            style: 'destructive',
            onPress: async () => {
            try {
                await api.delete(`/prints/${id}`);
                setPrints(prints.filter(p => p._id !== id));
            } catch {
                Alert.alert('Erro', 'Falha ao excluir print.');
            }
            },
        },
        ]);
    }

    const renderTarefa = ({ item }: any) => (
        <View style={styles.card}>
        <Text>Descrição: {item.descricao}</Text>
        <Text>Desconto: {item.desconto}%</Text>
        <TouchableOpacity onPress={() => excluirTarefa(item._id)} style={styles.deleteButton}>
            <Text style={styles.deleteText}>Excluir</Text>
        </TouchableOpacity>
        </View>
    );

    const renderPrint = ({ item }: any) => (
        <View style={styles.printCard}>
        <Image
            source={{ uri: `${process.env.EXPO_PUBLIC_API_URL}/uploads/prints/${item.imagem}` }}
            style={styles.printImage}
        />
        <TouchableOpacity onPress={() => excluirPrint(item._id)} style={styles.deleteButton}>
            <Text style={styles.deleteText}>Excluir</Text>
        </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
        <View style={styles.center}>
            <ActivityIndicator size="large" color="#00875F" />
            <Text>Carregando dados...</Text>
        </View>
        );
    }

    if (!empresa) {
        return (
        <View style={styles.center}>
            <Text>Nenhuma empresa carregada.</Text>
        </View>
        );
    }

    return (
        <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 20}
        >
        <View style={{ flex: 1 }}>
            <ScrollView
            contentContainerStyle={{ padding: 20 }}
            keyboardShouldPersistTaps="handled"
            >
            <Text style={styles.title}>{empresa.nome}</Text>

            <Text style={styles.sectionTitle}>📋 Dados da Empresa</Text>
            <Text>CNPJ/CPF: {empresa.cnpj_cpf}</Text>
            <Text>Email: {empresa.email}</Text>
            <Text>
                Endereço: {empresa.endereco?.rua}, {empresa.endereco?.numero} - {empresa.endereco?.cidade}
            </Text>

            <Text style={styles.sectionTitle}>🆕 Nova Tarefa</Text>
            <TextInput
                ref={descricaoRef}
                placeholder="Descrição"
                value={novaTarefa.descricao}
                onChangeText={t => setNovaTarefa({ ...novaTarefa, descricao: t })}
                style={styles.input}
                returnKeyType="next"
                onSubmitEditing={() => linkRef.current?.focus()}
            />
            <TextInput
                ref={linkRef}
                placeholder="Link"
                value={novaTarefa.link}
                onChangeText={t => setNovaTarefa({ ...novaTarefa, link: t })}
                style={styles.input}
                returnKeyType="next"
                onSubmitEditing={() => descontoRef.current?.focus()}
            />
            <TextInput
                ref={descontoRef}
                placeholder="Desconto (%)"
                keyboardType="numeric"
                value={novaTarefa.desconto}
                onChangeText={t => setNovaTarefa({ ...novaTarefa, desconto: t })}
                style={styles.input}
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
            />
            <TouchableOpacity style={styles.button} onPress={criarTarefa}>
                <Text style={styles.buttonText}>Criar Tarefa</Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>🖼️ Prints Recebidos</Text>
            {prints.length === 0 ? (
                <Text>Nenhum print recebido.</Text>
            ) : (
                <FlatList
                data={prints}
                keyExtractor={item => item._id}
                horizontal
                renderItem={renderPrint}
                style={{ marginVertical: 10 }}
                showsHorizontalScrollIndicator={false}
                />
            )}

            <View style={{ marginVertical: 20 }}>
                <TouchableOpacity style={styles.button} onPress={() => router.push('/empresa/fidelidade')}>
                <Text style={styles.buttonText}>Gerenciar Fidelidade</Text>
                </TouchableOpacity>

                <TouchableOpacity
                style={[styles.button, { backgroundColor: '#555' }]}
                onPress={() => router.push('/empresa/ranking')}
                >
                <Text style={styles.buttonText}>Ver Ranking</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>✅ Minhas Tarefas</Text>
            </ScrollView>

            {/* FlatList vertical das tarefas, scroll independente */}
            <FlatList
            data={tarefas}
            keyExtractor={item => item._id}
            renderItem={renderTarefa}
            style={{ paddingHorizontal: 20 }}
            contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
        </KeyboardAvoidingView>
    );
    }

    const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', marginVertical: 12 },
    input: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    button: {
        backgroundColor: '#00875F',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 6,
    },
    buttonText: { color: '#fff', fontWeight: 'bold' },
    card: {
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    deleteButton: {
        backgroundColor: '#E63946',
        padding: 6,
        marginTop: 6,
        borderRadius: 8,
        alignItems: 'center',
    },
    deleteText: { color: '#fff', fontWeight: 'bold' },
    printCard: { marginRight: 10, alignItems: 'center' },
    printImage: { width: 100, height: 100, borderRadius: 10, marginBottom: 6 },
});