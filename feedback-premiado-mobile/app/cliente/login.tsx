import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import api, { setToken } from '../services/api';

export default function ClienteLogin() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');

    async function handleLogin() {
        if (!email || !senha) {
        Alert.alert('Erro', 'Preencha todos os campos.');
        return;
        }

        setErro('');
        setLoading(true);

        try {
        const response = await api.post('/login', {
            email,
            senha,
            tipo: 'cliente'
        });

        const { token } = response.data;

        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('tipo', 'cliente');
        await setToken(token);

        router.replace('/cliente/painel');

        } catch (error: any) {
        console.error('Erro no login:', error);

        if (error.message === 'Network Error') {
            setErro('Não foi possível conectar ao servidor. Verifique o IP/URL no .env.');
        } else {
            setErro(error.response?.data?.message || 'Email ou senha incorretos.');
        }
        } finally {
        setLoading(false);
        }
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>
            Login do Cliente
        </Text>

        {erro ? <Text style={{ color: 'red', marginBottom: 16, textAlign: 'center' }}>{erro}</Text> : null}

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
            keyboardType="email-address"
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
            onPress={handleLogin}
            style={{
            backgroundColor: '#007AFF',
            padding: 12,
            borderRadius: 8,
            alignItems: 'center',
            }}
            disabled={loading}
        >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontWeight: 'bold' }}>Entrar</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/cliente/cadastro')}>
            <Text style={{ textAlign: 'center', marginTop: 16, color: '#007AFF' }}>
            Criar uma conta
            </Text>
        </TouchableOpacity>
        </View>
    );
}