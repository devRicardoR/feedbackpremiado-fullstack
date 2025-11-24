import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ScrollView,
    Platform,
    StyleSheet,
    } from 'react-native';
    import * as ImagePicker from 'expo-image-picker';
    import api, { getEnderecoByCep } from '../services/api';
    import { useRouter, useLocalSearchParams } from 'expo-router';

    export default function EmpresaCadastro() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const isEdit = params.edit === 'true';

    const [nome, setNome] = useState('');
    const [cnpjCpf, setCnpjCpf] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [endereco, setEndereco] = useState({
        rua: '',
        numero: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: '',
    });
    const [fotoFachada, setFotoFachada] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEdit) carregarDados();
    }, []);

    async function carregarDados() {
        try {
        const res = await api.get('/empresas/me');
        const e = res.data;
        setNome(e.nome || '');
        setCnpjCpf(e.cnpj_cpf || '');
        setEmail(e.email || '');
        setEndereco({
            rua: e.endereco?.rua || '',
            numero: e.endereco?.numero || '',
            bairro: e.endereco?.bairro || '',
            cidade: e.endereco?.cidade || '',
            estado: e.endereco?.estado || '',
            cep: e.endereco?.cep || '',
        });
        } catch (error) {
        Alert.alert('Erro', 'Falha ao carregar dados da empresa.');
        console.error(error);
        }
    }

    const handleEnderecoChange = (field: string, value: string) => {
        setEndereco(prev => ({ ...prev, [field]: value }));
    };

    // Buscar endereço automaticamente pelo CEP
    const handleCepBlur = async () => {
        if (endereco.cep.length === 8) {
        const e = await getEnderecoByCep(endereco.cep);
        if (e) {
            setEndereco(prev => ({
            ...prev,
            rua: e.rua,
            bairro: e.bairro,
            cidade: e.cidade,
            estado: e.estado,
            }));
        } else {
            Alert.alert('Aviso', 'Não foi possível localizar o CEP.');
        }
        }
    };

    async function pickImage() {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Precisamos de acesso à galeria para selecionar imagem.');
        return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
        });

        if (!result.canceled && result.assets.length > 0) {
        setFotoFachada(result.assets[0]);
        }
    }

    async function handleSubmit() {
        if (
        !nome ||
        !email ||
        !cnpjCpf ||
        !endereco.rua ||
        !endereco.numero ||
        !endereco.bairro ||
        !endereco.cidade ||
        !endereco.estado ||
        !endereco.cep ||
        (!isEdit && !senha)
        ) {
        Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
        return;
        }

        try {
        setLoading(true);
        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('cnpj_cpf', cnpjCpf);
        formData.append('email', email);
        if (senha) formData.append('senha', senha);
        formData.append('endereco', JSON.stringify(endereco));

        if (fotoFachada) {
            const uri = Platform.OS === 'ios' ? fotoFachada.uri.replace('file://', '') : fotoFachada.uri;
            formData.append('fachada', {
            uri,
            name: 'fachada.jpg',
            type: 'image/jpeg',
            } as any);
        }

        if (isEdit) {
            await api.put('/empresas/me', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            });
            Alert.alert('Sucesso', 'Perfil atualizado!');
            router.push('/empresa/painel');
        } else {
            await api.post('/empresas/cadastro', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            });
            Alert.alert('Sucesso', 'Cadastro realizado! Faça login.');
            router.push('/empresa/login');
        }
        } catch (error: any) {
        console.error(error);
        Alert.alert('Erro', error.response?.data?.message || 'Falha ao salvar dados.');
        } finally {
        setLoading(false);
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>
            {isEdit ? 'Editar Perfil da Empresa' : 'Cadastro de Empresa'}
        </Text>

        <TextInput placeholder="Nome do estabelecimento" value={nome} onChangeText={setNome} style={styles.input} />
        <TextInput
            placeholder="CNPJ ou CPF"
            value={cnpjCpf}
            onChangeText={setCnpjCpf}
            style={[styles.input, isEdit && { backgroundColor: '#eee' }]}
            editable={!isEdit}
        />
        <TextInput placeholder="CEP" value={endereco.cep} onChangeText={t => handleEnderecoChange('cep', t)} onBlur={handleCepBlur} style={styles.input} />
        <TextInput placeholder="Rua" value={endereco.rua} onChangeText={t => handleEnderecoChange('rua', t)} style={styles.input} />
        <TextInput placeholder="Número" value={endereco.numero} onChangeText={t => handleEnderecoChange('numero', t)} style={styles.input} />
        <TextInput placeholder="Bairro" value={endereco.bairro} onChangeText={t => handleEnderecoChange('bairro', t)} style={styles.input} />
        <TextInput placeholder="Cidade" value={endereco.cidade} onChangeText={t => handleEnderecoChange('cidade', t)} style={styles.input} />
        <TextInput placeholder="Estado (UF)" value={endereco.estado} onChangeText={t => handleEnderecoChange('estado', t)} maxLength={2} style={styles.input} />

        <TextInput placeholder="E-mail" value={email} onChangeText={setEmail} style={styles.input} />
        <TextInput placeholder={isEdit ? 'Senha (deixe vazio para não alterar)' : 'Senha'} value={senha} onChangeText={setSenha} secureTextEntry style={styles.input} />

        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
            <Text style={styles.buttonText}>
            {fotoFachada ? 'Alterar Foto da Fachada' : 'Selecionar Foto da Fachada'}
            </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
            <Text style={styles.buttonText}>{isEdit ? 'Salvar Alterações' : 'Cadastrar'}</Text>
        </TouchableOpacity>
        </ScrollView>
    );
    }

    const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: '#f5f5f5', paddingBottom: 40 },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    input: { backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#ccc' },
    button: { backgroundColor: '#00875F', padding: 14, borderRadius: 10, alignItems: 'center', marginVertical: 10 },
    buttonText: { color: '#fff', fontWeight: 'bold' },
    imageButton: { backgroundColor: '#555', padding: 12, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
});