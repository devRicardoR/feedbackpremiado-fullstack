import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    TextInput,
    StyleSheet,
    } from 'react-native';
    import { useLocalSearchParams, useRouter } from 'expo-router';
    import * as ImagePicker from 'expo-image-picker';
    import * as FileSystem from 'expo-file-system';
    import api from '../services/api';

    type TarefaType = {
    _id: string;
    descricao: string;
    link: string;
    desconto: number;
    };

    type EmpresaType = {
    _id: string;
    nome: string;
    };

    export default function Tarefa() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const [empresa, setEmpresa] = useState<EmpresaType | null>(null);
    const [tarefas, setTarefas] = useState<TarefaType[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [tarefaSelecionada, setTarefaSelecionada] = useState<TarefaType | null>(null);
    const [print, setPrint] = useState<any>(null);
    const [mensagem, setMensagem] = useState('');

    useEffect(() => {
        if (!id) return;
        carregarDados();
    }, [id]);

    async function carregarDados() {
        try {
        const [empresaRes, tarefasRes] = await Promise.all([
            api.get(`/empresas/${id}`),
            api.get(`/tarefas/empresa/${id}`),
        ]);
        setEmpresa(empresaRes.data);
        setTarefas(tarefasRes.data);
        } catch (err) {
        console.error('Erro ao carregar dados:', err);
        Alert.alert('Erro', 'Não foi possível carregar os dados da empresa.');
        } finally {
        setCarregando(false);
        }
    }

    const selecionarImagem = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        });

        if (!result.canceled) {
        setPrint(result.assets[0]);
        }
    };

    const enviarPrint = async () => {
        if (!print || !tarefaSelecionada) {
        Alert.alert('Atenção', 'Selecione uma tarefa e uma imagem antes de enviar.');
        return;
        }

        try {
        const formData = new FormData();
        const fileInfo = await FileSystem.getInfoAsync(print.uri);
        formData.append('print', {
            uri: print.uri,
            name: print.fileName || 'print.jpg',
            type: 'image/jpeg',
        } as any);

        await api.post(`/tarefas/${tarefaSelecionada._id}/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        setMensagem(`✅ Você liberou ${tarefaSelecionada.desconto}% de desconto!`);
        setTarefaSelecionada(null);
        setPrint(null);
        Keyboard.dismiss();
        } catch (err) {
        console.error('Erro ao enviar print:', err);
        Alert.alert('Erro', 'Não foi possível enviar o print. Tente novamente.');
        }
    };

    if (carregando) {
        return (
        <View style={styles.center}>
            <Text>Carregando...</Text>
        </View>
        );
    }

    return (
        <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: 'white' }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        >
        <ScrollView
            style={styles.container}
            contentContainerStyle={{ paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
        >
            <Text style={styles.title}>{empresa?.nome || 'Empresa'}</Text>

            {tarefas.length === 0 ? (
            <Text>Nenhuma tarefa disponível.</Text>
            ) : (
            tarefas.map((t) => (
                <View key={t._id} style={styles.card}>
                <Text style={styles.cardTitle}>{t.descricao}</Text>
                <TouchableOpacity
                    onPress={() => setTarefaSelecionada(t)}
                    style={styles.buttonBlue}
                >
                    <Text style={styles.buttonText}>Realizar Tarefa</Text>
                </TouchableOpacity>
                <Text>Desconto: {t.desconto}%</Text>
                </View>
            ))
            )}

            {tarefaSelecionada && (
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Link da tarefa:</Text>
                <Text
                style={styles.link}
                onPress={() => {
                    // Linking.openURL(tarefaSelecionada.link)
                }}
                >
                {tarefaSelecionada.link}
                </Text>

                <TouchableOpacity
                onPress={selecionarImagem}
                style={styles.buttonGreen}
                >
                <Text style={styles.buttonText}>
                    {print ? 'Trocar imagem' : 'Selecionar print'}
                </Text>
                </TouchableOpacity>

                {print && (
                <Image
                    source={{ uri: print.uri }}
                    style={styles.imagePreview}
                />
                )}

                <TouchableOpacity
                onPress={enviarPrint}
                style={styles.buttonRed}
                >
                <Text style={styles.buttonText}>Enviar Print</Text>
                </TouchableOpacity>
            </View>
            )}

            {mensagem ? (
            <Text style={styles.success}>{mensagem}</Text>
            ) : null}

            <View style={{ marginTop: 20 }}>
            <TouchableOpacity
                onPress={() => router.back()}
                style={styles.buttonGray}
            >
                <Text style={styles.buttonText}>Voltar</Text>
            </TouchableOpacity>
            </View>
        </ScrollView>
        </KeyboardAvoidingView>
    );
    }

    const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
    card: { backgroundColor: '#f3f4f6', padding: 16, borderRadius: 12, marginBottom: 12 },
    cardTitle: { fontWeight: 'bold', marginBottom: 8 },
    buttonBlue: { backgroundColor: '#3B82F6', padding: 12, borderRadius: 12, marginBottom: 8, alignItems: 'center' },
    buttonGreen: { backgroundColor: '#34D399', padding: 12, borderRadius: 12, marginBottom: 8, alignItems: 'center' },
    buttonRed: { backgroundColor: '#EF4444', padding: 12, borderRadius: 12, alignItems: 'center', marginTop: 8 },
    buttonGray: { backgroundColor: '#D1D5DB', padding: 12, borderRadius: 12, alignItems: 'center' },
    buttonText: { color: 'white', fontWeight: 'bold' },
    link: { color: 'blue', textDecorationLine: 'underline', marginBottom: 8 },
    imagePreview: { width: '100%', height: 200, borderRadius: 12, marginBottom: 8 },
    success: { color: 'green', fontWeight: 'bold', marginTop: 12 },
});