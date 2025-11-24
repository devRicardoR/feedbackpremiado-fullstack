import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";


export default function IndexScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Feedback Premiado</Text>
        <Text style={styles.subtitle}>Escolha como deseja entrar:</Text>

        <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/cliente/login")}
        >
            <Text style={styles.buttonText}>Entrar como Cliente</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/empresa/login")}
        >
            <Text style={styles.buttonText}>Entrar como Empresa</Text>
        </TouchableOpacity>
        </View>
    );
    }

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#333",
    },
    subtitle: {
        fontSize: 16,
        color: "#555",
        marginBottom: 40,
    },
    button: {
        backgroundColor: "#007bff",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginVertical: 10,
        width: "80%",
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        textAlign: "center",
    },
});