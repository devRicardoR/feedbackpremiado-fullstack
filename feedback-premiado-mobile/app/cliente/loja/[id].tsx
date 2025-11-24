import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import api, { setToken } from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";

export default function LojaDetalhes() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const lojaId = Array.isArray(id) ? id[0] : id;

  const [loja, setLoja] = useState<any>(null);
  const [tarefas, setTarefas] = useState<any[]>([]);
  const [printsEnviados, setPrintsEnviados] = useState<{ [key: string]: boolean }>({});
  const [tarefasAbertas, setTarefasAbertas] = useState<{ [key: string]: boolean }>({});
  const [uploadStatus, setUploadStatus] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      await setToken(token);
      carregarLoja();
      carregarTarefas();
    })();
  }, [lojaId]);

  async function carregarLoja() {
    try {
      const res = await api.get(`/empresas/${lojaId}`);
      setLoja(res.data);
    } catch {
      setErro("Erro ao carregar loja");
    }
  }

  async function carregarTarefas() {
    try {
      const res = await api.get(`/tarefas/empresa/${lojaId}`);
      setTarefas(res.data);
    } catch {
      setErro("Erro ao carregar tarefas");
    }
  }

  async function enviarPrint(tarefaId: string) {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert("Permissão negada", "Você precisa permitir acesso às imagens.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });

      if (result.canceled) return;
      const file = result.assets[0];

      const formData = new FormData();
      formData.append("imagem", {
        uri: file.uri,
        type: "image/jpeg",
        name: "comprovante.jpg",
      } as any);
      formData.append("id_tarefa", tarefaId);
      formData.append("id_empresa", String(lojaId));

      const { data } = await api.post(`/prints/enviar`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUploadStatus(`🎉 Parabéns! Você ganhou ${data.desconto || ""}% de desconto pelo feedback!`);
      setPrintsEnviados((prev) => ({ ...prev, [tarefaId]: true }));
    } catch (err: any) {
      setErro(err.response?.data?.message || "Erro ao enviar comprovante");
    }
  }

  const toggleTarefa = (tarefaId: string) =>
    setTarefasAbertas((prev) => ({ ...prev, [tarefaId]: !prev[tarefaId] }));

  // ✅ Redirecionamento corrigido para fidelidade
  const irParaProgramaFidelidade = () => {
    router.push({
      pathname: "/cliente/fidelidade/[id]",
      params: { id: lojaId },
    });
  };

  if (!loja)
    return <ActivityIndicator style={{ flex: 1, marginTop: 40 }} size="large" color="#a00" />;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }} contentContainerStyle={{ padding: 16 }}>
      {/* Dados da loja */}
      <View style={{ backgroundColor: "#f3f3f3", borderRadius: 12, padding: 12, marginBottom: 16 }}>
        {loja.fachada ? (
          <Image
            source={{ uri: `http://localhost:5000/uploads/prints/${loja.fachada}` }}
            style={{ width: 100, height: 100, borderRadius: 12 }}
          />
        ) : (
          <View
            style={{
              width: 100,
              height: 100,
              backgroundColor: "#ccc",
              borderRadius: 12,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text>Sem logo</Text>
          </View>
        )}
        <Text style={{ fontSize: 22, fontWeight: "bold", marginTop: 8 }}>{loja.nome}</Text>
        <Text>CNPJ/CPF: {loja.cnpj_cpf}</Text>
        <Text>Email: {loja.email}</Text>
      </View>

      {/* Endereço */}
      <View style={{ backgroundColor: "#f3f3f3", borderRadius: 12, padding: 12, marginBottom: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 4 }}>Endereço</Text>
        <Text>
          {loja.endereco?.rua}, {loja.endereco?.numero}
          {loja.endereco?.complemento ? `, ${loja.endereco.complemento}` : ""} {"\n"}
          {loja.endereco?.bairro} - {loja.endereco?.cidade} / {loja.endereco?.estado} {"\n"}
          CEP: {loja.endereco?.cep || "Não informado"}
        </Text>
      </View>

      {/* Programa de fidelidade */}
      <View style={{ backgroundColor: "#f3f3f3", borderRadius: 12, padding: 12, marginBottom: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 4 }}>Programa de Fidelidade</Text>
        <Text>Participe do programa de fidelidade e ganhe descontos e brindes!</Text>
        <TouchableOpacity
          onPress={irParaProgramaFidelidade}
          style={{ backgroundColor: "#28a745", padding: 10, borderRadius: 20, marginTop: 8, alignItems: "center" }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Quero Participar 🎉</Text>
        </TouchableOpacity>
      </View>

      {/* Tarefas */}
      <View style={{ backgroundColor: "#f3f3f3", borderRadius: 12, padding: 12, marginBottom: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>Tarefas</Text>
        {erro ? <Text style={{ color: "red", marginBottom: 8 }}>{erro}</Text> : null}
        {uploadStatus ? (
          <Text
            style={{
              backgroundColor: "#28a745",
              color: "#fff",
              padding: 8,
              borderRadius: 8,
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            {uploadStatus}
          </Text>
        ) : null}

        {tarefas.map((tarefa) => (
          <View
            key={tarefa._id}
            style={{
              backgroundColor: "#fff",
              padding: 10,
              borderRadius: 10,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: "#ddd",
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 4 }}>
              {tarefa.titulo || "Tarefa"}
            </Text>
            {!tarefasAbertas[tarefa._id] ? (
              <TouchableOpacity
                onPress={() => toggleTarefa(tarefa._id)}
                style={{ backgroundColor: "#007bff", padding: 8, borderRadius: 8, alignItems: "center" }}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Realizar Tarefa</Text>
              </TouchableOpacity>
            ) : (
              <>
                <Text style={{ marginBottom: 4 }}>Descrição: {tarefa.descricao}</Text>
                <TouchableOpacity
                  onPress={() => {
                    if (tarefa.link) Linking.openURL(tarefa.link);
                    else Alert.alert("Link indisponível", "Essa tarefa não possui um link associado.");
                  }}
                  style={{
                    backgroundColor: "#28a745",
                    padding: 8,
                    borderRadius: 8,
                    marginBottom: 4,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>Acessar Tarefa</Text>
                </TouchableOpacity>
                <Text>🎯 Desconto: {tarefa.desconto}%</Text>

                {printsEnviados[tarefa._id] ? (
                  <Text style={{ color: "green", fontWeight: "bold", marginTop: 4 }}>✅ Comprovante enviado!</Text>
                ) : (
                  <TouchableOpacity
                    onPress={() => enviarPrint(tarefa._id)}
                    style={{
                      backgroundColor: "#ffc107",
                      padding: 8,
                      borderRadius: 8,
                      marginTop: 6,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "#000", fontWeight: "bold" }}>Enviar Comprovante</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}