import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Dimensions, ActivityIndicator } from "react-native";
import { BarChart } from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api, { setToken } from "../services/api";

type RankingType = {
    nome: string;
    totalPrints: number;
    };

    export default function EmpresaRanking() {
    const [ranking, setRanking] = useState<RankingType[]>([]);
    const [erro, setErro] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
            setErro("Usuário não autenticado");
            setLoading(false);
            return;
            }
            setToken(token);
            await carregarRanking();
        } catch (e) {
            console.error(e);
            setErro("Erro ao carregar ranking");
        }
        };
        init();
    }, []);

    const carregarRanking = async () => {
        try {
        const res = await api.get("/empresas/ranking");
        setRanking(res.data);
        } catch (e) {
        console.error(e);
        setErro("Erro ao carregar ranking");
        } finally {
        setLoading(false);
        }
    };

    if (loading) {
        return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
            <ActivityIndicator size="large" />
            <Text>Carregando...</Text>
        </View>
        );
    }

    if (erro) {
        return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
            <Text style={{ color: "red", fontWeight: "600", textAlign: "center" }}>{erro}</Text>
        </View>
        );
    }

    if (ranking.length === 0) {
        return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
            <Text style={{ color: "#374151", fontSize: 16, textAlign: "center" }}>Nenhuma avaliação encontrada.</Text>
        </View>
        );
    }

    const labels = ranking.map((r) => r.nome);
    const data = ranking.map((r) => r.totalPrints);
    const screenWidth = Dimensions.get("window").width - 32;

    return (
        <ScrollView style={{ flex: 1, backgroundColor: "white", padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16, textAlign: "center" }}>
            Ranking de Empresas Mais Avaliadas
        </Text>

        <BarChart
            data={{
            labels,
            datasets: [{ data }],
            }}
            width={screenWidth}
            height={400}
            fromZero
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
            backgroundGradientFrom: "#f87171",
            backgroundGradientTo: "#7B1A1A",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: { borderRadius: 16 },
            propsForLabels: { fontWeight: "600" },
            }}
            style={{
            marginVertical: 8,
            borderRadius: 16,
            }}
            verticalLabelRotation={45}
            showValuesOnTopOfBars
        />
        </ScrollView>
    );
}