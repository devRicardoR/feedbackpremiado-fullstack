import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../services/api';

export default function ClienteCadastro() {
    const router = useRouter();
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleCadastro() {
        if (!nome || !email || !senha) {
        Alert.alert('Erro', 'Preencha todos os campos.');
        return;
        }

        try {
        setLoading(true);

        const response = await api.post('/clientes/cadastro', { nome, email, senha });

        Alert.alert('Sucesso', response.data.message || 'Cadastro realizado com sucesso!');
        router.push('/cliente/login');
        } catch (error: any) {
        console.error('Erro no cadastro:', error);
        Alert.alert('Erro', error.response?.data?.message || 'Falha ao conectar ao servidor.');
        } finally {
        setLoading(false);
        }
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>
            Criar Conta de Cliente
        </Text>

        <TextInput
            placeholder="Nome completo"
            style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            padding: 10,
            marginBottom: 12,
            }}
            value={nome}
            onChangeText={setNome}
        />

        <TextInput
            placeholder="E-mail"
            style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            padding: 10,
            marginBottom: 12,
            }}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
        />

        <TextInput
            placeholder="Senha"
            secureTextEntry
            style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            padding: 10,
            marginBottom: 20,
            }}
            value={senha}
            onChangeText={setSenha}
        />

        <TouchableOpacity
            onPress={handleCadastro}
            style={{
            backgroundColor: '#28a745',
            padding: 12,
            borderRadius: 8,
            alignItems: 'center',
            }}
            disabled={loading}
        >
            {loading ? (
            <ActivityIndicator color="#fff" />
            ) : (
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cadastrar</Text>
            )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/cliente/login')}>
            <Text style={{ textAlign: 'center', marginTop: 16, color: '#007AFF' }}>
            Já tem uma conta? Entrar
            </Text>
        </TouchableOpacity>
        </View>
    );
}